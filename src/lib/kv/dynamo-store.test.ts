import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createDynamoStore } from "./dynamo-store";

const TABLE = "cutecode-kv-test";

type Sent = { constructor: { name: string }; input: Record<string, unknown> };

function answerDynamo(...replies: Array<Record<string, unknown> | Error>): Sent[] {
  const sent: Sent[] = [];
  const send = vi.spyOn(DynamoDBDocumentClient.prototype, "send");
  for (const reply of replies) {
    send.mockImplementationOnce(async (command: unknown) => {
      sent.push(command as Sent);
      if (reply instanceof Error) throw reply;
      return reply;
    });
  }
  return sent;
}

function conditionFailed(): ConditionalCheckFailedException {
  return new ConditionalCheckFailedException({ message: "condition failed", $metadata: {} });
}

function nowSec(): number {
  return Math.floor(Date.now() / 1000);
}

describe("the DynamoDB kv store", () => {
  const store = createDynamoStore(TABLE, "us-east-1");

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reads a live value by pk and the fixed sort key", async () => {
    const sent = answerDynamo({ Item: { pk: "greeting", sk: "v", value: "hello", expiresAt: nowSec() + 60 } });
    expect(await store.get("greeting")).toBe("hello");
    expect(sent[0]?.constructor.name).toBe("GetCommand");
    expect(sent[0]?.input).toMatchObject({ TableName: TABLE, Key: { pk: "greeting", sk: "v" } });
  });

  it("ignores an item whose expiry has passed but is not yet deleted", async () => {
    answerDynamo({ Item: { pk: "stale", sk: "v", value: "old", expiresAt: nowSec() - 1 } });
    expect(await store.get("stale")).toBeNull();
  });

  it("increments atomically and keeps the first expiry", async () => {
    const sent = answerDynamo({ Attributes: { value: 4 } });
    expect(await store.incr("hits", 60)).toBe(4);
    expect(sent[0]?.constructor.name).toBe("UpdateCommand");
    expect(sent[0]?.input).toMatchObject({
      TableName: TABLE,
      Key: { pk: "hits", sk: "v" },
      UpdateExpression: "ADD #value :by SET #expiresAt = if_not_exists(#expiresAt, :expiresAt)",
      ExpressionAttributeValues: { ":by": 1 },
    });
  });

  it("restarts the counter when the window has expired", async () => {
    const sent = answerDynamo(conditionFailed(), {});
    expect(await store.incr("hits", 60, 2)).toBe(2);
    expect(sent[1]?.constructor.name).toBe("PutCommand");
    expect(sent[1]?.input).toMatchObject({ Item: { pk: "hits", sk: "v", value: 2 } });
  });
});
