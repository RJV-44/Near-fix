  const API_BASE = "http://localhost:5000/api";

const normalizeRole = (role) => {
  const value = String(role || "").toLowerCase();
  if (value === "admin" || value === "provider" || value === "customer")
    return value;
  return "customer";
};

const initialUsers = {
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
    businessName: "Pro Services",
  },
  "customer@example.com": {
    id: 3,
    name: "Customer User",
    email: "customer@example.com",
    role: "customer",
    password: "customer123",
  },
};

const initialCategories = [
  { id: 1, name: "Home Cleaning", icon: "🧹" },
  { id: 2, name: "Plumbing", icon: "🚰" },
  { id: 3, name: "Electrical", icon: "⚡" },
  { id: 4, name: "Appliance Repair", icon: "🧺" },
  { id: 5, name: "Painting", icon: "🎨" },
  { id: 6, name: "Handyman", icon: "🔨" },
];

const initialServices = [
  {
    id: "1",
    title: "Deep Home Cleaning",
    category: "Home Cleaning",
    categoryId: 1,
    description: "Complete deep cleaning of living area, kitchen, bathroom, and bedrooms.",
    price: 89,
    duration: "3 hours",
    image: "🧹",
    rating: "4.9",
    reviewCount: 24,
    providerId: 2,
    provider: { id: 2, name: "Provider User", businessName: "Pro Services", email: "provider@example.com" },
    isActive: true,
  },
  {
    id: "2",
    title: "Plumbing Inspection & Repair",
    category: "Plumbing",
    categoryId: 2,
    description: "Fix leaks, unblock drains, and inspect pipe connections.",
    price: 120,
    duration: "2 hours",
    image: "🚰",
    rating: "4.8",
    reviewCount: 18,
    providerId: 2,
    provider: { id: 2, name: "Provider User", businessName: "Pro Services", email: "provider@example.com" },
    isActive: true,
  },
  {
    id: "3",
    title: "Electrical Repair & Wiring",
    category: "Electrical",
    categoryId: 3,
    description: "Diagnostic, outlet repair, fixture installations, and wiring troubleshooting.",
    price: 95,
    duration: "1.5 hours",
    image: "⚡",
    rating: "4.7",
    reviewCount: 15,
    providerId: 2,
    provider: { id: 2, name: "Provider User", businessName: "Pro Services", email: "provider@example.com" },
    isActive: true,
  },
  {
    id: "4",
    title: "Washing Machine & Dryer Repair",
    category: "Appliance Repair",
    categoryId: 4,
    description: "Fixing spin cycle issues, leaks, noise, and power failures.",
    price: 110,
    duration: "2 hours",
    image: "🧺",
    rating: "4.9",
    reviewCount: 30,
    providerId: 2,
    provider: { id: 2, name: "Provider User", businessName: "Pro Services", email: "provider@example.com" },
    isActive: true,
  },
  {
    id: "5",
    title: "Full House Interior Painting",
    category: "Painting",
    categoryId: 5,
    description: "Wall preparation, prime coat, and premium double-coat wall paint.",
    price: 350,
    duration: "1 day",
    image: "🎨",
    rating: "4.8",
    reviewCount: 10,
    providerId: 2,
    provider: { id: 2, name: "Provider User", businessName: "Pro Services", email: "provider@example.com" },
    isActive: true,
  },
  {
    id: "6",
    title: "Furniture Assembly & Handyman",
    category: "Handyman",
    categoryId: 6,
    description: "Assembling flat-pack furniture, TV mounting, and wall hanging.",
    price: 75,
    duration: "1 hour",
    image: "🔨",
    rating: "4.6",
    reviewCount: 8,
    providerId: 2,
    provider: { id: 2, name: "Provider User", businessName: "Pro Services", email: "provider@example.com" },
    isActive: true,
  },
];

const initialBookings = [
  {
    id: "101",
    serviceId: "1",
    service: { id: "1", title: "Deep Home Cleaning", category: "Home Cleaning", price: 89 },
    customerId: 3,
    customer: { id: 3, name: "Customer User", email: "customer@example.com" },
    providerId: 2,
    provider: { id: 2, name: "Provider User", businessName: "Pro Services", email: "provider@example.com" },
    date: "2026-08-25",
    time: "10:00 AM",
    address: "123 Main St, Apartment 4B",
    notes: "Please bring eco-friendly products",
    totalPrice: 89,
    status: "confirmed",
    createdAt: "2026-08-18T10:00:00Z"
  }
];

function getStored(key, fallback) {
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return fallback;
  }
}

function setStored(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

function getMockFallback(endpoint, options = {}) {
  try {
    const [path, queryString] = endpoint.split("?");
    const params = new URLSearchParams(queryString || "");
    const body = options.body ? JSON.parse(options.body) : {};
    const method = (options.method || "GET").toUpperCase();
    const storedAuth = localStorage.getItem("auth_user");
    const currentUser = storedAuth ? JSON.parse(storedAuth) : null;
    const usersMap = getStored("local_mock_users", initialUsers);

    // AUTH
    if (path === "/auth/register" && method === "POST") {
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      if (!email || !password) {
        throw new Error("Please provide name, email, and password");
      }
      const role = normalizeRole(body.role);
      const user = {
        id: Date.now(),
        name: body.name || email.split("@")[0],
        email,
        role,
        password,
        businessName: body.businessName || `${body.name || 'Provider'} Services`,
        serviceCategory: body.serviceCategory || ''
      };
      usersMap[email] = user;
      setStored("local_mock_users", usersMap);
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: `mock-${user.role}-token`,
      };
    }

    if (path === "/auth/login" && method === "POST") {
      const email = String(body.email || "").trim().toLowerCase();
      let user = usersMap[email];
      if (!user) {
        if (!email || !body.password) {
          throw new Error("Please provide email and password");
        }
        user = {
          id: Date.now(),
          name: email.split("@")[0],
          email,
          role: normalizeRole(body.role),
          password: body.password,
          businessName: `${email.split("@")[0]} Services`
        };
        usersMap[email] = user;
        setStored("local_mock_users", usersMap);
      } else if (user.password !== body.password) {
        throw new Error("Invalid email or password");
      }

      const roleToUse = body.role ? normalizeRole(body.role) : normalizeRole(user.role);
      if (roleToUse !== user.role) {
        user.role = roleToUse;
        usersMap[email] = user;
        setStored("local_mock_users", usersMap);
      }

      const authUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        businessName: user.businessName || `${user.name} Services`
      };
      const token = `mock-${user.role}-token`;
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(authUser));
      return { ...authUser, token };
    }

    if (path === "/auth/me" && method === "GET") {
      if (currentUser) return currentUser;
      throw new Error("Not authenticated");
    }

    // CATEGORIES
    if (path === "/categories" && method === "GET") {
      return initialCategories;
    }

    // SERVICES
    if (path === "/services" && method === "GET") {
      let services = getStored("local_services_data", initialServices);
      if (params.get("mine") === "true") {
        if (currentUser) {
          const filtered = services.filter(
            (s) => String(s.providerId) === String(currentUser.id) || s.provider?.email === currentUser.email
          );
          return filtered;
        }
        return services;
      }
      if (params.get("category")) {
        const cat = params.get("category").toLowerCase();
        services = services.filter((s) => String(s.category).toLowerCase() === cat);
      }
      return services;
    }

    if (path === "/services" && method === "POST") {
      const services = getStored("local_services_data", initialServices);
      const providerId = currentUser?.id || 2;
      const newService = {
        id: String(Date.now()),
        title: body.title,
        category: body.category,
        categoryId: body.categoryId || null,
        description: body.description,
        price: parseFloat(body.price || 0),
        duration: body.duration || "",
        image: "🛠️",
        rating: "5.0",
        reviewCount: 0,
        providerId: providerId,
        provider: {
          id: providerId,
          name: currentUser?.name || "Provider User",
          businessName: currentUser?.businessName || `${currentUser?.name || "Provider"} Services`,
          email: currentUser?.email || "provider@example.com",
        },
        isActive: true,
      };
      services.unshift(newService);
      setStored("local_services_data", services);
      return newService;
    }

    if (path.startsWith("/services/")) {
      const serviceId = path.split("/")[2];
      let services = getStored("local_services_data", initialServices);
      const index = services.findIndex((s) => String(s.id) === String(serviceId));

      if (method === "GET") {
        if (index >= 0) return services[index];
        throw new Error("Service not found");
      }
      if (method === "PUT") {
        if (index >= 0) {
          services[index] = { ...services[index], ...body, price: parseFloat(body.price || services[index].price) };
          setStored("local_services_data", services);
          return services[index];
        }
        throw new Error("Service not found");
      }
      if (method === "DELETE") {
        if (index >= 0) {
          services.splice(index, 1);
          setStored("local_services_data", services);
          return { success: true };
        }
        throw new Error("Service not found");
      }
    }

    // BOOKINGS
    if (path === "/bookings" && method === "GET") {
      let bookings = getStored("local_bookings_data", initialBookings);
      if (currentUser?.role === "provider") {
        const filtered = bookings.filter(
          (b) => String(b.providerId) === String(currentUser.id) || b.provider?.email === currentUser.email
        );
        return filtered.length > 0 ? filtered : bookings;
      }
      if (currentUser?.role === "customer") {
        const filtered = bookings.filter(
          (b) => String(b.customerId) === String(currentUser.id) || b.customer?.email === currentUser.email
        );
        return filtered;
      }
      return bookings;
    }

    if (path === "/bookings" && method === "POST") {
      const bookings = getStored("local_bookings_data", initialBookings);
      const services = getStored("local_services_data", initialServices);
      const service = services.find((s) => String(s.id) === String(body.serviceId));

      const providerId = service?.providerId || body.providerId || 2;
      const providerInfo = service?.provider || {
        id: providerId,
        name: "Provider User",
        businessName: "Pro Services",
        email: "provider@example.com",
      };

      const newBooking = {
        id: String(Date.now()),
        serviceId: body.serviceId,
        service: service
          ? { id: service.id, title: service.title, category: service.category, price: service.price }
          : { id: body.serviceId, title: "Requested Service", price: body.totalPrice || 0 },
        customerId: currentUser?.id || 3,
        customer: {
          id: currentUser?.id || 3,
          name: currentUser?.name || "Customer User",
          email: currentUser?.email || "customer@example.com",
        },
        providerId: providerId,
        provider: providerInfo,
        date: body.date,
        time: body.time,
        address: body.address,
        notes: body.notes,
        totalPrice: parseFloat(body.totalPrice || service?.price || 0),
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      bookings.unshift(newBooking);
      setStored("local_bookings_data", bookings);
      return newBooking;
    }

    if (path.startsWith("/bookings/")) {
      const bookingId = path.split("/")[2];
      let bookings = getStored("local_bookings_data", initialBookings);
      const index = bookings.findIndex((b) => String(b.id) === String(bookingId));

      if (method === "GET") {
        if (index >= 0) return bookings[index];
        throw new Error("Booking not found");
      }
      if (method === "PUT") {
        if (index >= 0) {
          bookings[index] = { ...bookings[index], ...body };
          setStored("local_bookings_data", bookings);

          if (body.status === "confirmed" || body.status === "completed") {
            const payments = getStored("local_payments_data", [
              { id: "p1", bookingId: "101", amount: 89, paidAt: new Date().toISOString() },
            ]);
            if (!payments.some((p) => String(p.bookingId) === String(bookingId))) {
              payments.unshift({
                id: String(Date.now()),
                bookingId: bookingId,
                booking: bookings[index],
                amount: bookings[index].totalPrice,
                providerId: bookings[index].providerId,
                customerId: bookings[index].customerId,
                customer: bookings[index].customer,
                paidAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
              });
              setStored("local_payments_data", payments);
            }
          }

          return bookings[index];
        }
        throw new Error("Booking not found");
      }
    }

    // PAYMENTS
    if (path === "/payments" && method === "GET") {
      let payments = getStored("local_payments_data", [
        { id: "p1", bookingId: "101", amount: 89, customer: { name: "Customer User" }, paidAt: new Date().toISOString() },
      ]);
      return payments;
    }

    if (path === "/payments" && method === "POST") {
      let payments = getStored("local_payments_data", []);
      const newPayment = { id: String(Date.now()), ...body, paidAt: new Date().toISOString() };
      payments.unshift(newPayment);
      setStored("local_payments_data", payments);
      return newPayment;
    }

    // REVIEWS
    if (path === "/reviews" && method === "GET") {
      return getStored("local_reviews_data", [
        { id: "r1", rating: 5, comment: "Great service and very professional!", customer: { name: "Customer User" }, service: { title: "Deep Home Cleaning" } },
      ]);
    }

    if (path === "/reviews" && method === "POST") {
      let reviews = getStored("local_reviews_data", []);
      const newReview = { id: String(Date.now()), ...body, customer: { name: currentUser?.name || "Customer User" } };
      reviews.unshift(newReview);
      setStored("local_reviews_data", reviews);
      return newReview;
    }

    // FAVORITES
    if (path === "/favorites" && method === "GET") {
      return getStored("local_favorites_data", [
        { id: "f1", provider: { id: 2, name: "Provider User", businessName: "Pro Services", rating: "4.9", serviceCategory: "Home Services" } },
      ]);
    }

    if (path === "/favorites" && method === "POST") {
      let favorites = getStored("local_favorites_data", []);
      const newFav = { id: String(Date.now()), providerId: body.providerId, provider: { id: body.providerId, name: "Provider User", businessName: "Pro Services" } };
      favorites.push(newFav);
      setStored("local_favorites_data", favorites);
      return newFav;
    }

    if (path.startsWith("/favorites/") && method === "DELETE") {
      const providerId = path.split("/")[2];
      let favorites = getStored("local_favorites_data", []);
      favorites = favorites.filter((f) => String(f.providerId) !== String(providerId) && String(f.provider?.id) !== String(providerId));
      setStored("local_favorites_data", favorites);
      return { success: true };
    }

    // NOTIFICATIONS
    if (path === "/notifications" && method === "GET") {
      return getStored("local_notifications_data", [
        { id: "n1", title: "New Booking", message: "You have a new service request.", read: false, createdAt: new Date().toISOString() },
      ]);
    }

    if (path === "/notifications/unread-count" && method === "GET") {
      const notifications = getStored("local_notifications_data", []);
      return { count: notifications.filter((n) => !n.read).length };
    }

    // PAYOUTS
    if (path === "/payouts") {
      return { success: true };
    }
  } catch (err) {
    // Let request throw or handle
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
  login: (email, password, role) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, role }),
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
