import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { adminUserApi } from "../api/adminUserApi";
import { queryKeys } from "./queryKeys";

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: adminUserApi.getAdminUsers,
  });
}

export function useUser(userId) {
  return useQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn: () => adminUserApi.getAdminUserById(userId),
    enabled: Boolean(userId),
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }) =>
      adminUserApi.updateAdminUserRole(userId, role),
    onSuccess: (user, { userId }) => {
      queryClient.setQueryData(queryKeys.users.detail(userId), user);
      return queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}
