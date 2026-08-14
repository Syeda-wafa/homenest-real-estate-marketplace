import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";

import "./EditProperty.css";

function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  // =====================================
  // STATE
  // =====================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    propertyType: "House",
    purpose: "Sale",
    bedrooms: "",
    bathrooms: "",
    area: "",
    description: "",
  });

  const [images, setImages] = useState([]);

  // =====================================
  // FETCH PROPERTY
  // =====================================

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);

        console.log("Fetching property:", id);

        const response = await api.get(`/properties/${id}`);

        console.log("Property response:", response.data);

        const property = response.data.property;

        if (!property) {
          toast.error("Property not found");
          navigate("/my-properties");
          return;
        }

        // =====================================
        // SET FORM DATA
        // =====================================

        setFormData({
          title: property.title || "",
          location: property.location || "",
          price: property.price || "",
          propertyType: property.propertyType || "House",
          purpose: property.purpose || "Sale",
          bedrooms: property.bedrooms ?? 0,
          bathrooms: property.bathrooms ?? 0,
          area: property.area || "",
          description: property.description || "",
        });

        // =====================================
        // SET IMAGES
        // =====================================

        setImages(property.images || []);
      } catch (error) {
        console.error("Fetch property error:", error);

        toast.error(
          error.response?.data?.message || "Failed to fetch property",
        );

        navigate("/my-properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, navigate]);

  // =====================================
  // HANDLE INPUT
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================
  // REMOVE IMAGE
  // =====================================

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // =====================================
  // UPDATE PROPERTY
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // =====================================
    // VALIDATION
    // =====================================

    if (!formData.title.trim()) {
      toast.error("Property title is required");
      return;
    }

    if (!formData.location.trim()) {
      toast.error("Location is required");
      return;
    }

    if (!formData.price) {
      toast.error("Price is required");
      return;
    }

    if (!formData.area) {
      toast.error("Area is required");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }

    try {
      setSaving(true);

      // =====================================
      // UPDATE PROPERTY API
      // =====================================

      const response = await api.put(`/properties/${id}`, {
        title: formData.title.trim(),

        location: formData.location.trim(),

        price: Number(formData.price),

        propertyType: formData.propertyType,

        purpose: formData.purpose,

        bedrooms: Number(formData.bedrooms) || 0,

        bathrooms: Number(formData.bathrooms) || 0,

        area: Number(formData.area),

        description: formData.description.trim(),
      });

      console.log("Update property response:", response.data);

      // =====================================
      // SUCCESS
      // =====================================

      toast.success("Property updated successfully!");

      navigate("/my-properties");
    } catch (error) {
      console.error("Update property error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update property. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // LOADING UI
  // =====================================

  if (loading) {
    return (
      <main className="edit-property-page">
        <div className="edit-property-container">
          <div className="edit-property-loading">
            <div className="loading-spinner"></div>

            <h3>Loading property...</h3>

            <p>Please wait while we fetch the property details.</p>
          </div>
        </div>
      </main>
    );
  }

  // =====================================
  // UI
  // =====================================

  return (
    <main className="edit-property-page">
      <div className="edit-property-container">
        {/* =====================================
            HEADER
        ===================================== */}

        <div className="edit-property-header">
          <div>
            <Link to="/my-properties" className="edit-back-link">
              ← Back to My Properties
            </Link>

            <span className="edit-property-label">MANAGE PROPERTY</span>

            <h1>
              Edit your <span>property.</span>
            </h1>

            <p>
              Update your property information and keep your listing up to date.
            </p>
          </div>

          <div className="editing-badge">EDITING LISTING</div>
        </div>

        {/* =====================================
            FORM
        ===================================== */}

        <form className="edit-property-form" onSubmit={handleSubmit}>
          {/* =====================================
              BASIC INFORMATION
          ===================================== */}

          <section className="edit-form-card">
            <div className="edit-section-heading">
              <span>01</span>

              <div>
                <h2>Basic Information</h2>

                <p>Update the basic details of your property.</p>
              </div>
            </div>

            <div className="edit-form-grid">
              {/* TITLE */}

              <div className="edit-form-group full">
                <label htmlFor="title">Property Title</label>

                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="e.g. Modern Family House"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              {/* PROPERTY TYPE */}

              <div className="edit-form-group">
                <label htmlFor="propertyType">Property Type</label>

                <select
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  disabled={saving}
                >
                  <option value="House">House</option>

                  <option value="Apartment">Apartment</option>

                  <option value="Villa">Villa</option>

                  <option value="Plot">Plot</option>

                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              {/* PURPOSE */}

              <div className="edit-form-group">
                <label htmlFor="purpose">Purpose</label>

                <select
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  disabled={saving}
                >
                  <option value="Sale">Sale</option>

                  <option value="Rent">Rent</option>
                </select>
              </div>

              {/* LOCATION */}

              <div className="edit-form-group full">
                <label htmlFor="location">Location</label>

                <input
                  id="location"
                  type="text"
                  name="location"
                  placeholder="e.g. F-11, Islamabad"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>
            </div>
          </section>

          {/* =====================================
              PROPERTY DETAILS
          ===================================== */}

          <section className="edit-form-card">
            <div className="edit-section-heading">
              <span>02</span>

              <div>
                <h2>Property Details</h2>

                <p>Update size and property features.</p>
              </div>
            </div>

            <div className="edit-form-grid three">
              {/* PRICE */}

              <div className="edit-form-group">
                <label htmlFor="price">
                  {formData.purpose === "Rent" ? "Monthly Rent" : "Price"}
                </label>

                <div className="input-prefix">
                  <span>Rs.</span>

                  <input
                    id="price"
                    type="number"
                    name="price"
                    placeholder="28500000"
                    value={formData.price}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>
              </div>

              {/* BEDROOMS */}

              <div className="edit-form-group">
                <label htmlFor="bedrooms">Bedrooms</label>

                <input
                  id="bedrooms"
                  type="number"
                  name="bedrooms"
                  min="0"
                  placeholder="4"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              {/* BATHROOMS */}

              <div className="edit-form-group">
                <label htmlFor="bathrooms">Bathrooms</label>

                <input
                  id="bathrooms"
                  type="number"
                  name="bathrooms"
                  min="0"
                  placeholder="4"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              {/* AREA */}

              <div className="edit-form-group">
                <label htmlFor="area">Area (sq ft)</label>

                <input
                  id="area"
                  type="number"
                  name="area"
                  min="0"
                  placeholder="3500"
                  value={formData.area}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>
            </div>
          </section>

          {/* =====================================
              DESCRIPTION
          ===================================== */}

          <section className="edit-form-card">
            <div className="edit-section-heading">
              <span>03</span>

              <div>
                <h2>Description</h2>

                <p>Tell potential buyers or renters about your property.</p>
              </div>
            </div>

            <div className="edit-form-group">
              <label htmlFor="description">Property Description</label>

              <textarea
                id="description"
                name="description"
                rows="7"
                placeholder="Describe your property..."
                value={formData.description}
                onChange={handleChange}
                disabled={saving}
              />
            </div>
          </section>

          {/* =====================================
              IMAGES
          ===================================== */}

          <section className="edit-form-card">
            <div className="edit-section-heading">
              <span>04</span>

              <div>
                <h2>Property Images</h2>

                <p>Images currently associated with your listing.</p>
              </div>
            </div>

            {images.length > 0 ? (
              <div className="edit-image-grid">
                {images.map((image, index) => (
                  <div className="edit-image-item" key={`${image}-${index}`}>
                    <img src={image} alt={`Property ${index + 1}`} />

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      aria-label="Remove image"
                      disabled={saving}
                    >
                      ×
                    </button>

                    {index === 0 && <span>MAIN IMAGE</span>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-images">
                <span>⌂</span>

                <p>No property images added.</p>
              </div>
            )}
          </section>

          {/* =====================================
              ACTIONS
          ===================================== */}

          <div className="edit-form-actions">
            <Link to="/my-properties" className="cancel-edit-btn">
              Cancel
            </Link>

            <button
              type="submit"
              className="update-property-btn"
              disabled={saving}
            >
              {saving ? "Updating Property..." : "Update Property"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default EditProperty;
