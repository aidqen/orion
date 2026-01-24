import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTypewriter } from '@/hooks/useTypewriter';

interface TextPartProps {
  text: string;
  speed?: number;
  isUser?: boolean;
  isStreaming?: boolean;
}

const markdownComponents = {
  p: ({ children }: any) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }: any) => <ul className="mb-2 ml-4 list-disc">{children}</ul>,
  ol: ({ children }: any) => <ol className="mb-2 ml-4 list-decimal">{children}</ol>,
  li: ({ children }: any) => <li className="mb-1">{children}</li>,
  code: ({ inline, children }: any) => inline
    ? <code className="px-1 text-gray-800 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-200">{children}</code>
    : <pre className="overflow-x-auto p-2 my-2 text-white bg-gray-800 rounded dark:bg-gray-900"><code>{children}</code></pre>,
  blockquote: ({ children }: any) => (
    <blockquote className="pl-4 my-2 italic border-l-4 border-gray-300 dark:border-gray-600">{children}</blockquote>
  ),
};

export const TextPart = memo(function TextPart({ 
  text, 
  speed = 5, 
  isUser = false,
  isStreaming = false,
}: TextPartProps) {
  const { displayedContent, isFinished } = useTypewriter({
    text,
    speed,
    enabled: !isUser && isStreaming,
  });

  if (!text) return null;

  // User messages render as plain text
  if (isUser) {
    return (
      <p className="text-xs whitespace-pre-wrap max-sm:text-sm px-4 py-2 lg:text-sm">{text}</p>
    );
  }

  // Assistant messages render with markdown
  const contentToRender = isFinished ? text : displayedContent;

  return (
    <div className="text-xs max-sm:text-sm lg:text-sm markdown-content py-2">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {contentToRender}
      </ReactMarkdown>
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.text === nextProps.text && 
         prevProps.speed === nextProps.speed &&
         prevProps.isStreaming === nextProps.isStreaming;
});
