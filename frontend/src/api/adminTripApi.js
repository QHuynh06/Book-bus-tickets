import axiosClient from "./axiosClient";

export const adminTripApi = {
  getAdminTrips: async () =>
    (await axiosClient.get("/admin/trips")).data,

  getAdminTripById: async (id) =>
    (await axiosClient.get(`/admin/trips/${id}`)).data,

  createAdminTrip: async (trip) =>
    (await axiosClient.post("/admin/trips", trip)).data,

  updateAdminTrip: async (id, trip) =>
    (await axiosClient.put(`/admin/trips/${id}`, trip)).data,

  deleteAdminTrip: async (id) =>
    (await axiosClient.delete(`/admin/trips/${id}`)).data,
};
