"use client";

import { useEffect, useState, useRef, type ChangeEvent } from "react";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Button } from "@/components/ui/button";
import { ArrowUp, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileUploader } from "./FileUploader";
import { PasteHandler } from "./PasteHandler";
import { DragOverlay } from "./DragOverlay";
import { FileUIPartWithId, MessageInput } from "@/types/chat";

export function CustomPromptInput({
  input,
  setInput,
  placeholder = "Ask Planwise AI...",
  className = "",
  textAnimation = true,
  onSubmit,
  status,
  stop,
  chatId,
  userId,
}: {
  input: string;
  setInput: (value: string) => void;
  placeholder?: string;
  className?: string;
  textAnimation?: boolean;
  onSubmit?: (message: MessageInput) => void;
  status?: string;
  stop?: () => void;
  chatId?: string;
  userId?: string;
}) {
  const [typedPlaceholder, setTypedPlaceholder] = useState("");
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set());

  const uploadingIdsRef = useRef<Set<string>>(new Set());
  const uploadedUrlsRef = useRef<Map<string, string>>(new Map());

  const markFailed = (id: string) => {
    setFailedIds(prev => new Set(prev).add(id));
  };

  const retryUpload = (id: string) => {
    setFailedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  useEffect(() => {
    if (!textAnimation) return;
    if (!placeholder) {
      setTypedPlaceholder("");
      return;
    }
    setTypedPlaceholder("");
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTypedPlaceholder(placeholder.slice(0, i));
      if (i >= placeholder.length) window.clearInterval(id);
    }, 100);
    return () => window.clearInterval(id);
  }, [placeholder, textAnimation]);

  const handleSubmit = (message: MessageInput) => {
    let transformedFiles: FileUIPartWithId[] = [];
    if (message.files && message.files.length > 0) {
      transformedFiles = message.files
      .filter((f) => !failedIds.has(f.id))
      .map((f) => ({
        ...f,
        url: uploadedUrlsRef.current.get(f.id) || f.url,
      }));
    }
    onSubmit?.({ ...message, files: transformedFiles });
    uploadedUrlsRef.current.clear();
    setFailedIds(new Set());
  };

  return (
    <>
      <DragOverlay />
      <PromptInput
        onSubmit={handleSubmit}
        globalDrop={true}
        accept=""
        multiple={true}
        syncHiddenInput={false}
        maxFiles={undefined}
        maxFileSize={undefined}
        onError={undefined}
        className={cn(
          "mb-2 relative overflow-hidden bg-background shadow-[0_0_5px_2px_rgba(0,0,0,0.05)] border border-gray-300/50 dark:border-stone-700/40 mx-auto transition-[max-width] duration-300 ease-out ",

          className
        )}
      >
        <PromptInputBody className="">
          <FileUploader
            chatId={chatId}
            userId={userId}
            uploadedUrlsRef={uploadedUrlsRef}
            uploadingIdsRef={uploadingIdsRef}
            failedIds={failedIds}
            onMarkFailed={markFailed}
          />
          <PasteHandler />

          <PromptInputAttachments className="">
            {(attachment: { id: string; type: string; url: string; mediaType: string; filename: string }) => (
              <div className="relative">
                <PromptInputAttachment
                  data={attachment}
                  className={failedIds.has(attachment.id) ? "ring-2 ring-red-500 rounded-md" : ""}
                />
                {failedIds.has(attachment.id) && (
                  <button
                    type="button"
                    onClick={() => retryUpload(attachment.id)}
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    title="Upload failed, try again"
                  >
                    <RotateCw className="size-4" />
                  </button>
                )}
              </div>
            )}
          </PromptInputAttachments>

          <PromptInputTextarea
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            value={input}
            placeholder={textAnimation ? typedPlaceholder : placeholder}
            className="text-black dark:text-white"
          />
        </PromptInputBody>

        <PromptInputToolbar className="border-0 px-3 py-2">
          <PromptInputTools className="">
            <PromptInputActionMenu className="">
              <PromptInputActionMenuTrigger className="dark:text-white focus-visible:ring-offset-0 focus-visible:ring-0">
                {null}
              </PromptInputActionMenuTrigger>
              <PromptInputActionMenuContent className="rounded-2xl dark:bg-stone-800 dark:border-stone-700/60">
                <PromptInputActionAddAttachments
                  className="rounded-2xl dark:hover:bg-[#292929] dark:text-white"
                  label="Add Image"
                />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>
          </PromptInputTools>

          {status === "streaming" ? (
            <Button
              onClick={stop}
              aria-label="Stop streaming"
              className="w-[28px] h-[28px] p-0 cursor-pointer bg-[#0466c8] hover:bg-[#055bb2] text-white rounded-full flex items-center justify-center"
            >
              <span className="block w-[10px] h-[10px] rounded-full bg-white" />
            </Button>
          ) : (
            <Button
              disabled={input.length === 0}
              className="w-[28px] h-[28px] p-0 cursor-pointer bg-[#0466c8] hover:bg-[#055bb2] text-white rounded-full"
            >
              <ArrowUp className="h-max" />
            </Button>
          )}
        </PromptInputToolbar>
      </PromptInput>
    </>
  );
}

