import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import Navbar from "../../components/Navbar/Navbar";
import api from "../../services/api";

import { addFavorite, removeFavorite } from "../../redux/favoritesSlice";

import "./PropertyDetails.css";

function PropertyDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  // =====================================
  // CONSTANTS
  // =====================================

  const SERVER_URL = "http://localhost:5000";

  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80";

  // =====================================
  // REDUX
  // =====================================

  const favorites = useSelector((state) => state.favorites?.favorites || []);

  // =====================================
  // STATE
  // =====================================

  const [property, setProperty] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [activeImage, setActiveImage] = useState(0);

  // =====================================
  // CONVERT IMAGE PATH
  // =====================================

  const getImageUrl = (image) => {
    if (!image) {
      return FALLBACK_IMAGE;
    }

    // Already complete URL
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    // Backend returns:
    // /uploads/filename.jpg

    if (image.startsWith("/")) {
      return `${SERVER_URL}${image}`;
    }

    // Backend returns:
    // uploads/filename.jpg

    return `${SERVER_URL}/${image}`;
  };

  // =====================================
  // IMAGE ERROR FALLBACK
  // =====================================

  const handleImageError = (e) => {
    if (e.currentTarget.src !== FALLBACK_IMAGE) {
      e.currentTarget.src = FALLBACK_IMAGE;
    }
  };

  // =====================================
  // FETCH PROPERTY
  // =====================================

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");
        setActiveImage(0);

        const response = await api.get(`/properties/${id}`);

        console.log("Property details response:", response.data);

        if (!response.data?.property) {
          setError("Property not found");
          return;
        }

        setProperty(response.data.property);
      } catch (error) {
        console.error("Property fetch error:", error);

        setError(error.response?.data?.message || "Failed to load property");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // =====================================
  // PROPERTY ID
  // =====================================

  const propertyId = property?._id || property?.id;

  // =====================================
  // CHECK FAVORITE
  // =====================================

  const isFavorite = favorites.some(
    (item) => (item?._id || item?.id) === propertyId,
  );

  // =====================================
  // FAVORITE HANDLER
  // =====================================

  const handleFavorite = async () => {
    if (!property) {
      return;
    }

    const currentPropertyId = property._id;

    try {
      if (isFavorite) {
        await api.delete(`/favorites/${currentPropertyId}`);

        dispatch(removeFavorite(currentPropertyId));

        toast.success("Removed from saved properties");
      } else {
        await api.post(`/favorites/${currentPropertyId}`);

        dispatch(addFavorite(property));

        toast.success("Property saved successfully");
      }
    } catch (error) {
      console.error("Favorite error:", error);

      toast.error(
        error.response?.data?.message || "Failed to update saved property.",
      );
    }
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="property-details-page">
        <Navbar />

        <main className="property-loading">
          <div className="loading-spinner"></div>

          <p>Loading property...</p>
        </main>
      </div>
    );
  }

  // =====================================
  // ERROR / NOT FOUND
  // =====================================

  if (error || !property) {
    return (
      <div className="property-details-page">
        <Navbar />

        <main className="property-not-found">
          <div className="not-found-icon">⌂</div>

          <span className="not-found-label">PROPERTY UNAVAILABLE</span>

          <h1>Property Not Found</h1>

          <p>{error || "The property you are looking for does not exist."}</p>

          <Link to="/properties" className="back-properties-btn">
            Browse Properties
          </Link>
        </main>
      </div>
    );
  }

  // =====================================
  // PROPERTY IMAGES
  // =====================================

  const propertyImages =
    Array.isArray(property.images) && property.images.length > 0
      ? property.images.map(getImageUrl)
      : [FALLBACK_IMAGE];

  // =====================================
  // SAFE ACTIVE IMAGE
  // =====================================

  const currentImage = propertyImages[activeImage] || FALLBACK_IMAGE;

  // =====================================
  // MAIN UI
  // =====================================

  return (
    <div className="property-details-page">
      <Navbar />

      <main className="property-details-container">
        {/* =====================================
            BACK BUTTON
        ===================================== */}

        <Link to="/properties" className="back-link">
          ← Back to Properties
        </Link>

        {/* =====================================
            IMAGE GALLERY
        ===================================== */}

        <section className="property-gallery">
          {/* MAIN IMAGE */}

          <div className="main-property-image">
            <img
              src={currentImage}
              alt={property.title}
              onError={handleImageError}
            />

            <div className="gallery-overlay"></div>

            {/* BADGES */}

            <div className="gallery-badges">
              <span className="gallery-purpose">{property.purpose}</span>

              <button
                type="button"
                className={`gallery-favorite ${isFavorite ? "active" : ""}`}
                onClick={handleFavorite}
                aria-label={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                {isFavorite ? "♥" : "♡"}
              </button>
            </div>

            {/* IMAGE COUNTER */}

            {propertyImages.length > 1 && (
              <div className="gallery-counter">
                {activeImage + 1} / {propertyImages.length}
              </div>
            )}
          </div>

          {/* =====================================
              THUMBNAILS
          ===================================== */}

          {propertyImages.length > 1 && (
            <div className="thumbnail-gallery">
              {propertyImages.map((image, index) => (
                <button
                  type="button"
                  key={`${image}-${index}`}
                  className={`thumbnail ${
                    activeImage === index ? "active" : ""
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <img
                    src={image}
                    alt={`${property.title} ${index + 1}`}
                    onError={handleImageError}
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* =====================================
            PROPERTY DETAILS
        ===================================== */}

        <section className="property-details-layout">
          {/* =====================================
              MAIN CONTENT
          ===================================== */}

          <div className="property-main-info">
            {/* HEADING */}

            <div className="property-heading">
              <span className="details-property-type">
                {property.propertyType || "PROPERTY"}
              </span>

              <h1>{property.title}</h1>

              <p className="details-location">
                <span>⌖</span>

                {property.location}
              </p>
            </div>

            {/* =====================================
                PRICE
            ===================================== */}

            <div className="details-price">
              <div className="price-content">
                <span>
                  {property.purpose === "Rent"
                    ? "Monthly Rent"
                    : "Asking Price"}
                </span>

                <strong>
                  Rs. {Number(property.price || 0).toLocaleString()}
                </strong>
              </div>

              {property.purpose === "Rent" && <small>/ month</small>}
            </div>

            {/* =====================================
                FEATURES
            ===================================== */}

            <div className="property-features">
              <div className="feature">
                <div className="feature-icon">🛏</div>

                <div>
                  <strong>{property.bedrooms || 0}</strong>

                  <span>Bedrooms</span>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">◉</div>

                <div>
                  <strong>{property.bathrooms || 0}</strong>

                  <span>Bathrooms</span>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">▣</div>

                <div>
                  <strong>{Number(property.area || 0).toLocaleString()}</strong>

                  <span>Square Feet</span>
                </div>
              </div>
            </div>

            {/* =====================================
                DESCRIPTION
            ===================================== */}

            <div className="property-description">
              <span className="section-label">PROPERTY OVERVIEW</span>

              <h2>About this property</h2>

              <p>
                {property.description ||
                  "No description has been provided for this property."}
              </p>
            </div>

            {/* =====================================
                PROPERTY INFORMATION
            ===================================== */}

            <div className="property-information">
              <span className="section-label">DETAILS</span>

              <h2>Property Information</h2>

              <div className="information-grid">
                <div>
                  <span>Property Type</span>

                  <strong>{property.propertyType || "—"}</strong>
                </div>

                <div>
                  <span>Purpose</span>

                  <strong>{property.purpose || "—"}</strong>
                </div>

                <div>
                  <span>Bedrooms</span>

                  <strong>{property.bedrooms || 0}</strong>
                </div>

                <div>
                  <span>Bathrooms</span>

                  <strong>{property.bathrooms || 0}</strong>
                </div>

                <div>
                  <span>Area</span>

                  <strong>
                    {property.area
                      ? `${Number(property.area).toLocaleString()} sq ft`
                      : "—"}
                  </strong>
                </div>

                <div>
                  <span>Location</span>

                  <strong>{property.location || "—"}</strong>
                </div>
              </div>
            </div>

            {/* =====================================
                SAVE PROPERTY
            ===================================== */}

            <div className="details-save-section">
              <button
                type="button"
                className={`save-property-btn ${isFavorite ? "saved" : ""}`}
                onClick={handleFavorite}
              >
                {isFavorite ? "♥ Saved Property" : "♡ Save Property"}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default PropertyDetails;
