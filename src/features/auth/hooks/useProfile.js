import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/AuthContext.jsx";
import { changePassword, updateProfile } from "@/features/auth/api/authApi.js";

export function useUpdateProfile() {
  const { user, updateUser } = useAuth();
  return useMutation({
    mutationFn: (values) => updateProfile({ id: user.id, ...values }),
    onSuccess: (updated) => updateUser(updated),
  });
}

export function useChangePassword() {
  const { user } = useAuth();
  return useMutation({
    mutationFn: (values) => changePassword({ id: user.id, ...values }),
  });
}
