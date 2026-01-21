"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { ShineBorder } from "@/components/ui/shine-border";
import { cn } from "@/lib/utils";

// optional: safe logger that reads attachments *inside* the PromptInput tree
function AttachmentsLogger() {
  const attachments = usePromptInputAttachments();
  useEffect(() => {
    console.log("attachments:", attachments);
  }, [attachments]);
  return null;
}

export function CustomPromptInput({
  input,
  setInput,
  placeholder = "Ask Planwise AI...",
  isBorderShine = true,
  className = "",
  textAnimation = true,
  onSubmit,
  status, // optional: from useChat
  stop, // optional: from useChat
}: {
  input: string;
  setInput: (value: string) => void;
  placeholder?: string;
  isBorderShine?: boolean;
  className?: string;
  textAnimation?: boolean;
  onSubmit?: (message: any) => void;
  status?: string;
  stop?: () => void;
}) {
  const [typedPlaceholder, setTypedPlaceholder] = useState("");

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

  return (
    <PromptInput
      onSubmit={(message: { text: string; files: unknown[] }) => {
        onSubmit?.(message);
      }}
      globalDrop={true}
      accept=""
      multiple={true}
      syncHiddenInput={false}
      maxFiles={undefined}
      maxFileSize={undefined}
      onError={undefined}
      className={cn(
        "mt-4 relative overflow-hidden dark:bg-[#222124]  border border-gray-300/50 dark:border-stone-700/40",
        className
      )}
    >
      <PromptInputBody className="">
        <AttachmentsLogger />

        <PromptInputAttachments className="">
          {(attachment: { id: string; type: string; url: string; mediaType: string; filename: string }) => (
            <PromptInputAttachment data={attachment} className="" />
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
                className="rounded-2xl dark:hover:bg-[#292929]  dark:text-white"
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
      {/* {isBorderShine && (
        <ShineBorder
          className="opacity-80"
          borderWidth={1.5}
          duration={60}
          shineColor={["#643c9f", "#c084fc"]}
        />
      )} */}
    </PromptInput>
  );
}
