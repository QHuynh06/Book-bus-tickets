import { useQuery } from "@tanstack/react-query";
import { seatApi } from "../api/seatApi";
import { queryKeys } from "./queryKeys";

// export function useTripSeats(tripId) {
//   return useQuery({
//     queryKey: queryKeys.seats.trip(tripId),
//     queryFn: () => seatApi.getTripSeats(tripId),
//     enabled: Boolean(tripId),
//     refetchInterval: 5_000,                // refetch mỗi 5 giây
//     refetchIntervalInBackground: false,    // có polling khi trang ở nền hay ko
//     refetchOnWindowFocus: "always",        // refetch khi trang được focus trở lại
//     refetchOnReconnect: "always",          // refetch khi trang được connect mạng trở lại
//   });
// }


export function useTripSeats(tripId, options = {}) {
  return useQuery({
    queryKey: queryKeys.seats.trip(tripId),
    queryFn: () => seatApi.getTripSeats(tripId),
    enabled: Boolean(tripId),
    ...options,
  });
}
