import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getAllBookings,
  confirmAdminBooking,
} from "../api/adminBookingApi";

// Query Keys
export const adminBookingKeys = {
  all: ["admin", "bookings"],
};

// Lấy danh sách booking dành cho Admin.
export function useAdminBookings() {
  return useQuery({
    queryKey: adminBookingKeys.all,
    queryFn: getAllBookings,
  });
}

// Xác nhận booking.
export function useConfirmAdminBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmAdminBooking,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminBookingKeys.all,
      });
    },
  });
}