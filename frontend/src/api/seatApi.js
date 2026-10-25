import axiosClient from "./axiosClient";

export const seatApi = {
  getTripSeats: async (tripId) =>
    (await axiosClient.get(`/trips/${tripId}/seats`)).data,
};
