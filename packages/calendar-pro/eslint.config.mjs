import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

const calendarRules = {
  curly: ["error", "all"],
  "@typescript-eslint/no-explicit-any": "error",
  "@typescript-eslint/no-non-null-assertion": "error",
  "@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "never" }],
  "@typescript-eslint/consistent-type-definitions": ["error", "type"],
  "no-restricted-syntax": [
    "error",
    { selector: "TSEnumDeclaration[const=true]", message: "Use a plain string enum, never const enum." },
    { selector: "TSEnumMember:not([initializer])", message: "Enums are string enums." },
    { selector: "TSEnumMember > Literal[raw=/^[^\"']/]", message: "Enums are string enums." },
    { selector: "ConditionalExpression ConditionalExpression", message: "No nested ternaries." },
  ],
};

const restrictedImports = {
  patterns: [
    { group: ["@date-fns/tz", "@date-fns/utc"], message: "Zones and plain dates go through @cutecode/calendar/time." },
    {
      group: ["chrono-node", "chrono-node/*"],
      allowTypeImports: true,
      message: "Load chrono-node lazily with import() inside quick-add.",
    },
  ],
};

export default defineConfig([
  { ignores: ["node_modules/**"] },
  ...tseslint.configs.strict,
  { rules: { ...calendarRules, "no-restricted-imports": ["error", restrictedImports] } },
]);
