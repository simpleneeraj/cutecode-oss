import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  {
    ignores: ["infra/cdk.out/**", "infra/node_modules/**"],
  },
  {
    extends: [...nextCoreWebVitals],
  },
]);
