import "server-only";
import { createDynamoStore } from "./dynamo-store";
import { memoryStore } from "./memory-store";
import type { KvStore } from "./types";

export type { KvStore } from "./types";

let store: KvStore | undefined;

export function kv(): KvStore {
  const table = process.env.KV_TABLE;
  store ??= table ? createDynamoStore(table, process.env.AWS_REGION ?? "us-east-1") : memoryStore;
  return store;
}
