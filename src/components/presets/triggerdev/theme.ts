import { Theme, IconType } from "@/typings/editor";
import { convertToShikiTheme } from "../themes/shared";

export const triggerdev: Theme = {
  id: "triggerdev",
  name: "Trigger.dev",
  background: {
    from: "#121317",
    to: "#121317",
  },
  icon: { type: IconType.IMAGE, source: "/editor/assets/triggerdev/logo.svg" },
  font: "geist-mono",
  partner: true,
  group: "Brands",
  sample: {
    language: "TypeScript",
    fileName: "hello-world.ts",
    icon: "https://raw.githubusercontent.com/simpleneeraj/vscode-material-icon-theme/main/icons/trigger.svg",
    code: 'import { task } from "@trigger.dev/sdk";\n\nexport const helloWorld = task({\n  id: "hello-world",\n  run: async (payload: { message: string }) => {\n    console.log(payload.message);\n    return { delivered: true };\n  },\n});',
  },
  syntax: {
    light: convertToShikiTheme({
      foreground: "#2E2E4B",
      constant: "#1E1E1E",
      string: "#262626",
      comment: "#5F6570",
      keyword: "#B114D3",
      parameter: "#404040",
      function: "#5C40FF",
      stringExpression: "#0879E2",
      punctuation: "#333333",
      link: "#1A1A1A",
      number: "#262626",
      property: "#222222",
    }),
    dark: convertToShikiTheme({
      foreground: "#CCCBFF",
      constant: "#9C9AF2",
      string: "#AFEC73",
      comment: "#5F6570",
      keyword: "#E888F8",
      parameter: "#CCCBFF",
      function: "#9684FF",
      stringExpression: "#AFEC73",
      punctuation: "#878C99",
      link: "#826DFF",
      number: "#b5cea8",
      property: "#CCCBFF",
    }),
  },
};
