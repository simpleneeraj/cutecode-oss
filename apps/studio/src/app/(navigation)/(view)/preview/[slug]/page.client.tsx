"use client";

import React from "react";
import { Avatar, AvatarFallback } from "@cutecode/ui/components/avatar";
import { Button } from "@cutecode/ui/components/button";
import { Spinner } from "@cutecode/ui/components/spinner";
import { Textarea } from "@cutecode/ui/components/textarea";
import { PasscodeGate } from "../components/passcode-gate";
import { SnippetFrame } from "../components/snippet-frame";
import { SnippetCard } from "../components/snippet-card";
import { PreviewLoading } from "../components/preview-loading";
import SnippetNotFound from "../components/preview-not-found";
import { useSnippetPreview, type OwnedSnippet } from "../hooks/use-snippet-preview";
import { useAddComment, useSnippetComments } from "@/hooks/use-snippet";
import SnippetInfo from "../components/snippet-info";
import SponsorCard from "@/components/sponsors/sponsor-card";
import copy from "copy-to-clipboard";

type PreviewSnippetClientProps = { slug: string };

type OwnerShareBannerProps = {
  ownedSnippet: OwnedSnippet | undefined;
  asVisitor: boolean;
  onViewAsVisitor: () => void;
  onExitVisitor: () => void;
};

function OwnerShareBanner({ ownedSnippet, asVisitor, onViewAsVisitor, onExitVisitor }: OwnerShareBannerProps) {
  if (asVisitor) {
    return (
      <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border px-3 py-1.5 text-xs text-muted-foreground">
        <span>Viewing as a visitor.</span>
        <Button size="xs" variant="ghost" onClick={onExitVisitor}>
          Exit
        </Button>
      </div>
    );
  }
  if (ownedSnippet?.visibility === "PRIVATE") {
    return <p className="mb-4 rounded-lg border px-3 py-2 text-xs text-muted-foreground">Private. Only you can see this.</p>;
  }
  if (ownedSnippet?.visibility !== "PASSCODE") return null;
  return (
    <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border px-3 py-1.5 text-xs text-muted-foreground">
      <span>Passcode protected. Visitors must enter the code; you see it because you own it.</span>
      <Button size="xs" variant="outline" className="shrink-0" onClick={onViewAsVisitor}>
        View as visitor
      </Button>
    </div>
  );
}

export default function PreviewSnippetClient({ slug }: PreviewSnippetClientProps) {
  const {
    passcodeInput,
    setPasscodeInput,
    setSubmittedPasscode,
    asVisitor,
    setAsVisitor,
    isInitialLoadPending,
    isPasscodeVerifying,
    isPasscodeRequired,
    isInvalidPasscode,
    snippetRecord,
    hasUserUpvoted,
    hasUserBookmarked,
    isAuthorFollowed,
    authenticatedUserId,
    ownedSnippet,
    authorFollowerCount,
    authorFollowingCount,
    presentationConfig,
    presentationElements,
    resolvedElementIds,
    handleUpvoteToggle,
    handleBookmarkToggle,
    shareLinkPayload,
  } = useSnippetPreview(slug);

  const snippetId = snippetRecord?.id ?? null;
  const { data: commentsData } = useSnippetComments(snippetId);
  const { trigger: addComment, isMutating: isSubmitting } = useAddComment(snippetId);
  const [commentText, setCommentText] = React.useState("");

  async function handleAddComment() {
    if (!snippetId || !commentText.trim()) return;
    await addComment(commentText.trim());
    setCommentText("");
  }

  function renderComments() {
    const comments = commentsData?.comments ?? [];
    return (
      <section className="flex flex-col gap-6" aria-label="Comments">
        {authenticatedUserId && (
          <div className="flex flex-col gap-2">
            <Textarea
              rows={2}
              placeholder="Add a comment..."
              aria-label="Add a comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAddComment();
              }}
            />
            <Button
              size="sm"
              disabled={isSubmitting || !commentText.trim()}
              onClick={handleAddComment}
              className="self-end"
            >
              {isSubmitting && <Spinner />}
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>
        )}
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No comments yet.</p>
        ) : (
          <ul className="flex flex-col gap-5">
            {comments.map((c) => (
              <li key={c.id} className="flex gap-3 text-sm">
                <Avatar className="size-6 shrink-0">
                  <AvatarFallback className="text-xs font-medium">
                    {(c.user?.name?.[0] ?? "U").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-xs font-medium">{c.user?.name ?? "Anonymous"}</span>
                  <p className="text-pretty">{c.content}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  }

  const [copied, setCopied] = React.useState(false);
  const onCopy = (content: string) => {
    copy(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  function switchVisitorMode(next: boolean) {
    setPasscodeInput("");
    setSubmittedPasscode("");
    setAsVisitor(next);
  }

  const ownerBanner = (
    <OwnerShareBanner
      ownedSnippet={ownedSnippet}
      asVisitor={asVisitor}
      onViewAsVisitor={() => switchVisitorMode(true)}
      onExitVisitor={() => switchVisitorMode(false)}
    />
  );

  if (isInitialLoadPending) return <PreviewLoading />;

  if (isPasscodeRequired || isPasscodeVerifying) {
    return (
      <>
        {asVisitor && <div className="mx-auto w-full max-w-4xl px-4 pt-4 md:px-6">{ownerBanner}</div>}
        <PasscodeGate
        passcode={passcodeInput}
        onChange={(val) => {
          setPasscodeInput(val);
          if (isInvalidPasscode) setSubmittedPasscode("");
        }}
        isLoading={isPasscodeVerifying}
        onSubmit={() => setSubmittedPasscode(passcodeInput)}
        invalidPasscode={isInvalidPasscode}
        />
      </>
    );
  }

  if (!snippetRecord) return <SnippetNotFound />;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col px-4 py-8 md:px-6 md:py-10">
      {ownerBanner}
      <SnippetCard
        slug={slug}
        author={snippetRecord.user ?? undefined}
        description={snippetRecord.description}
        commentCount={snippetRecord._count?.comments ?? 0}
        upvoted={hasUserUpvoted!}
        upvoteCount={snippetRecord._count?.upvotes ?? 0}
        bookmarked={hasUserBookmarked!}
        bookmarkCount={snippetRecord._count?.bookmarks ?? 0}
        isFollowing={isAuthorFollowed}
        followerCount={authorFollowerCount}
        followingCount={authorFollowingCount}
        currentUserId={authenticatedUserId}
        ownedSnippet={ownedSnippet}
        onUpvote={handleUpvoteToggle}
        onBookmark={handleBookmarkToggle}
        title={snippetRecord.title ?? ""}
        renderComments={renderComments}
      >
        {resolvedElementIds.map((elementId) => {
          const presentationElement = presentationElements?.[elementId];
          if (!presentationElement) return null;
          return (
            <div key={elementId} className="flex flex-col gap-2">
              <SnippetFrame
                elementId={elementId}
                element={presentationElement}
                windowWidth={presentationConfig?.width ?? 800}
              />
              <SnippetInfo
                copied={copied}
                viewCount={shareLinkPayload?.shareLink?.viewCount ?? 0}
                language={presentationElement?.properties?.language}
                onCopy={() => onCopy(presentationElement?.content)}
              />
            </div>
          );
        })}
      </SnippetCard>
      <SponsorCard className="mt-6 self-start" />
    </div>
  );
}
