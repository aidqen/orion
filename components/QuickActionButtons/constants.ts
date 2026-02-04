import {
	CalendarClock,
	CalendarRange,
	Lightbulb,
	ListChecks,
	PenLine,
} from "lucide-react";

export const quickActions = [
	{ id: "plan-day", label: "Plan my day", icon: CalendarRange },
	{ id: "prioritize", label: "Prioritize tasks", icon: ListChecks },
	{ id: "optimize-focus", label: "Optimize Routines", icon: CalendarClock },
	{ id: "help-write", label: "Import Events", icon: PenLine },
	{ id: "brainstorm", label: "Brainstorm", icon: Lightbulb },
];
