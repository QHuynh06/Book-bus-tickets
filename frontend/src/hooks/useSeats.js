import { useQuery } from "@tanstack/react-query";
import { seatApi } from "../api/seatApi";
import { queryKeys } from "./queryKeys";

export function useTripSeats(tripId) {
  return useQuery({
    queryKey: queryKeys.seats.trip(tripId),
    queryFn: () => seatApi.getTripSeats(tripId),
    enabled: Boolean(tripId),
    refetchInterval: 3_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: "always",
    refetchOnReconnect: "always",
  });
}
