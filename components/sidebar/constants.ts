import {
  FolderClosed,
  Globe,
  Home,
  MessageCircle,
} from "lucide-react"

export type MenuItem = {
  icon?: React.ComponentType<{ className?: string }>
  text: string
  href?: string
}

export const PRIMARY_NAV: MenuItem[] = [
  { icon: Home, text: 'Home', href: '#' },
  { icon: Globe, text: 'Explore Synapse AI', href: '#' }
]

export const FOLDERS: MenuItem[] = [
  { icon: FolderClosed, text: 'Selasa', href: '#' },
  { icon: FolderClosed, text: 'Analytica ideas', href: '#' }
]

export const HISTORY: MenuItem[] = [
  { icon: MessageCircle, text: 'Poem of the past', href: '#' },
  { icon: MessageCircle, text: 'Assistance request', href: '#' },
  { icon: MessageCircle, text: 'What is this?', href: '#' },
  { icon: MessageCircle, text: 'Analytica ideas', href: '#' }
]
