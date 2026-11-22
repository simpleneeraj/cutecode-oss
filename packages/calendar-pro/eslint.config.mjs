import { defineConfig } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
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

const zoneLibraries = {
  group: ["@date-fns/tz", "@date-fns/utc"],
  message: "Zones and plain dates go through @cutecode/calendar/time.",
};

const lazyChrono = {
  group: ["chrono-node", "chrono-node/*"],
  allowTypeImports: true,
  message: "Load chrono-node lazily with import() inside quick-add.",
};

const reactLibraries = {
  group: [
    "react",
    "react/*",
    "react-dom",
    "react-dom/*",
    "motion",
    "motion/*",
    "@cutecode/ui",
    "@cutecode/ui/*",
    "@solar-icons/*",
    "@tanstack/react-virtual",
    "@cutecode/calendar/parts/*",
    "@cutecode/calendar/week",
    "@cutecode/calendar/day",
    "@cutecode/calendar/month",
    "@cutecode/calendar/agenda",
  ],
  message: "Engine folders stay pure. React lives in src/views and src/parts.",
};

const reactFolders = ["src/views/**", "src/parts/**"];

export default defineConfig([
  { ignores: ["node_modules/**"] },
  ...tseslint.configs.strict,
  { files: reactFolders, ...reactHooks.configs.flat["recommended-latest"] },
  {
    rules: {
      ...calendarRules,
      "no-restricted-imports": ["error", { patterns: [zoneLibraries, lazyChrono, reactLibraries] }],
    },
  },
  { files: reactFolders, rules: { "no-restricted-imports": ["error", { patterns: [zoneLibraries, lazyChrono] }] } },
]);
