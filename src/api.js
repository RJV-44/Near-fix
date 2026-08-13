const API_BASE = "http://localhost:5000/api";

const normalizeRole = (role) => {
  const value = String(role || "").toLowerCase();
  if (value === "admin" || value === "provider" || value === "customer")
    return value;
  return "customer";
};

const mockUsers = {
  "admin@example.com": {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    password: "admin123",
  },
  "provider@example.com": {
    id: 2,
    name: "Provider User",
    email: "provider@example.com",
    role: "provider",
    password: "provider123",
  },
  "customer@example.com": {
    id: 3,
    name: "Customer User",
    email: "customer@example.com",
    role: "customer",
    password: "customer123",
  },
};

function getMockFallback(endpoint, options = {}) {
  try {
    const body = options.body ? JSON.parse(options.body) : {};

    if (endpoint === "/auth/register") {
      const email = String(body.email || "")
        .trim()
        .toLowerCase();
      const password = String(body.password || "");
      if (!email || !password) {
        throw new Error("Please provide your name, email, and password");
      }

      const role = normalizeRole(body.role);
      const user = {
        id: Date.now(),
        name: body.name || email.split("@")[0],
        email,
        role,
        password,
      };

      mockUsers[email] = user;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: `mock-${user.role}-token`,
      };
    }

    if (endpoint === "/auth/login") {
      const email = String(body.email || "")
        .trim()
        .toLowerCase();
      const user = mockUsers[email];
      if (user && user.password === body.password) {
        const role = normalizeRole(body.role || user.role);
        const authUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          role,
        };
        const token = `mock-${role}-token`;
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_user", JSON.stringify(authUser));
        return { ...authUser, token };
      }
      throw new Error("Invalid email or password");
    }

    if (endpoint === "/auth/me") {
      const stored = localStorage.getItem("auth_user");
      if (stored) {
        return JSON.parse(stored);
      }
      throw new Error("Not authenticated");
    }
  } catch {
    // Ignore and let the caller handle the failure.
  }

  return null;
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("auth_token");
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    let data = {};

    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
  } catch (error) {
    const fallback = getMockFallback(endpoint, options);
    if (fallback) return fallback;
    throw error;
  }
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
