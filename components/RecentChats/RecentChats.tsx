"use client";

import { IconMessageCircle } from "@tabler/icons-react";
import { ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { RecentChatsList } from "./RecentChatsList";
import { Chat } from "@/types/chat";

interface RecentChatsProps {
  chats?: Chat[];
  loading?: boolean;
}

export function RecentChats({ chats = [], loading = false }: RecentChatsProps) {
  const router = useRouter();

  const sortedChats = useMemo(() => {
    return [...chats].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [chats]);

  const isHidden = useMemo(
    () => !sortedChats.length && !loading,
    [sortedChats.length, loading]
  );

  const handleChatClick = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  return (
    <div className="w-full flex flex-col items-start mt-12 gap-4 h-[150px]">
      {!isHidden && (
        <>
          <div className="flex flex-row items-center justify-start gap-1">
            <motion.h3
              initial={{ y: "50%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                bounce: 0,
                damping: 15,
                mass: 1,
                stiffness: 100,
                delay: 0.7,
                duration: 0.1,
              }}
              className="recent-chats-header tracking-tight cursor-pointer group flex flex-row items-center gap-1.5 text-lg font-medium text-black dark:text-white"
            >
              {/* <IconMessageCircle className="size-5" /> */}
              Your Recent Chats
              <ChevronRight className="chevron group-hover:translate-x-1 transition-transform duration-100 size-4 mt-px text-stone-900 dark:text-stone-200" />
            </motion.h3>
          </div>
          <RecentChatsList chats={sortedChats} onChatClick={handleChatClick} />
        </>
      )}
    </div>
  );
}

