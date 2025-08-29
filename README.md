# ✈️ Flight Booking Service

A microservice responsible for handling bookings, user authentication, payments, and seat management in a distributed flight booking system.

---

## 📌 Overview

This service is part of a microservices-based Flight Booking System. It manages the booking lifecycle, user registration/login, payment status, and communicates with the Flight Service to sync seat availability.

---

## 🛠️ Tech Stack

- **Node.js** with **Express.js**
- **MySQL** & **Sequelize ORM**
- **JWT** for user authentication
- **Winston** for logging
- **node-cron** for scheduled tasks
- **Axios** for inter-service HTTP communication

---

## 🧩 Architecture

```
Flight Booking Service
├── controllers/    # Handle HTTP requests and responses
├── services/       # Business logic
├── repositories/   # Database access
├── models/         # Sequelize models
├── config/         # Configuration files
├── routes/         # API route definitions
├── middlewares/    # Auth, validation, error handling
└── utils/          # Helpers, error classes, cron jobs
```

---

## ⚙️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/<your-repo>.git
   cd <your-repo>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:
   ```
   PORT=4000
   DB_NAME=booking_db
   DB_USER=root
   DB_PASS=yourpassword
   DB_HOST=localhost
   FLIGHT_SERVICE=http://localhost:3000
   JWT_SECRET=your_jwt_secret
   ```

4. **Initialize Sequelize (if not already)**
   ```bash
   npx sequelize init
   ```

5. **Run DB migrations**
   ```bash
   npx sequelize db:migrate
   ```

6. **Start the server**
   ```bash
   npm run dev
   ```

---

## 🔁 API Endpoints

| Method | Route                       | Description                    |
|--------|-----------------------------|--------------------------------|
| POST   | `/api/v1/users/register`    | Register a new user            |
| POST   | `/api/v1/users/login`       | Login and receive JWT token    |
| POST   | `/api/v1/users/logout`      | Logout (clear JWT cookie)      |
| POST   | `/api/v1/bookings`          | Create a booking (auth needed) |
| POST   | `/api/v1/bookings/payments` | Make payment for booking       |
| GET    | `/api/v1/bookings/:id`      | Get booking details            |
| PATCH  | `/api/v1/bookings/:id`      | Update booking status          |
| DELETE | `/api/v1/bookings/:id`      | Cancel a booking               |

---

## 🔒 Authentication

- **JWT-based authentication** for all booking-related endpoints.
- Only authenticated users can create, pay for, or cancel bookings.
- Registration and login endpoints are public.

---

## ⏱️ Cron Jobs

- Periodically cancels unpaid bookings older than a set threshold (e.g., 15 minutes).
- Frees up locked seats for other users.

---

## 🔗 Inter-service Communication

- Communicates with the **Flight Service** via REST APIs to:
  - Check seat availability
  - Lock seats during booking
  - Release seats on cancellation

---

## 📝 Project Principles

- Separation of concerns: clear distinction between controllers, services, repositories, and models.
- Secure password storage using bcrypt.
- Stateless authentication using JWT.
- Scalable and maintainable codebase.

---

## 🚀 Future Enhancements

- Add refresh tokens for improved security.
- Integrate RabbitMQ for async communication.
- Add unit and integration tests.

---


## 👤 Author
