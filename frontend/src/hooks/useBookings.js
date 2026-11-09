import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  cancelTicket,
} from "../api/bookingApi";

// Query Keys
export const bookingKeys = {
  myBookings: ["bookings", "me"],

  detail: (bookingId) => ["booking", bookingId],
};

// Lấy danh sách booking của khách hàng.
export function useMyBookings() {
  return useQuery({
    queryKey: bookingKeys.myBookings,
    queryFn: getMyBookings,
  });
}

// Lấy chi tiết một booking.
export function useBooking(bookingId) {
  return useQuery({
    queryKey: bookingKeys.detail(bookingId),
    queryFn: () => getBookingById(bookingId),
    enabled: Boolean(bookingId),
  });
}

// Tạo booking mới.
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bookingKeys.myBookings,
      });
    },
  });
}

// Hủy một ticket trong booking.
export function useCancelTicket(bookingId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId }) =>
      cancelTicket(bookingId, ticketId),

    onSuccess: (response) => {
      queryClient.setQueryData(
        bookingKeys.detail(bookingId),
        response,
      );

      queryClient.invalidateQueries({
        queryKey: bookingKeys.myBookings,
      });
    },
  });
}

// Hủy toàn bộ booking.
export function useCancelBooking(bookingId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cancelBooking(bookingId),

    onSuccess: (response) => {
      queryClient.setQueryData(
        bookingKeys.detail(bookingId),
        response,
      );

      queryClient.invalidateQueries({
        queryKey: bookingKeys.myBookings,
      });
    },
  });
}