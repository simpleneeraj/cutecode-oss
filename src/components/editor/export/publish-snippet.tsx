import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { OTPField, OTPFieldInput } from "@/components/ui/otp-field";
import { Spinner } from "@/components/ui/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Share01Icon, CancelCircleIcon } from "@hugeicons/core-free-icons";
import { useAtomValue, useSetAtom } from "jotai";
import { dispatchPublishSnippetAtom, publishSnippetAtom } from "./store";
import { Visibility } from "./types";
import { AnimatePresence, motion } from "motion/react";
import { usePublish, usePublishQuota, type PublishQuota } from "@/hooks/use-publish";
import {
  currentElementIdAtom,
  currentSlideIdAtom,
  editorStateAtom,
  fileNameAtom,
  windowWidthAtom,
} from "@/store/editor/editor";
import { toast } from "@/components/toast";
import { useUser } from "@/hooks/use-auth";
import { getShareUrl } from "@/lib/share/urls";
import React, { useState } from "react";
import SuccessDialog from "./success-dialog";
import { useSubscription } from "@/hooks/use-subscription";
import { plansDialogOpenAtom } from "@/store/editor/plans";
import { PLANS } from "@/lib/billing/plans";
import { Plan } from "@/db/schema";
import { trackSnippet } from "@/lib/analytics";
import { isForbiddenError } from "@/lib/trpc-error";
import VisibilitySelect from "./visibility-select";
import { visibilityConfig } from "./visibility-config";

const OTP_LENGTH = 6;
const OTP_SLOTS = Array.from({ length: OTP_LENGTH }, (_, i) => `otp-slot-${i}`);

function formatResetTime(iso: string) {
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(iso));
}

function describeQuota({ dailyLimit, dailyRemaining, dailyResetsAt, liveLimit, liveRemaining }: PublishQuota) {
  const daily = dailyLimit === null ? "" : `${dailyRemaining} of ${dailyLimit} publishes left today`;
  const live = liveLimit === null ? "" : `${liveRemaining} of ${liveLimit} live snippets left`;
  const reset = dailyRemaining === 0 && dailyResetsAt ? `Next publish at ${formatResetTime(dailyResetsAt)}` : "";
  return [[daily, live].filter(Boolean).join(", "), reset].filter(Boolean).join(". ");
}

function upgradeHint(plan: Plan) {
  if (plan === Plan.FREE) return `Pro raises this to ${PLANS.PRO.dailyPublishes} a day with no live limit.`;
  if (plan === Plan.PRO) return `Premium raises this to ${PLANS.PREMIUM.dailyPublishes} a day.`;
  return null;
}

const PublishSnippet: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const { title, tags, description, visibility, passcode, isSuccessOpen, publishedUrl } =
    useAtomValue(publishSnippetAtom);

  const dispatch = useSetAtom(dispatchPublishSnippetAtom);

  const slideId = useAtomValue(currentSlideIdAtom);
  const elementId = useAtomValue(currentElementIdAtom);
  const editorState = useAtomValue(editorStateAtom);
  const windowWidth = useAtomValue(windowWidthAtom);
  const fileName = useAtomValue(fileNameAtom);

  const { isSignedIn, isLoaded } = useUser();
  const { publish } = usePublish();
  const { can, plan, isFree } = useSubscription();
  const { data: quota, mutate: refreshQuota } = usePublishQuota(!!isSignedIn);
  const activePlan = isFree ? Plan.FREE : plan;
  const setPlansOpen = useSetAtom(plansDialogOpenAtom);

  const onTriggerClick = () => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setPlansOpen(true);
      return;
    }
    if (visibilityConfig[visibility].isPremium && !can("privateShares")) {
      dispatch({ visibility: Visibility.PUBLIC });
    }
    trackSnippet.publishDialogOpened();
    setOpen(true);
  };

  const publishSnippet = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to publish.");
      return;
    }
    if (!slideId || !elementId) {
      toast.error("No element selected to publish.");
      return;
    }
    if (!editorState) {
      toast.error("Editor is still loading, please try again.");
      return;
    }

    setIsPending(true);
    try {
      const { slug } = await publish({
        name: fileName || "Untitled Presentation",
        width: windowWidth || 680,
        slides: editorState.slides,
        elements: editorState.elements,
        slideElements: editorState.slideElements,
        elementId,
        title: title || fileName || undefined,
        description: description || undefined,
        tags,
        visibility,
        passcode: visibility === Visibility.PASSCODE ? passcode : undefined,
      });

      const url = getShareUrl(slug);
      dispatch({ publishedUrl: url, isSuccessOpen: true });
      await navigator.clipboard.writeText(url).catch(() => {});
      trackSnippet.published(visibility, Boolean(description?.trim()));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      if (isForbiddenError(err)) {
        refreshQuota();
        setOpen(false);
        setPlansOpen(true);
        toast.error(message || "This option needs Premium.");
      } else if (message.includes("Daily publish limit")) {
        refreshQuota();
        setOpen(false);
        setPlansOpen(true);
        toast.error(message);
      } else {
        toast.error("Failed to publish snippet.");
      }
    } finally {
      setIsPending(false);
    }
  };

  const isPublishDisabled = isPending || (visibility === Visibility.PASSCODE && passcode.length < OTP_LENGTH);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center justify-between gap-2">
        <DialogTrigger render={<Button variant="ghost" size="xs" />} onClick={onTriggerClick}>
          <HugeiconsIcon icon={Share01Icon} aria-hidden="true" />
          Publish snippet
        </DialogTrigger>
        {quota?.dailyLimit != null && isSignedIn && (
          <span className="px-1 text-muted-foreground text-xs tabular-nums">
            {quota.dailyRemaining}/{quota.dailyLimit} today
          </span>
        )}
      </div>

      <DialogPopup className="sm:max-w-md overflow-hidden rounded-2xl p-0">
        <DialogHeader className="relative px-5 pt-5 pb-4">
          <DialogTitle className="flex items-center gap-2.5 text-base">
            <span className="flex size-8 items-center justify-center rounded-xl bg-foreground text-background">
              <HugeiconsIcon icon={Share01Icon} className="size-4" aria-hidden="true" />
            </span>
            Publish Snippet
          </DialogTitle>
          <DialogDescription className="mt-1 text-xs text-muted-foreground">
            Share your snippet publicly, protect it with a passcode, or keep it private.
            {quota?.dailyLimit != null && (
              <span className="mt-1 block text-muted-foreground">
                {describeQuota(quota)}. {upgradeHint(activePlan)}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogPanel className="flex flex-col gap-4 px-5">
          {/* Title */}
          <Field>
            <FieldLabel className="text-muted-foreground text-xs">Title</FieldLabel>
            <Input
              placeholder={fileName || "Untitled Snippet"}
              value={title}
              onChange={(e) => dispatch({ title: e.target.value })}
              className="text-sm"
            />
          </Field>

          {/* Description */}
          <Field>
            <FieldLabel className="text-muted-foreground text-xs">Description</FieldLabel>
            <Textarea
              placeholder="What does this snippet do? Any usage notes…"
              value={description}
              onChange={(e) => dispatch({ description: e.target.value })}
              rows={3}
              className="resize-none text-sm"
            />
          </Field>

          {/* Tags */}
          <Field>
            <FieldLabel className="text-muted-foreground text-xs">Tags</FieldLabel>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-md"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => dispatch({ tags: tags.filter((t) => t !== tag) })}
                      className="hover:text-destructive focus:outline-none"
                    >
                      <HugeiconsIcon icon={CancelCircleIcon} className="size-3" aria-hidden="true" />
                    </button>
                  </span>
                ))}
              </div>
              <Input
                placeholder="Add tags (press Enter or comma)"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    const val = e.currentTarget.value.trim();
                    if (val && !tags.includes(val) && tags.length < 10) {
                      dispatch({ tags: [...tags, val] });
                      e.currentTarget.value = "";
                    }
                  }
                }}
                className="text-sm"
              />
            </div>
          </Field>

          {/* Visibility */}
          <Field>
            <FieldLabel className="text-muted-foreground text-xs">Visibility</FieldLabel>
            <VisibilitySelect />
          </Field>

          {/* Passcode field */}
          <AnimatePresence>
            {visibility === Visibility.PASSCODE && (
              <motion.div
                key="passcode-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                style={{ overflow: "hidden" }}
              >
                <Field className="items-center rounded-xl border border-border bg-muted/50 p-6">
                  <FieldLabel className="text-muted-foreground text-xs">Set a 6-digit passcode</FieldLabel>
                  <OTPField
                    size="lg"
                    value={passcode}
                    length={OTP_LENGTH}
                    aria-label="6-digit passcode"
                    onValueChange={(passcode) => dispatch({ passcode })}
                  >
                    {OTP_SLOTS.map((key, i) => (
                      <OTPFieldInput key={key} aria-label={`Digit ${i + 1} of ${OTP_LENGTH}`} />
                    ))}
                  </OTPField>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Share this code with anyone you want to grant access.
                  </p>
                </Field>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogPanel>

        <DialogFooter className="px-5 pb-5 pt-3 gap-2">
          <DialogClose render={<Button className="flex-1" variant="outline" disabled={isPending} />}>
            Cancel
          </DialogClose>
          <Button className="flex-1" onClick={publishSnippet} disabled={isPublishDisabled}>
            {isPending ? (
              <>
                <Spinner />
                Publishing…
              </>
            ) : (
              "Publish"
            )}
          </Button>
        </DialogFooter>

        <SuccessDialog
          isSuccessOpen={isSuccessOpen}
          setIsSuccessOpen={(open) => dispatch({ isSuccessOpen: open })}
          publishedUrl={publishedUrl ?? undefined}
        />
      </DialogPopup>
    </Dialog>
  );
};

export default PublishSnippet;
