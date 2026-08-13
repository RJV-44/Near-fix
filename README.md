# Local Services

Local Services is a full-stack marketplace platform that connects customers with local service providers. Customers can browse services, book appointments, make payments, and review providers, while providers can manage their listings and bookings. Admins can monitor users, providers, services, bookings, payments, and reviews from a dedicated dashboard.

## Features

- User registration and login for customer, provider, and admin roles
- Service listing and category-based browsing
- Provider profile and service management
- Booking creation and booking status tracking
- Reviews and ratings
- Favorites and notifications
- Payment records and payout support
- Admin dashboard with tables and analytics
- Responsive frontend UI for desktop and mobile

## Tech Stack

Frontend:

- React
- Vite
- JavaScript
- CSS

Backend:

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT authentication
- bcryptjs

## Project Structure

```bash
local-services/
├── public/
├── src/
│   ├── api.js
│   ├── App.jsx
│   ├── main.jsx
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── dashboards/
│   ├── pages/
│   └── index.css
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── server.js
│   ├── seed.js
│   └── package.json
├── package.json
├── vite.config.js
├── index.html
├── README.md
└── TODO.md
```

## Setup Instructions

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure database environment

Create or update the file `server/.env` with your MySQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=local_services
JWT_SECRET=local_services_jwt_secret_key_2024
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Make sure MySQL is running and the database `local_services` is available.

### 4. Seed demo users

```bash
cd server
node seed.js
```

This creates default demo accounts for login testing.

### 5. Start the backend

```bash
cd server
npm start
```

### 6. Start the frontend

Open a new terminal and run:

```bash
cd ..
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

The backend API runs on:

```text
http://localhost:5000
```

## Demo Login Accounts

Admin:

- Email: admin@example.com
- Password: admin123

Customer:

- Email: customer@example.com
- Password: customer123

Provider:

- Email: provider@example.com
- Password: provider123

## Admin Dashboard

The admin dashboard includes:

- Users management
- Providers management
- Services overview
- Bookings tracking
- Payments overview
- Reviews moderation
- Reports and analytics
- Platform settings

## Notes

- The frontend connects to the backend through the shared API layer in `src/api.js`.
- Database models and associations are defined in the `server/models` folder.
- The server automatically syncs the MySQL tables on startup.

## License

This project is for learning and portfolio use.

## Author

Rajvi Lunagariya
