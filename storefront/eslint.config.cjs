const { FlatCompat } = require("@eslint/eslintrc")

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

module.exports = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
    ignorePatterns: [
      // Dependencies
      "node_modules/",

      // Build and output directories
      ".next/",
      "out/",

      // Coverage
      "coverage/",

      // Static and public assets
      "public/",

      // Test directories
      "e2e/",
      "integration-tests/",

      // Type definitions
      "**/*.d.ts",

      // Environment and config files
      ".env",
      ".env.local",
      ".env.*.local",

      // Linting cache
      ".eslintcache",

      // Package lock files (yarn only)
      "yarn.lock",
    ],
    rules: {
      // General best practices
      "no-console": [
        "warn",
        {
          allow: ["warn", "error", "info"],
        },
      ],
      "no-debugger": "error",
      "no-duplicate-imports": "error",
      "no-var": "error",
      "prefer-const": "error",
      "prefer-arrow-callback": "warn",
      "object-shorthand": "warn",
      eqeqeq: ["error", "always"],

      // React best practices
      "react/no-unescaped-entities": "warn",
      "react/self-closing-comp": "error",
      "react/prefer-es6-class": "error",
      "react/no-array-index-key": "warn",
      "react/no-danger": "warn",

      // React hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Next.js
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "error",
    },
  }),
  // Override for config files that legitimately use require()
  {
    files: ["**/*.config.js", "**/*.config.cjs", "check-env-variables.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]
