import "server-only";
import { ConditionalCheckFailedException, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import type { KvStore } from "./types";

const SORT_KEY = "v";

type Item = { value?: string | number; expiresAt?: number };

function nowSec(): number {
  return Math.floor(Date.now() / 1000);
}

function expiry(ttlSec: number | undefined): { expiresAt?: number } {
  return ttlSec ? { expiresAt: nowSec() + ttlSec } : {};
}

function liveValue(item: Item | undefined): string | null {
  if (item?.value === undefined) return null;
  if (item.expiresAt !== undefined && item.expiresAt <= nowSec()) return null;
  return String(item.value);
}

export function createDynamoStore(table: string, region: string): KvStore {
  const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region }));
  const itemKey = (key: string) => ({ pk: key, sk: SORT_KEY });

  async function addToLive(key: string, ttlSec: number, by: number): Promise<number> {
    const now = nowSec();
    const { Attributes } = await client.send(
      new UpdateCommand({
        TableName: table,
        Key: itemKey(key),
        UpdateExpression: "ADD #value :by SET #expiresAt = if_not_exists(#expiresAt, :expiresAt)",
        ConditionExpression: "attribute_not_exists(pk) OR #expiresAt > :now",
        ExpressionAttributeNames: { "#value": "value", "#expiresAt": "expiresAt" },
        ExpressionAttributeValues: { ":by": by, ":expiresAt": now + ttlSec, ":now": now },
        ReturnValues: "UPDATED_NEW",
      }),
    );
    return Number(Attributes?.value);
  }

  async function restartExpired(key: string, ttlSec: number, by: number): Promise<void> {
    const now = nowSec();
    await client.send(
      new PutCommand({
        TableName: table,
        Item: { ...itemKey(key), value: by, expiresAt: now + ttlSec },
        ConditionExpression: "#expiresAt <= :now",
        ExpressionAttributeNames: { "#expiresAt": "expiresAt" },
        ExpressionAttributeValues: { ":now": now },
      }),
    );
  }

  async function incr(key: string, ttlSec: number, by = 1): Promise<number> {
    try {
      return await addToLive(key, ttlSec, by);
    } catch (error) {
      if (!(error instanceof ConditionalCheckFailedException)) throw error;
    }
    try {
      await restartExpired(key, ttlSec, by);
      return by;
    } catch (error) {
      if (!(error instanceof ConditionalCheckFailedException)) throw error;
      return incr(key, ttlSec, by);
    }
  }

  return {
    get: async (key) => {
      const { Item } = await client.send(new GetCommand({ TableName: table, Key: itemKey(key) }));
      return liveValue(Item);
    },
    set: async (key, value, ttlSec) => {
      await client.send(new PutCommand({ TableName: table, Item: { ...itemKey(key), value, ...expiry(ttlSec) } }));
    },
    del: async (key) => {
      await client.send(new DeleteCommand({ TableName: table, Key: itemKey(key) }));
    },
    getAndDelete: async (key) => {
      const { Attributes } = await client.send(
        new DeleteCommand({ TableName: table, Key: itemKey(key), ReturnValues: "ALL_OLD" }),
      );
      return liveValue(Attributes);
    },
    incr,
  };
}
