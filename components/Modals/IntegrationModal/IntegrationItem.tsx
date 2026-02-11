import { Check, Puzzle } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/utils/shared";

interface Integration {
	id: string;
	name: string;
	description: string;
	connected: boolean;
	icon: ReactNode;
	isAvailable?: boolean;
}

interface IntegrationItemProps {
	integration: Integration;
	onConnect?: () => void;
}

export function IntegrationItem({
	integration,
	onConnect,
}: IntegrationItemProps) {
	return (
		<div className="py-[16px] border-b border-gray-200 dark:border-[#333333] last:border-b-0 flex items-center justify-between gap-4">
			<div className="flex items-center gap-4">
				<div className="shrink-0 size-10 rounded-lg bg-gray-100 dark:bg-[#212121] flex items-center justify-center text-gray-900 dark:text-white">
					{integration.icon || <Puzzle className="size-6" />}
				</div>
				<div className="flex flex-col gap-1">
					<h3 className="text-[15px] font-medium text-gray-900 dark:text-white leading-none">
						{integration.name}
					</h3>
					<p className="text-[13px] text-gray-500 dark:text-[#B4B4B4] leading-none">
						{integration.description}
					</p>
				</div>
			</div>
			<button
				onClick={!integration.connected ? onConnect : undefined}
				disabled={!integration.isAvailable}
				className={cn(
					"w-30 h-10 flex justify-center items-center disabled:opacity-50 rounded-full text-sm font-medium transition-colors border",
					integration.connected
						? "bg-transparent border-stone-400 dark:border-stone-200 text-stone-400 dark:text-stone-200 cursor-default"
						: "bg-black dark:bg-white text-white dark:text-black border-transparent hover:opacity-90 cursor-pointer",
				)}
			>
				{integration.connected ? (
					<span className="flex items-center gap-1">
						<Check size={18} /> Connected
					</span>
				) : (
					<span className="flex items-center gap-1">
						{integration.isAvailable ? "Connect" : "Coming Soon"}
					</span>
				)}
			</button>
		</div>
	);
}
