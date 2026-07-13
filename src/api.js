const API_BASE = "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("auth_token");
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// Auth
export const authAPI = {
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (userData) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  getMe: () => request("/auth/me"),
};

// Categories
export const categoryAPI = {
  getAll: () => request("/categories"),
};

// Services
export const serviceAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/services${query ? `?${query}` : ""}`);
  },
  getById: (id) => request(`/services/${id}`),
  create: (data) =>
    request("/services", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/services/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/services/${id}`, { method: "DELETE" }),
};

// Users (admin)
export const userAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/users${query ? `?${query}` : ""}`);
  },
  getById: (id) => request(`/users/${id}`),
  update: (id, data) =>
    request(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  toggleStatus: (id) =>
    request(`/users/${id}/toggle-status`, { method: "PUT" }),
};

// Bookings
export const bookingAPI = {
  create: (data) =>
    request("/bookings", { method: "POST", body: JSON.stringify(data) }),
  getAll: () => request("/bookings"),
  getById: (id) => request(`/bookings/${id}`),
  updateStatus: (id, data) =>
    request(`/bookings/${id}`, { method: "PUT", body: JSON.stringify(data) }),
};

// Reviews
export const reviewAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/reviews${query ? `?${query}` : ""}`);
  },
  create: (data) =>
    request("/reviews", { method: "POST", body: JSON.stringify(data) }),
};

// Payments
export const paymentAPI = {
  getAll: () => request("/payments"),
  create: (data) =>
    request("/payments", { method: "POST", body: JSON.stringify(data) }),
};

// Notifications
export const notificationAPI = {
  getAll: () => request("/notifications"),
  getUnreadCount: () => request("/notifications/unread-count"),
  markAsRead: (id) => request(`/notifications/${id}/read`, { method: "PUT" }),
  markAllAsRead: () => request("/notifications/read-all", { method: "PUT" }),
};

// Favorites
export const favoriteAPI = {
  getAll: () => request("/favorites"),
  add: (providerId) =>
    request("/favorites", {
      method: "POST",
      body: JSON.stringify({ providerId }),
    }),
  remove: (providerId) =>
    request(`/favorites/${providerId}`, { method: "DELETE" }),
};

// Payouts
export const payoutAPI = {
  getAll: () => request("/payouts"),
  request: (data) =>
    request("/payouts", { method: "POST", body: JSON.stringify(data) }),
};
