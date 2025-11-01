'use client'
import { AnimatePresence, motion } from 'motion/react'
import { useIsMobile } from "@/hooks/useMediaQuery";
import { FolderClosed, Globe, Home, MessageCircle, MessageSquarePlus, PanelLeft, Plus } from "lucide-react";
import { useSidebarStore } from "@/store/useSidebarStore";
// import { SignInWithGoogleButton } from "@/app/auth/components/LogInWithGoogle";

type MenuItem = { icon?: React.ReactNode, text: string }

const PRIMARY_NAV: MenuItem[] = [
  { icon: <Home className="size-4 text-gray-500 dark:text-stone-300" />, text: 'Home' },
  { icon: <Globe className="size-4 text-gray-500 dark:text-stone-300" />, text: 'Explore Synapse AI' }
]

const FOLDERS: MenuItem[] = [
  { icon: <FolderClosed className="size-4 text-gray-500 dark:text-stone-300" />, text: 'Selasa' },
  { icon: <FolderClosed className="size-4 text-gray-500 dark:text-stone-300" />, text: 'Analytica ideas' }
]

const HISTORY: MenuItem[] = [
  { text: 'Poem of the past' },
  { text: 'Assistance request' },
  { text: 'What is this?' },
  { text: 'Analytica ideas' }
]
const SIDEBAR_WIDTH = 220
const SIDEBAR_PADDING = 16
const SIDEBAR_WIDTH_WITH_PADDING = SIDEBAR_WIDTH - SIDEBAR_PADDING * 2

export function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useSidebarStore()
  const isMobile = useIsMobile()
  return (
    <AnimatePresence>
      {isSidebarOpen &&
        (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: SIDEBAR_WIDTH }}
            exit={{ width: 0 }}
            transition={{ type: 'spring', duration: 0.5, stiffness: 300, damping: 35, bounce: 0 }}
            className="flex flex-col gap-5 overflow-hidden h-dvh bg-gray-100 dark:bg-[#222124] text-black dark:text-white pt-2 pb-2 z-10"
            style={{ width: SIDEBAR_WIDTH, paddingInline: SIDEBAR_PADDING }}
          >
            <div className="flex flex-row items-center justify-between bg-transparent"
              style={{ width: SIDEBAR_WIDTH_WITH_PADDING }}>
              <span className="font-bold">Synapse</span>
              {isSidebarOpen && <PanelLeft className="size-5 cursor-pointer" onClick={toggleSidebar} />}
            </div>

            <button
              className="flex flex-row items-center text-sm justify-center py-2 gap-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 dark:border-white/10 dark:bg-stone-500/30 dark:hover:bg-stone-500/40 dark:text-white"
              style={{ width: SIDEBAR_WIDTH_WITH_PADDING }}
            >
              <MessageSquarePlus className="size-5" />
              New Chat
            </button>


            {/* Primary navigation */}
            <SidebarMenuList
              data={PRIMARY_NAV}
              menuItemClassName="flex items-center gap-3 text-sm text-gray-700 dark:text-stone-200 px-1"
            />

            {/* Folder section */}
            <div className="flex flex-col gap-1">
              <div style={{ width: SIDEBAR_WIDTH_WITH_PADDING }} className="flex flex-row items-center justify-between text-xs font-semibold text-gray-500 dark:text-stone-400 px-1">
                <span>Folder</span>
                <Plus className="size-4" />
              </div>
              <SidebarMenuList
                data={FOLDERS}
                menuItemClassName="flex items-center text-sm text-gray-700 dark:text-stone-200 px-1"
              />
            </div>

            {/* History section */}
            <div className="flex flex-col gap-1">

              <div style={{ width: SIDEBAR_WIDTH_WITH_PADDING }} className="text-xs font-semibold text-gray-500 dark:text-stone-400 px-1">History</div>
              <SidebarMenuList
                data={HISTORY}
                listIcon={<MessageCircle className="size-4 text-gray-500 dark:text-stone-300" />}
                menuItemClassName="flex items-center text-sm text-gray-700 dark:text-stone-200 px-1"
              />
            </div>

             {/* Authentication Section */}
             <div className="flex flex-col gap-2" style={{ width: SIDEBAR_WIDTH_WITH_PADDING }}>
               {/* <SignInWithGoogleButton /> */}
             </div>
          </motion.div>
        )}
    </AnimatePresence>
  )
}

function SidebarMenuList({ data, listIcon, menuItemClassName }: { data: { icon?: React.ReactNode, text: string }[], listIcon?: React.ReactNode, menuItemClassName?: string }) {

  return (
    <ul>
      {data.map((line) => (
        <SidebarMenuItem key={line.text} icon={listIcon ?? line.icon} text={line.text} className={menuItemClassName} />
      ))}
    </ul>
  )
}
function SidebarMenuItem({ icon, text, className }: { icon: React.ReactNode, text: string, className?: string }) {
  return (
    <li
      className={`px-2 py-1.5 gap-2 cursor-pointer hover:bg-stone-200/80 dark:hover:bg-white/5 rounded-lg ${className ?? ''}`}
      style={{ width: SIDEBAR_WIDTH_WITH_PADDING }}>
      <span className=" text-gray-500 dark:text-stone-300 inline-flex items-center justify-center">{icon}</span>
      <span className="whitespace-nowrap">{text}</span>
    </li>
  )
}
