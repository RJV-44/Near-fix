const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const path = require('path');

console.log("DB_USER =", process.env.DB_USER);
console.log("DB_NAME =", process.env.DB_NAME);
console.log("DB_HOST =", process.env.DB_HOST);

const { connectDB } = require('./config/db');
const { syncDatabase } = require('./config/init');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Load models and associations (must be required before routes)
require('./models');

// Auth & Users
app.use('/api/auth', require('./routes/authRoutes'));

// Services
app.use('/api/services', require('./routes/serviceRoutes')); 

// Bookings
app.use('/api/bookings', require('./routes/bookingRoutes'));

// Reviews
app.use('/api/reviews', require('./routes/reviewRoutes'));

// Payments
app.use('/api/payments', require('./routes/paymentRoutes'));

// Notifications
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Favorites
app.use('/api/favorites', require('./routes/favoriteRoutes'));

// Categories
app.use('/api/categories', require('./routes/categoryRoutes'));

// Payouts
app.use('/api/payouts', require('./routes/payoutRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    await syncDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Startup error: ${error.message}`);
    process.exit(1);
  }
};

start();