import { defineConfig } from "vitest/config";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "server-only": path.join(path.dirname(require.resolve("server-only")), "empty.js"),
    },
  },
  test: {
    environment: "node",
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "api",
          include: ["tests/api/**/*.test.ts"],
          globalSetup: ["tests/api/setup/global.ts"],
          setupFiles: ["tests/api/setup/env.ts", "tests/api/setup/db.ts"],
          testTimeout: 30_000,
          hookTimeout: 30_000,
        },
      },
    ],
  },
});
