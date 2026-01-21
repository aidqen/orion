import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserChats } from "@/lib/supabase/chats";
import { useUser } from "@/contexts";
import { Chat } from "@/types/chat";

export function useChats() {
  const { user, authenticated } = useUser();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["chats", user?.id],
    queryFn: async () => {
      if (!authenticated || !user) {
        return [];
      }
      const userChats = await getUserChats(user.id);
      return userChats;
    },
    enabled: !!authenticated && !!user,
    staleTime: 1000 * 60 * 5, 
  });

  const addOptimisticChat = (chat: Chat) => {
    queryClient.setQueryData<Chat[]>(["chats", user?.id], (old = []) => [
      chat,
      ...old,
    ]);
  };

  return {
    chats: data ?? [],
    loading: isLoading,
    error: error as Error | null,
    refetch,
    addOptimisticChat
  };
}

