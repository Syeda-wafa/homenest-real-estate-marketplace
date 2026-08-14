import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import Navbar from "../../components/Navbar/Navbar";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import api from "../../services/api";

import {
  removeFavorite,
  clearFavorites,
  setFavorites,
} from "../../redux/favoritesSlice";

import "./SavedProperties.css";

function SavedProperties() {
  const dispatch = useDispatch();

  // =====================================
  // BACKEND BASE URL
  // =====================================

  const SERVER_URL = "http://localhost:5000";

  // =====================================
  // STATE
  // =====================================

  const [favorites, setSavedProperties] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [removingId, setRemovingId] = useState(null);

  const [clearing, setClearing] = useState(false);

  // =====================================
  // GET PROPERTY ID
  // =====================================

  const getPropertyId = (property) => {
    return property?._id || property?.id;
  };

  // =====================================
  // FIX IMAGE URL
  // =====================================

  const getImageUrl = (image) => {
    // No image
    if (!image) {
      return null;
    }

    // If backend returns an object
    if (typeof image === "object") {
      image = image.url || image.path || image.filename || image.src || "";
    }

    if (!image) {
      return null;
    }

    // Already a complete URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("data:")
    ) {
      return image;
    }

    // Relative backend path
    if (image.startsWith("/")) {
      return `${SERVER_URL}${image}`;
    }

    // Example: uploads/property.jpg
    return `${SERVER_URL}/${image}`;
  };

  // =====================================
  // NORMALIZE PROPERTY IMAGES
  // =====================================

  const normalizeProperty = (property) => {
    if (!property) {
      return property;
    }

    let normalizedImages = [];

    if (Array.isArray(property.images)) {
      normalizedImages = property.images
        .map((image) => getImageUrl(image))
        .filter(Boolean);
    }

    // Support backend returning single image
    if (normalizedImages.length === 0 && property.image) {
      const imageUrl = getImageUrl(property.image);

      if (imageUrl) {
        normalizedImages = [imageUrl];
      }
    }

    return {
      ...property,
      images: normalizedImages,
    };
  };

  // =====================================
  // FETCH SAVED PROPERTIES
  // =====================================

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/favorites");

      console.log("Saved properties response:", response.data);

      const savedProperties =
        response.data?.favorites ||
        response.data?.properties ||
        response.data?.data ||
        [];

      // Normalize images
      const normalizedProperties = savedProperties.map(normalizeProperty);

      console.log("Normalized saved properties:", normalizedProperties);

      setSavedProperties(normalizedProperties);

      // Keep Redux synchronized
      dispatch(setFavorites(normalizedProperties));
    } catch (error) {
      console.error("Fetch favorites error:", error);

      const message =
        error.response?.data?.message ||
        "Failed to load saved properties. Please try again.";

      setError(message);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // =====================================
  // INITIAL FETCH
  // =====================================

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // =====================================
  // REMOVE FAVORITE
  // =====================================

  const handleRemove = async (property) => {
    const propertyId = getPropertyId(property);

    if (!propertyId) {
      toast.error("Invalid property.");
      return;
    }

    try {
      setRemovingId(propertyId);

      await api.delete(`/favorites/${propertyId}`);

      // Remove from local state
      setSavedProperties((prev) =>
        prev.filter((item) => getPropertyId(item) !== propertyId),
      );

      // Remove from Redux
      dispatch(removeFavorite(propertyId));

      toast.success("Property removed from saved properties.");
    } catch (error) {
      console.error("Remove favorite error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to remove property. Please try again.",
      );
    } finally {
      setRemovingId(null);
    }
  };

  // =====================================
  // CLEAR ALL FAVORITES
  // =====================================

  const handleClearAll = async () => {
    if (favorites.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to remove all saved properties?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setClearing(true);

      await api.delete("/favorites/clear");

      setSavedProperties([]);

      dispatch(clearFavorites());

      toast.success("All saved properties removed.");
    } catch (error) {
      console.error("Clear favorites error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to clear saved properties. Please try again.",
      );
    } finally {
      setClearing(false);
    }
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="saved-page">
        <Navbar />

        <main className="saved-container">
          <section className="saved-loading">
            <div className="loading-spinner"></div>

            <h3>Loading saved properties...</h3>

            <p>Please wait while we fetch your saved properties.</p>
          </section>
        </main>
      </div>
    );
  }

  // =====================================
  // ERROR
  // =====================================

  if (error) {
    return (
      <div className="saved-page">
        <Navbar />

        <main className="saved-container">
          <section className="saved-error">
            <div className="empty-saved-icon">!</div>

            <span className="empty-saved-label">
              UNABLE TO LOAD SAVED PROPERTIES
            </span>

            <h2>Something went wrong.</h2>

            <p>{error}</p>

            <button
              type="button"
              className="browse-saved-btn"
              onClick={fetchFavorites}
            >
              Try Again
            </button>
          </section>
        </main>
      </div>
    );
  }

  // =====================================
  // UI
  // =====================================

  return (
    <div className="saved-page">
      <Navbar />

      <main className="saved-container">
        {/* =========================
            HEADER
        ========================= */}

        <section className="saved-header">
          <div>
            <span className="saved-label">YOUR COLLECTION</span>

            <h1>
              Saved <span>Properties.</span>
            </h1>

            <p>
              Keep track of the properties you love and come back to them
              whenever you want.
            </p>
          </div>

          <div className="saved-count">
            <strong>{favorites.length}</strong>

            <span>
              {favorites.length === 1 ? "Saved Property" : "Saved Properties"}
            </span>
          </div>
        </section>

        {/* =========================
            TOOLBAR
        ========================= */}

        {favorites.length > 0 && (
          <section className="saved-toolbar">
            <div>
              <strong>{favorites.length}</strong>

              <span>
                {favorites.length === 1 ? "property saved" : "properties saved"}
              </span>
            </div>

            <button
              type="button"
              className="clear-saved-btn"
              onClick={handleClearAll}
              disabled={clearing}
            >
              {clearing ? "Clearing..." : "Clear All"}
            </button>
          </section>
        )}

        {/* =========================
            SAVED PROPERTIES
        ========================= */}

        {favorites.length > 0 ? (
          <section className="saved-listing">
            {favorites.map((property) => {
              const propertyId = getPropertyId(property);

              return (
                <article className="saved-property-wrapper" key={propertyId}>
                  <PropertyCard property={property} />

                  <button
                    type="button"
                    className="remove-saved-btn"
                    onClick={() => handleRemove(property)}
                    disabled={removingId === propertyId || clearing}
                  >
                    {removingId === propertyId
                      ? "Removing..."
                      : "♡ Remove from Saved"}
                  </button>
                </article>
              );
            })}
          </section>
        ) : (
          /* =========================
             EMPTY STATE
          ========================= */

          <section className="empty-saved">
            <div className="empty-saved-icon">♡</div>

            <span className="empty-saved-label">NO SAVED PROPERTIES</span>

            <h2>Your saved list is empty.</h2>

            <p>
              When you find a property you love, save it here so you can easily
              find it later.
            </p>

            <Link to="/properties" className="browse-saved-btn">
              Browse Properties
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}

export default SavedProperties;
