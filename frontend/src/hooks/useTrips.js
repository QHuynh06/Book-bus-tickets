import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { adminTripApi } from "../api/adminTripApi";
import { tripApi } from "../api/tripApi";
import { queryKeys } from "./queryKeys";

export function useTrip(tripId) {
  return useQuery({
    queryKey: queryKeys.trips.detail(tripId),
    queryFn: () => tripApi.getTripById(tripId),
    enabled: Boolean(tripId),
  });
}

export function useTripSearch(params) {
  return useQuery({
    queryKey: queryKeys.trips.search(params),
    queryFn: () => tripApi.searchTrips(params),
    enabled: Boolean(params?.from && params?.to && params?.date),
  });
}

export function useAdminTrips() {
  return useQuery({
    queryKey: queryKeys.trips.admin,
    queryFn: adminTripApi.getAdminTrips,
  });
}

export function useAdminTrip(tripId) {
  return useQuery({
    queryKey: queryKeys.trips.adminDetail(tripId),
    queryFn: () => adminTripApi.getAdminTripById(tripId),
    enabled: Boolean(tripId),
  });
}

export function useCreateAdminTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminTripApi.createAdminTrip,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.trips.admin }),
        queryClient.invalidateQueries({ queryKey: queryKeys.trips.all }),
      ]),
  });
}

export function useUpdateAdminTrip(tripId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (trip) => adminTripApi.updateAdminTrip(tripId, trip),
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.trips.admin }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.trips.adminDetail(tripId),
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.trips.all }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.seats.trip(tripId),
        }),
      ]),
  });
}

export function useDeleteAdminTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminTripApi.deleteAdminTrip,
    onSuccess: (_, tripId) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.trips.admin }),
        queryClient.removeQueries({
          queryKey: queryKeys.trips.adminDetail(tripId),
        }),
        queryClient.removeQueries({
          queryKey: queryKeys.trips.detail(tripId),
        }),
        queryClient.removeQueries({
          queryKey: queryKeys.seats.trip(tripId),
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.trips.all }),
      ]),
  });
}
