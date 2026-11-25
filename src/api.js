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
    isActive: true,
  },
  "provider@example.com": {
    id: 2,
    name: "Provider User",
    email: "provider@example.com",
    role: "provider",
    password: "provider123",
    businessName: "Pro Services",
    isActive: true,
  },
  "customer@example.com": {
    id: 3,
    name: "Customer User",
    email: "customer@example.com",
    role: "customer",
    password: "customer123",
    isActive: true,
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
    description:
      "Complete deep cleaning of living area, kitchen, bathroom, and bedrooms.",
    price: 89,
    duration: "3 hours",
    image: "🧹",
    rating: "4.9",
    reviewCount: 24,
    providerId: 2,
    provider: {
      id: 2,
      name: "Provider User",
      businessName: "Pro Services",
      email: "provider@example.com",
    },
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
    provider: {
      id: 2,
      name: "Provider User",
      businessName: "Pro Services",
      email: "provider@example.com",
    },
    isActive: true,
  },
  {
    id: "3",
    title: "Electrical Repair & Wiring",
    category: "Electrical",
    categoryId: 3,
    description:
      "Diagnostic, outlet repair, fixture installations, and wiring troubleshooting.",
    price: 95,
    duration: "1.5 hours",
    image: "⚡",
    rating: "4.7",
    reviewCount: 15,
    providerId: 2,
    provider: {
      id: 2,
      name: "Provider User",
      businessName: "Pro Services",
      email: "provider@example.com",
    },
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
    provider: {
      id: 2,
      name: "Provider User",
      businessName: "Pro Services",
      email: "provider@example.com",
    },
    isActive: true,
  },
  {
    id: "5",
    title: "Full House Interior Painting",
    category: "Painting",
    categoryId: 5,
    description:
      "Wall preparation, prime coat, and premium double-coat wall paint.",
    price: 350,
    duration: "1 day",
    image: "🎨",
    rating: "4.8",
    reviewCount: 10,
    providerId: 2,
    provider: {
      id: 2,
      name: "Provider User",
      businessName: "Pro Services",
      email: "provider@example.com",
    },
    isActive: true,
  },
  {
    id: "6",
    title: "Furniture Assembly & Handyman",
    category: "Handyman",
    categoryId: 6,
    description:
      "Assembling flat-pack furniture, TV mounting, and wall hanging.",
    price: 75,
    duration: "1 hour",
    image: "🔨",
    rating: "4.6",
    reviewCount: 8,
    providerId: 2,
    provider: {
      id: 2,
      name: "Provider User",
      businessName: "Pro Services",
      email: "provider@example.com",
    },
    isActive: true,
  },
];

const initialBookings = [
  {
    id: "101",
    serviceId: "1",
    service: {
      id: "1",
      title: "Deep Home Cleaning",
      category: "Home Cleaning",
      price: 89,
    },
    customerId: 3,
    customer: { id: 3, name: "Customer User", email: "customer@example.com" },
    providerId: 2,
    provider: {
      id: 2,
      name: "Provider User",
      businessName: "Pro Services",
      email: "provider@example.com",
    },
    date: "2026-08-25",
    time: "10:00 AM",
    address: "123 Main St, Apartment 4B",
    notes: "Please bring eco-friendly products",
    totalPrice: 89,
    status: "confirmed",
    createdAt: "2026-08-18T10:00:00Z",
  },
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
    const addMockNotification = (notification) => {
      const notifications = getStored("local_notifications_data", []);
      const newNotification = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        isRead: false,
        createdAt: new Date().toISOString(),
        ...notification,
      };
      notifications.unshift(newNotification);
      setStored("local_notifications_data", notifications);
      return newNotification;
    };

    // AUTH
    if (path === "/auth/register" && method === "POST") {
      const email = String(body.email || "")
        .trim()
        .toLowerCase();
      const password = String(body.password || "");
      if (!email || !password) {
        throw new Error("Please provide name, email, and password");
      }
      const role = normalizeRole(body.role);
      if (role === "admin") {
        throw new Error("Administrator accounts cannot be created through public registration");
      }
      const user = {
        id: Date.now(),
        name: body.name || email.split("@")[0],
        email,
        role,
        password,
        businessName:
          body.businessName || `${body.name || "Provider"} Services`,
        serviceCategory: body.serviceCategory || "",
        isActive: true,
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
      const email = String(body.email || "")
        .trim()
        .toLowerCase();
      const user = usersMap[email];
      if (!email || !body.password || !user || user.password !== body.password || user.isActive === false) {
        throw new Error("Invalid email or password");
      }

      const authUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        businessName: user.businessName || `${user.name} Services`,
        isActive: user.isActive !== false,
      };
      const token = `mock-${normalizeRole(user.role)}-token`;
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(authUser));
      return { ...authUser, token };
    }

    if (path === "/auth/me" && method === "GET") {
      if (currentUser) return currentUser;
      throw new Error("Not authenticated");
    }

    if (path === "/users" && method === "GET") {
      let result = Object.values(usersMap).map((user) => ({ ...user }));
      const role = params.get("role");
      const status = params.get("status");
      const search = params.get("search");

      if (role) {
        result = result.filter(
          (user) =>
            String(user.role).toLowerCase() === String(role).toLowerCase(),
        );
      }
      if (status === "active") {
        result = result.filter((user) => user.isActive !== false);
      } else if (status === "suspended") {
        result = result.filter((user) => user.isActive === false);
      }
      if (search) {
        const term = search.toLowerCase();
        result = result.filter((user) =>
          [user.name, user.email, user.businessName, user.serviceCategory]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(term)),
        );
      }

      return result.map((user) => {
        const normalized = { ...user, isActive: user.isActive !== false };
        delete normalized.password;
        return normalized;
      });
    }

    if (path.startsWith("/users/") && method === "GET") {
      const userId = path.split("/")[2];
      const email = Object.keys(usersMap).find(
        (key) => String(usersMap[key].id) === String(userId),
      );
      if (!email) throw new Error("User not found");
      const user = {
        ...usersMap[email],
        isActive: usersMap[email].isActive !== false,
      };
      delete user.password;
      return user;
    }

    // PROFILE UPDATES
    if (
      path.startsWith("/users/") &&
      method === "PUT" &&
      !path.endsWith("/toggle-status")
    ) {
      const userId = path.split("/")[2];
      const email = Object.keys(usersMap).find(
        (key) => String(usersMap[key].id) === String(userId),
      );
      if (!email) throw new Error("User not found");
      const updatedUser = {
        ...usersMap[email],
        ...body,
        id: usersMap[email].id,
        isActive: usersMap[email].isActive !== false,
      };
      delete updatedUser.password;
      usersMap[email] = {
        ...usersMap[email],
        ...body,
        isActive: usersMap[email].isActive !== false,
      };
      setStored("local_mock_users", usersMap);
      return updatedUser;
    }

    if (
      path.startsWith("/users/") &&
      method === "PUT" &&
      path.endsWith("/toggle-status")
    ) {
      const userId = path.split("/")[2];
      const email = Object.keys(usersMap).find(
        (key) => String(usersMap[key].id) === String(userId),
      );
      if (!email) throw new Error("User not found");
      usersMap[email] = {
        ...usersMap[email],
        isActive: !Boolean(usersMap[email].isActive),
      };
      setStored("local_mock_users", usersMap);
      return {
        message: `User ${usersMap[email].isActive ? "activated" : "suspended"}`,
        isActive: usersMap[email].isActive,
      };
    }

    // CATEGORIES
    if (path === "/categories" && method === "GET") {
      return getStored("local_categories_data", initialCategories);
    }

    if (path === "/categories" && method === "POST") {
      const categories = getStored("local_categories_data", initialCategories);
      const name = String(body.name || "").trim();
      if (!name) throw new Error("Category name is required");
      if (
        categories.some(
          (category) => category.name.toLowerCase() === name.toLowerCase(),
        )
      )
        throw new Error("Category already exists");
      const category = {
        id: Date.now(),
        name,
        slug: body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: body.description || "",
        icon: body.icon || "🛠️",
      };
      categories.push(category);
      setStored("local_categories_data", categories);
      return category;
    }

    // SERVICES
    if (path === "/services" && method === "GET") {
      let services = getStored("local_services_data", initialServices);
      if (params.get("mine") === "true") {
        if (currentUser) {
          const filtered = services.filter(
            (s) =>
              String(s.providerId) === String(currentUser.id) ||
              s.provider?.email === currentUser.email,
          );
          return filtered;
        }
        return services;
      }
      if (params.get("category")) {
        const cat = params.get("category").toLowerCase();
        services = services.filter(
          (s) => String(s.category).toLowerCase() === cat,
        );
      }
      if (params.get("provider")) {
        services = services.filter(
          (s) => String(s.providerId) === String(params.get("provider")),
        );
      }
      return services;
    }

    if (path === "/services" && method === "POST") {
      if (currentUser?.role !== "provider" && currentUser?.role !== "admin") {
        throw new Error("Only providers can publish services");
      }
      const services = getStored("local_services_data", initialServices);
      const providerId = currentUser.id;
      const newService = {
        id: String(Date.now()),
        title: body.title,
        category: body.category,
        categoryId: body.categoryId || null,
        description: body.description,
        price: parseFloat(body.price || 0),
        duration: body.duration || "",
        image: "🛠️",
        rating: "0.0",
        reviewCount: 0,
        providerId: providerId,
        provider: {
          id: providerId,
          name: currentUser?.name || "Provider User",
          businessName:
            currentUser?.businessName ||
            `${currentUser?.name || "Provider"} Services`,
          email: currentUser?.email || "provider@example.com",
        },
        isActive: true,
      };
      services.unshift(newService);
      setStored("local_services_data", services);
      Object.values(usersMap)
        .filter((user) => user.role === "customer" && user.isActive !== false)
        .forEach((customer) => addMockNotification({
          userId: customer.id,
          title: "New service available",
          message: `${newService.provider.businessName} added ${newService.title}.`,
          type: "promotion",
          relatedId: newService.id,
          relatedModel: "Service",
        }));
      return newService;
    }

    if (path.startsWith("/services/")) {
      const serviceId = path.split("/")[2];
      let services = getStored("local_services_data", initialServices);
      const index = services.findIndex(
        (s) => String(s.id) === String(serviceId),
      );

      if (method === "GET") {
        if (index >= 0) return services[index];
        throw new Error("Service not found");
      }
      if (method === "PUT") {
        if (index >= 0) {
          services[index] = {
            ...services[index],
            ...body,
            price: parseFloat(body.price || services[index].price),
          };
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
        const services = getStored("local_services_data", initialServices);
        const filtered = bookings.filter(
          (booking) => {
            const service = services.find(
              item => String(item.id) === String(booking.serviceId),
            )
            return String(booking.providerId) === String(currentUser.id) ||
              booking.provider?.email === currentUser.email ||
              String(service?.providerId || booking.service?.providerId) === String(currentUser.id);
          },
        );
        return filtered;
      }
      if (currentUser?.role === "customer") {
        const filtered = bookings.filter(
          (b) =>
            String(b.customerId) === String(currentUser.id) ||
            b.customer?.email === currentUser.email,
        );
        return filtered;
      }
      return bookings;
    }

    if (path === "/bookings" && method === "POST") {
      if (currentUser?.role !== "customer") {
        throw new Error("Only customers can create bookings");
      }
      const bookings = getStored("local_bookings_data", initialBookings);
      const services = getStored("local_services_data", initialServices);
      const service = services.find(
        (s) => String(s.id) === String(body.serviceId),
      );
      if (!service || service.isActive === false) {
        throw new Error("Service not found or unavailable");
      }

      const providerId = service.providerId;
      const providerInfo = service.provider;

      const newBooking = {
        id: String(Date.now()),
        serviceId: body.serviceId,
        service: {
          id: service.id,
          title: service.title,
          category: service.category,
          price: service.price,
        },
        customerId: currentUser.id,
        customer: {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
        },
        providerId: providerId,
        provider: providerInfo,
        date: body.date,
        time: body.time,
        address: body.address,
        notes: body.notes,
        totalPrice: parseFloat(service.price || 0),
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      bookings.unshift(newBooking);
      setStored("local_bookings_data", bookings);
      addMockNotification({
        userId: providerId,
        title: "New booking request",
        message: `${currentUser.name} requested ${service.title} for ${body.date} at ${body.time}.`,
        type: "booking",
        relatedId: newBooking.id,
        relatedModel: "Booking",
      });
      return newBooking;
    }

    if (path.startsWith("/bookings/")) {
      const bookingId = path.split("/")[2];
      let bookings = getStored("local_bookings_data", initialBookings);
      const index = bookings.findIndex(
        (b) => String(b.id) === String(bookingId),
      );

      if (method === "GET") {
        if (index >= 0) return bookings[index];
        throw new Error("Booking not found");
      }
      if (method === "PUT") {
        if (index >= 0) {
          const booking = bookings[index];
          const services = getStored("local_services_data", initialServices);
          const service = services.find(
            item => String(item.id) === String(booking.serviceId),
          );
          const serviceProviderId = service?.providerId || booking.service?.providerId;
          const previousStatus = booking.status;
          if (
            currentUser?.role === "provider" &&
            String(booking.providerId) !== String(currentUser.id) &&
            String(serviceProviderId) !== String(currentUser.id)
          ) {
            throw new Error("Not authorized to modify this booking");
          }
          if (currentUser?.role === "customer" && String(booking.customerId) !== String(currentUser.id)) {
            throw new Error("Not authorized to modify this booking");
          }
          if (currentUser?.role === "customer" && body.status && body.status !== "cancelled") {
            throw new Error("Customers can only cancel their bookings");
          }
          const validTransitions = {
            pending: ["confirmed", "cancelled"],
            confirmed: ["in-progress", "completed", "cancelled"],
            "in-progress": ["completed", "cancelled"],
            completed: [],
            cancelled: [],
          };
          if (body.status && body.status !== previousStatus && !validTransitions[previousStatus]?.includes(body.status)) {
            throw new Error(`Cannot change booking from ${previousStatus} to ${body.status}`);
          }
          bookings[index] = {
            ...bookings[index],
            ...(currentUser?.role === "provider" && String(serviceProviderId) === String(currentUser.id)
              ? { providerId: currentUser.id, provider: service?.provider || booking.provider }
              : {}),
            ...body,
          };
          setStored("local_bookings_data", bookings);

          if (body.status && body.status !== previousStatus) {
            const customerCancelled = currentUser?.role === "customer" && body.status === "cancelled";
            let recipientId = customerCancelled ? booking.providerId : booking.customerId;
            let title = "Booking status updated";
            let message = `Your booking for ${booking.service?.title || "a service"} is now ${body.status}.`;
            if (body.status === "confirmed") {
              title = "Booking accepted";
              message = `Your booking for ${booking.service?.title || "a service"} has been accepted by the provider.`;
            } else if (body.status === "in-progress") {
              title = "Service started";
              message = `The provider has started your ${booking.service?.title || "service"}.`;
            } else if (body.status === "completed") {
              title = "Service completed";
              message = `Your ${booking.service?.title || "service"} booking is complete.`;
            } else if (body.status === "cancelled") {
              title = "Booking cancelled";
              message = customerCancelled
                ? `The customer cancelled the booking for ${booking.service?.title || "your service"}.`
                : `The provider cancelled your booking for ${booking.service?.title || "a service"}.`;
            }
            addMockNotification({
              userId: recipientId,
              title,
              message,
              type: "booking",
              relatedId: booking.id,
              relatedModel: "Booking",
            });
          }

          if (body.status === "confirmed" || body.status === "completed") {
            const payments = getStored("local_payments_data", [
              {
                id: "p1",
                bookingId: "101",
                amount: 89,
                paidAt: new Date().toISOString(),
              },
            ]);
            if (
              !payments.some((p) => String(p.bookingId) === String(bookingId))
            ) {
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
        {
          id: "p1",
          bookingId: "101",
          amount: 89,
          customer: { name: "Customer User" },
          paidAt: new Date().toISOString(),
        },
      ]);
      return payments;
    }

    if (path === "/payments" && method === "POST") {
      let payments = getStored("local_payments_data", []);
      const newPayment = {
        id: String(Date.now()),
        ...body,
        paidAt: new Date().toISOString(),
      };
      payments.unshift(newPayment);
      setStored("local_payments_data", payments);
      return newPayment;
    }

    // REVIEWS
    if (path === "/reviews" && method === "GET") {
      let reviews = getStored("local_reviews_data", []);
      if (currentUser?.role === "customer") {
        reviews = reviews.filter(
          (review) => String(review.customerId) === String(currentUser.id),
        );
      } else if (currentUser?.role === "provider") {
        reviews = reviews.filter(
          (review) =>
            String(review.providerId) === String(currentUser.id) &&
            review.isApproved,
        );
      } else if (params.get("pending") === "true") {
        reviews = reviews.filter((review) => !review.isApproved);
      }
      return reviews;
    }

    if (path === "/reviews" && method === "POST") {
      if (currentUser?.role !== "customer") {
        throw new Error("Only customers can write reviews");
      }
      const bookingId = String(body.bookingId || "");
      const rating = Number(body.rating);
      const comment = String(body.comment || "").trim();
      const bookings = getStored("local_bookings_data", initialBookings);
      const booking = bookings.find(
        (item) =>
          String(item.id) === bookingId &&
          String(item.customerId) === String(currentUser.id),
      );
      if (!booking || booking.status !== "completed") {
        throw new Error("You can review a service after its booking is completed");
      }
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new Error("Rating must be a whole number from 1 to 5");
      }
      if (!comment || comment.length > 2000) {
        throw new Error("Please enter a comment of 1 to 2000 characters");
      }
      let reviews = getStored("local_reviews_data", []);
      if (
        reviews.some(
          (review) =>
            String(review.customerId) === String(currentUser.id) &&
            String(review.bookingId) === bookingId,
        )
      ) {
        throw new Error("You have already reviewed this booking");
      }
      const newReview = {
        id: String(Date.now()),
        customerId: currentUser.id,
        providerId: booking.providerId,
        bookingId: booking.id,
        serviceId: booking.serviceId,
        rating,
        comment,
        isApproved: false,
        createdAt: new Date().toISOString(),
        customer: { id: currentUser.id, name: currentUser.name },
        provider: booking.provider,
        service: booking.service,
      };
      reviews.unshift(newReview);
      setStored("local_reviews_data", reviews);
      return newReview;
    }

    if (path.startsWith("/reviews/")) {
      const reviewId = path.split("/")[2];
      let reviews = getStored("local_reviews_data", []);
      const reviewIndex = reviews.findIndex(
        (review) => String(review.id) === String(reviewId),
      );

      if (path.endsWith("/moderate") && method === "PUT") {
        if (currentUser?.role !== "admin") {
          throw new Error("Only admins can moderate reviews");
        }
        if (typeof body.isApproved !== "boolean") {
          throw new Error("isApproved must be a boolean");
        }
        if (reviewIndex < 0) throw new Error("Review not found");
        reviews[reviewIndex] = {
          ...reviews[reviewIndex],
          isApproved: body.isApproved,
        };
        setStored("local_reviews_data", reviews);
        const services = getStored("local_services_data", initialServices);
        const serviceReviews = reviews.filter(
          (review) =>
            String(review.serviceId) ===
              String(reviews[reviewIndex].serviceId) &&
            review.isApproved,
        );
        const serviceIndex = services.findIndex(
          (service) =>
            String(service.id) === String(reviews[reviewIndex].serviceId),
        );
        if (serviceIndex >= 0) {
          services[serviceIndex] = {
            ...services[serviceIndex],
            reviewCount: serviceReviews.length,
            rating: serviceReviews.length
              ? (
                  serviceReviews.reduce((sum, review) => sum + review.rating, 0) /
                  serviceReviews.length
                ).toFixed(1)
              : "0.0",
          };
          setStored("local_services_data", services);
        }
        return reviews[reviewIndex];
      }

      if (method === "DELETE") {
        if (reviewIndex < 0) throw new Error("Review not found");
        if (
          currentUser?.role !== "admin" &&
          String(reviews[reviewIndex].customerId) !== String(currentUser?.id)
        ) {
          throw new Error("Not authorized");
        }
        const [deletedReview] = reviews.splice(reviewIndex, 1);
        setStored("local_reviews_data", reviews);
        const services = getStored("local_services_data", initialServices);
        const serviceReviews = reviews.filter(
          (review) =>
            String(review.serviceId) === String(deletedReview.serviceId) &&
            review.isApproved,
        );
        const serviceIndex = services.findIndex(
          (service) => String(service.id) === String(deletedReview.serviceId),
        );
        if (serviceIndex >= 0) {
          services[serviceIndex] = {
            ...services[serviceIndex],
            reviewCount: serviceReviews.length,
            rating: serviceReviews.length
              ? (
                  serviceReviews.reduce((sum, review) => sum + review.rating, 0) /
                  serviceReviews.length
                ).toFixed(1)
              : "0.0",
          };
          setStored("local_services_data", services);
        }
        return { message: "Review removed" };
      }
    }

    // FAVORITES
    if (path === "/favorites" && method === "GET") {
      if (currentUser?.role !== "customer") {
        throw new Error("Only customers can view their wishlist");
      }
      const favorites = getStored("local_favorites_data", []);
      return favorites.filter(
        (favorite) =>
          String(favorite.customerId) === String(currentUser.id) &&
          favorite.serviceId,
      );
    }

    if (path === "/favorites" && method === "POST") {
      if (currentUser?.role !== "customer") {
        throw new Error("Only customers can save services");
      }
      const serviceId = String(body.serviceId || "");
      const services = getStored("local_services_data", initialServices);
      const service = services.find(
        (item) => String(item.id) === serviceId && item.isActive !== false,
      );
      if (!service) throw new Error("Service not found or unavailable");
      let favorites = getStored("local_favorites_data", []);
      const existing = favorites.find(
        (favorite) =>
          String(favorite.customerId) === String(currentUser.id) &&
          String(favorite.serviceId) === serviceId,
      );
      if (existing) return existing;
      const newFav = {
        id: String(Date.now()),
        customerId: currentUser.id,
        serviceId,
        service,
      };
      favorites.push(newFav);
      setStored("local_favorites_data", favorites);
      return newFav;
    }

    if (path.startsWith("/favorites/") && method === "DELETE") {
      const serviceId = path.split("/")[2];
      let favorites = getStored("local_favorites_data", []);
      favorites = favorites.filter(
        (f) =>
          String(f.customerId) !== String(currentUser?.id) ||
          String(f.serviceId) !== String(serviceId),
      );
      setStored("local_favorites_data", favorites);
      return { success: true };
    }

    // NOTIFICATIONS
    if (path === "/notifications" && method === "GET") {
      const notifications = getStored("local_notifications_data", []);
      return notifications.filter(
        (notification) => String(notification.userId) === String(currentUser?.id),
      );
    }

    if (path === "/notifications/unread-count" && method === "GET") {
      const notifications = getStored("local_notifications_data", []);
      return {
        count: notifications.filter(
          (notification) =>
            String(notification.userId) === String(currentUser?.id) &&
            !notification.isRead,
        ).length,
      };
    }

    if (path === "/notifications/read-all" && method === "PUT") {
      const notifications = getStored("local_notifications_data", []);
      const updatedNotifications = notifications.map((notification) =>
        String(notification.userId) === String(currentUser?.id)
          ? { ...notification, isRead: true }
          : notification,
      );
      setStored("local_notifications_data", updatedNotifications);
      return { message: "All notifications marked as read" };
    }

    if (path.startsWith("/notifications/") && path.endsWith("/read") && method === "PUT") {
      const notificationId = path.split("/")[2];
      const notifications = getStored("local_notifications_data", []);
      const notification = notifications.find(
        (item) =>
          String(item.id) === String(notificationId) &&
          String(item.userId) === String(currentUser?.id),
      );
      if (!notification) throw new Error("Notification not found");
      notification.isRead = true;
      setStored("local_notifications_data", notifications);
      return notification;
    }

    // CONTACT MESSAGES
    if (path === "/contact-messages" && method === "POST") {
      const name = String(body.name || "").trim();
      const email = String(body.email || "").trim().toLowerCase();
      const subject = String(body.subject || "General enquiry").trim();
      const message = String(body.message || "").trim();
      if (!name || name.length > 100) {
        throw new Error("Name is required and must be 100 characters or fewer");
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
        throw new Error("Enter a valid email address");
      }
      if (!subject || subject.length > 150) {
        throw new Error("Subject is required and must be 150 characters or fewer");
      }
      if (!message || message.length > 5000) {
        throw new Error("Message is required and must be 5000 characters or fewer");
      }

      const contactMessages = getStored("local_contact_messages_data", []);
      const contactMessage = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name,
        email,
        subject,
        message,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      contactMessages.unshift(contactMessage);
      setStored("local_contact_messages_data", contactMessages);
      const admin = Object.values(usersMap).find(user => user.role === "admin");
      if (admin) {
        addMockNotification({
          userId: admin.id,
          title: `Contact: ${subject}`,
          message: `New contact message from ${name} (${email}).`,
          type: "system",
          relatedId: contactMessage.id,
          relatedModel: "ContactMessage",
        });
      }
      return { message: "Message sent successfully", contactMessage };
    }

    if (path === "/contact-messages" && method === "GET") {
      if (currentUser?.role !== "admin") {
        throw new Error("Only admins can view contact messages");
      }
      return getStored("local_contact_messages_data", []);
    }

    if (path.startsWith("/contact-messages/") && path.endsWith("/read") && method === "PUT") {
      if (currentUser?.role !== "admin") {
        throw new Error("Only admins can update contact messages");
      }
      const contactMessageId = path.split("/")[2];
      const contactMessages = getStored("local_contact_messages_data", []);
      const contactMessage = contactMessages.find(
        item => String(item.id) === String(contactMessageId),
      );
      if (!contactMessage) throw new Error("Contact message not found");
      contactMessage.isRead = true;
      setStored("local_contact_messages_data", contactMessages);
      return contactMessage;
    }

    if (path.startsWith("/contact-messages/") && path.endsWith("/reply") && method === "PUT") {
      if (currentUser?.role !== "admin") {
        throw new Error("Only admins can reply to contact messages");
      }
      const reply = String(body.reply || "").trim();
      if (!reply || reply.length > 5000) {
        throw new Error("Reply is required and must be 5000 characters or fewer");
      }
      const contactMessageId = path.split("/")[2];
      const contactMessages = getStored("local_contact_messages_data", []);
      const contactMessage = contactMessages.find(
        item => String(item.id) === String(contactMessageId),
      );
      if (!contactMessage) throw new Error("Contact message not found");
      contactMessage.adminReply = reply;
      contactMessage.repliedAt = new Date().toISOString();
      contactMessage.isRead = true;
      setStored("local_contact_messages_data", contactMessages);

      const recipient = Object.values(usersMap).find(
        user =>
          user.email.toLowerCase() === contactMessage.email.toLowerCase() &&
          (user.role === "customer" || user.role === "provider"),
      );
      if (recipient) {
        addMockNotification({
          userId: recipient.id,
          title: "Support replied to your message",
          message: `An administrator replied to your contact request: ${contactMessage.subject}`,
          type: "system",
          relatedId: contactMessage.id,
          relatedModel: "ContactMessage",
        });
      }
      return {
        message: recipient
          ? "Reply sent and sender notified"
          : "Reply saved; no matching customer or provider account was found",
        notificationSent: Boolean(recipient),
        contactMessage,
      };
    }

    // PAYOUTS
    if (path === "/payouts") {
      return { success: true };
    }
  } catch (err) {
    throw err
  }

  return null;
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("auth_token");
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  } catch (error) {
    const fallback = getMockFallback(endpoint, options);
    if (fallback !== null) return fallback;
    throw error;
  }

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
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
  create: (data) =>
    request("/categories", { method: "POST", body: JSON.stringify(data) }),
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
  moderate: (id, isApproved) =>
    request(`/reviews/${id}/moderate`, {
      method: "PUT",
      body: JSON.stringify({ isApproved }),
    }),
  delete: (id) => request(`/reviews/${id}`, { method: "DELETE" }),
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
  markAsRead: async (id) => {
    const result = await request(`/notifications/${id}/read`, { method: "PUT" });
    window.dispatchEvent(new Event("notifications:changed"));
    return result;
  },
  markAllAsRead: async () => {
    const result = await request("/notifications/read-all", { method: "PUT" });
    window.dispatchEvent(new Event("notifications:changed"));
    return result;
  },
};

// Contact messages
export const contactAPI = {
  submit: (data) =>
    request("/contact-messages", { method: "POST", body: JSON.stringify(data) }),
  getAll: () => request("/contact-messages"),
  markAsRead: (id) =>
    request(`/contact-messages/${id}/read`, { method: "PUT" }),
  reply: (id, reply) =>
    request(`/contact-messages/${id}/reply`, {
      method: "PUT",
      body: JSON.stringify({ reply }),
    }),
};

// Favorites
export const favoriteAPI = {
  getAll: () => request("/favorites"),
  add: (serviceId) =>
    request("/favorites", {
      method: "POST",
      body: JSON.stringify({ serviceId }),
    }),
  remove: (serviceId) =>
    request(`/favorites/${serviceId}`, { method: "DELETE" }),
};

// Payouts
export const payoutAPI = {
  getAll: () => request("/payouts"),
  request: (data) =>
    request("/payouts", { method: "POST", body: JSON.stringify(data) }),
};
