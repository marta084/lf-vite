// @ts-check

/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig}
 */
export default {
  semi: false,
  singleQuote: true,
  trailingComma: "all",
  arrowParens: "avoid",
  plugins: [
    "prettier-plugin-tailwindcss",
    "@ianvs/prettier-plugin-sort-imports",
  ],
  // This plugin's options
  importOrder: [
    "^@core/(.*)$",
    "",
    "^@server/(.*)$",
    "",
    "^@ui/(.*)$",
    "",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "5.0.0",
};
