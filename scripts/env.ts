import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const REGION = "us-east-1";
const APP_ID = "d3bad3vjedksxl";
const SSM_PATH = "/cutecode/main/";
const ENV_FILE = ".env.production";
const LINE = /^([A-Z_][A-Z0-9_]*)=(.*)$/;

type EnvMap = Record<string, string>;

function aws(args: string[]): unknown {
  return JSON.parse(execFileSync("aws", [...args, "--region", REGION, "--output", "json"], { encoding: "utf8" }));
}

function readSsm(): EnvMap {
  const result = aws(["ssm", "get-parameters-by-path", "--path", SSM_PATH, "--with-decryption"]) as {
    Parameters: { Name: string; Value: string }[];
  };
  return Object.fromEntries(result.Parameters.map(({ Name, Value }) => [Name.slice(SSM_PATH.length), Value]));
}

function readAmplify(): EnvMap {
  return aws(["amplify", "get-app", "--app-id", APP_ID, "--query", "app.environmentVariables"]) as EnvMap;
}

function readDeployed(): EnvMap {
  return { ...readAmplify(), ...readSsm() };
}

function parseLine(line: string): [string, string] | null {
  const match = LINE.exec(line);
  if (!match) return null;
  return [match[1], match[2].trim().replace(/^"|"$/g, "")];
}

function readEnvLines(): string[] {
  return readFileSync(ENV_FILE, "utf8").split("\n");
}

function findDrift(lines: string[], deployed: EnvMap): string[] {
  const local = Object.fromEntries(lines.map(parseLine).filter((entry) => entry !== null));
  return Object.keys(deployed).filter((key) => local[key] !== deployed[key]);
}

function pull(): void {
  const deployed = readDeployed();
  const lines = readEnvLines();
  const seen = new Set<string>();
  const updated = lines.map((line) => {
    const entry = parseLine(line);
    if (!entry || !(entry[0] in deployed)) return line;
    seen.add(entry[0]);
    return `${entry[0]}="${deployed[entry[0]]}"`;
  });
  const added = Object.keys(deployed).filter((key) => !seen.has(key));
  const output = [...updated.join("\n").trimEnd().split("\n"), ...added.map((key) => `${key}="${deployed[key]}"`)];
  writeFileSync(ENV_FILE, `${output.join("\n")}\n`, { mode: 0o600 });
  console.log(`env:pull updated ${seen.size} and added ${added.length} keys in ${ENV_FILE}`);
}

function check(): void {
  const drift = findDrift(readEnvLines(), readDeployed());
  if (drift.length === 0) return console.log(`env:check ${ENV_FILE} matches deployed config`);
  console.log(`env:check drift in: ${drift.join(", ")}`);
  process.exitCode = 1;
}

const command = process.argv[2];
if (command === "pull") pull();
else if (command === "check") check();
else {
  console.log("usage: tsx scripts/env.ts <pull|check>");
  process.exitCode = 1;
}
