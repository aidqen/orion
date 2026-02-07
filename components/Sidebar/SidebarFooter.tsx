import { ChevronDown, ChevronUp } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { SidebarFooter as ShadcnSidebarFooter } from "../ui/sidebar";

export function SidebarFooter() {
	const { user } = useUser();
	return (
		<ShadcnSidebarFooter className="mt-auto grid grid-cols-[auto_1fr_auto] gap-3 items-center hover:bg-gray-100 dark:hover:bg-stone-800 transition-colors cursor-pointer pb-3">
			<button className="size-7 rounded-full bg-linear-to-r from-[#E100FF] to-[#7F00FF]" />

			<div className="flex flex-col gap-0">
				<span className="text-black dark:text-white text-sm font-medium">
					{user?.user_metadata?.name || "User"}
				</span>
				<span className="text-stone-600 dark:text-stone-400 text-xs">
					Free Plan
				</span>
			</div>
			<div className="flex flex-col gap-0">
				<ChevronUp size={10} />
				<ChevronDown size={10} />
			</div>
		</ShadcnSidebarFooter>
	);
}
