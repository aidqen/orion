import { memo } from 'react';
import { UIMessage } from 'ai';
import { TextPart } from './parts/TextPart';
import { CreateEventPreview } from './parts/CreateEventPreview';
import { EventList } from './parts/EventList';
import { AI_TOOLS } from '@/constants/chat.constant';

interface MessageProps {
  message: UIMessage | any;
  isAssistantBgVisible?: boolean;
}

// Renders each part based on its type
function RenderPart(
  part: any,
  index: number,
  isUser: boolean,
  isStreaming: boolean,
  messageId: string
) {
  switch (part.type) {
    case 'text':
      return (
        <TextPart
          key={index}
          text={part.text}
          speed={5}
          isUser={isUser}
          isStreaming={part.state === 'streaming' || isStreaming}
        />
      );

    case AI_TOOLS.CREATE_NEW_EVENT:
      return (
        <CreateEventPreview
          data={part.output}
          key={index}
          messageId={messageId}
        />
      );
    case AI_TOOLS.GET_CALENDAR_EVENTS:
      return (
        <EventList
          key={index}
          data={part.output}
        />
      );

    default:
      return null;
  }
}

export const Message = memo(function Message({
  message,
  isAssistantBgVisible = false
}: MessageProps) {
  console.log("🚀 ~ Message ~ message:", message)
  const isUser = message?.role === 'user';
  const parts = message?.parts || [];

  const isStreaming = parts.some((part: any) => part.state === 'streaming');

  const validTypes = Object.values(AI_TOOLS);
  const hasContent = parts.some((part: any) =>
    validTypes.includes(part.type)
  );

  if (!hasContent) return null;

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex flex-col gap-1 sm:max-w-[85%] transition-all duration-300 ease-out transform w-fit
      ${isUser
          ? 'text-white bg-blue-500 rounded-2xl rounded-tr-sm dark:bg-blue-600'
          : `${isAssistantBgVisible ? 'dark:bg-gray-800 bg-gray-100' : ''} 
          text-gray-800 rounded-xl dark:text-gray-100`
        }`}>
        {parts.map((part: any, index: number) =>
          RenderPart(part, index, isUser, isStreaming, message.id)
        )}
      </div>
    </div>
  );
}, (prevProps: MessageProps, nextProps: MessageProps) => {
  return prevProps.message === nextProps.message;
});
