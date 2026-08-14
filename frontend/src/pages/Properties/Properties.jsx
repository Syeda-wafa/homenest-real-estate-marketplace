import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar/Navbar";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import api from "../../services/api";

import "./Properties.css";

function Properties() {
  const [properties, setProperties] = useState([]);

  const [search, setSearch] = useState("");
  const [purpose, setPurpose] = useState("All");
  const [propertyType, setPropertyType] = useState("All");
  const [sort, setSort] = useState("newest");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================
  // BACKEND URL
  // =====================================

  const SERVER_URL = "http://localhost:5000";

  // =====================================
  // CONVERT IMAGE PATH TO FULL URL
  // =====================================

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    // Already a complete URL
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    // Backend returns /uploads/filename.jpg
    if (image.startsWith("/")) {
      return `${SERVER_URL}${image}`;
    }

    // Backend returns uploads/filename.jpg
    return `${SERVER_URL}/${image}`;
  };

  // =====================================
  // PREPARE PROPERTY IMAGES
  // =====================================

  const prepareProperties = (propertyList) => {
    return propertyList.map((property) => ({
      ...property,

      images: Array.isArray(property.images)
        ? property.images.map(getImageUrl)
        : [],

      // Also provide a direct image property
      // in case PropertyCard uses property.image
      image:
        Array.isArray(property.images) && property.images.length > 0
          ? getImageUrl(property.images[0])
          : property.image
            ? getImageUrl(property.image)
            : "",
    }));
  };

  // =====================================
  // FETCH PROPERTIES
  // =====================================

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/properties");

      console.log("Properties response:", response.data);

      const propertyList = response.data.properties || [];

      const preparedProperties = prepareProperties(propertyList);

      console.log("Prepared properties:", preparedProperties);

      setProperties(preparedProperties);
    } catch (err) {
      console.error("Properties fetch error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load properties. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // FILTER + SEARCH + SORT
  // =====================================

  const filteredProperties = properties
    .filter((property) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        property.title?.toLowerCase().includes(searchValue) ||
        property.location?.toLowerCase().includes(searchValue);

      const matchesPurpose = purpose === "All" || property.purpose === purpose;

      const matchesPropertyType =
        propertyType === "All" || property.propertyType === propertyType;

      return matchesSearch && matchesPurpose && matchesPropertyType;
    })
    .sort((a, b) => {
      // Price low to high
      if (sort === "priceLow") {
        return Number(a.price || 0) - Number(b.price || 0);
      }

      // Price high to low
      if (sort === "priceHigh") {
        return Number(b.price || 0) - Number(a.price || 0);
      }

      // Newest first
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  // =====================================
  // CLEAR FILTERS
  // =====================================

  const clearFilters = () => {
    setSearch("");
    setPurpose("All");
    setPropertyType("All");
    setSort("newest");
  };

  // =====================================
  // RETRY
  // =====================================

  const handleRetry = () => {
    fetchProperties();
  };

  // =====================================
  // LOADING UI
  // =====================================

  if (loading) {
    return (
      <div className="properties-page">
        <Navbar />

        <main className="properties-container">
          <div className="properties-loading">
            <div className="loading-spinner"></div>

            <p>Loading properties...</p>
          </div>
        </main>
      </div>
    );
  }

  // =====================================
  // MAIN UI
  // =====================================

  return (
    <div className="properties-page">
      <Navbar />

      <main className="properties-container">
        {/* =====================================
            HEADER
        ===================================== */}

        <section className="properties-header">
          <div className="properties-header-content">
            <span className="properties-label">HOMENEST PROPERTIES</span>

            <h1>
              Find your next
              <span> home.</span>
            </h1>

            <p>
              Explore carefully selected properties for every lifestyle and
              budget.
            </p>
          </div>

          <div className="property-count">
            <strong>{filteredProperties.length}</strong>

            <span>Properties Found</span>
          </div>
        </section>

        {/* =====================================
            SEARCH
        ===================================== */}

        <section className="properties-search">
          <div className="search-input-wrapper">
            <span className="search-icon">⌕</span>

            <input
              type="text"
              placeholder="Search by property name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </section>

        {/* =====================================
            FILTERS
        ===================================== */}

        <section className="horizontal-filters">
          {/* PURPOSE */}

          <div className="filter-item">
            <label htmlFor="purpose">Purpose</label>

            <select
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            >
              <option value="All">All</option>

              <option value="Sale">Buy</option>

              <option value="Rent">Rent</option>
            </select>
          </div>

          {/* PROPERTY TYPE */}

          <div className="filter-item">
            <label htmlFor="propertyType">Property Type</label>

            <select
              id="propertyType"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="All">All Types</option>

              <option value="House">House</option>

              <option value="Apartment">Apartment</option>

              <option value="Villa">Villa</option>

              <option value="Plot">Plot</option>

              <option value="Commercial">Commercial</option>
            </select>
          </div>

          {/* CLEAR FILTERS */}

          <button
            type="button"
            className="clear-filters"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </section>

        {/* =====================================
            TOOLBAR
        ===================================== */}

        <section className="listing-toolbar">
          <div className="listing-result">
            <strong>{filteredProperties.length}</strong>

            <span>
              {filteredProperties.length === 1 ? "property" : "properties"}{" "}
              available
            </span>
          </div>

          <div className="sort-wrapper">
            <label htmlFor="sort">Sort by</label>

            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest</option>

              <option value="priceLow">Price: Low to High</option>

              <option value="priceHigh">Price: High to Low</option>
            </select>
          </div>
        </section>

        {/* =====================================
            ERROR
        ===================================== */}

        {error && (
          <div className="properties-error">
            <div className="empty-icon">!</div>

            <h2>Something went wrong</h2>

            <p>{error}</p>

            <button
              type="button"
              className="empty-reset-btn"
              onClick={handleRetry}
            >
              Try Again
            </button>
          </div>
        )}

        {/* =====================================
            PROPERTY LIST
        ===================================== */}

        {!error && (
          <section className="property-listing">
            {filteredProperties.length > 0 ? (
              <div className="property-grid">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            ) : (
              <div className="empty-properties">
                <div className="empty-icon">⌂</div>

                <h2>No properties found</h2>

                <p>
                  Try changing your search or filters to find more properties.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="empty-reset-btn"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default Properties;
