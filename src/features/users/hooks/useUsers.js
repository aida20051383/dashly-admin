import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "@/features/users/api/usersApi.js";

export const useUsers = (params) =>
  useQuery({
    queryKey: ["users", "list", params],
    queryFn: () => getUsers(params),
    placeholderData: keepPreviousData,
  });

function useUsersMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}

export const useCreateUser = () => useUsersMutation(createUser);
export const useUpdateUser = () => useUsersMutation(updateUser);
export const useDeleteUser = () => useUsersMutation(deleteUser);
