import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";

import "./MyProperties.css";

function MyProperties() {
  const navigate = useNavigate();

  // =====================================
  // STATE
  // =====================================

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // =====================================
  // FETCH MY PROPERTIES
  // =====================================

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const fetchMyProperties = async () => {
    try {
      setLoading(true);

      const response = await api.get("/properties/my-properties");

      console.log("My properties response:", response.data);

      const data = response.data.properties || response.data.data || [];

      setProperties(data);
    } catch (error) {
      console.error("Fetch my properties error:", error);

      toast.error(
        error.response?.data?.message || "Failed to load your properties.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // DELETE PROPERTY
  // =====================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await api.delete(`/properties/${id}`);

      console.log("Delete property response:", response.data);

      setProperties((prev) => prev.filter((property) => property._id !== id));

      toast.success("Property deleted successfully!");
    } catch (error) {
      console.error("Delete property error:", error);

      toast.error(
        error.response?.data?.message || "Failed to delete property.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================
  // FORMAT PRICE
  // =====================================

  const formatPrice = (price) => {
    if (!price) {
      return "Rs. 0";
    }

    return `Rs. ${Number(price).toLocaleString()}`;
  };

  // =====================================
  // PROPERTY IMAGE
  // =====================================

  const getPropertyImage = (property) => {
    if (Array.isArray(property.images) && property.images.length > 0) {
      const image = property.images[0];

      // Already a complete URL
      if (image.startsWith("http")) {
        return image;
      }

      // Backend local image
      return `http://localhost:5000${image}`;
    }

    // Single image fallback
    if (property.image) {
      return property.image;
    }

    // Default image
    return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80";
  };

  // =====================================
  // LOADING UI
  // =====================================

  if (loading) {
    return (
      <main className="my-properties-page">
        <div className="my-properties-container">
          <div className="my-properties-loading">
            <div className="loading-spinner"></div>

            <h3>Loading your properties...</h3>

            <p>Please wait while we fetch your listings.</p>
          </div>
        </div>
      </main>
    );
  }

  // =====================================
  // MAIN UI
  // =====================================

  return (
    <main className="my-properties-page">
      <div className="my-properties-container">
        {/* =========================
            HEADER
        ========================= */}

        <section className="my-properties-header">
          <div>
            <span className="my-properties-label">PROPERTY MANAGEMENT</span>

            <h1>My properties.</h1>

            <p>
              Manage your property listings, update details, and keep your
              listings organized.
            </p>
          </div>

          <Link to="/add-property" className="add-property-btn">
            + Add Property
          </Link>
        </section>

        {/* =========================
            STATS
        ========================= */}

        <section className="property-management-stats">
          <div className="management-stat">
            <span>Total Listings</span>

            <strong>{properties.length}</strong>
          </div>

          <div className="management-stat">
            <span>Active Listings</span>

            <strong>{properties.length}</strong>
          </div>
        </section>

        {/* =========================
            LISTING COUNT
        ========================= */}

        <section className="my-properties-toolbar">
          <div>
            <strong>{properties.length}</strong>

            <span>{properties.length === 1 ? " listing" : " listings"}</span>
          </div>
        </section>

        {/* =========================
            EMPTY STATE
        ========================= */}

        {properties.length === 0 && (
          <section className="my-properties-empty">
            <div className="empty-icon">+</div>

            <h2>You don't have any properties yet.</h2>

            <p>Start by adding your first property listing to HomeNest.</p>

            <Link to="/add-property" className="add-property-btn">
              + Add Your First Property
            </Link>
          </section>
        )}

        {/* =========================
            PROPERTY LIST
        ========================= */}

        {properties.length > 0 && (
          <section className="my-property-list">
            {properties.map((property) => (
              <article className="my-property-card" key={property._id}>
                {/* =========================
                    IMAGE
                ========================= */}

                <div className="my-property-image">
                  <img src={getPropertyImage(property)} alt={property.title} />

                  <span className="property-status active">Active</span>
                </div>

                {/* =========================
                    CONTENT
                ========================= */}

                <div className="my-property-content">
                  <span className="my-property-type">
                    {property.propertyType || "Property"}
                    {" · "}
                    {property.purpose || "Sale"}
                  </span>

                  <h2>{property.title}</h2>

                  <p className="my-property-location">⌖ {property.location}</p>

                  {/* PRICE */}

                  <div className="my-property-price">
                    <strong>{formatPrice(property.price)}</strong>

                    {property.purpose === "Rent" && <span>/ month</span>}
                  </div>

                  {/* FEATURES */}

                  <div className="my-property-features">
                    <span>
                      <strong>{property.bedrooms || 0}</strong>
                      Beds
                    </span>

                    <span>
                      <strong>{property.bathrooms || 0}</strong>
                      Baths
                    </span>

                    <span>
                      <strong>{property.area || 0}</strong>
                      sq ft
                    </span>
                  </div>
                </div>

                {/* =========================
                    ACTIONS
                ========================= */}

                <div className="my-property-actions">
                  {/* VIEW */}

                  <button
                    type="button"
                    className="view-property-btn"
                    onClick={() => navigate(`/properties/${property._id}`)}
                  >
                    View
                  </button>

                  {/* EDIT */}

                  <button
                    type="button"
                    className="edit-property-btn"
                    onClick={() => navigate(`/edit-property/${property._id}`)}
                  >
                    Edit
                  </button>

                  {/* DELETE */}

                  <button
                    type="button"
                    className="delete-property-btn"
                    onClick={() => handleDelete(property._id)}
                    disabled={deletingId === property._id}
                  >
                    {deletingId === property._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

export default MyProperties;
