const multer = require("multer");

// =====================================
// MEMORY STORAGE
// =====================================
// Files are temporarily stored in memory.
// They will be uploaded to Cloudinary
// instead of the local /uploads folder.

const storage = multer.memoryStorage();

// =====================================
// FILE FILTER
// =====================================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only JPG, JPEG, PNG and WEBP images are allowed"),
      false
    );
  }
};

// =====================================
// MULTER
// =====================================

const upload = multer({
  storage,

  fileFilter,

  limits: {
    files: 6,
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;