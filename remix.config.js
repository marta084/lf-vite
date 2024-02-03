import { flatRoutes } from "remix-flat-routes";
/** @type {import('@remix-run/dev/dist/vite/presets/cloudflare').VitePluginConfig} */
export default {
  routes: async (defineRoutes) => {
    return flatRoutes("routes", defineRoutes, {
      ignoredRouteFiles: [
        ".*",
        "**/*.css",
        "**/*.test.{js,jsx,ts,tsx}",
        "**/__*.*",
      ],
    });
  },
};
