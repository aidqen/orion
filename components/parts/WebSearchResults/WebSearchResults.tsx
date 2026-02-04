"use client";

import { motion } from "motion/react";
import { useState } from "react";
import useMeasure from "react-use-measure";
import { cn } from "@/lib/utils";
import { ResultsList } from "./ResultsList";
import { ResultsToggleButton } from "./ResultsToggleButton";
import { SearchHeader } from "./SearchHeader";

interface WebSearchData {
	input?: { query?: string };
	output?: {
		type: string;
		title: string | null;
		url: string;
		pageAge: string | null;
		encryptedContent: string;
	}[];
}

interface WebSearchFetchProps {
	data: WebSearchData;
}

export function WebSearchResults({ data }: WebSearchFetchProps) {
	const [showResults, setShowResults] = useState(false);
	const [ref, bounds] = useMeasure();

	const query = data?.input?.query;
	const output = data?.output;
	const outputAvailable = output && output.length > 0;

	return (
		<motion.div
			className="rounded-lg border border-border-300 my-3 overflow-hidden relative bg-background w-full"
			animate={{ height: bounds.height }}
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
		>
			<div ref={ref}>
				<SearchHeader query={query} isOutputAvailable={!!outputAvailable} />

				{outputAvailable && query ? (
					<div
						className={cn(
							"px-3 py-2 overflow-hidden",
							showResults ? "bg-muted/50" : "bg-transparent",
						)}
					>
						<ResultsToggleButton
							query={query}
							resultCount={output.length}
							isExpanded={showResults}
							onToggle={() => setShowResults(!showResults)}
						/>

						{showResults && <ResultsList results={output} />}
					</div>
				) : null}
			</div>
		</motion.div>
	);
}
