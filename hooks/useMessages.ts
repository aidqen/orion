import { useChat } from "@ai-sdk/react";
import { generateId, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { AI_MODEL } from "@/constants/chat.constant";
import { useDataStream } from "@/contexts/DataStreamContext";
import { getChatMessages } from "@/data/messages";
import { useArtifactStore } from "@/store/useArtifactStore";
import { useChatStore } from "@/store/useChatStore";
import type { ChatMessage, FileUIPartWithId, MessageInput } from "@/types/chat";
import { saveLatestMessages } from "@/utils/messages";
import { useChats } from "./useChats";

interface MessagePart {
	type: "file" | "text";
	url?: string;
	mediaType?: string;
	text?: string;
}

function buildMessageParts(
	files: FileUIPartWithId[],
	text?: string,
): MessagePart[] {
	const parts: MessagePart[] = [];

	for (const file of files) {
		if (file.mediaType?.startsWith("image/")) {
			parts.push({
				type: "file",
				url: file.url,
				mediaType: file.mediaType,
			});
		}
	}

	if (text?.trim()) {
		parts.push({ type: "text", text: text.trim() });
	}

	return parts;
}

export function useMessages(chatId: string) {
	const [input, setInput] = useState("");
	const pendingMessage = useChatStore((state) => state.pendingMessage);
	const isNewChatInitialized = useRef(false);
	const hasFetchedMessages = useRef(false);
	const savedMessageIds = useRef(new Set<string>());
	const artifactIdRef = useRef<string | null>(null);

	const setPendingMessage = useChatStore((state) => state.setPendingMessage);
	const closeArtifact = useArtifactStore((state) => state.closeArtifact);
	const reconstructArtifacts = useArtifactStore(
		(state) => state.reconstructArtifacts,
	);
	const { setDataStream } = useDataStream();
	const { generateChatTitle } = useChats();

	const {
		messages,
		status,
		stop,
		sendMessage,
		setMessages,
		error,
		regenerate,
	} = useChat({
		id: chatId,
		generateId: () => generateId(),
		onFinish: async ({ messages: allMessages }) => {
			const lastAssistantMessage = allMessages
				.slice()
				.reverse()
				.find((msg) => msg.role === "assistant");

			if (
				lastAssistantMessage &&
				!savedMessageIds.current.has(lastAssistantMessage.id)
			) {
				try {
					await saveLatestMessages(chatId, allMessages, AI_MODEL);
					savedMessageIds.current.add(lastAssistantMessage.id);
				} catch (error) {
					console.error("❌ Error saving messages:", error);
				}
			}
		},
		onData: (data) => {
			setDataStream((ds) => [...ds, data]);
		},
	});

	useEffect(() => {
		hasFetchedMessages.current = false;
		savedMessageIds.current = new Set();
		artifactIdRef.current = null;
		closeArtifact();

		if (pendingMessage && !isNewChatInitialized.current) {
			initializeNewChat();
		} else {
			fetchChatMessages();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chatId, closeArtifact]);

	async function initializeNewChat() {
		isNewChatInitialized.current = true;
		handleSendMessage(pendingMessage as MessageInput);
		generateChatTitle(chatId, pendingMessage as MessageInput);
		setPendingMessage(null);
	}

	async function fetchChatMessages() {
		if (!hasFetchedMessages.current) {
			try {
				const fetchedMessages = await getChatMessages(chatId);
				if (fetchedMessages.length > 0) {
					setMessages(fetchedMessages as UIMessage[]);

					reconstructArtifacts(fetchedMessages as UIMessage[]);
				}
			} catch (error) {
				console.error("Error fetching chat messages:", error);
			} finally {
				hasFetchedMessages.current = true;
			}
		}
	}

	function handleSendMessage(message: MessageInput) {
		const messageText = message.text || input;
		const files = message.files || [];

		const parts = buildMessageParts(files, messageText);

		if (parts.length > 0) {
			setInput("");
			sendMessage({ parts } as UIMessage, { body: { chatId } });
		}
	}

	return {
		input,
		setInput,
		messages: messages as ChatMessage[],
		status,
		error,
		stop,
		reload: regenerate,
		handleSendMessage,
	};
}
