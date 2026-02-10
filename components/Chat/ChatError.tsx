import { Ban } from "lucide-react";

interface ChatErrorProps {
	error: Error | undefined;
	reload: () => void;
}

export function ChatError({ error, reload }: ChatErrorProps) {
	if (!error) return null;

	return (
		<div className="p-4 bg-red-50 dark:bg-red-950/30 border mt-10 border-red-200 dark:border-red-800/50 rounded-lg flex items-start gap-3">
			<div className="shrink-0 text-red-500 dark:text-red-400 mt-0.5">
				<Ban size={20} />
			</div>
			<div className="flex-1">
				<h3 className="text-red-800 dark:text-red-200 font-medium text-base">
					Error
				</h3>
				<p className="text-red-700 dark:text-red-300 text-sm mt-1">
					Somethings terrible happened.
				</p>
			</div>
			<button
				onClick={() => reload()}
				className="text-red-600 dark:text-red-300 active:scale-[0.98] hover:scale-[1.02] hover:text-red-700 cursor-pointer dark:hover:text-red-200 border border-red-600 dark:border-red-500 font-medium text-sm px-3 py-1 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-[colors,transform]"
			>
				Retry
			</button>
		</div>
	);
}
