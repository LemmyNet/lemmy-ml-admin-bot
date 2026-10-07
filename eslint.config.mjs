import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    languageOptions: {
      parser: tseslint.parser,
    },
  },
  // For some reason this has to be in its own block
  {
    ignores: [
      "eslint.config.mjs",
      "generate_translations.js",
      "src/shared/build-config.js",
      "src/api_tests",
      "**/*.png",
      "**/*.css",
      "**/*.scss",
      "**/*.svg",
      "src/shared/translations/**",
      "dist/*",
      ".yalc/*",
    ],
  },
  {
    files: ["src/**/*.js", "src/**/*.mjs", "src/**/*.ts", "src/**/*.tsx"],
    rules: {
      // TODO: the following is caused by calling async functions from sync functions
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            // An unhandledRejection handler prevents NodeJS from exiting on unhandled rejections.
            inheritedMethods: false, // allow async lifecycles in class components
            attributes: false, // allow async event handlers in tsx
          },
        },
      ],
      "@typescript-eslint/no-useless-constructor": "error",
      "@typescript-eslint/no-explicit-any": ["error", { ignoreRestArgs: true }],
      "@typescript-eslint/no-unnecessary-type-assertion": [
        "error",
        { typesToIgnore: ["NoOptionI18nKeys"] },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      eqeqeq: "error",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["assets/*", "client/*", "server/*", "shared/*"],
              message: "Use relative import instead.",
            },
          ],
        },
      ],
      "no-restricted-properties": [
        "error",
        {
          object: "document",
          property: "getElementById",
          message: "Use createRef instead",
        },
        {
          property: "querySelector",
          message: "Use createRef instead",
        },
      ],
      "no-restricted-syntax": [
        "error",
        /* To figure out the node types and hierarchy, set the info view to ESTree in the
         * typescript-eslint Playground (https://typescript-eslint.io/play/) and move the cursor in
         * the code view to the positions you're interested in.
         *
         * For the selector syntax: https://eslint.org/docs/latest/extend/selectors
         */
        {
          /* Expected to catch:
           * document.removeEventListener("", () => {});
           * document.removeEventListener("", function () {});
           * document.removeEventListener("", function notAnon() {});
           */
          selector:
            "CallExpression[callee.property.name=removeEventListener] > :matches(FunctionExpression, ArrowFunctionExpression):nth-child(2)",
          message:
            "removeEventListener has to be called with the same listener as addEventListener. You are passing a new function.",
        },
      ],
    },
  },
];
