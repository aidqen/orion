"use client";

import type { TavilySearchResult } from "@/types/chat";
import { SearchResultItem } from "./SearchResultItem";

interface SearchResultsListProps {
	results: TavilySearchResult[];
}

export function SearchResultsList({ results }: SearchResultsListProps) {
	return (
		<div className="mt-2 pl-4 overflow-x-hidden space-y-1">
			{results.map((result, index) => (
				<SearchResultItem
					key={index}
					title={result.title}
					url={result.url}
					favicon={result.favicon}
				/>
			))}
		</div>
	);
}
