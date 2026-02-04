"use client";

import { Brain, LogIn, LogOut, Puzzle } from "lucide-react";
import { useState } from "react";
import { AUTH_POPUP_MODES } from "@/constants/auth.constant";
import { useUser } from "@/contexts/UserContext";
import { useAuthPopupStore } from "@/store/useAuthPopupStore";
import { MemoriesModal } from "../MemoriesModal";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function ChatpageHeader() {
	const { authenticated, signOut } = useUser();
	const openAuthPopup = useAuthPopupStore((state) => state.open);
	const [memoriesModalOpen, setMemoriesModalOpen] = useState(false);

	const handleLogin = () => {
		openAuthPopup(AUTH_POPUP_MODES.SIGN_IN);
	};

	const handleLogout = async () => {
		await signOut();
	};

	return (
		<div className="w-full flex justify-end items-center p-2 gap-10 pe-6">
			{/* <Button variant={"outline"}>
                <Sparkles size={16} />
                Memories
            </Button> */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button className="size-8 rounded-full border border-stone-300 shadow-sm bg-linear-to-r from-[#E100FF] to-[#7F00FF] cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2" />
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-48">
					<DropdownMenuItem>
						<Puzzle className="size-4" />
						Integrations
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setMemoriesModalOpen(true)}>
						<Brain className="size-4" />
						Memories
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					{authenticated ? (
						<DropdownMenuItem onClick={handleLogout}>
							<LogOut className="size-4" />
							Logout
						</DropdownMenuItem>
					) : (
						<DropdownMenuItem onClick={handleLogin}>
							<LogIn className="size-4" />
							Login
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
			<MemoriesModal
				open={memoriesModalOpen}
				onOpenChange={setMemoriesModalOpen}
			/>
		</div>
	);
}
