import {
	CalendarPlus,
	CalendarRange,
	FileText,
	ListChecks,
	Search,
} from "lucide-react";

export const quickActions = [
	{
		id: "view-calendar",
		label: "View Calendar",
		icon: CalendarRange,
		prompt: "I want to know what is scheduled for me at ",
	},
	{
		id: "create-event",
		label: "Create Event",
		icon: CalendarPlus,
		prompt: "Create a new event for ",
	},
	{
		id: "fetch-todos",
		label: "Fetch Todos",
		icon: ListChecks,
		prompt: "Show me my todos for ",
	},
	{
		id: "research",
		label: "Research The Web",
		icon: Search,
		prompt: "Research and find information about ",
	},
	{
		id: "create-document",
		label: "Create Document",
		icon: FileText,
		prompt: "Create a document about ",
	},
];
