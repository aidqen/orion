"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RecentChats } from "@/components/RecentChats";
import { CustomPromptInput } from "@/components/CustomPromptInput/CustomPromptInput";
import { QuickActionButtons } from "@/components/QuickActionButtons";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useUser } from "@/contexts";
import { createChat } from "@/lib/supabase/chats";
import { useIsMobile } from "@/hooks/use-mobile";
import { useChats } from "@/hooks";
import { useChatStore } from "@/store/useChatStore";
import { useAuthPopupStore } from "@/store/useAuthPopupStore";
import { motion } from "motion/react";
import { HomepageHeader } from "@/components/HomepageHeader";

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
  const setPendingMessage = useChatStore(state => state.setPendingMessage);
  const openAuthPopup = useAuthPopupStore(state => state.open)

  const startChat = async (message: any) => {
    if (!authenticated || !user) {
      openAuthPopup()
      return
    }
    const chatId = await createChat(user.id)
    setPendingMessage(message)
    refetch()
    router.push(`/chat/${chatId}`)
  };

  return (
    <div className="w-full h-full flex flex-col pt-[20vh] md:pt-[25vh] justify-start items-center bg-background text-black dark:text-white">
      <HomepageHeader />

      <div className="w-full max-w-[680px] px-5 flex flex-col items-center gap-2">
        <div className="flex flex-col items-center text-black dark:text-white mb-4">
          <h1 className="text-3xl font-medium tracking-tight mb-1">
            Good evening,{" "}
            <span className="capitalize">
              {(user as User | null)?.user_metadata?.name || "user"}
            </span>
          </h1>
          <p className="text-2xl text-stone-600 tracking-tight dark:text-gray-300">
            How can I help you?
          </p>
        </div>
        <CustomPromptInput setInput={setInput} input={input} onSubmit={startChat} chatId={""} userId={user?.id} />
        <QuickActionButtons />
        <RecentChats chats={chats} loading={loading} />
      </div>
    </div>
  );
}
