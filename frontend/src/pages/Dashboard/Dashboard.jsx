import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../../components/Navbar/Navbar";
import api from "../../services/api";

import "./Dashboard.css";

function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  const favorites = useSelector((state) => state.favorites?.favorites || []);

  // =====================================
  // STATE
  // =====================================

  const [dashboard, setDashboard] = useState({
    stats: {
      totalProperties: 0,
      savedProperties: 0,
      activeListings: 0,
      totalViews: 0,
      draftListings: 0,
    },
    recentProperties: [],
  });

  const [loading, setLoading] = useState(true);

  // =====================================
  // USER
  // =====================================

  const displayName = user?.name || "HomeNest User";

  const firstName = displayName.split(" ")[0];

  // =====================================
  // FETCH DASHBOARD
  // =====================================

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const response = await api.get("/properties/dashboard");

        console.log("Dashboard response:", response.data);

        setDashboard({
          stats: {
            totalProperties: response.data.stats?.totalProperties || 0,

            savedProperties: response.data.stats?.savedProperties || 0,

            activeListings: response.data.stats?.activeListings || 0,

            totalViews: response.data.stats?.totalViews || 0,

            draftListings: response.data.stats?.draftListings || 0,
          },

          recentProperties: response.data.recentProperties || [],
        });
      } catch (error) {
        console.error("Dashboard fetch error:", error);

        toast.error(
          error.response?.data?.message || "Failed to load dashboard.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // =====================================
  // STATS
  // =====================================

  const stats = [
    {
      number: dashboard.stats.totalProperties,
      label: "Total Properties",
      icon: "⌂",
      link: "/my-properties",
    },

    {
      number: favorites.length,
      label: "Saved Properties",
      icon: "♡",
      link: "/saved-properties",
    },

    {
      number: dashboard.stats.activeListings,
      label: "Active Listings",
      icon: "◈",
      link: "/my-properties",
    },
  ];

  // =====================================
  // FORMAT PRICE
  // =====================================

  const formatPrice = (price, purpose) => {
    if (!price) {
      return "Rs. 0";
    }

    const formattedPrice = Number(price).toLocaleString();

    if (purpose === "Rent") {
      return `Rs. ${formattedPrice} / month`;
    }

    return `Rs. ${formattedPrice}`;
  };

  // =====================================
  // PROPERTY IMAGE
  // =====================================

  const getPropertyImage = (property) => {
    if (Array.isArray(property.images) && property.images.length > 0) {
      const image = property.images[0];

      if (image.startsWith("http")) {
        return image;
      }

      return `http://localhost:5000${image}`;
    }

    if (property.image) {
      if (property.image.startsWith("http")) {
        return property.image;
      }

      return `http://localhost:5000${property.image}`;
    }

    return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80";
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="dashboard-page">
        <Navbar />

        <main className="dashboard-container">
          <div className="dashboard-loading">
            <div className="loading-spinner"></div>

            <h3>Loading your dashboard...</h3>

            <p>Please wait while we fetch your HomeNest activity.</p>
          </div>
        </main>
      </div>
    );
  }

  // =====================================
  // UI
  // =====================================

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-container">
        {/* =====================================
            WELCOME
        ===================================== */}

        <section className="dashboard-welcome">
          <div className="welcome-content">
            <span className="dashboard-label">HOMENEST DASHBOARD</span>

            <h1>
              Welcome back, <span>{firstName}.</span>
            </h1>

            <p>
              Manage your properties, saved homes and account activity from one
              place.
            </p>
          </div>

          <Link to="/add-property" className="add-property-dashboard-btn">
            <span>＋</span>
            List a Property
          </Link>
        </section>

        {/* =====================================
            STATS
        ===================================== */}

        <section className="dashboard-stats">
          {stats.map((stat) => (
            <Link to={stat.link} className="dashboard-stat" key={stat.label}>
              <div className="stat-icon">{stat.icon}</div>

              <div className="stat-content">
                <strong>{stat.number}</strong>

                <span>{stat.label}</span>
              </div>

              <div className="stat-arrow">→</div>
            </Link>
          ))}
        </section>

        {/* =====================================
            MAIN DASHBOARD
        ===================================== */}

        <section className="dashboard-main">
          {/* =====================================
              LEFT CONTENT
          ===================================== */}

          <div className="dashboard-content">
            {/* SECTION HEADER */}

            <div className="dashboard-section-header">
              <div>
                <span>YOUR ACTIVITY</span>

                <h2>Recent Properties</h2>
              </div>

              <Link to="/my-properties">View all →</Link>
            </div>

            {/* =====================================
                RECENT PROPERTIES
            ===================================== */}

            {dashboard.recentProperties.length > 0 ? (
              <div className="dashboard-properties">
                {dashboard.recentProperties.map((property) => (
                  <Link
                    to={`/properties/${property._id}`}
                    className="dashboard-property"
                    key={property._id}
                  >
                    {/* IMAGE */}

                    <div className="dashboard-property-image">
                      <img
                        src={getPropertyImage(property)}
                        alt={property.title}
                      />

                      <span className="property-purpose">
                        {property.purpose}
                      </span>

                      <button
                        type="button"
                        className="property-heart"
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                        aria-label="Save property"
                      >
                        ♡
                      </button>
                    </div>

                    {/* INFO */}

                    <div className="dashboard-property-info">
                      <span className="property-type">
                        {property.propertyType || "PROPERTY"}
                      </span>

                      <h3>{property.title}</h3>

                      <p className="property-location">⌖ {property.location}</p>

                      <strong>
                        {formatPrice(property.price, property.purpose)}
                      </strong>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              /* =====================================
                  EMPTY STATE
              ===================================== */

              <div className="dashboard-empty">
                <div className="empty-icon">+</div>

                <h3>No properties yet</h3>

                <p>Start by adding your first property listing.</p>

                <Link to="/add-property" className="add-property-dashboard-btn">
                  ＋ Add Property
                </Link>
              </div>
            )}

            {/* =====================================
                VIEW ALL
            ===================================== */}

            <Link to="/properties" className="dashboard-view-properties">
              Explore all properties
              <span>→</span>
            </Link>
          </div>

          {/* =====================================
              RIGHT SIDEBAR
          ===================================== */}

          <aside className="dashboard-sidebar">
            {/* =====================================
                PROPERTY MANAGEMENT
            ===================================== */}

            <div className="dashboard-list-card">
              <div>
                <span className="card-label">PROPERTY MANAGEMENT</span>

                <h3>Manage your listings</h3>

                <p>View, edit and manage all your properties.</p>
              </div>

              <Link to="/my-properties" className="manage-properties-btn">
                My Properties
                <span>→</span>
              </Link>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
