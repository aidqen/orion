'use client';

import { WebSearchResultItem } from './WebSearchItem';

interface Result {
  title: string;
  url: string;
}

interface ResultsListProps {
  results: Result[];
}

export function ResultsList({ results }: ResultsListProps) {
  return (
    <div className="mt-2 pl-4 overflow-y-auto space-y-1">
      {results.map((result, index) => (
        <WebSearchResultItem
          key={index}
          title={result.title}
          url={result.url}
        />
      ))}
    </div>
  );
}
