"use client";

import { Earth } from "lucide-react";

interface ContextAwareWidgetProps {
	title?: string;
	description?: string;
	badgeText?: string;
}

export function ContextAwareWidget({
	title = "Context-Aware Chat",
	description = "Your AI remembers past interactions to provide more relevant and personalized responses.",
	badgeText = "New",
}: ContextAwareWidgetProps) {
	return (
		<div className="flex-1 bg-sidebar dark:bg-card rounded-2xl border border-border p-3 flex flex-col gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.02)] font-sans">
			<div className="flex items-center gap-0.5 px-1.5 py-[3px]  border border-border rounded-full w-fit shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
				<Earth size={15} className="text-muted-foreground" />
				<span className="text-[11px] font-semibold text-foreground">
					{badgeText}
				</span>
			</div>

			<div className="flex flex-col gap-2">
				<h3 className="text-base font-semibold leading-tight text-foreground m-0">
					{title}
				</h3>
				<p className="text-[13px] font-normal text-muted-foreground leading-tight m-0">
					{description}
				</p>
			</div>
		</div>
	);
}
