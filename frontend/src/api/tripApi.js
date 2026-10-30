import axiosClient from "./axiosClient";

export const tripApi = {
  searchTrips: async ({ from, to, date }) =>
    (await axiosClient.get("/trips", {
      params: { from, to, date },
    })).data,

  getTripById: async (id) =>
    (await axiosClient.get(`/trips/${id}`)).data,
};
