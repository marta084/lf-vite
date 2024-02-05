import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
  type MetaFunction,
  LinksFunction,
} from "@remix-run/cloudflare";

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useFetchers,
  useLoaderData,
} from "@remix-run/react";

import { AuthenticityTokenProvider } from "remix-utils/csrf/react";
import { GeneralErrorBoundary } from "./components/error-boundary";
import { csrf } from "~/utils/csrf.server";

import Footer from "./components/site/footer";
import Header from "./components/site/header";
import { getEnv } from "./utils/env.server";

import { Toaster, toast as showToast } from "sonner";

import { getTheme, setTheme, type Theme } from "./utils/theme.server";
import { z } from "zod";
import { combineHeaders, invariantResponse } from "./utils/misc";
import { parse } from "@conform-to/zod";
import { useForm } from "@conform-to/react";
import { ErrorList } from "./components/forms";
import { toastSessionStorage } from "~/utils/toast.server";

import { useEffect } from "react";
import { Spacer } from "./components/spacer";
import { HoneypotProvider } from "remix-utils/honeypot/react";
import { honeypot } from "./utils/honeypot.server";
import { withSentry } from "@sentry/remix";

import "~/styles/tailwind.css";
import lficon from "~/assets/favicon.ico";

export const links: LinksFunction = () => {
  return [{ rel: "icon", href: lficon }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const [csrfToken, csrfCookieHeader] = await csrf.commitToken(request);
  const honeyProps = honeypot.getInputProps();
  const toastCookieSession = await toastSessionStorage.getSession(
    request.headers.get("cookie"),
  );
  const toast = toastCookieSession.get("toast");
  console.log("allgooooood");
  return json(
    {
      theme: getTheme(request),
      toast,
      ENV: getEnv(),
      csrfToken,
      honeyProps,
    },
    {
      headers: combineHeaders(
        csrfCookieHeader ? { "set-cookie": csrfCookieHeader } : null,
        {
          "set-cookie":
            await toastSessionStorage.commitSession(toastCookieSession),
        },
      ),
    },
  );
}

const ThemeFormSchema = z.object({
  theme: z.enum(["light", "dark"]),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  invariantResponse(
    formData.get("intent") === "update-theme",
    "Invalid intent",
    { status: 400 },
  );
  const submission = parse(formData, {
    schema: ThemeFormSchema,
  });
  if (submission.intent !== "submit") {
    return json({ status: "success", submission } as const);
  }
  if (!submission.value) {
    return json({ status: "error", submission } as const, { status: 400 });
  }
  const { theme } = submission.value;

  const responseInit = {
    headers: { "set-cookie": setTheme(theme) },
  };
  return json({ success: true, submission }, responseInit);
}

function Document({
  children,
  theme,
}: Readonly<{
  children: React.ReactNode;
  theme?: Theme;
}>) {
  return (
    <html lang="en" className={`${theme} h-full overflow-x-hidden`}>
      <head>
        <Meta />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Links />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <div className=" bg-black text-foreground">
          <div className="mx-auto flex max-w-4xl flex-col">
            <div className="flex justify-between">
              <div></div>
              <div>
                <ThemeSwitch userPreference={theme} />
              </div>
            </div>
          </div>
        </div>
        {/* <GlobalLoading /> */}
        {children}

        <Toaster
          expand
          visibleToasts={90}
          toastOptions={{
            unstyled: false,
          }}
          closeButton
          position="bottom-right"
        />

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
function App() {
  const data = useLoaderData<typeof loader>();
  const theme = useTheme();
  return (
    <Document theme={theme}>
      <Header />
      <div className="mx-auto flex max-w-4xl flex-col bg-background px-4 py-2">
        <Outlet />
        <Spacer size="3xs" />

        {data.toast ? <ShowToast toast={data.toast} /> : null}
      </div>
      <Footer />
    </Document>
  );
}

function AppWithProviders() {
  const data = useLoaderData<typeof loader>();
  return (
    <AuthenticityTokenProvider token={data.csrfToken}>
      <HoneypotProvider {...data.honeyProps}>
        <App />
      </HoneypotProvider>
    </AuthenticityTokenProvider>
  );
}

export default withSentry(AppWithProviders);

function useTheme() {
  const data = useLoaderData<typeof loader>();
  const fetchers = useFetchers();
  const fetcher = fetchers.find(
    (f) => f.formData?.get("intent") === "update-theme",
  );
  const optimisticTheme = fetcher?.formData?.get("theme");
  if (optimisticTheme === "light" || optimisticTheme === "dark") {
    return optimisticTheme;
  }
  return data.theme;
}

function ThemeSwitch({ userPreference }: Readonly<{ userPreference?: Theme }>) {
  const fetcher = useFetcher<typeof action>();

  const [form] = useForm({
    id: "theme-switch",
    lastSubmission: fetcher.data?.submission,
    onValidate({ formData }) {
      return parse(formData, { schema: ThemeFormSchema });
    },
  });

  const mode = userPreference ?? "light";
  const nextMode = mode === "light" ? "dark" : "light";
  const modeLabel = {
    light: "Light ",
    dark: "Dark ",
  };

  return (
    <fetcher.Form method="POST" {...form.props}>
      <input type="hidden" name="theme" value={nextMode} />
      <div className="flex gap-2 text-white">
        <button
          name="intent"
          value="update-theme"
          type="submit"
          className="flex h-8 w-8 cursor-pointer items-center justify-center"
        >
          {modeLabel[mode]}
        </button>
      </div>
      <ErrorList errors={form.errors} id={form.errorId} />
    </fetcher.Form>
  );
}

function ShowToast({ toast }: { toast: unknown }) {
  const { id, type, title, description } = toast as {
    id: string;
    type: "success" | "message";
    title: string;
    description: string;
  };
  useEffect(() => {
    setTimeout(() => {
      showToast[type](title, { id, description });
    }, 0);
  }, [description, id, title, type]);
  return null;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Marta Blog" },
    {
      name: "description",
      description: "Marta Blog",
    },
  ];
};

export function ErrorBoundary() {
  return (
    <Document>
      <GeneralErrorBoundary />
    </Document>
  );
}
