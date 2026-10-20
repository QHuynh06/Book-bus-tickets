import axios from "axios";

// Khóa lưu phiên đăng nhập (dùng chung với utils/auth.js và contexts/AuthContext.jsx)
const TOKEN_KEY = "accessToken";
const ROLE_KEY = "userRole";
const USER_KEY = "bus_ticket_user";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Trước mỗi request: gắn JWT vào header
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Token hết hạn / không hợp lệ (401): xóa phiên và chuyển về trang đăng nhập
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.includes("/auth/");

    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(ROLE_KEY);
      localStorage.removeItem(USER_KEY);

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
