import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createTodo,
  deleteTodo,
  getTodos,
  toggleTodo,
  updateTodo,
} from "@/features/todo/api/todoApi.js";

const KEY = ["todos"];

export const useTodos = (params) =>
  useQuery({
    queryKey: [...KEY, params],
    queryFn: () => getTodos(params),
    placeholderData: keepPreviousData,
  });

function useTodoMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export const useCreateTodo = () => useTodoMutation(createTodo);
export const useUpdateTodo = () => useTodoMutation(updateTodo);
export const useDeleteTodo = () => useTodoMutation(deleteTodo);

export function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleTodo,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: KEY });
      const snapshot = queryClient.getQueriesData({ queryKey: KEY });

      queryClient.setQueriesData({ queryKey: KEY }, (data) =>
        data
          ? {
              ...data,
              items: data.items.map((t) =>
                t.id === id ? { ...t, done: !t.done } : t,
              ),
            }
          : data,
      );

      return { snapshot };
    },
    onError: (_error, _id, context) => {
      context?.snapshot.forEach(([key, data]) =>
        queryClient.setQueryData(key, data),
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}
