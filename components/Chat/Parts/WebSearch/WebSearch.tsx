"use client";

import { motion } from "motion/react";
import { useState } from "react";
import useMeasure from "react-use-measure";
import type { TavilySearchOutput } from "@/types/chat";
import { cn } from "@/utils/shared";
import { CollapsibleResultsSummary } from "./CollapsibleResultsSummary";
import { SearchResultsList } from "./SearchResultsList";
import { SearchStatusBanner } from "./SearchStatusBanner";

interface WebSearchData {
	input?: { query?: string };
	output?: TavilySearchOutput;
}

interface WebSearchFetchProps {
	data: WebSearchData;
}

export function WebSearch({ data }: WebSearchFetchProps) {
	const [showResults, setShowResults] = useState(false);
	const [ref, bounds] = useMeasure();

	const query = data?.input?.query;
	const output = data?.output;
	const results = output?.results;
	const outputAvailable = results && results.length > 0;

	return (
		<motion.div
			className="rounded-lg border border-border-300 my-3 overflow-hidden relative bg-background w-full"
			animate={{ height: bounds.height }}
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
		>
			<div ref={ref} className="w-full">
				<SearchStatusBanner
					query={query}
					isOutputAvailable={!!outputAvailable}
				/>

				{outputAvailable && query ? (
					<div
						className={cn(
							"px-3 py-2 overflow-hidden dark:text-white text-black w-full",
							showResults ? "bg-muted/50" : "bg-transparent hover:bg-muted/30",
						)}
					>
						<CollapsibleResultsSummary
							query={query}
							resultCount={results.length}
							isExpanded={showResults}
							onToggle={() => setShowResults(!showResults)}
						/>

						{showResults && <SearchResultsList results={results} />}
					</div>
				) : null}
			</div>
		</motion.div>
	);
}
