"use client";

import { WeatherWidget } from "./WeatherWidget";
import { ContextAwareWidget } from "./ContextAwareWidget";
import { RecentChats } from "@/components/RecentChats";
import { Chat } from "@/types/chat";

interface HomeWidgetsProps {
  chats?: Chat[];
  loading?: boolean;
}

export function HomeWidgets({ chats = [], loading = false }: HomeWidgetsProps) {
  return (
    <div className="w-full flex flex-col gap-7 mt-5">
      <div className="grid grid-cols-[2.5fr_4fr] gap-3 w-full">
        <WeatherWidget />
        <ContextAwareWidget />
      </div>

      <RecentChats chats={chats} loading={loading} />
    </div>
  );
}

