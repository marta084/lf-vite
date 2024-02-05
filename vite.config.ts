import {
  unstable_vitePlugin as remix,
  unstable_cloudflarePreset as cloudflare,
} from "@remix-run/dev";
import morgan from "morgan";
import { defineConfig, type ViteDevServer } from "vite";
import TurboConsole from "vite-plugin-turbo-console";
import tsconfigPaths from "vite-tsconfig-paths";
import { remixDevTools } from "remix-development-tools/vite";
import remixConfig from "./remix.config";
import envOnly from "vite-env-only";

export default defineConfig({
  base: "https://lf-vite.pages.dev",

  plugins: [
    envOnly(),
    remixDevTools({
      pluginDir: "./plugins",
    }),
    TurboConsole(),
    morganPlugin(),
    remix({
      ...remixConfig,
      presets: [cloudflare()],
    }),
    tsconfigPaths(),
  ],
  build: {
    cssMinify: true,
  },
  server: {
    open: true,
  },
  ssr: {
    resolve: {
      externalConditions: ["workerd", "worker"],
    },
  },
});

function morganPlugin() {
  return {
    name: "morgan-plugin",
    configureServer(server: ViteDevServer) {
      return () => {
        server.middlewares.use(morgan("tiny"));
      };
    },
  };
}
