export async function generateAndSaveChatTitle(chatId: string, firstMessage: string): Promise<{ title: string }> {
  const response = await fetch('/api/chat/generate-title', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, firstMessage }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate chat title');
  }

  return response.json();
}
