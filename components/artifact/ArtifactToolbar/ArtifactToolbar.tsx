import { useMutation } from "@tanstack/react-query";
import { Check, Copy, Download, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AUTH_POPUP_MODES } from "@/constants/auth.constant";
import { useUser } from "@/contexts/UserContext";
import { createDocumentFromArtifact } from "@/services/client/docs.service";
import { useArtifactStore } from "@/store/useArtifactStore";
import { useAuthPopupStore } from "@/store/useAuthPopupStore";

interface ArtifactToolbarProps {
	closeArtifact: () => void;
}

export function ArtifactToolbar({ closeArtifact }: ArtifactToolbarProps) {
	const openAuthPopup = useAuthPopupStore((state) => state.open);
	const { user, isGoogleConnected } = useUser();
	const { activeArtifactId, artifacts } = useArtifactStore();
	const activeArtifact = activeArtifactId
		? artifacts.get(activeArtifactId)
		: null;
	const [isCopied, setIsCopied] = useState(false);

	const { mutate: createDoc, isPending } = useMutation({
		mutationFn: createDocumentFromArtifact,
		onSuccess: (data) => {
			// Open the Google Doc in a new tab
			window.open(data.url, "_blank");
		},
		onError: (error) => {
			console.error("Failed to create Google Doc:", error);
			toast.error(
				"Failed to create Google Doc, try again later. If the problem persists, please contact support.",
			);
		},
	});

	useEffect(() => {
		if (isCopied) {
			const timeout = setTimeout(() => {
				setIsCopied(false);
			}, 2500);
			return () => clearTimeout(timeout);
		}
	}, [isCopied]);

	function onCloseArtifact() {
		closeArtifact();
	}

	function onCreateGoogleDoc() {
		if (!isGoogleConnected)
			return openAuthPopup(AUTH_POPUP_MODES.CONNECT_GOOGLE);
		if (!user?.id || !activeArtifact) return;

		createDoc({
			title: activeArtifact.title,
			content: activeArtifact.content,
		});
	}

	async function onCopyContent() {
		if (!activeArtifact) return;

		try {
			await navigator.clipboard.writeText(activeArtifact.content);
			setIsCopied(true);
		} catch (error) {
			console.error("Failed to copy content:", error);
		}
	}

	return (
		<div className="flex flex-row whitespace-nowrap items-center gap-2">
			<Button variant="outline" size="icon" onClick={onCopyContent}>
				{isCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
			</Button>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="icon" className="relative">
						<Download className="size-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={onCreateGoogleDoc} disabled={isPending}>
						{isPending ? "Creating..." : "Save To Docs"}
					</DropdownMenuItem>
					<DropdownMenuItem>Save To Notion</DropdownMenuItem>
					<DropdownMenuItem>Download</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Button
				variant="outline"
				size="icon"
				onClick={onCloseArtifact}
				aria-label="Close artifact"
			>
				<X className="size-4" />
			</Button>
		</div>
	);
}
