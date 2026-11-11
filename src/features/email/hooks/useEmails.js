import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deleteEmail,
  getEmail,
  getEmails,
  markRead,
  restoreEmail,
  sendEmail,
  toggleStar,
  trashEmail,
} from "@/features/email/api/emailApi.js";

const KEY = ["emails"];

export const useEmails = (params) =>
  useQuery({
    queryKey: [...KEY, "list", params],
    queryFn: () => getEmails(params),
    placeholderData: keepPreviousData,
  });

export const useEmail = (id) =>
  useQuery({
    queryKey: [...KEY, "detail", id],
    queryFn: () => getEmail(id),
    enabled: id != null,
  });

function useEmailMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export const useMarkRead = () => useEmailMutation(markRead);
export const useToggleStar = () => useEmailMutation(toggleStar);
export const useTrashEmail = () => useEmailMutation(trashEmail);
export const useRestoreEmail = () => useEmailMutation(restoreEmail);
export const useDeleteEmail = () => useEmailMutation(deleteEmail);
export const useSendEmail = () => useEmailMutation(sendEmail);
