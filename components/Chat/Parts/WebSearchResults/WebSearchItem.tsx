"use client";

import Image from "next/image";
import Link from "next/link";

interface WebSearchResultItemProps {
	title: string;
	url: string;
	favicon?: string;
}

export function WebSearchResultItem({
	title,
	url,
	favicon,
}: WebSearchResultItemProps) {
	const domain = new URL(url).hostname;
	const faviconUrl =
		favicon || `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

	return (
		<Link
			href={url}
			target="_blank"
			rel="noopener noreferrer"
			className="grid grid-cols-[1fr_10fr] gap-2 px-2 py-1.5 hover:bg-bg-100 rounded text-sm w-full"
		>
			<Image
				src={faviconUrl}
				alt=""
				width={16}
				height={16}
				className="size-4 shrink-0"
				unoptimized
			/>
			<span className="truncate text-text-300 flex-1 min-w-0">
				{title || "Untitled"}
			</span>
		</Link>
	);
}
