import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { logout } from "../../redux/authSlice";
import api from "../../services/api";

import "./Settings.css";

function Settings() {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const displayName = user?.name || "HomeNest User";
  const email = user?.email || "user@example.com";
  const phone = user?.phone || "Not added";

  // =========================
  // PASSWORD INPUT
  // =========================

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================
  // PASSWORD INPUT
  // =========================

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await api.put("/auth/change-password", passwordData);

      toast.success(response.data.message || "Password updated successfully");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPassword(false);
    } catch (error) {
      console.error("Change password error:", error);

      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    dispatch(logout());

    toast.success("Logged out successfully");

    navigate("/login");
  };

  // =========================
  // DELETE ACCOUNT
  // =========================

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      const response = await api.delete("/auth/account");

      toast.success(response.data.message || "Account deleted successfully");

      // Clear Redux auth state
      dispatch(logout());

      // Go to login
      navigate("/login");
    } catch (error) {
      console.error("Delete account error:", error);

      toast.error(error.response?.data?.message || "Failed to delete account");
    }
  };

  return (
    <div className="settings-page">
      <main className="settings-container">
        {/* =========================
            HEADER
        ========================= */}

        <section className="settings-header">
          <div>
            <span className="settings-label">ACCOUNT SETTINGS</span>

            <h1>Settings</h1>

            <p>Manage your account, password, and privacy preferences.</p>
          </div>

          <Link to="/dashboard" className="settings-back-btn">
            ← Dashboard
          </Link>
        </section>

        {/* =========================
            CONTENT
        ========================= */}

        <section className="settings-layout">
          {/* =========================
              LEFT NAVIGATION
          ========================= */}

          <aside className="settings-sidebar">
            <a href="#account" className="settings-nav-item active">
              <span>◉</span>

              <div>
                <strong>Account</strong>
                <small>Personal information</small>
              </div>
            </a>

            <a href="#password" className="settings-nav-item">
              <span>⌕</span>

              <div>
                <strong>Password</strong>
                <small>Security settings</small>
              </div>
            </a>

            <a href="#privacy" className="settings-nav-item">
              <span>◇</span>

              <div>
                <strong>Privacy</strong>
                <small>Your privacy</small>
              </div>
            </a>

            <div className="settings-sidebar-divider"></div>

            <button className="settings-logout-btn" onClick={handleLogout}>
              <span>↪</span>
              Logout
            </button>
          </aside>

          {/* =========================
              RIGHT CONTENT
          ========================= */}

          <div className="settings-content">
            {/* =========================
                ACCOUNT
            ========================= */}

            <section className="settings-card" id="account">
              <div className="settings-card-header">
                <div>
                  <span>PROFILE</span>

                  <h2>Account Information</h2>

                  <p>Your basic HomeNest account information.</p>
                </div>

                <div className="settings-profile-avatar">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              </div>

              <div className="settings-info-grid">
                <div className="settings-info-item">
                  <span>Full Name</span>
                  <strong>{displayName}</strong>
                </div>

                <div className="settings-info-item">
                  <span>Email Address</span>
                  <strong>{email}</strong>
                </div>

                <div className="settings-info-item">
                  <span>Phone Number</span>
                  <strong>{phone}</strong>
                </div>

                <div className="settings-info-item">
                  <span>Account Type</span>
                  <strong>HomeNest User</strong>
                </div>
              </div>

              <div className="settings-card-footer">
                <Link to="/profile" className="settings-secondary-btn">
                  Edit Profile
                </Link>
              </div>
            </section>

            {/* =========================
                PASSWORD
            ========================= */}

            <section className="settings-card" id="password">
              <div className="settings-section-title">
                <span>SECURITY</span>

                <h2>Change Password</h2>

                <p>Keep your account secure by using a strong password.</p>
              </div>

              <form
                className="settings-password-form"
                onSubmit={handlePasswordSubmit}
              >
                <div className="settings-form-group">
                  <label htmlFor="currentPassword">Current Password</label>

                  <input
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    name="currentPassword"
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                  />
                </div>

                <div className="settings-form-row">
                  <div className="settings-form-group">
                    <label htmlFor="newPassword">New Password</label>

                    <input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      placeholder="Minimum 6 characters"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>

                  <div className="settings-form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>

                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Repeat new password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                </div>

                <label className="show-password">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />

                  <span>Show password</span>
                </label>

                <button type="submit" className="settings-primary-btn">
                  Update Password
                </button>
              </form>
            </section>

            {/* =========================
                PRIVACY
            ========================= */}

            <section className="settings-card" id="privacy">
              <div className="settings-section-title">
                <span>PRIVACY</span>

                <h2>Privacy & Account</h2>

                <p>Manage your account privacy and account actions.</p>
              </div>

              <div className="privacy-options">
                <div className="privacy-option">
                  <div>
                    <strong>Profile Visibility</strong>

                    <p>
                      Your basic profile information can be shown when
                      contacting property owners.
                    </p>
                  </div>

                  <span className="privacy-status">Standard</span>
                </div>

                <div className="privacy-option">
                  <div>
                    <strong>Contact Information</strong>

                    <p>
                      Your contact details are only shared when you choose to
                      contact an owner.
                    </p>
                  </div>

                  <span className="privacy-status">Protected</span>
                </div>
              </div>
            </section>

            {/* =========================
                DANGER ZONE
            ========================= */}

            <section className="settings-danger-card">
              <div>
                <span>DANGER ZONE</span>

                <h2>Delete Account</h2>

                <p>
                  Permanently delete your HomeNest account and associated
                  information.
                </p>
              </div>

              <button
                className="delete-account-btn"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Settings;
