import { Button } from "@cutecode/ui/components/button";
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
} from "@cutecode/ui/components/dialog";
import { Field, FieldDescription, FieldLabel } from "@cutecode/ui/components/field";
import { Textarea } from "@cutecode/ui/components/textarea";
import { Input } from "@cutecode/ui/components/input";
import { OTPField, OTPFieldInput } from "@cutecode/ui/components/otp-field";
import { Spinner } from "@cutecode/ui/components/spinner";
import { CloseIcon } from "@solar-icons/react/linear/close";
import { ShareIcon } from "@solar-icons/react/linear/share";
import { useAtomValue, useSetAtom } from "jotai";
import { dispatchPublishSnippetAtom, publishSnippetAtom } from "./store";
import { Visibility } from "./types";
import { AnimatePresence, motion } from "motion/react";
import { usePublish, usePublishQuota } from "@/hooks/use-publish";
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
import { Plan } from "@/db/schema";
import { trackSnippet } from "@/lib/analytics";
import { isForbiddenError } from "@/lib/trpc-error";
import VisibilitySelect from "./visibility-select";
import { visibilityConfig } from "./visibility-config";
import PublishQuota from "./publish-quota";

const OTP_LENGTH = 6;
const OTP_SLOTS = Array.from({ length: OTP_LENGTH }, (_, i) => `otp-slot-${i}`);

const PublishSnippet: React.FC = () => {
  const [open, setOpen] = useState(false);

  const { title, tags, description, visibility, passcode, isSuccessOpen, publishedUrl } =
    useAtomValue(publishSnippetAtom);

  const dispatch = useSetAtom(dispatchPublishSnippetAtom);

  const slideId = useAtomValue(currentSlideIdAtom);
  const elementId = useAtomValue(currentElementIdAtom);
  const editorState = useAtomValue(editorStateAtom);
  const windowWidth = useAtomValue(windowWidthAtom);
  const fileName = useAtomValue(fileNameAtom);

  const { isSignedIn, isLoaded } = useUser();
  const { trigger: publish, isMutating: isPending } = usePublish();
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
    }
  };

  const isPublishDisabled = isPending || (visibility === Visibility.PASSCODE && passcode.length < OTP_LENGTH);

  const onTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" && e.key !== ",") return;
    e.preventDefault();
    const val = e.currentTarget.value.trim();
    if (val && !tags.includes(val) && tags.length < 10) {
      dispatch({ tags: [...tags, val] });
      e.currentTarget.value = "";
    }
  };

  const onUpgrade = () => {
    setOpen(false);
    setPlansOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />} onClick={onTriggerClick}>
        <ShareIcon aria-hidden="true" />
        Publish
      </DialogTrigger>

      <DialogPopup className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-medium text-base">Publish snippet</DialogTitle>
          <DialogDescription>Get a link anyone can open.</DialogDescription>
        </DialogHeader>

        <DialogPanel className="flex flex-col gap-3">
          <Field>
            <Input
              aria-label="Title"
              placeholder={fileName || "Untitled Snippet"}
              value={title}
              onChange={(e) => dispatch({ title: e.target.value })}
            />
          </Field>

          <Field>
            <Textarea
              aria-label="Description"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => dispatch({ description: e.target.value })}
              rows={2}
              className="resize-none"
            />
          </Field>

          <Field>
            <Input aria-label="Tags" placeholder="Tags, press Enter to add" onKeyDown={onTagKeyDown} />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex h-6 items-center gap-1 rounded-md bg-secondary ps-2 pe-1 text-secondary-foreground text-xs"
                  >
                    {tag}
                    <button
                      type="button"
                      aria-label={`Remove ${tag}`}
                      onClick={() => dispatch({ tags: tags.filter((t) => t !== tag) })}
                      className="flex size-4 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground"
                    >
                      <CloseIcon className="size-3" aria-hidden="true" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Field>

          <Field>
            <FieldLabel>Visibility</FieldLabel>
            <VisibilitySelect />
          </Field>

          <AnimatePresence initial={false}>
            {visibility === Visibility.PASSCODE && (
              <motion.div
                key="passcode-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <Field>
                  <FieldLabel>Passcode</FieldLabel>
                  <OTPField
                    value={passcode}
                    length={OTP_LENGTH}
                    aria-label="6-digit passcode"
                    onValueChange={(passcode) => dispatch({ passcode })}
                  >
                    {OTP_SLOTS.map((key, i) => (
                      <OTPFieldInput key={key} aria-label={`Digit ${i + 1} of ${OTP_LENGTH}`} />
                    ))}
                  </OTPField>
                  <FieldDescription>Viewers enter this 6-digit code to open the snippet.</FieldDescription>
                </Field>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogPanel>

        <DialogFooter>
          {quota?.dailyLimit != null && (quota.dailyRemaining ?? 0) <= 5 && (
            <PublishQuota quota={quota} canUpgrade={activePlan !== Plan.PREMIUM} onUpgrade={onUpgrade} />
          )}
          <DialogClose render={<Button variant="ghost" disabled={isPending} />}>Cancel</DialogClose>
          <Button type="button" onClick={publishSnippet} disabled={isPublishDisabled}>
            {isPending && <Spinner />}
            {isPending ? "Publishing…" : "Publish"}
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
