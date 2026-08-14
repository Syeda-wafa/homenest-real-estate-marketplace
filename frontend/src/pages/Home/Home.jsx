import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const [searchData, setSearchData] = useState({
    location: "",
    purpose: "",
    propertyType: "",
  });

  // =====================================
  // SEARCH INPUT
  // =====================================

  const handleChange = (e) => {
    setSearchData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =====================================
  // SEARCH
  // =====================================

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (searchData.location.trim()) {
      params.append("location", searchData.location.trim());
    }

    if (searchData.purpose) {
      params.append("purpose", searchData.purpose);
    }

    if (searchData.propertyType) {
      params.append("propertyType", searchData.propertyType);
    }

    const query = params.toString();

    navigate(query ? `/properties?${query}` : "/properties");
  };

  return (
    <div className="home-page">
      <Navbar />

      <main>
        {/* =====================================
            HERO
        ===================================== */}

        <section className="hero-section">
          <div className="hero-container">
            <div className="hero-content">
              <span className="hero-label">FIND YOUR PLACE</span>

              <h1>
                Find a place
                <br />
                <span>you'll love to call home.</span>
              </h1>

              <p>
                Discover properties that match your lifestyle. Explore, compare,
                save, and find your next home with HomeNest.
              </p>

              <div className="hero-buttons">
                <Link to="/properties" className="primary-btn">
                  Explore Properties
                </Link>

                <Link to="/add-property" className="secondary-btn">
                  List Your Property
                </Link>
              </div>
            </div>

            {/* HERO VISUAL */}

            <div className="hero-visual">
              <div className="hero-image-card">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"
                  alt="Modern home"
                />

                <div className="hero-image-overlay"></div>

                <div className="hero-image-content">
                  <span>HOME NEST</span>
                  <strong>Find your next home.</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================
            SEARCH
        ===================================== */}

        <section className="search-section">
          <div className="search-container">
            <div className="search-heading">
              <span>PROPERTY SEARCH</span>

              <h2>What are you looking for?</h2>
            </div>

            <form className="search-box" onSubmit={handleSearch}>
              {/* LOCATION */}

              <div className="search-field">
                <label htmlFor="location">Location</label>

                <input
                  id="location"
                  type="text"
                  name="location"
                  placeholder="Islamabad, Lahore..."
                  value={searchData.location}
                  onChange={handleChange}
                />
              </div>

              {/* PURPOSE */}

              <div className="search-field">
                <label htmlFor="purpose">Purpose</label>

                <select
                  id="purpose"
                  name="purpose"
                  value={searchData.purpose}
                  onChange={handleChange}
                >
                  <option value="">Buy or Rent</option>

                  <option value="Sale">Buy</option>

                  <option value="Rent">Rent</option>
                </select>
              </div>

              {/* PROPERTY TYPE */}

              <div className="search-field">
                <label htmlFor="propertyType">Property Type</label>

                <select
                  id="propertyType"
                  name="propertyType"
                  value={searchData.propertyType}
                  onChange={handleChange}
                >
                  <option value="">All Types</option>

                  <option value="House">House</option>

                  <option value="Apartment">Apartment</option>

                  <option value="Villa">Villa</option>

                  <option value="Plot">Plot</option>

                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              {/* SEARCH BUTTON */}

              <button type="submit" className="search-btn">
                Search Properties
              </button>
            </form>
          </div>
        </section>

        {/* =====================================
            SIMPLE CTA
        ===================================== */}

        <section className="home-cta">
          <div className="home-cta-content">
            <span>READY TO FIND YOUR PLACE?</span>

            <h2>
              Your next home
              <br />
              is waiting.
            </h2>

            <p>
              Browse available properties and discover a place that feels right
              for you.
            </p>

            <Link to="/properties" className="cta-btn">
              Browse Properties →
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}

export default Home;
