"use client";

import { useEffect, useState } from "react";
import { RecentChats } from "@/components/RecentChats";
import { CustomPromptInput } from "@/components/CustomPromptInput";
import {
  CalendarClock,
  CalendarRange,
  Lightbulb,
  ListChecks,
  PenLine,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import AuthCard from "@/components/auth/AuthCard";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useUser } from "@/hooks/useUser";

const quickActions = [
  { id: "plan-day", label: "Plan my day", icon: CalendarRange },
  { id: "prioritize", label: "Prioritize tasks", icon: ListChecks },
  { id: "optimize-focus", label: "Optimize Routines", icon: CalendarClock },
  { id: "help-write", label: "Import from Google", icon: PenLine },
  { id: "brainstorm", label: "Brainstorm", icon: Lightbulb },
];

type User = {
  user_metadata?: {
    name?: string;
  };
};

export default function Home() {
  const [input, setInput] = useState("");
  const [showRecentChats, setShowRecentChats] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const { user, authenticated } = useUser();

  useEffect(() => {
    const timer = setTimeout(() => setShowRecentChats(true), 850);
    return () => clearTimeout(timer);
  }, []);

  // UI-only placeholder function
  const startChat = (message: any) => {
    console.log("Start chat with:", message);
    if (!authenticated) {
      setOpenLogin(true);
    } else {
      
    }
  };

  return (
    <div className=" w-full h-full flex flex-col justify-center items-center dark:bg-[#161618] bg-white text-black dark:text-white">
      {/* Sidebar Toggle Button */}
      <SidebarTrigger className="fixed top-4 left-4 z-5" />

      <AnimatePresence>
        {openLogin && (
          <motion.div
            onClick={() => setOpenLogin(false)}
            className="fixed inset-0 backdrop-brightness-50 backdrop-blur-sm z-1000"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
          >
            <div className="fixed inset-x-0 bottom-0 flex justify-center">
              <motion.div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{
                  type: "spring",
                  bounce: 0,
                  damping: 35,
                  mass: 1,
                  stiffness: 300,
                  duration: 0.4,
                }}
              >
                <AuthCard setOpen={setOpenLogin} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="w-full max-w-[680px] mt-[100px] flex flex-col items-center gap-2">
        <div className="flex flex-col items-center text-black dark:text-white mb-4">
          <h1 className="text-3xl font-semibold tracking-tight">
            Good evening,{" "}
            <span className="capitalize">
              {(user as User | null)?.user_metadata?.name || "user"}
            </span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-300">
            How can I help you?
          </p>
        </div>
        <CustomPromptInput setInput={setInput} input={input} onSubmit={startChat} />
        <div className="flex flex-row items-center justify-between w-full gap-2 mt-4">
          {quickActions.map((action, index: number) => (
            <motion.button
              key={action.id}
              initial={{ y: "50%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                bounce: 0,
                damping: 35,
                mass: 1,
                stiffness: 300,
                delay: 0.4 + 0.1 * index,
                duration: 0.1,
              }}
              className="rounded-full flex flex-row gap-1 dark:text-stone-200 text-stone-600 items-center justify-center dark:bg-[#222124] dark:hover:bg-[#292929] hover:bg-stone-100 bg-gray-100 px-3 py-1.5 text-xs text-start whitespace-nowrap transition-colors cursor-pointer"
            >
              <action.icon className="w-4 h-4" />
              {action.label}
            </motion.button>
          ))}
        </div>

        <RecentChats showRecentChats={showRecentChats} />
      </div>
    </div>
  );
}
