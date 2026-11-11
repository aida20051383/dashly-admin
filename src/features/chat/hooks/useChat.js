import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getConversation,
  getConversations,
  markConversationRead,
  receiveReply,
  sendMessage,
} from "@/features/chat/api/chatApi.js";

const KEY = ["chat"];

export const useConversations = (params) =>
  useQuery({
    queryKey: [...KEY, "list", params],
    queryFn: () => getConversations(params),
    placeholderData: keepPreviousData,
  });

export const useConversation = (id) =>
  useQuery({
    queryKey: [...KEY, "thread", id],
    queryFn: () => getConversation(id),
    enabled: id != null,
  });

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,
    onMutate: async ({ id, text }) => {
      await queryClient.cancelQueries({ queryKey: KEY });
      const key = [...KEY, "thread", id];
      const previous = queryClient.getQueryData(key);

      queryClient.setQueryData(key, (data) =>
        data
          ? {
              ...data,
              messages: [
                ...data.messages,
                {
                  id: `tmp-${Date.now()}`,
                  from: "me",
                  text: text.trim(),
                  at: Date.now(),
                  pending: true,
                },
              ],
            }
          : data,
      );

      return { key, previous };
    },
    onError: (_error, _vars, context) => {
      if (context) queryClient.setQueryData(context.key, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

function useChatMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export const useReceiveReply = () => useChatMutation(receiveReply);
export const useMarkConversationRead = () =>
  useChatMutation(markConversationRead);
