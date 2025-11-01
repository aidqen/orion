import React, { useState, useEffect, useRef, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'motion/react';

export const MessageBubble = memo(function MessageBubble({ message, speed = 5, isAssistantBgVisible = false }) {
  const isUser = message?.role === 'user';

  const [displayedContent, setDisplayedContent] = useState('');
  const [typewriterFinished, setTypewriterFinished] = useState(false);
  const intervalRef = useRef(null);

  // Check if any parts have streaming state
  const isStreaming = message?.parts && Array.isArray(message.parts)
    ? message.parts.some(part => part.state === 'streaming')
    : false;

  // Get timestamp from message metadata
  const getTimestamp = () => {
    if (!isUser) return null;
    return message?.metadata?.timestamp || '';
  };

  // Define markdown components for consistent styling
  const markdownComponents = {
    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
    ul: ({ children }) => <ul className="mb-2 ml-4 list-disc">{children}</ul>,
    ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal">{children}</ol>,
    li: ({ children }) => <li className="mb-1">{children}</li>,
    code: ({ inline, children }) => inline
      ? <code className="px-1 text-gray-800 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-200">{children}</code>
      : <pre className="overflow-x-auto p-2 my-2 text-white bg-gray-800 rounded dark:bg-gray-900"><code>{children}</code></pre>,
    blockquote: ({ children }) => (
      <blockquote className="pl-4 my-2 italic border-l-4 border-gray-300 dark:border-gray-600">{children}</blockquote>
    ),
  };

  const textParts = message?.parts ? message.parts.filter(part => part.type === 'text') : [];

  const messageContent = textParts.map(part => part.text).join('');
  const hasText = typeof messageContent === 'string' && messageContent.length >= 1;

  useEffect(() => {
    if (isUser) {
      setDisplayedContent(messageContent);
      setTypewriterFinished(true);
      return;
    }

    // If not streaming and we haven't started typing yet, show content immediately
    if (!isStreaming && displayedContent === '') {
      setDisplayedContent(messageContent);
      setTypewriterFinished(true);
      return;
    }

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    let index = displayedContent.length;

    intervalRef.current = setInterval(() => {
      if (index < messageContent.length) {
        setDisplayedContent(messageContent.slice(0, index + 1));
        index++;
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [messageContent, isStreaming, isUser, speed, displayedContent.length]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const contentToDisplay = isUser ? messageContent : displayedContent;

  if (!hasText) return null;

  return (
    <AnimatePresence>
      <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
        <motion.div
          className="flex flex-col gap-1 max-w-[85%] transition-all duration-300 ease-out transform"
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -5, opacity: 0 }}
        >
          <div className={`px-4 py-2 transition-opacity duration-300 w-fit ${isUser
            ? 'text-white bg-blue-500 rounded-2xl rounded-tr-sm dark:bg-blue-600'
            : `${isAssistantBgVisible ? 'dark:bg-gray-800 bg-gray-100' : ''} text-gray-800  rounded-xl dark:text-gray-100 `
            }`}>
            {isUser ? (
              <p className="text-xs whitespace-pre-wrap max-sm:text-sm lg:text-sm">{messageContent}</p>
            ) : (
              <div className="text-xs max-sm:text-sm lg:text-sm markdown-content">
                {/* Render content based on typewriter state */}
                {typewriterFinished ? (
                  textParts.map((part, index) => (
                    <ReactMarkdown key={index} remarkPlugins={[remarkGfm]} components={markdownComponents}>
                      {part.text}
                    </ReactMarkdown>
                  ))
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {contentToDisplay}
                  </ReactMarkdown>
                )}
              </div>
            )}
          </div>
          {getTimestamp() && (
            <p className="text-xs text-end text-gray-500 dark:text-gray-400">
              {getTimestamp()}
            </p>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}, (prevProps, nextProps) => {
  // Only re-render if the message object reference changes
  return prevProps.message === nextProps.message && prevProps.speed === nextProps.speed;
});
