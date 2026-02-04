"use client";

import { Info, Mail, User } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

export function UserDetailsSection() {
	const { user, authenticated } = useUser();

	if (!authenticated || !user) {
		return (
			<div className="space-y-4">
				<div className="p-4 rounded-[12px] border border-gray-200 bg-gray-50 dark:bg-gray-900/10 dark:border-gray-800/30 flex items-start gap-3">
					<div className="shrink-0 text-gray-500 mt-0.5">
						<Info size={20} />
					</div>
					<div className="flex-1">
						<h3 className="text-gray-800 dark:text-gray-200 font-semibold text-sm">
							Not Signed In
						</h3>
						<p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
							Please sign in to access all features and save your settings.
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<h3 className="text-[16px] font-medium text-[#111827] dark:text-[#E5E7EB]">
				Account
			</h3>

			<div className="p-4 rounded-[12px] border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[rgba(255,255,255,0.02)] space-y-3">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
						<User className="w-5 h-5" />
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-medium text-[#111827] dark:text-[#E5E7EB] truncate">
							{user.user_metadata?.name || "User"}
						</p>
						<p className="text-xs text-gray-500 dark:text-gray-400 truncate">
							User ID: {user.id.slice(0, 8)}...
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 pt-2 border-t border-[#E5E7EB] dark:border-[rgba(255,255,255,0.1)]">
					<Mail className="w-4 h-4 text-gray-400" />
					<span className="truncate">{user.email}</span>
				</div>
			</div>
		</div>
	);
}
