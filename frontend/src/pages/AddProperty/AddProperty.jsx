import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";

import "./AddProperty.css";

function AddProperty() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    propertyType: "House",
    purpose: "Sale",
    price: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // =====================================
  // HANDLE INPUT CHANGE
  // =====================================

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =====================================
  // IMAGE CHANGE
  // =====================================

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) {
      return;
    }

    // Maximum 6 images
    if (files.length > 6) {
      toast.error("You can upload maximum 6 images.");
      e.target.value = "";
      return;
    }

    // Allowed image types
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    const invalidFile = files.find((file) => !allowedTypes.includes(file.type));

    if (invalidFile) {
      toast.error("Only JPG, JPEG, PNG and WEBP images are allowed.");
      e.target.value = "";
      return;
    }

    // Maximum 5MB per image
    const maxSize = 5 * 1024 * 1024;

    const oversizedFile = files.find((file) => file.size > maxSize);

    if (oversizedFile) {
      toast.error("Each image must be less than 5MB.");
      e.target.value = "";
      return;
    }

    // Create preview objects
    const selectedImages = files.map((file) => ({
      file: file,
      preview: URL.createObjectURL(file),
    }));

    setImages(selectedImages);

    // Allow selecting same file again
    e.target.value = "";
  };

  // =====================================
  // REMOVE IMAGE
  // =====================================

  const removeImage = (index) => {
    setImages((prev) => {
      const imageToRemove = prev[index];

      if (imageToRemove?.preview) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  // =====================================
  // SUBMIT PROPERTY
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // =====================================
    // VALIDATION
    // =====================================

    if (
      !formData.title.trim() ||
      !formData.price ||
      !formData.location.trim() ||
      !formData.area ||
      !formData.description.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // =====================================
    // IMAGE VALIDATION
    // =====================================

    if (images.length === 0) {
      toast.error("Please upload at least one property image.");
      return;
    }

    try {
      setLoading(true);

      // =====================================
      // CREATE FORM DATA
      // =====================================

      const data = new FormData();

      data.append("title", formData.title.trim());

      data.append("propertyType", formData.propertyType);

      data.append("purpose", formData.purpose);

      data.append("price", formData.price);

      data.append("location", formData.location.trim());

      data.append("bedrooms", formData.bedrooms || "0");

      data.append("bathrooms", formData.bathrooms || "0");

      data.append("area", formData.area);

      data.append("description", formData.description.trim());

      // =====================================
      // APPEND ALL IMAGES
      // =====================================

      images.forEach((image) => {
        data.append("images", image.file);
      });

      // =====================================
      // DEBUG
      // =====================================

      console.log("Images being uploaded:");

      images.forEach((image, index) => {
        console.log(
          `${index + 1}:`,
          image.file.name,
          image.file.type,
          image.file.size,
        );
      });

      // =====================================
      // API REQUEST
      // =====================================

      const response = await api.post("/properties", data);

      console.log("Create property response:", response.data);

      // =====================================
      // SUCCESS
      // =====================================

      toast.success("Property listed successfully!");

      // Clean preview URLs
      images.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });

      setImages([]);

      navigate("/my-properties");
    } catch (error) {
      console.error("Create property error:", error);

      console.error("Backend response:", error.response?.data);

      toast.error(
        error.response?.data?.message ||
          "Failed to create property. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // UI
  // =====================================

  return (
    <main className="add-property-page">
      <div className="add-property-container">
        {/* HEADER */}

        <section className="add-property-header">
          <div>
            <span className="add-property-label">HOMENEST PROPERTIES</span>

            <h1>Add a new property.</h1>

            <p>Provide the details below to create your property listing.</p>
          </div>

          <button
            type="button"
            className="cancel-property-btn"
            onClick={() => navigate("/properties")}
            disabled={loading}
          >
            Cancel
          </button>
        </section>

        {/* FORM */}

        <form className="add-property-form" onSubmit={handleSubmit}>
          {/* =====================================
              BASIC INFORMATION
          ===================================== */}

          <section className="property-form-card">
            <div className="form-card-heading">
              <span>01</span>

              <div>
                <h2>Basic Information</h2>

                <p>Tell buyers about your property.</p>
              </div>
            </div>

            {/* TITLE */}

            <div className="form-field full-width">
              <label htmlFor="title">
                Property Title <span>*</span>
              </label>

              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. Modern Family House"
                value={formData.title}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* PROPERTY TYPE + PURPOSE */}

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="propertyType">
                  Property Type <span>*</span>
                </label>

                <select
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="House">House</option>

                  <option value="Apartment">Apartment</option>

                  <option value="Villa">Villa</option>

                  <option value="Plot">Plot</option>

                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="purpose">
                  Purpose <span>*</span>
                </label>

                <select
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="Sale">Sale</option>

                  <option value="Rent">Rent</option>
                </select>
              </div>
            </div>

            {/* PRICE + LOCATION */}

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="price">
                  {formData.purpose === "Rent"
                    ? "Monthly Rent"
                    : "Asking Price"}{" "}
                  <span>*</span>
                </label>

                <div className="input-prefix">
                  <span>Rs.</span>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    placeholder="25000000"
                    value={formData.price}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="location">
                  Location <span>*</span>
                </label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="e.g. F-11, Islamabad"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>
          </section>

          {/* =====================================
              PROPERTY DETAILS
          ===================================== */}

          <section className="property-form-card">
            <div className="form-card-heading">
              <span>02</span>

              <div>
                <h2>Property Details</h2>

                <p>Add specifications and property measurements.</p>
              </div>
            </div>

            <div className="details-input-grid">
              {/* BEDROOMS */}

              <div className="form-field">
                <label htmlFor="bedrooms">Bedrooms</label>

                <input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  min="0"
                  placeholder="4"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {/* BATHROOMS */}

              <div className="form-field">
                <label htmlFor="bathrooms">Bathrooms</label>

                <input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  min="0"
                  placeholder="4"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {/* AREA */}

              <div className="form-field">
                <label htmlFor="area">
                  Area (sq ft) <span>*</span>
                </label>

                <input
                  id="area"
                  name="area"
                  type="number"
                  min="0"
                  placeholder="3500"
                  value={formData.area}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* DESCRIPTION */}

            <div className="form-field full-width">
              <label htmlFor="description">
                Description <span>*</span>
              </label>

              <textarea
                id="description"
                name="description"
                rows="6"
                placeholder="Describe the property, its features, nearby facilities, and anything buyers should know..."
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </section>

          {/* =====================================
              PROPERTY IMAGES
          ===================================== */}

          <section className="property-form-card">
            <div className="form-card-heading">
              <span>03</span>

              <div>
                <h2>Property Images</h2>

                <p>Add up to 6 high-quality images.</p>
              </div>
            </div>

            {/* UPLOAD */}

            <label htmlFor="property-images" className="image-upload-area">
              <input
                id="property-images"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageChange}
                disabled={loading}
              />

              <div className="upload-icon">↑</div>

              <strong>Upload property images</strong>

              <span>PNG, JPG or WEBP · Maximum 6 images</span>
            </label>

            {/* PREVIEWS */}

            {images.length > 0 && (
              <div className="uploaded-images">
                {images.map((image, index) => (
                  <div className="uploaded-image" key={image.preview}>
                    <img src={image.preview} alt={`Property ${index + 1}`} />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      aria-label="Remove image"
                      disabled={loading}
                    >
                      ×
                    </button>

                    {index === 0 && (
                      <span className="primary-image">Cover</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* IMAGE COUNT */}

            {images.length > 0 && (
              <p className="image-count">
                {images.length} of 6 images selected
              </p>
            )}
          </section>

          {/* =====================================
              ACTIONS
          ===================================== */}

          <div className="add-property-actions">
            <button
              type="submit"
              className="publish-property-btn"
              disabled={loading}
            >
              {loading ? "Creating Listing..." : "Create Property Listing"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default AddProperty;
