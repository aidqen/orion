"use client";

import type { TavilySearchResult } from "@/types/chat";
import { WebSearchResultItem } from "./WebSearchItem";

interface ResultsListProps {
	results: TavilySearchResult[];
}

export function ResultsList({ results }: ResultsListProps) {
	return (
		<div className="mt-2 pl-4 overflow-x-hidden space-y-1">
			{results.map((result, index) => (
				<WebSearchResultItem
					key={index}
					title={result.title}
					url={result.url}
					favicon={result.favicon}
				/>
			))}
		</div>
	);
}
