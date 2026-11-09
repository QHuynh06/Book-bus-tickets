import axiosClient from "./axiosClient";

export const adminBusApi = {
  getAdminBuses: async () =>
    (await axiosClient.get("/admin/buses")).data,

  getAdminBusById: async (id) =>
    (await axiosClient.get(`/admin/buses/${id}`)).data,

  createAdminBus: async (bus) =>
    (await axiosClient.post("/admin/buses", bus)).data,

  updateAdminBus: async (id, bus) =>
    (await axiosClient.put(`/admin/buses/${id}`, bus)).data,

  deleteAdminBus: async (id) =>
    (await axiosClient.delete(`/admin/buses/${id}`)).data,
};
