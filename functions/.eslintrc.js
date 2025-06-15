module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.dev.json"], // Changed from tsconfig.json to tsconfig.dev.json
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*",
    "/dist/**/*",
    ".eslintrc.js"  // Add this line to ignore the eslint config file
  ],
  plugins: [
    "@typescript-eslint",
    "prettier"
  ],
  rules: {
    "quotes": ["error", "double"],
    "indent": ["error", 2],
    "object-curly-spacing": ["error", "never"],
    "max-len": ["error", {code: 100}],
    "@typescript-eslint/no-explicit-any": "warn",
    "eol-last": ["error", "always"]
  },
};
