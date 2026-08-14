import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";

import "./NotFound.css";

function NotFound() {
  return (
    <div className="not-found-page">
      <Navbar />

      <main className="not-found-container">
        {/* DECORATIVE BACKGROUND */}
        <div className="not-found-circle circle-one"></div>
        <div className="not-found-circle circle-two"></div>

        <section className="not-found-content">
          {/* LOGO MARK */}
          <div className="not-found-logo">H</div>

          {/* 404 */}
          <span className="not-found-number">404</span>

          <span className="not-found-label">PAGE NOT FOUND</span>

          <h1>
            Looks like you've
            <br />
            <span>taken a wrong turn.</span>
          </h1>

          <p>
            The page you're looking for doesn't exist or may have been moved.
            Let's get you back home and help you find your perfect property.
          </p>

          {/* ACTIONS */}
          <div className="not-found-actions">
            <Link to="/" className="not-found-primary-btn">
              Back to Home
              <span>→</span>
            </Link>

            <Link to="/properties" className="not-found-secondary-btn">
              Browse Properties
            </Link>
          </div>
        </section>

        {/* BOTTOM MESSAGE */}
        <div className="not-found-footer-text">
          <span>HOMENEST</span>
          <p>Find a place you'll love to call home.</p>
        </div>
      </main>
    </div>
  );
}

export default NotFound;
