import type { ActionArgs } from "@remix-run/node";
import {   redirect, type LoaderArgs, defer } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/node";
import { Link, useFetcher,   useSubmit } from "@remix-run/react";
import { EmbeddedDevTools } from "remix-development-tools";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const test = new Promise((resolve) => {
    setTimeout(() => {
      resolve("test");
    }, 1000);
  })
  return defer({ message: "Hello World!", test });
};

export const action = async ({ request }: ActionArgs) => {
  return redirect("/login");
};

export default function Index() {  
  const lFetcher = useFetcher();
  const pFetcher = useFetcher();
  const submit = useSubmit();
  const data = new FormData();
  data.append("test", "test");
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <button
        onClick={() => lFetcher.submit(null, { method: "get", action: "/" })}
      >
        FETCHER Loader
      </button>
      <button
        onClick={() => pFetcher.submit(data, { method: "POST", action: "/" })}
      >
        FETCHER Action
      </button>
      <button onClick={() => submit(null, { method: "POST", action: "/" })}>
        SUBMIT Action
      </button>
      <button onClick={() => submit(data, { method: "PATCH", action: "/" })}>
        SUBMIT Action PATCH
      </button>
      <button onClick={() => submit(null, { method: "DELETE", action: "/" })}>
        SUBMIT Action DELETE
      </button>
      <button onClick={() => submit(null, { method: "PUT", action: "/" })}>
        SUBMIT Action PUT
      </button>
      <div style={{ height: 400, overflowY: "auto",  width: 1700 }}>
        <EmbeddedDevTools className="!h-[400px] !overflow-y-auto" mainPanelClassName="w-40" />
      </div>
      <Link to="/login">Login</Link>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
