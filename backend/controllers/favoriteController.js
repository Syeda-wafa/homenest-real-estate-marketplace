const Favorite = require("../models/Favorite");

// =====================================
// ADD FAVORITE
// =====================================

const addFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const existingFavorite = await Favorite.findOne({
      user: req.user._id,
      property: propertyId,
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: "Property is already saved.",
      });
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      property: propertyId,
    });

    await favorite.populate("property");

    res.status(201).json({
      success: true,
      message: "Property saved successfully.",
      favorite,
    });
  } catch (error) {
    console.error("Add favorite error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save property.",
      error: error.message,
    });
  }
};

// =====================================
// GET MY FAVORITES
// =====================================

const getMyFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({
      user: req.user._id,
    })
      .populate({
        path: "property",
        populate: {
          path: "owner",
          select: "name email phone",
        },
      })
      .sort({ createdAt: -1 });

    const properties = favorites
      .filter((favorite) => favorite.property)
      .map((favorite) => favorite.property);

    res.status(200).json({
      success: true,
      count: properties.length,
      favorites: properties,
    });
  } catch (error) {
    console.error("Get favorites error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch saved properties.",
      error: error.message,
    });
  }
};

// =====================================
// REMOVE FAVORITE
// =====================================

const removeFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      user: req.user._id,
      property: propertyId,
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Saved property not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Property removed from saved properties.",
    });
  } catch (error) {
    console.error("Remove favorite error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove saved property.",
      error: error.message,
    });
  }
};

// =====================================
// CLEAR ALL FAVORITES
// =====================================

const clearFavorites = async (req, res) => {
  try {
    const result = await Favorite.deleteMany({
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "All saved properties removed.",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Clear favorites error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to clear saved properties.",
      error: error.message,
    });
  }
};

module.exports = {
  addFavorite,
  getMyFavorites,
  removeFavorite,
  clearFavorites,
};