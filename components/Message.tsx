import { memo } from 'react';
import { UIMessage } from 'ai';
import Image from 'next/image';
import { TextPart } from './parts/TextPart';
import { CreateEventPreview } from './parts/CreateEventPreview/CreateEventPreview';
import { EventList } from './parts/EventList/EventList';
import { AI_TOOLS } from '@/constants/chat.constant';
import { WebSearchResults } from './parts/WebSearchResults/WebSearchResults';
import { ArtifactPreview } from './parts/ArtifactPreview';

interface MessageProps {
  message: UIMessage | any;
}

function RenderPart(
  part: any,
  index: number,
  isUser: boolean,
  isStreaming: boolean,
  messageId: string
) {
  switch (part.type) {
    case AI_TOOLS.TEXT:
      return (
        <TextPart
          key={index}
          text={part.text}
          speed={5}
          isUser={isUser}
          isStreaming={part.state === 'streaming' || isStreaming}
        />
      );
    case AI_TOOLS.IMAGE:
      return (
        <div key={index} className="relative w-full max-w-xs">
          <Image
            src={part.url}
            alt={part.filename || 'Uploaded image'}
            width={300}
            height={200}
            className="rounded-lg object-contain"
            unoptimized
          />
        </div>
      );
    case AI_TOOLS.WEB_SEARCH:
      return (
        <WebSearchResults data={part} key={index} />
      )

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
    case AI_TOOLS.CREATE_DOCUMENT:
      return (
        <ArtifactPreview
          key={index}
          data={part.output}
          toolCallId={part.toolCallId}
          isStreaming={part.state === 'streaming'}
        />
      );

    default:
      return null;
  }
}

export const Message = memo(function Message({
  message,
}: MessageProps) {
  const isUser = message?.role === 'user';
  const parts = message?.parts || [];

  const isStreaming = parts.some((part: any) => part.state === 'streaming');

  const validTypes = ['text', 'file', ...Object.values(AI_TOOLS)];
  const hasContent = parts.some((part: any) =>
    validTypes.includes(part.type)
  );

  if (!hasContent) return null;

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex flex-col gap-1.5  transition-all duration-300 ease-out transform 
      ${isUser
          ? 'text-white w-fit sm:max-w-[90%]'
          : 'text-gray-800 dark:text-gray-100 w-full'
        }`}>
        {parts.map((part: any, index: number) =>
          RenderPart(part, index, isUser, isStreaming, message.tempId || message.id)
        )}
      </div>
    </div>
  );
}, (prevProps: MessageProps, nextProps: MessageProps) => {
  return prevProps.message === nextProps.message;
});
