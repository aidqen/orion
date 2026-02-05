"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowUpDown, Search, X } from "lucide-react";
import { useState } from "react";
import { MemoriesList } from "@/components/MemoriesList";
import { Modal } from "@/components/Modal";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/contexts/UserContext";
import { fetchAllMemories } from "@/data/memories";
import { createClient } from "@/infra/supabase/client";

interface MemoriesModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function MemoriesModal({ open, onOpenChange }: MemoriesModalProps) {
	const { user } = useUser();
	const [searchQuery, setSearchQuery] = useState("");

	const { data: memories, isLoading } = useQuery({
		queryKey: ["memories", user?.id],
		queryFn: async () => {
			if (!user) return [];
			const supabase = createClient();
			return fetchAllMemories(supabase, user.id);
		},
		select: (memoriesData) =>
			memoriesData.filter((memory) =>
				memory.memory_text.toLowerCase().includes(searchQuery.toLowerCase()),
			),
		enabled: !!user && open,
	});

	return (
		<Modal
			open={open}
			onOpenChange={onOpenChange}
			isAnimate={true}
			className="max-w-[680px] h-[720px] bg-white dark:bg-[#171717] border-gray-200 dark:border-[#333333] shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.5)] p-0 flex flex-col overflow-hidden rounded-[12px]"
		>
			<div className="pt-[20px] px-[24px] pb-0 flex flex-col gap-[8px] shrink-0">
				<div className="flex justify-between items-start">
					<h2 className="text-2xl font-medium text-gray-900 dark:text-white m-0">
						Saved memories
					</h2>
					<button
						onClick={() => onOpenChange(false)}
						className="text-gray-500 dark:text-[#9CA3AF] cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
					>
						<X size={20} />
					</button>
				</div>
				<p className="text-[13px] text-gray-500 dark:text-[#B4B4B4] leading-[1.4]">
					Planwise tries to remember your recent chats, but it may forget things
					over time. Saved memories are never forgotten.{" "}
					<a
						href="#"
						className="underline hover:text-gray-900 dark:hover:text-white transition-colors"
					>
						Learn more
					</a>
				</p>
			</div>

			<div className="p-[20px_24px] flex justify-between items-center gap-[16px] shrink-0">
				<div className="bg-gray-100 dark:bg-[#212121] border border-gray-200 dark:border-[#424242] rounded-[20px] px-[12px] py-[8px] text-gray-500 dark:text-[#B4B4B4] text-[14px] grow flex items-center gap-[8px]">
					<Search size={16} />
					<input
						type="text"
						placeholder="Search memories"
						className="bg-transparent border-none outline-none w-full placeholder:text-gray-500 dark:placeholder:text-[#B4B4B4] text-gray-900 dark:text-[#ECECEC]"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className="flex gap-3 text-gray-500 dark:text-[#9CA3AF]">
					<button className="hover:text-gray-900 dark:hover:text-white transition-colors">
						<ArrowUpDown size={20} />
					</button>
				</div>
			</div>

			<div className="px-[24px] pb-[24px] overflow-y-auto grow flex flex-col custom-scrollbar">
				{isLoading ? (
					<>
						{[...Array(4)].map((_, i) => (
							<div
								key={i}
								className="py-[16px] border-b border-gray-200 dark:border-[#333333] last:border-b-0"
							>
								<Skeleton className="h-5 w-full" />
							</div>
						))}
					</>
				) : memories && memories.length > 0 ? (
					<MemoriesList memories={memories} userId={user!.id} />
				) : (
					<div className="text-gray-500 dark:text-[#B4B4B4] text-center py-8">
						{searchQuery
							? "No matching memories found."
							: "No memories saved yet."}
					</div>
				)}
			</div>
		</Modal>
	);
}
