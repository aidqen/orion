// import { useMutation } from "@tanstack/react-query";

// import { useAuthPopupStore } from "@/store/useAuthPopupStore";
import { Packer } from "docx";
import { Check, Copy, Download, X } from "lucide-react";
// import { AUTH_POPUP_MODES } from "@/constants/auth.constant";
// import { useUser } from "@/contexts/UserContext";
// import {
// 	createDocumentFromArtifact,
// 	isDocsApiError,
// } from "@/services/client/docs.service";
import { markdownDocx } from "markdown-docx";
import { useEffect, useState } from "react";
// import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useArtifactStore } from "@/store/useArtifactStore";

interface ArtifactToolbarProps {
	closeArtifact: () => void;
}

export function ArtifactToolbar({ closeArtifact }: ArtifactToolbarProps) {
	// const openAuthPopup = useAuthPopupStore((state) => state.open);
	// const { user, isGoogleConnected } = useUser();
	const { activeArtifactId, artifacts } = useArtifactStore();
	const activeArtifact = activeArtifactId
		? artifacts.get(activeArtifactId)
		: null;
	const [isCopied, setIsCopied] = useState(false);

	// const { mutate: createDoc, isPending } = useMutation({
	// 	mutationFn: createDocumentFromArtifact,
	// 	onSuccess: (data) => {
	// 		window.open(data.url, "_blank");
	// 	},
	// 	onError: (error) => {
	// 		if (
	// 			isDocsApiError(error) &&
	// 			(error.code === "google_access_revoked" ||
	// 				error.code === "google_not_connected")
	// 		) {
	// 			openAuthPopup(AUTH_POPUP_MODES.CONNECT_GOOGLE);
	// 			return;
	// 		}

	// 		toast.error(
	// 			"Failed to create Google Doc, try again later. If the problem persists, please contact support.",
	// 		);
	// 	},
	// });

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

	// function onCreateGoogleDoc() {
	// 	if (!isGoogleConnected)
	// 		return openAuthPopup(AUTH_POPUP_MODES.CONNECT_GOOGLE);
	// 	if (!user?.id || !activeArtifact) return;

	// 	createDoc({
	// 		title: activeArtifact.title,
	// 		content: activeArtifact.content,
	// 	});
	// }

	async function onCopyContent() {
		if (!activeArtifact) return;

		try {
			await navigator.clipboard.writeText(activeArtifact.content);
			setIsCopied(true);
		} catch (error) {
			console.error("Failed to copy content:", error);
		}
	}

	async function onDownload() {
		if (!activeArtifact) return;

		const doc = await markdownDocx(activeArtifact.content);
		const blob = await Packer.toBlob(doc);

		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${activeArtifact.title}.docx`;
		link.click();

		URL.revokeObjectURL(url);
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
					{/* <DropdownMenuItem onClick={onCreateGoogleDoc} disabled={isPending}>
						{isPending ? "Creating..." : "Save To Docs"}
					</DropdownMenuItem> */}
					<DropdownMenuItem>Save To Notion</DropdownMenuItem>
					<DropdownMenuItem onClick={onDownload}>Download</DropdownMenuItem>
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
