import { afterEach, describe, expect, it } from "vitest";
import { loadRuntimeSecrets, type ParameterReader } from "./secrets";

function reader(pages: { Name: string; Value: string }[][]): ParameterReader {
  let index = 0;
  return {
    send: async () => {
      const page = pages[index++];
      return { Parameters: page, NextToken: index < pages.length ? String(index) : undefined };
    },
  };
}

const touched = ["SSM_SECRETS_PATH", "CS_TEST_A", "CS_TEST_B", "CS_TEST_KEEP"];

afterEach(() => {
  for (const name of touched) delete process.env[name];
});

describe("loadRuntimeSecrets", () => {
  it("does nothing without SSM_SECRETS_PATH", async () => {
    expect(await loadRuntimeSecrets(reader([[{ Name: "/x/CS_TEST_A", Value: "a" }]]))).toEqual([]);
    expect(process.env.CS_TEST_A).toBeUndefined();
  });

  it("loads every page, keeps existing values and skips invalid names", async () => {
    process.env.SSM_SECRETS_PATH = "/cutecode/main/";
    process.env.CS_TEST_KEEP = "local";
    const loaded = await loadRuntimeSecrets(
      reader([
        [
          { Name: "/cutecode/main/CS_TEST_A", Value: "a" },
          { Name: "/cutecode/main/lower", Value: "x" },
        ],
        [
          { Name: "/cutecode/main/CS_TEST_B", Value: "b" },
          { Name: "/cutecode/main/CS_TEST_KEEP", Value: "remote" },
        ],
      ]),
    );
    expect(loaded).toEqual(["CS_TEST_A", "CS_TEST_B"]);
    expect(process.env.CS_TEST_A).toBe("a");
    expect(process.env.CS_TEST_KEEP).toBe("local");
  });

  it("wraps reader failures with the path", async () => {
    process.env.SSM_SECRETS_PATH = "/cutecode/main/";
    const failing: ParameterReader = {
      send: async () => {
        throw new Error("denied");
      },
    };
    await expect(loadRuntimeSecrets(failing)).rejects.toThrow("/cutecode/main/");
  });
});
