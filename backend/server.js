const dotenv = require("dotenv");

dotenv.config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");


// =====================================
// DATABASE
// =====================================

connectDB();

const app = express();

// =====================================
// MIDDLEWARE
// =====================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://homenest-frontend.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));

// =====================================
// API ROUTES
// =====================================

// Authentication
app.use("/api/auth", authRoutes);

// Users / Settings
app.use("/api/users", userRoutes);

// Properties
app.use("/api/properties", propertyRoutes);

// Favorites
app.use("/api/favorites", favoriteRoutes);

// =====================================
// TEST ROUTE
// =====================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HomeNest API Running",
  });
});

// =====================================
// 404 ROUTE
// =====================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// =====================================
// ERROR HANDLER
// =====================================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// =====================================
// VERCEL
// =====================================

module.exports = app;