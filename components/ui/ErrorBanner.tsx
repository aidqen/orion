"use client";

export default function ErrorBanner({
	message,
	className = "",
}: {
	message: string;
	className?: string;
}) {
	return (
		<div
			className={`rounded-xl border border-[#7F1D1D] bg-[#2A1212] p-3 text-sm text-[#FCA5A5] ${className}`}
		>
			{message}
		</div>
	);
}
