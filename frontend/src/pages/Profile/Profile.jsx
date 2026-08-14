import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../../components/Navbar/Navbar";
import api from "../../services/api";
import { updateUser } from "../../redux/authSlice";

import "./Profile.css";

function Profile() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // =====================================
  // FETCH PROFILE
  // =====================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const response = await api.get("/users/profile");

        console.log("Profile response:", response.data);

        const profileUser = response.data.user;

        setFormData({
          name: profileUser?.name || "",
          email: profileUser?.email || "",
          phone: profileUser?.phone || "",
        });

        dispatch(updateUser(profileUser));
      } catch (error) {
        console.error("Profile fetch error:", error);

        // If backend profile route is not available yet,
        // use Redux user data as fallback.
        setFormData({
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
        });

        toast.error(
          error.response?.data?.message ||
            "Failed to load profile information.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [dispatch]);

  // =====================================
  // HANDLE INPUT
  // =====================================

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =====================================
  // SAVE PROFILE
  // =====================================

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      setSaving(true);

      const response = await api.put("/users/profile", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      });

      console.log("Profile update response:", response.data);

      const updatedUser = response.data.user;

      // Update Redux
      dispatch(updateUser(updatedUser));

      // Update local form
      setFormData({
        name: updatedUser?.name || "",
        email: updatedUser?.email || "",
        phone: updatedUser?.phone || "",
      });

      setIsEditing(false);

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // CANCEL EDIT
  // =====================================

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });

    setIsEditing(false);
  };

  // =====================================
  // USER DISPLAY DATA
  // =====================================

  const userName = formData.name || user?.name || "HomeNest User";

  const userInitial = userName.charAt(0).toUpperCase();

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar />

        <main className="profile-container">
          <div className="profile-loading">
            <div className="profile-loading-spinner"></div>

            <p>Loading your profile...</p>
          </div>
        </main>
      </div>
    );
  }

  // =====================================
  // MAIN UI
  // =====================================

  return (
    <div className="profile-page">
      <Navbar />

      <main className="profile-container">
        {/* =====================================
            PAGE HEADER
        ===================================== */}

        <section className="profile-header">
          <div>
            <span className="profile-label">ACCOUNT</span>

            <h1>My Profile</h1>

            <p>
              Manage your personal information and HomeNest account details.
            </p>
          </div>

          <Link to="/dashboard" className="profile-back-link">
            ← Back to Dashboard
          </Link>
        </section>

        {/* =====================================
            PROFILE LAYOUT
        ===================================== */}

        <section className="profile-layout">
          {/* =====================================
              LEFT PROFILE CARD
          ===================================== */}

          <aside className="profile-sidebar">
            <div className="profile-avatar">{userInitial}</div>

            <h2>{userName}</h2>

            <p>{formData.email || "user@example.com"}</p>

            <span className="profile-member">HomeNest Member</span>

            <div className="profile-sidebar-divider"></div>

            <div className="profile-sidebar-item">
              <span>ACCOUNT STATUS</span>

              <strong>Active</strong>
            </div>

            <div className="profile-sidebar-item">
              <span>MEMBER SINCE</span>

              <strong>
                {user?.createdAt
                  ? new Date(user.createdAt).getFullYear()
                  : "2026"}
              </strong>
            </div>
          </aside>

          {/* =====================================
              RIGHT CONTENT
          ===================================== */}

          <div className="profile-content">
            {/* =====================================
                PERSONAL INFORMATION
            ===================================== */}

            <div className="profile-card">
              <div className="profile-card-header">
                <div>
                  <span>PERSONAL INFORMATION</span>

                  <h2>Account Details</h2>
                </div>

                {!isEditing && (
                  <button
                    type="button"
                    className="edit-profile-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {/* =====================================
                  FORM
              ===================================== */}

              <form onSubmit={handleSave}>
                <div className="profile-form-grid">
                  {/* NAME */}

                  <div className="profile-form-group">
                    <label htmlFor="name">Full Name</label>

                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing || saving}
                      placeholder="Your full name"
                    />
                  </div>

                  {/* PHONE */}

                  <div className="profile-form-group">
                    <label htmlFor="phone">Phone Number</label>

                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing || saving}
                      placeholder="03XX XXXXXXX"
                    />
                  </div>

                  {/* EMAIL */}

                  <div className="profile-form-group full-width">
                    <label htmlFor="email">Email Address</label>

                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing || saving}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* =====================================
                    EDIT ACTIONS
                ===================================== */}

                {isEditing && (
                  <div className="profile-form-actions">
                    <button
                      type="button"
                      className="cancel-profile-btn"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="save-profile-btn"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* =====================================
                ACCOUNT SETTINGS
            ===================================== */}

            <div className="profile-card account-settings">
              <div className="profile-card-header">
                <div>
                  <span>ACCOUNT</span>

                  <h2>Account Settings</h2>
                </div>
              </div>

              <div className="settings-list">
                {/* PASSWORD */}

                <div className="setting-item">
                  <div className="setting-icon">🔒</div>

                  <div className="setting-info">
                    <strong>Password & Security</strong>

                    <span>Manage your password and account security.</span>
                  </div>

                  <Link to="/settings">Manage</Link>
                </div>

                {/* SAVED PROPERTIES */}

                <div className="setting-item">
                  <div className="setting-icon">♡</div>

                  <div className="setting-info">
                    <strong>Saved Properties</strong>

                    <span>View properties you have saved for later.</span>
                  </div>

                  <Link to="/saved-properties">View</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Profile;
