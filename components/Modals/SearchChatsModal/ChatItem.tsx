import { cn } from "@/utils/shared";
import { MessageCircle } from "lucide-react";

interface ChatItemProps {
	title: string;
	rightLabel: string;
	onClick?: () => void;
}

export function ChatItem({ title, rightLabel, onClick }: ChatItemProps) {
	return (
		<div
			onClick={onClick}
			className={cn(
				"flex items-center justify-between px-3 py-[10px] rounded-lg cursor-pointer hover:bg-accent",
			)}
		>
			<div className="flex items-center overflow-hidden">
				<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] mr-3">
					<MessageCircle size={20} className="text-foreground" />
				</div>
				<span className="truncate text-[14px] font-medium text-foreground">
					{title}
				</span>
			</div>

			<span className="shrink-0 text-[13px] text-muted-foreground">
				{rightLabel}
			</span>
		</div>
	);
}
