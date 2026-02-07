import { File } from "lucide-react";
import { ArtifactToolbar } from "@/components/Artifact/ArtifactToolbar/ArtifactToolbar";

interface ArtifactHeaderProps {
	title: string;
	closeArtifact: () => void;
}

export function ArtifactHeader({ title, closeArtifact }: ArtifactHeaderProps) {
	return (
		<div className="border-b p-4 items-center gap-4 shrink-0 grid grid-cols-[minmax(0,1fr)_auto] text-black dark:text-white">
			<div className="flex items-center gap-3 overflow-hidden ">
				<File className="size-5 shrink-0" />
				<h2 className="font-semibold text-lg truncate min-w-0 ">{title}</h2>
			</div>

			<div className="flex shrink-0 min-w-[150px] justify-end">
				<ArtifactToolbar closeArtifact={closeArtifact} />
			</div>
		</div>
	);
}
