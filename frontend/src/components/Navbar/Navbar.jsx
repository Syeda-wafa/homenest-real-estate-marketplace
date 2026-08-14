import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { logout } from "../../redux/authSlice";

import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [menuOpen, setMenuOpen] = useState(false);

  // =====================================
  // USER INFO
  // =====================================

  const displayName = user?.name || "HomeNest User";

  const userInitial = displayName.charAt(0).toUpperCase();

  // =====================================
  // CLOSE MOBILE MENU
  // =====================================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    dispatch(logout());

    closeMenu();

    toast.success("Logged out successfully");

    navigate("/");
  };

  // =====================================
  // NAV LINK CLASS
  // =====================================

  const navLinkClass = ({ isActive }) =>
    `navbar-link ${isActive ? "active" : ""}`;

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* =====================================
            LOGO
        ===================================== */}

        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="navbar-logo-mark">H</span>

          <span className="navbar-logo-text">
            Home<span>Nest</span>
          </span>
        </Link>

        {/* =====================================
            DESKTOP NAVIGATION
        ===================================== */}

        <nav className="navbar-nav">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/properties" className={navLinkClass}>
            Properties
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>

              <NavLink to="/saved-properties" className={navLinkClass}>
                Saved
              </NavLink>
            </>
          )}
        </nav>

        {/* =====================================
            RIGHT SIDE
        ===================================== */}

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              {/* SETTINGS */}

              <Link
                to="/settings"
                className="navbar-icon-btn"
                aria-label="Settings"
                title="Settings"
              >
                <span>⚙</span>
              </Link>

              {/* USER */}

              <Link to="/profile" className="navbar-user">
                <div className="navbar-avatar">{userInitial}</div>

                <div className="navbar-user-info">
                  <strong>{displayName}</strong>

                  <span>My Account</span>
                </div>
              </Link>

              {/* LOGOUT */}

              <button
                type="button"
                className="navbar-logout"
                onClick={handleLogout}
                title="Logout"
              >
                ↪
              </button>
            </>
          ) : (
            <>
              {/* SIGN IN */}

              <Link to="/login" className="navbar-login">
                Sign In
              </Link>

              {/* CREATE ACCOUNT */}

              <Link to="/register" className="navbar-register">
                Create Account
              </Link>
            </>
          )}
        </div>

        {/* =====================================
            MOBILE MENU BUTTON
        ===================================== */}

        <button
          type="button"
          className={`navbar-menu-btn ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* =====================================
          MOBILE MENU
      ===================================== */}

      <div className={`navbar-mobile-menu ${menuOpen ? "open" : ""}`}>
        <nav className="mobile-nav">
          {/* HOME */}

          <NavLink to="/" className={navLinkClass} onClick={closeMenu}>
            <span className="mobile-nav-icon">⌂</span>
            Home
          </NavLink>

          {/* PROPERTIES */}

          <NavLink
            to="/properties"
            className={navLinkClass}
            onClick={closeMenu}
          >
            <span className="mobile-nav-icon">⌕</span>
            Properties
          </NavLink>

          {isAuthenticated && (
            <>
              {/* DASHBOARD */}

              <NavLink
                to="/dashboard"
                className={navLinkClass}
                onClick={closeMenu}
              >
                <span className="mobile-nav-icon">◈</span>
                Dashboard
              </NavLink>

              {/* SAVED PROPERTIES */}

              <NavLink
                to="/saved-properties"
                className={navLinkClass}
                onClick={closeMenu}
              >
                <span className="mobile-nav-icon">♡</span>
                Saved Properties
              </NavLink>

              {/* PROFILE */}

              <NavLink
                to="/profile"
                className={navLinkClass}
                onClick={closeMenu}
              >
                <span className="mobile-nav-icon">◎</span>
                Profile
              </NavLink>

              {/* SETTINGS */}

              <NavLink
                to="/settings"
                className={navLinkClass}
                onClick={closeMenu}
              >
                <span className="mobile-nav-icon">⚙</span>
                Settings
              </NavLink>

              {/* MY PROPERTIES */}

              <NavLink
                to="/my-properties"
                className={navLinkClass}
                onClick={closeMenu}
              >
                <span className="mobile-nav-icon">⌂</span>
                My Properties
              </NavLink>

              {/* LOGOUT */}

              <button
                type="button"
                className="mobile-logout"
                onClick={handleLogout}
              >
                ↪ Sign Out
              </button>
            </>
          )}

          {/* =====================================
              MOBILE AUTH
          ===================================== */}

          {!isAuthenticated && (
            <div className="mobile-auth-actions">
              <Link to="/login" className="mobile-login" onClick={closeMenu}>
                Sign In
              </Link>

              <Link
                to="/register"
                className="mobile-register"
                onClick={closeMenu}
              >
                Create Account
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
