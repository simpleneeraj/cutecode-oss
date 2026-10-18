import { describe, it, expect } from "vitest";
import { Plan, ShareVisibility } from "@/db/schema";
import { callerFor, type Caller } from "./support/caller";
import { createUser } from "./support/factories";
import { insertShare, publishInput } from "./support/content";

const long = (length: number) => "x".repeat(length);
const manyTags = Array.from({ length: 11 }, (_, index) => `tag${index}`);
const hugeElements = { el_huge: { type: "code", code: long(2_000_000) } };

type Fixture = { caller: Caller; snippetId: string; presentationId: string; linkId: string; slug: string };

type Case = [string, (fixture: Fixture) => Promise<unknown>];

const CASES: Case[] = [
  ["presentation.create empty name", ({ caller }) => caller.presentation.create({ name: "" })],
  ["presentation.create long name", ({ caller }) => caller.presentation.create({ name: long(121) })],
  ["presentation.create narrow width", ({ caller }) => caller.presentation.create({ width: 100 })],
  ["presentation.create wide width", ({ caller }) => caller.presentation.create({ width: 5000 })],
  ["presentation.sync long name", ({ caller, presentationId }) => caller.presentation.sync({ id: presentationId, data: { name: long(121) } })],
  ["presentation.sync bad width", ({ caller, presentationId }) => caller.presentation.sync({ id: presentationId, data: { width: 5000 } })],
  ["presentation.sync empty id", ({ caller }) => caller.presentation.sync({ id: "", data: {} })],
  ["presentation.delete empty id", ({ caller }) => caller.presentation.delete({ id: "" })],
  ["snippet.create long title", ({ caller, presentationId }) => caller.snippet.create({ presentationId, elementId: "el", title: long(121) })],
  ["snippet.create too many tags", ({ caller, presentationId }) => caller.snippet.create({ presentationId, elementId: "el", tags: manyTags })],
  ["snippet.create empty presentation", ({ caller }) => caller.snippet.create({ presentationId: "", elementId: "el" })],
  ["snippet.update long title", ({ caller, snippetId }) => caller.snippet.update({ id: snippetId, data: { title: long(121) } })],
  ["snippet.update too many tags", ({ caller, snippetId }) => caller.snippet.update({ id: snippetId, data: { tags: manyTags } })],
  ["snippet.delete empty id", ({ caller }) => caller.snippet.delete({ id: "" })],
  ["snippet.addComment empty", ({ caller, snippetId }) => caller.snippet.addComment({ snippetId, content: "" })],
  ["snippet.addComment oversized", ({ caller, snippetId }) => caller.snippet.addComment({ snippetId, content: long(2001) })],
  ["snippet.toggleUpvote empty id", ({ caller }) => caller.snippet.toggleUpvote({ snippetId: "" })],
  ["snippet.toggleBookmark empty id", ({ caller }) => caller.snippet.toggleBookmark({ snippetId: "" })],
  ["snippet.remix empty slug", ({ caller }) => caller.snippet.remix({ slug: "" })],
  ["snippet.list oversized page", ({ caller }) => caller.snippet.list({ limit: 101 })],
  ["snippet.explore oversized page", ({ caller }) => caller.snippet.explore({ limit: 49 })],
  ["publish.publish long name", ({ caller }) => caller.publish.publish({ ...publishInput(), name: long(121) })],
  ["publish.publish long title", ({ caller }) => caller.publish.publish({ ...publishInput(), title: long(201) })],
  ["publish.publish long description", ({ caller }) => caller.publish.publish({ ...publishInput(), description: long(2001) })],
  ["publish.publish too many tags", ({ caller }) => caller.publish.publish({ ...publishInput(), tags: manyTags })],
  ["publish.publish empty element id", ({ caller }) => caller.publish.publish({ ...publishInput(), elementId: "" })],
  ["publish.publish bad visibility", ({ caller }) => caller.publish.publish({ ...publishInput(), visibility: "SECRET" as ShareVisibility })],
  ["publish.publish missing element", ({ caller }) => caller.publish.publish({ ...publishInput(), elementId: "el_missing" })],
  ["publish.publish passcode visibility without passcode", ({ caller }) => caller.publish.publish(publishInput({ visibility: ShareVisibility.PASSCODE }))],
  ["publish.publish oversized tag", ({ caller }) => caller.publish.publish({ ...publishInput(), tags: [long(10_000)] })],
  ["publish.publish oversized elements", ({ caller }) => caller.publish.publish({ ...publishInput(), elements: hugeElements, elementId: "el_huge" })],
  ["presentation.create oversized elements", ({ caller }) => caller.presentation.create({ elements: hugeElements })],
  ["presentation.sync oversized elements", ({ caller, presentationId }) => caller.presentation.sync({ id: presentationId, data: { elements: hugeElements } })],
  ["snippet.update oversized tag", ({ caller, snippetId }) => caller.snippet.update({ id: snippetId, data: { tags: [long(10_000)] } })],
  ["share.create without target", ({ caller }) => caller.share.create({})],
  ["share.create with two targets", ({ caller, snippetId, presentationId }) => caller.share.create({ snippetId, presentationId })],
  ["share.create passcode visibility without passcode", ({ caller, snippetId }) => caller.share.create({ snippetId, visibility: ShareVisibility.PASSCODE })],
  ["share.create long hint", ({ caller, snippetId }) => caller.share.create({ snippetId, encryptionHint: long(201) })],
  ["share.create zero max views", ({ caller, snippetId }) => caller.share.create({ snippetId, maxViews: 0 })],
  ["share.create bad expiry", ({ caller, snippetId }) => caller.share.create({ snippetId, expiresAt: "tomorrow" })],
  ["share.update long hint", ({ caller, linkId }) => caller.share.update({ id: linkId, data: { encryptionHint: long(201) } })],
  ["share.update zero max views", ({ caller, linkId }) => caller.share.update({ id: linkId, data: { maxViews: 0 } })],
  ["share.update bad visibility", ({ caller, linkId }) => caller.share.update({ id: linkId, data: { visibility: "SECRET" as ShareVisibility } })],
  ["share.delete empty id", ({ caller }) => caller.share.delete({ id: "" })],
  ["share.preview empty slug", ({ caller }) => caller.share.preview({ slug: "" })],
  ["user.toggleFollow empty id", ({ caller }) => caller.user.toggleFollow({ targetUserId: "" })],
  ["user.profile empty id", ({ caller }) => caller.user.profile({ userId: "" })],
];

async function fixture(): Promise<Fixture> {
  const user = await createUser(Plan.PREMIUM);
  const { snippet, presentation, link } = await insertShare(user.id);
  return { caller: await callerFor(user), snippetId: snippet.id, presentationId: presentation.id, linkId: link.id, slug: link.slug };
}

describe("input validation", () => {
  it.each(CASES)("%s is rejected", async (_name, run) => {
    await expect(run(await fixture())).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
