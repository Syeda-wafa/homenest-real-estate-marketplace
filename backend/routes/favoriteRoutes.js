const express = require("express");

const {
  addFavorite,
  getMyFavorites,
  removeFavorite,
  clearFavorites,
} = require("../controllers/favoriteController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get logged-in user's saved properties
router.get("/", protect, getMyFavorites);

// Clear all saved properties
router.delete("/clear", protect, clearFavorites);

// Add property to favorites
router.post("/:propertyId", protect, addFavorite);

// Remove property from favorites
router.delete("/:propertyId", protect, removeFavorite);

module.exports = router;