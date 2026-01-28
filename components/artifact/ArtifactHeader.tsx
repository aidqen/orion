import { File, Loader2 } from "lucide-react";
import { ArtifactToolbar } from "@/components/Artifact/ArtifactToolbar/ArtifactToolbar";

interface ArtifactHeaderProps {
    status: 'streaming' | 'completed';
    title: string;
    closeArtifact: () => void;
}

export function ArtifactHeader({ status, title, closeArtifact }: ArtifactHeaderProps) {
    
    return (
        <div className="border-b p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">

                <div className="flex items-center gap-3">
                    {status === 'streaming' && (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    )}
                    <File className="size-5" />
                    <h2 className="font-semibold text-lg whitespace-nowrap">{title}</h2>
                </div>
            </div>

            <ArtifactToolbar closeArtifact={closeArtifact} />
        </div>
    )
}