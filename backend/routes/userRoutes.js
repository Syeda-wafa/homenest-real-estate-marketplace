const express = require("express");

const {
  getProfile,
  updateProfile,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/users/profile
router.get("/profile", protect, getProfile);

// PUT /api/users/profile
router.put("/profile", protect, updateProfile);

module.exports = router;