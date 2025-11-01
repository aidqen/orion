"use client";

import { IconMessageCircle } from "@tabler/icons-react";
import { ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { motion } from "motion/react";

// Simple utility function for formatting relative time (UI-only mock)
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

// Mock schedule data type
interface MockSchedule {
  id: string;
  name: string;
  updatedAt: string;
}

// Mock data for UI-only component
const mockSchedules: MockSchedule[] = [
  { id: "1", name: "Morning Routine Plan", updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: "2", name: "Weekly Goals", updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: "3", name: "Brainstorm Project Ideas", updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
];

export function RecentChats({ showRecentChats }: { showRecentChats: boolean }) {
  // UI-only: Use mock data instead of Redux
  const sortedUserSchedules = useMemo(() => {
    return [...mockSchedules].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, []);

  const isHidden = useMemo(
    () => !sortedUserSchedules.length || !showRecentChats,
    [showRecentChats, sortedUserSchedules.length]
  );

  // UI-only click handler (no navigation)
  const handleScheduleClick = (scheduleId: string) => {
    console.log("Schedule clicked:", scheduleId);
    // Navigation logic will be added later when backend is connected
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
                delay: 0.5,
                duration: 0.1,
              }}
              className="recent-chats-header cursor-pointer group flex flex-row items-center gap-1.5 text-base font-semibold text-black dark:text-white"
            >
              <IconMessageCircle className="size-5" />
              Your Recent Chats
              <ChevronRight className="chevron group-hover:translate-x-1 transition-transform duration-100 size-4 mt-px text-stone-500 dark:text-stone-300" />
            </motion.h3>
          </div>
          <div className="grid grid-cols-3 w-full items-center justify-start gap-4">
            {sortedUserSchedules.slice(0, 3).map((schedule, index) => (
              <motion.div
                onClick={() => handleScheduleClick(schedule.id)}
                initial={{ y: "30%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  mass: 1,
                  delay: 0.4 + 0.1 * -index,
                  duration: 0.15,
                }}
                key={schedule.id}
                className="flex flex-col gap-3 bg-stone-50 dark:bg-[#222124] dark:hover:bg-[#292929] hover:bg-stone-100 transition-colors p-3 border dark:border-stone-700/60 border-stone-300 rounded-2xl cursor-pointer"
              >
                <IconMessageCircle
                  style={{ transform: "rotateY(180deg)" }}
                  className="w-5 h-5 text-stone-600 dark:text-stone-300"
                />
                <h4 className="text-sm text-black dark:text-white font-semibold">
                  {schedule.name}
                </h4>
                <span className="text-[13px] text-stone-500 dark:text-stone-300">
                  {formatRelativeTime(schedule.updatedAt)}
                </span>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

