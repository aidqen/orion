"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RecentChats } from "@/components/RecentChats";
import { CustomPromptInput } from "@/components/CustomPromptInput";
import { QuickActionButtons } from "@/components/QuickActionButtons";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useUser } from "@/contexts";
import { createChat } from "@/lib/supabase/chats";
import { useIsMobile } from "@/hooks/use-mobile";
import { useChats } from "@/hooks";
import { useChatStore } from "@/store/useChatStore";
import { useAuthPopupStore } from "@/store/useAuthPopupStore";

type User = {
  user_metadata?: {
    name?: string;
  };
};

export default function Home() {
  const isMobile = useIsMobile()
  const [input, setInput] = useState("");
  const { user, authenticated } = useUser();
  const { chats, loading, refetch } = useChats();
  const router = useRouter();
  const { setPendingMessage } = useChatStore();
  const { open: openAuthPopup } = useAuthPopupStore();

  const startChat = async (message: any) => {
    console.log("🚀 ~ startChat ~ message:", message)
    // 1. Create chat → returns chatId
    // 2. Append pending message to global state
    // 3. Refetch chats list
    // 4. Redirect to /chat/[chatId]
    // 5. Append user message (to that chatId)
    // 6. Call AI → stream response
    // 7. Append assistant message (when complete)
    if (!authenticated || !user) {
      openAuthPopup()
      return
    }
    const chatId = await createChat(user.id)
    setPendingMessage(message)
    refetch() // Refresh chats list
    router.push(`/chat/${chatId}`)
  };

  return (
    <div className="w-full h-full flex flex-col pt-[20vh] md:pt-[25vh] justify-start items-center dark:bg-[#161618] bg-white text-black dark:text-white">
      {isMobile && <SidebarTrigger className="fixed top-4 left-4 z-10" />}

      <div className="w-full max-w-[680px] px-5 flex flex-col items-center gap-2">
        <div className="flex flex-col items-center text-black dark:text-white mb-4">
          <h1 className="text-4xl font-medium tracking-tight mb-1">
            Good evening,{" "}
            <span className="capitalize">
              {(user as User | null)?.user_metadata?.name || "user"}
            </span>
          </h1>
          <p className="text-2xl text-gray-600 tracking-tight dark:text-gray-300">
            How can I help you?
          </p>
        </div>
        <CustomPromptInput setInput={setInput} input={input} onSubmit={startChat} />
        <QuickActionButtons />
        <RecentChats chats={chats} loading={loading} />
      </div>
    </div>
  );
}
