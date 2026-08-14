const express = require("express");

const {
  createProperty,
  getProperties,
  getPropertyById,
  getMyProperties,
  updateProperty,
  deleteProperty,
  getDashboard,
} = require("../controllers/propertyController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// =====================================
// PUBLIC
// =====================================

// Get all properties
router.get("/", getProperties);

// =====================================
// PROTECTED
// =====================================

// Dashboard
// IMPORTANT: dashboard must come BEFORE /:id
router.get("/dashboard", protect, getDashboard);

// My Properties
router.get("/my-properties", protect, getMyProperties);

// Create property + images
router.post(
  "/",
  protect,
  upload.array("images", 6),
  createProperty
);

// Update property
router.put(
  "/:id",
  protect,
  updateProperty
);

// Delete property
router.delete(
  "/:id",
  protect,
  deleteProperty
);

// =====================================
// PUBLIC SINGLE PROPERTY
// =====================================

// Get single property
// Keep this LAST because /:id matches anything
router.get("/:id", getPropertyById);

module.exports = router;