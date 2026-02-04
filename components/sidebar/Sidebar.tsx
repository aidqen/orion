'use client'

import {
  SidebarContent,
  useSidebar,
  Sidebar as ShadcnSidebar
} from "@/components/ui/sidebar"
import { SidebarHeader } from "../Sidebar/SidebarHeader"
import { SidebarNav } from "../Sidebar/SidebarNav"
import { SidebarHistory } from "../Sidebar/SidebarHistory"
import { useArtifactStore } from "@/store/useArtifactStore"
import { useEffect, useState } from "react"
import { SearchChatsModal } from "../SearchChatsModal"
import { useChats } from "@/hooks"
import { motion } from "motion/react";
import { SidebarFooter } from "./SidebarFooter"

export function Sidebar() {
  const { setOpen, state } = useSidebar()
  const isArtifactOpen = useArtifactStore(state => state.isOpen)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const { chats, loading } = useChats()

  useEffect(() => {
    if (isArtifactOpen) {
      setOpen(false)
    }
  }, [isArtifactOpen])
  return (
    <>
      <ShadcnSidebar className="flex flex-col justify-between h-full">

        <div>
          <SidebarHeader onSearchClick={() => setIsSearchModalOpen(true)} />

          <SidebarNav />
          <SidebarHistory chats={chats} loading={loading} />
        </div>
        <SidebarFooter />
      </ShadcnSidebar>
      <SearchChatsModal open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen} chats={chats} />
    </>
  )
}
