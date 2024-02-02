/// <reference types="@remix-run/node" />
/// <reference types="vite/client" />
import type { KVNamespace } from "@cloudflare/workers-types";

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    env: {
      MY_KV: KVNamespace;
    };
  }
}
