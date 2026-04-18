// import axios from "axios";
// import { authUtils } from "./auth";

// const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// const api = axios.create({
//   baseURL: API_URL,
//   headers: { "Content-Type": "application/json" },
// });

// api.interceptors.request.use((config) => {
//   const token = authUtils.getToken();
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401 && typeof window !== "undefined") {
//       authUtils.logout();
//       window.location.href = "/login";
//     }
//     return Promise.reject(err);
//   }
// );

// export const authApi = {
//   register: (d: { email: string; password: string; name: string }) =>
//     api.post("/auth/register", d),
//   login: (d: { email: string; password: string }) =>
//     api.post("/auth/login", d),
//   getMe: () => api.get("/auth/me"),
// };

// export const restaurantApi = {
//   create: (d: object) => api.post("/restaurants/", d),
//   getMy: () => api.get("/restaurants/my"),
//   getById: (id: number) => api.get(`/restaurants/${id}`),
//   update: (id: number, d: object) => api.put(`/restaurants/${id}`, d),
//   regenerateQR: (id: number) => api.post(`/restaurants/${id}/regenerate-qr`),
// };

// export const menuApi = {
//   getItems: (restaurantId: number, categoryId?: number) =>
//     api.get(
//       `/restaurants/${restaurantId}/menu${categoryId ? `?category_id=${categoryId}` : ""}`
//     ),
//   createItem: (restaurantId: number, d: object) =>
//     api.post(`/restaurants/${restaurantId}/menu`, d),
//   updateItem: (itemId: number, d: object) => api.put(`/menu/${itemId}`, d),
//   deleteItem: (itemId: number) => api.delete(`/menu/${itemId}`),
//   rateItem: (itemId: number, rating: number) =>
//     api.post(`/menu/${itemId}/rate`, { rating }),
//   getCategories: (restaurantId: number) =>
//     api.get(`/restaurants/${restaurantId}/categories`),
//   createCategory: (restaurantId: number, d: object) =>
//     api.post(`/restaurants/${restaurantId}/categories`, d),
//   deleteCategory: (categoryId: number) =>
//     api.delete(`/categories/${categoryId}`),
// };

// export const orderApi = {
//   create: (d: object) => api.post("/orders/", d),
//   getRestaurantOrders: (restaurantId: number, status?: string) =>
//     api.get(
//       `/orders/restaurant/${restaurantId}${status ? `?order_status=${status}` : ""}`
//     ),
//   getById: (orderId: number) => api.get(`/orders/${orderId}`),
//   updateStatus: (orderId: number, status: string) =>
//     api.put(`/orders/${orderId}/status`, { status }),
// };

// export const uploadApi = {
//   uploadMenuItemImage: (itemId: number, file: File) => {
//     const fd = new FormData();
//     fd.append("file", file);
//     return api.post(`/upload/image/menu-item/${itemId}`, fd, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//   },
//   uploadMenuItemModel: (itemId: number, file: File) => {
//     const fd = new FormData();
//     fd.append("file", file);
//     return api.post(`/upload/model/menu-item/${itemId}`, fd, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//   },
//   uploadRestaurantLogo: (restaurantId: number, file: File) => {
//     const fd = new FormData();
//     fd.append("file", file);
//     return api.post(`/upload/logo/restaurant/${restaurantId}`, fd, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//   },
// };

// export { API_URL };
// export default api;
import axios from "axios";
import { authUtils } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = authUtils.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      authUtils.logout();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  register: (d: { email: string; password: string; name: string }) =>
    api.post("/auth/register", d),
  login: (d: { email: string; password: string }) =>
    api.post("/auth/login", d),
  getMe: () => api.get("/auth/me"),
};

export const restaurantApi = {
  create: (d: object) => api.post("/restaurants/", d),
  getMy: () => api.get("/restaurants/my"),
  getById: (id: number) => api.get(`/restaurants/${id}`),
  update: (id: number, d: object) => api.put(`/restaurants/${id}`, d),
  regenerateQR: (id: number) => api.post(`/restaurants/${id}/regenerate-qr`),
};

export const menuApi = {
  // ✅ Fixed: /restaurants/{id}/menu → /menu/restaurants/{id}/menu
  getItems: (restaurantId: number, categoryId?: number) =>
    api.get(
      `/menu/restaurants/${restaurantId}/menu${categoryId ? `?category_id=${categoryId}` : ""}`
    ),
  // ✅ Fixed: /restaurants/{id}/menu → /menu/restaurants/{id}/menu
  createItem: (restaurantId: number, d: object) =>
    api.post(`/menu/restaurants/${restaurantId}/menu`, d),
  // ✅ Fixed: /menu/{id} → /menu/menu/{id}
  updateItem: (itemId: number, d: object) => api.put(`/menu/menu/${itemId}`, d),
  // ✅ Fixed: /menu/{id} → /menu/menu/{id}
  deleteItem: (itemId: number) => api.delete(`/menu/menu/${itemId}`),
  // ✅ Fixed: /menu/{id}/rate → /menu/menu/{id}/rate
  rateItem: (itemId: number, rating: number) =>
    api.post(`/menu/menu/${itemId}/rate`, { rating }),
  // ✅ Fixed: /restaurants/{id}/categories → /menu/restaurants/{id}/categories
  getCategories: (restaurantId: number) =>
    api.get(`/menu/restaurants/${restaurantId}/categories`),
  // ✅ Fixed: /restaurants/{id}/categories → /menu/restaurants/{id}/categories
  createCategory: (restaurantId: number, d: object) =>
    api.post(`/menu/restaurants/${restaurantId}/categories`, d),
  // ✅ Fixed: /categories/{id} → /menu/categories/{id}
  deleteCategory: (categoryId: number) =>
    api.delete(`/menu/categories/${categoryId}`),
};

export const orderApi = {
  create: (d: object) => api.post("/orders/", d),
  getRestaurantOrders: (restaurantId: number, status?: string) =>
    api.get(
      `/orders/restaurant/${restaurantId}${status ? `?order_status=${status}` : ""}`
    ),
  getById: (orderId: number) => api.get(`/orders/${orderId}`),
  updateStatus: (orderId: number, status: string) =>
    api.put(`/orders/${orderId}/status`, { status }),
};

export const uploadApi = {
  uploadMenuItemImage: (itemId: number, file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return api.post(`/upload/image/menu-item/${itemId}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  uploadMenuItemModel: (itemId: number, file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return api.post(`/upload/model/menu-item/${itemId}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  uploadRestaurantLogo: (restaurantId: number, file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return api.post(`/upload/logo/restaurant/${restaurantId}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export { API_URL };
export default api;
