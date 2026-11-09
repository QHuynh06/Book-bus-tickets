import axiosClient from "./axiosClient";

export const adminRouteApi = {
  getAdminRoutes: async () =>
      (await axiosClient.get("/admin/routes")).data,

  getAdminRouteById: async (id) =>
      (await axiosClient.get(`/admin/routes/${id}`)).data,

  createAdminRoute: async (route) =>
      (await axiosClient.post("/admin/routes", route)).data,

  updateAdminRoute: async (id, route) =>
      (await axiosClient.put(`/admin/routes/${id}`, route)).data,

  deleteAdminRoute: async (id) =>
      (await axiosClient.delete(`/admin/routes/${id}`)).data,
};