import { Theme, IconType } from "@/typings/editor";
import { convertToShikiTheme } from "../themes/shared";

export const stripe: Theme = {
  id: "stripe",
  name: "Stripe",
  background: {
    from: "#0a2540",
    to: "#0a2540",
  },
  icon: { type: IconType.IMAGE, source: "/editor/assets/stripe/logo.svg" },
  partner: true,
  group: "Brands",
  sample: {
    language: "JavaScript",
    fileName: "checkout.js",
    icon: "https://raw.githubusercontent.com/simpleneeraj/vscode-material-icon-theme/main/icons/javascript.svg",
    code: 'const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);\n\nconst session = await stripe.checkout.sessions.create({\n  success_url: "https://example.com/success",\n  line_items: [{ price: "price_gold_plan", quantity: 1 }],\n  mode: "subscription",\n});\n\nconsole.log(session.url);',
  },
  font: "source-code-pro",
  lineNumbers: true,
  syntax: {
    dark: convertToShikiTheme({
      foreground: "#f5fbff",
      constant: "#b9b4ff",
      string: "#9fdcb0",
      comment: "#a3abcd",
      keyword: "#b9b4ff",
      parameter: "#e0e7ff",
      function: "#dcdaff",
      stringExpression: "#9fdcb0",
      punctuation: "#aab3d4",
      link: "#9fdcb0",
      number: "#b9b4ff",
      property: "#e0e7ff",
      objectLiteral: "#e0e7ff",
      highlight: "rgba(185, 180, 255, 0.1)",
      highlightHover: "rgba(185, 180, 255, 0.05)",
      highlightBorder: "#b9b4ff",
      diffInserted: "#85d996",
      diffDeleted: "#fbb5b2",
    }),
  },
};
