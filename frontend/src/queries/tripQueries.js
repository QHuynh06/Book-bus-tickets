import { useTripSearch } from "../hooks/useTrips";

export { useTrip } from "../hooks/useTrips";

export function useSearchTrips(from, to, date) {
  return useTripSearch({ from, to, date });
}
