"use client";
import {
	Brain,
	Home,
	Keyboard,
	LayoutDashboard,
	LogIn,
	LogOut,
	Monitor,
	Moon,
	Plus,
	Puzzle,
	Settings,
	Sun,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import { AUTH_POPUP_MODES } from "@/constants/auth.constant";
import { useUser } from "@/contexts/UserContext";
import { useAuthPopupStore } from "@/store/useAuthPopupStore";
import { cn } from "@/utils/shared";
import { MemoriesModal } from "./MemoriesModal";
import { SettingsModal } from "./SettingsModal/SettingsModal";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";

export function Header() {
	const { user, authenticated, signOut } = useUser();
	const { setTheme } = useTheme();
	const { state } = useSidebar();
	const openAuthPopup = useAuthPopupStore((state) => state.open);
	const [memoriesModalOpen, setMemoriesModalOpen] = useState(false);
	const [settingsModalOpen, setSettingsModalOpen] = useState(false);
	const router = useRouter();

	const handleLogin = () => {
		openAuthPopup(AUTH_POPUP_MODES.SIGN_IN);
	};

	const handleLogout = async () => {
		await signOut();
		router.push("/");
	};

	const openCommandMenu = () => {
		const event = new KeyboardEvent("keydown", {
			key: "k",
			code: "KeyK",
			metaKey: true,
			ctrlKey: true,
			bubbles: true,
			cancelable: true,
		});
		document.dispatchEvent(event);
	};

	return (
		<div className="w-full flex relative justify-end items-center p-2 gap-10 pe-6">
			<SidebarTrigger
				className={cn(
					"absolute top-1/2 left-4 -translate-y-1/2 z-5 flex justify-center items-center",
					state === "collapsed" ? "block" : "hidden",
				)}
			/>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button className="size-8 rounded-full border border-stone-300 shadow-sm bg-linear-to-r from-[#E100FF] to-[#7F00FF] cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2" />
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-56">
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							<p className="text-sm font-medium leading-none">
								{user?.user_metadata?.name || user?.email || "User"}
							</p>
							<p className="text-xs leading-none text-muted-foreground">
								{user?.email}
							</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem onClick={() => router.push("/")}>
							<LayoutDashboard className="mr-2 size-4" />
							Dashboard
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setMemoriesModalOpen(true)}>
							<Brain className="mr-2 size-4" />
							Memories
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Puzzle className="mr-2 size-4" />
							Integrations
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setSettingsModalOpen(true)}>
							<Settings className="mr-2 size-4" />
							Account Settings
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Plus className="mr-2 size-4" />
							Create Team
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem onClick={openCommandMenu}>
							<Keyboard className="mr-2 size-4" />
							Command Menu
							<DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<Sun className="mr-2 size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
								<Moon className="absolute mr-2 size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
								<span className="">Theme</span>
							</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									<DropdownMenuItem onClick={() => setTheme("light")}>
										<Sun className="mr-2 size-4" />
										Light
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => setTheme("dark")}>
										<Moon className="mr-2 size-4" />
										Dark
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => setTheme("system")}>
										<Monitor className="mr-2 size-4" />
										System
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => router.push("/")}>
						<Home className="mr-2 size-4" />
						Home Page
					</DropdownMenuItem>
					{authenticated ? (
						<DropdownMenuItem onClick={handleLogout}>
							<LogOut className="mr-2 size-4" />
							Log out
						</DropdownMenuItem>
					) : (
						<DropdownMenuItem onClick={handleLogin}>
							<LogIn className="mr-2 size-4" />
							Log in
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
			<MemoriesModal
				open={memoriesModalOpen}
				onOpenChange={setMemoriesModalOpen}
			/>
			<SettingsModal
				isOpen={settingsModalOpen}
				onClose={() => setSettingsModalOpen(false)}
			/>
		</div>
	);
}
