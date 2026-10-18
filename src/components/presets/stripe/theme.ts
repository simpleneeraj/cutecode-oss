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
      constant: "#7fd3ed",
      string: "#85d996",
      comment: "#c1c9d2",
      keyword: "#a4cdfe",
      parameter: "#fbb5b2",
      function: "#7fd3ed",
      stringExpression: "#85d996",
      punctuation: "#f5fbff",
      link: "#7fd3ed",
      number: "#f8b886",
      property: "#f5fbff",
      objectLiteral: "#f5fbff",
      highlight: "#1a2147",
      highlightBorder: "#665efd",
      highlightHover: "rgba(26, 33, 71, 0.6)",
      diffInserted: "#85d996",
      diffDeleted: "#fbb5b2",
    }),
  },
};
