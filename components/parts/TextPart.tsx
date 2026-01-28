import React, { memo } from 'react';
import { Streamdown } from 'streamdown';
import { useTypewriter } from '@/hooks/useTypewriter';

interface TextPartProps {
  text: string;
  speed: number;
  isUser?: boolean;
  isStreaming?: boolean;
}

interface UserResponseProps {
  text: string;
}

interface AssistantResponseProps {
  text: string;
  speed: number;
  isStreaming: boolean;
}



export const TextPart = memo(function TextPart({
  text,
  speed,
  isUser = false,
  isStreaming = false,
}: TextPartProps) {
  if (!text) return null;

  if (isUser) {
    return <UserResponse text={text} />;
  }

  return <AssistantResponse text={text} speed={speed} isStreaming={isStreaming} />;
}, (prevProps, nextProps) => {
  return prevProps.text === nextProps.text &&
    prevProps.isStreaming === nextProps.isStreaming;
});

const UserResponse = memo(function UserResponse({ text }: UserResponseProps) {
  return (
    <div className='w-full flex justify-end'>
      <p className="whitespace-pre-wrap text-xs sm:text-sm lg:text-base px-3 py-1.5  bg-bubble-user border border-gray-300 dark:border-stone-800 backdrop-blur-sm dark:text-white text-black rounded-xl rounded-tr-sm w-fit">
        {text}
      </p>
    </div>
  );
});

const AssistantResponse = memo(function AssistantResponse({
  text,
  speed,
  isStreaming
}: AssistantResponseProps) {
  const { displayedContent, isFinished } = useTypewriter({
    text,
    speed,
    enabled: isStreaming,
  });

  const contentToRender = isFinished ? text : displayedContent;

  return (
    <div className="text-xs sm:text-sm lg:text-base leading-loose font-medium py-2">
      <Streamdown isAnimating={isStreaming && !isFinished}>
        {contentToRender}
      </Streamdown>
    </div>
  );
});