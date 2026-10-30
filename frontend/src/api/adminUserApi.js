import axiosClient from "./axiosClient";

export const adminUserApi = {
  getAdminUsers: async () =>
    (await axiosClient.get("/admin/users")).data,

  getAdminUserById: async (id) =>
    (await axiosClient.get(`/admin/users/${id}`)).data,

  updateAdminUserRole: async (id, role) =>
    (await axiosClient.put(`/admin/users/${id}/role`, { role })).data,
};
