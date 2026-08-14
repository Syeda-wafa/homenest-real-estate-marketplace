const express = require("express");

const {
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  changePassword,
  deleteAccount,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================
// PUBLIC
// =====================================

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// =====================================
// PROTECTED
// =====================================

// Current user
router.get("/me", protect, getCurrentUser);

// Update profile
router.put("/profile", protect, updateProfile);

// Change password
router.put("/change-password", protect, changePassword);

// Delete account
router.delete("/account", protect, deleteAccount);

module.exports = router;