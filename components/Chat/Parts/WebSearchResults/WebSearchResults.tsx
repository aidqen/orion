"use client";

import { motion } from "motion/react";
import { useState } from "react";
import useMeasure from "react-use-measure";
import { cn } from "@/utils/shared";
import type { TavilySearchOutput } from "@/types/chat";
import { ResultsList } from "./ResultsList";
import { ResultsToggleButton } from "./ResultsToggleButton";
import { SearchHeader } from "./SearchHeader";

interface WebSearchData {
	input?: { query?: string };
	output?: TavilySearchOutput;
}

interface WebSearchFetchProps {
	data: WebSearchData;
}

export function WebSearchResults({ data }: WebSearchFetchProps) {
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
				<SearchHeader query={query} isOutputAvailable={!!outputAvailable} />

				{outputAvailable && query ? (
					<div
						className={cn(
							"px-3 py-2 overflow-hidden dark:text-white text-black w-full",
							showResults ? "bg-muted/50" : "bg-transparent hover:bg-muted/30",
						)}
					>
						<ResultsToggleButton
							query={query}
							resultCount={results.length}
							isExpanded={showResults}
							onToggle={() => setShowResults(!showResults)}
						/>

						{showResults && <ResultsList results={results} />}
					</div>
				) : null}
			</div>
		</motion.div>
	);
}
