'use client';

import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import useMeasure from 'react-use-measure';
import { cn } from '@/lib/utils';
import { SearchHeader } from './SearchHeader';
import { ResultsToggleButton } from './ResultsToggleButton';
import { ResultsList } from './ResultsList';

interface WebSearchFetchProps {
  data: any;
}

export function WebSearchResults({ data }: WebSearchFetchProps) {
  const [showResults, setShowResults] = useState(false);
  const [ref, bounds] = useMeasure();
  const outputAvailable = useMemo(() => data?.output && data?.output?.length > 0, [data]);

  return (
    <motion.div
      className="rounded-lg border border-border-300 my-3 overflow-hidden relative bg-background w-full"
      animate={{ height: bounds.height }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div ref={ref}>
        <SearchHeader query={data?.input?.query} isOutputAvailable={outputAvailable}/>

        {outputAvailable && (
          <div className={cn("px-3 py-2 overflow-hidden", showResults ? "bg-muted/50" : "bg-transparent")}>
            <ResultsToggleButton
              query={data.input.query}
              resultCount={data.output.length}
              isExpanded={showResults}
              onToggle={() => setShowResults(!showResults)}
            />

            {showResults && <ResultsList results={data.output} />}
          </div>
        )}
      </div>
    </motion.div>
  );
}
