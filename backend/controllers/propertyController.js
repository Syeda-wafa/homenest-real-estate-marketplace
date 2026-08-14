const Property = require("../models/Property");
const cloudinary = require("../config/cloudinary");

// =====================================
// CLOUDINARY UPLOAD HELPER
// =====================================

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "homenest/properties",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

// =====================================
// CREATE PROPERTY
// =====================================

const createProperty = async (req, res) => {
  try {
    const {
      title,
      propertyType,
      purpose,
      price,
      location,
      bedrooms,
      bathrooms,
      area,
      description,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !propertyType ||
      !purpose ||
      !price ||
      !location ||
      !area ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields",
      });
    }

    // IMAGES

  // =====================================
  // UPLOAD IMAGES TO CLOUDINARY
  // =====================================

  let images = [];

  if (req.files && req.files.length > 0) {
  const uploadedImages = await Promise.all(
    req.files.map((file) =>
      uploadToCloudinary(file.buffer)
    )
  );

  images = uploadedImages.map((image) => image.secure_url);
}

    // Create property
    const property = await Property.create({
      title: title.trim(),
      propertyType,
      purpose,
      price: Number(price),
      location: location.trim(),
      bedrooms: bedrooms ? Number(bedrooms) : 0,
      bathrooms: bathrooms ? Number(bathrooms) : 0,
      area: Number(area),
      description: description.trim(),
      images,

      // Logged-in user
      owner: req.user._id,
    });

    // RESPONSE

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      property,
    });
  } catch (error) {
    console.error("Create Property Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create property",
    });
  }
};

// =====================================
// GET ALL PROPERTIES
// =====================================

const getProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error("Get Properties Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch properties",
    });
  }
};

// =====================================
// GET SINGLE PROPERTY
// =====================================

const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "owner",
      "name email phone"
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    console.error("Get Property Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch property",
    });
  }
};

// =====================================
// GET MY PROPERTIES
// =====================================

const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      owner: req.user._id,
    })
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error("Get My Properties Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch your properties",
    });
  }
};

// =====================================
// UPDATE PROPERTY
// =====================================

const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Only owner can update
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this property",
      });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("owner", "name email phone");

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      property: updatedProperty,
    });
  } catch (error) {
    console.error("Update Property Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to update property",
    });
  }
};

// =====================================
// DELETE PROPERTY
// =====================================

const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Only owner can delete
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this property",
      });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error("Delete Property Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete property",
    });
  }
};

// =====================================
// GET USER DASHBOARD
// =====================================

const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // User ki properties
    const properties = await Property.find({
      owner: userId,
    })
      .sort({ createdAt: -1 })
      .limit(3);

    // Total properties
    const totalProperties = await Property.countDocuments({
      owner: userId,
    });

    // Active listings
    const activeListings = await Property.countDocuments({
      owner: userId,
      status: "Active",
    });

    // Draft listings
    const draftListings = await Property.countDocuments({
      owner: userId,
      status: "Draft",
    });

    // Total views
    const viewsResult = await Property.aggregate([
      {
        $match: {
          owner: userId,
        },
      },
      {
        $group: {
          _id: null,
          totalViews: {
            $sum: "$views",
          },
        },
      },
    ]);

    const totalViews =
      viewsResult.length > 0 ? viewsResult[0].totalViews : 0;

    res.status(200).json({
      success: true,

      stats: {
        totalProperties,
        savedProperties: 0,
        activeListings,
        messages: 0,
        totalViews,
        draftListings,
      },

      recentProperties: properties,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard",
    });
  }
};

module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  getMyProperties,
  updateProperty,
  deleteProperty,
  getDashboard,
};