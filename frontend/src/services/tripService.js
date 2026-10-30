import { tripApi } from "../api/tripApi";

/*
 * API của backend:
 *   GET /trips?from=TP.HCM&to=Đà Nẵng&date=2026-10-05   ->  Trip[]   (bắt buộc đủ from, to, date;
 *                                                          from/to là tên thành phố đúng như trong bảng routes)
 *   GET /trips/{id}                                    ->  Trip
 * Trip = { id, departureTime, arrivalTime, price, status,
 *          route: { departureCity, destinationCity, departureStation, destinationStation, durationMinutes },
 *          bus:   { busType, seatCount } }
 * (Backend chưa trả số chỗ trống nên availableSeats có thể không có.)
 */

export async function searchTrips({ from, to, date }) {
  if (!from || !to) throw new Error("Vui lòng chọn cả điểm đi và điểm đến để tìm chuyến.");
  return tripApi.searchTrips({ from, to, date });
}

export async function getTripById(id) {
  return tripApi.getTripById(id);
}
