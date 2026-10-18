import "server-only";
import { GetParametersByPathCommand, SSMClient, type GetParametersByPathCommandOutput } from "@aws-sdk/client-ssm";
import { logger } from "@/lib/logger";

const VARIABLE_NAME = /^[A-Z][A-Z0-9_]*$/;

export type ParameterReader = {
  send(command: GetParametersByPathCommand): Promise<Pick<GetParametersByPathCommandOutput, "Parameters" | "NextToken">>;
};

declare global {
  var __cutecodeSecretsLoaded: boolean | undefined;
}

let pendingLoad: Promise<void> | undefined;

export function ensureRuntimeSecrets(): Promise<void> {
  if (globalThis.__cutecodeSecretsLoaded) return Promise.resolve();
  pendingLoad ??= loadRuntimeSecrets()
    .then(() => {
      globalThis.__cutecodeSecretsLoaded = true;
    })
    .catch((error: unknown) => {
      logger.error({ err: error }, "[secrets] load failed");
      pendingLoad = undefined;
      throw error;
    });
  return pendingLoad;
}

export async function loadRuntimeSecrets(client?: ParameterReader): Promise<string[]> {
  const path = process.env.SSM_SECRETS_PATH?.trim();
  if (!path || process.env.NEXT_PHASE === "phase-production-build") return [];

  const ssm: ParameterReader = client ?? new SSMClient({});
  const loaded: string[] = [];
  let nextToken: string | undefined;
  try {
    do {
      const page = await ssm.send(new GetParametersByPathCommand({ Path: path, WithDecryption: true, NextToken: nextToken }));
      for (const parameter of page.Parameters ?? []) {
        if (!parameter.Name || parameter.Value === undefined) continue;
        const name = parameter.Name.slice(parameter.Name.lastIndexOf("/") + 1);
        if (!VARIABLE_NAME.test(name) || process.env[name]) continue;
        process.env[name] = parameter.Value;
        loaded.push(name);
      }
      nextToken = page.NextToken;
    } while (nextToken);
  } catch (cause) {
    const reason = cause instanceof Error ? `${cause.name}: ${cause.message}` : String(cause);
    throw new Error(`Could not load secrets from SSM path ${path}. ${reason}`, { cause });
  }

  logger.info(`[secrets] loaded ${loaded.length} parameters from ${path}: ${loaded.join(", ") || "none"}`);
  return loaded;
}
