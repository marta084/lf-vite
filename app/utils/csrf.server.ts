import { createCookie } from "@remix-run/cloudflare";
import { CSRF, CSRFError } from "remix-utils/csrf/server";

const cookie = createCookie("csrf", {
  path: "/",
  httpOnly: true,

  sameSite: "lax",
});

export const csrf = new CSRF({ cookie });

export async function validateCSRF(formData: FormData, headers: Headers) {
  try {
    await csrf.validate(formData, headers);
  } catch (error) {
    if (error instanceof CSRFError) {
      throw new Response("Invalid CSRF token", { status: 403 });
    }
    throw error;
  }
}
