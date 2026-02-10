"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";
import { NotionIcon } from "@/components/Icons/NotionIcon";
import { TodoistIcon } from "@/components/Icons/TodoistIcon";
import { IntegrationItem } from "@/components/Modals/IntegrationModal/IntegrationItem";
import { Modal } from "@/components/Modals/Modal";
import { useUser } from "@/contexts/UserContext";
import { connectTodoist } from "@/services/client/todoist";
import { GoogleIcon } from "../../Icons/GoogleIcon";

interface IntegrationsModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function IntegrationsModal({
	open,
	onOpenChange,
}: IntegrationsModalProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const { isTodoistConnected, isGoogleConnected } = useUser();

	const handleConnect = (integrationId: string) => {
		if (integrationId === "todoist") {
			connectTodoist();
		}
	};

	const integrations = [
		{
			id: "todoist",
			name: "Todoist",
			description: "Manage your tasks and projects directly from Orion.",
			connected: isTodoistConnected,
			icon: <TodoistIcon className="size-6" />,
			isAvailable: true,
		},
		{
			id: "google",
			name: "Google",
			description:
				"Connect your google calendar account for calendar management.",
			connected: isGoogleConnected,
			icon: <GoogleIcon />,
			isAvailable: false,
		},
		{
			id: "notion",
			name: "Notion",
			description: "Connect your Notion workspace to sync pages and databases.",
			connected: false,
			icon: <NotionIcon className="size-6" />,
			isAvailable: false,
		},
	];

	const filteredIntegrations = integrations.filter((integration) =>
		integration.name.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<Modal
			open={open}
			onOpenChange={onOpenChange}
			isAnimate={true}
			className="max-w-[680px] h-[720px] bg-white dark:bg-[#171717] border-gray-200 dark:border-[#333333] shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.5)] p-0 flex flex-col overflow-hidden md:rounded-[12px]"
		>
			<div className="pt-[20px] px-[24px] pb-0 flex flex-col gap-[8px] shrink-0">
				<div className="flex justify-between items-start">
					<h2 className="text-2xl font-medium text-gray-900 dark:text-white m-0">
						Integrations
					</h2>
					<button
						onClick={() => onOpenChange(false)}
						className="text-gray-500 dark:text-[#9CA3AF] cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
					>
						<X size={20} />
					</button>
				</div>
				<p className="text-[13px] text-gray-500 dark:text-[#B4B4B4] leading-[1.4]">
					Connect your favorite tools to supercharge your workflow with Orion.
				</p>
			</div>

			<div className="p-[20px_24px] flex justify-between items-center gap-[16px] shrink-0">
				<div className="bg-gray-100 dark:bg-[#212121] border border-gray-200 dark:border-[#424242] rounded-[20px] px-[12px] py-[8px] text-gray-500 dark:text-[#B4B4B4] text-[14px] grow flex items-center gap-[8px]">
					<Search size={16} />
					<input
						type="text"
						placeholder="Search integrations"
						className="bg-transparent border-none outline-none w-full placeholder:text-gray-500 dark:placeholder:text-[#B4B4B4] text-gray-900 dark:text-[#ECECEC]"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</div>

			<div className="px-[24px] pb-[24px] overflow-y-auto grow flex flex-col custom-scrollbar">
				{filteredIntegrations.length > 0 ? (
					<div className="flex flex-col">
						{filteredIntegrations.map((integration) => (
							<IntegrationItem
								key={integration.id}
								integration={integration}
								onConnect={() => handleConnect(integration.id)}
							/>
						))}
					</div>
				) : (
					<div className="text-gray-500 dark:text-[#B4B4B4] text-center py-8">
						No integrations found.
					</div>
				)}
			</div>
		</Modal>
	);
}
