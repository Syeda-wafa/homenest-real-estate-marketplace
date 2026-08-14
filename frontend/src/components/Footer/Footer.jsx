import { Link } from "react-router-dom";

import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* =========================
            TOP FOOTER
        ========================= */}

        <div className="footer-top">
          {/* BRAND */}

          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span>H</span>
              HomeNest
            </Link>

            <p>
              A smarter way to discover, buy, rent, and manage properties. Find
              a place that feels like home.
            </p>

            <div className="footer-socials">
              <a href="#" aria-label="Facebook">
                f
              </a>

              <a href="#" aria-label="Instagram">
                ◎
              </a>

              <a href="#" aria-label="LinkedIn">
                in
              </a>

              <a href="#" aria-label="Twitter">
                𝕏
              </a>
            </div>
          </div>

          {/* EXPLORE */}

          <div className="footer-column">
            <h3>Explore</h3>

            <Link to="/properties">Properties</Link>

            <Link to="/properties?purpose=Sale">Properties for Sale</Link>

            <Link to="/properties?purpose=Rent">Properties for Rent</Link>
          </div>

          {/* PROPERTY */}

          <div className="footer-column">
            <h3>Property</h3>

            <Link to="/add-property">List a Property</Link>

            <Link to="/my-properties">My Properties</Link>

            <Link to="/properties">Browse Properties</Link>
          </div>

          {/* ACCOUNT */}

          <div className="footer-column">
            <h3>Account</h3>

            <Link to="/profile">My Profile</Link>

            <Link to="/login">Sign In</Link>

            <Link to="/register">Create Account</Link>
          </div>

          {/* CONTACT */}

          <div className="footer-column footer-contact">
            <h3>Get in touch</h3>

            <a href="mailto:hello@homenest.com">hello@homenest.com</a>

            <a href="tel:+923001234567">+92 300 1234567</a>

            <p>
              Islamabad,
              <br />
              Pakistan
            </p>
          </div>
        </div>

        {/* =========================
            BOTTOM FOOTER
        ========================= */}

        <div className="footer-bottom">
          <p>© {currentYear} HomeNest. All rights reserved.</p>

          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>

            <Link to="/terms">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
