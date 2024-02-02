import {
  unstable_vitePlugin as remix,
  unstable_cloudflarePreset as cloudflare,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { remixDevTools } from "remix-development-tools/vite";
import remixConfig from "./remix.config";

export default defineConfig({
  plugins: [
    remixDevTools({
      pluginDir: "./plugins",
    }),
    remix({
      presets: [cloudflare()],
    }),
    tsconfigPaths(),
  ],
  server: {
    open: true,
  },
  ssr: {
    resolve: {
      externalConditions: ["workerd", "worker"],
    },
  },
});
