'use client'

import React from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { useArtifactStore } from '@/store/useArtifactStore';

interface ArtifactPreviewProps {
  data: {
    id: string;
    title: string;
    description: string;
    content: string;
  };
  toolCallId: string;
  isStreaming: boolean;
}

export const ArtifactPreview: React.FC<ArtifactPreviewProps> = ({
  data,
  toolCallId,
  isStreaming
}) => {
  const openArtifact = useArtifactStore(state => state.openArtifact);

  if (!data?.id) return null;

  const handleClick = () => {
    openArtifact(data.id);
  };

  return (
    <div
      className="w-fit min-w-[250px] sm:min-w-[400px] max-w-full my-2 cursor-pointer"
      onClick={handleClick}
    >
      {/* <div className="w-full overflow-hidden rounded-xl border bg-card backdrop-blur-md text-card-foreground shadow-sm hover:shadow-md transition-shadow"> */}
        <div className="border-b bg-muted/40 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {isStreaming ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <FileText className="h-5 w-5" />
              )}
            </div>
            <div className="grid gap-1">
              <h3 className="font-semibold leading-none tracking-tight">
                {data.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isStreaming ? 'Generating...' : 'Document'}
              </p>
            </div>
          </div>
        </div>

        {data.description && (
          <div className="p-4">
            <p className="text-sm text-muted-foreground">
              {data.description}
            </p>
          </div>
        )}
      {/* </div> */}
    </div>
  );
};
