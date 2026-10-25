import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { adminRouteApi } from "../api/adminRouteApi";
import { queryKeys } from "./queryKeys";

export function useRoutes() {
  return useQuery({
    queryKey: queryKeys.routes.all,
    queryFn: adminRouteApi.getAdminRoutes
  });
}

export function useRoute(routeId) {
  return useQuery({
    queryKey: queryKeys.routes.detail(routeId),
    queryFn: () => adminRouteApi.getAdminRouteById(routeId),
    enabled: Boolean(routeId),
  });
}

export function useCreateRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminRouteApi.createAdminRoute,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.routes.all }),
  });
}

export function useUpdateRoute(routeId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (route) => adminRouteApi.updateAdminRoute(routeId, route),
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.routes.all }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.routes.detail(routeId),
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.trips.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.trips.admin }),
      ]),
  });
}

export function useDeleteRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminRouteApi.deleteAdminRoute,
    onSuccess: (_, routeId) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.routes.all }),
        queryClient.removeQueries({ queryKey: queryKeys.routes.detail(routeId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.trips.admin }),
      ]),
  });
}
