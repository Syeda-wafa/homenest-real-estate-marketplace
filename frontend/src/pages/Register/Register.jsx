import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import api from "../../services/api";
import { loginSuccess } from "../../redux/authSlice";

import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // VALIDATE FORM
  // =========================

  const validateForm = () => {
    const { name, email, phone, password, confirmPassword } = formData;

    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password ||
      !confirmPassword
    ) {
      toast.error("Please fill in all fields");
      return false;
    }

    if (name.trim().length < 2) {
      toast.error("Name must contain at least 2 characters");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  // =========================
  // REGISTER
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // confirmPassword backend ko nahi bhejna
      const { confirmPassword, ...registerData } = formData;

      const response = await api.post("/auth/register", registerData);

      console.log("Register response:", response.data);

      // =========================
      // IF BACKEND RETURNS TOKEN
      // =========================

      if (response.data.token && response.data.user) {
        dispatch(loginSuccess(response.data));

        toast.success("Account created successfully!");

        navigate("/dashboard");
      }

      // =========================
      // IF BACKEND ONLY CREATES USER
      // =========================
      else {
        toast.success("Account created successfully! Please login.");

        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);

      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        {/* =========================
            LEFT SIDE
        ========================= */}

        <div className="register-brand">
          <div className="register-brand-content">
            <span className="register-logo">H</span>

            <h1>
              Your next
              <br />
              chapter starts <span>here.</span>
            </h1>

            <p>
              Join HomeNest and discover a smarter way to buy, rent, and manage
              properties.
            </p>

            <div className="register-benefits">
              <div className="benefit-item">
                <span>✓</span>
                <p>Explore property listings</p>
              </div>

              <div className="benefit-item">
                <span>✓</span>
                <p>Save your favorite homes</p>
              </div>

              <div className="benefit-item">
                <span>✓</span>
                <p>List and manage properties</p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div className="register-form-section">
          <div className="register-form-container">
            <div className="register-heading">
              <span>GET STARTED</span>

              <h2>Create your account</h2>

              <p>Fill in your details to get started.</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* NAME + PHONE */}

              <div className="form-row">
                <div className="register-form-group">
                  <label htmlFor="name">Full Name</label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="register-form-group">
                  <label htmlFor="phone">Phone</label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="03XX XXXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* EMAIL */}

              <div className="register-form-group">
                <label htmlFor="email">Email Address</label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {/* PASSWORD + CONFIRM PASSWORD */}

              <div className="form-row">
                <div className="register-form-group">
                  <label htmlFor="password">Password</label>

                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="register-form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>

                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                className="register-submit"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* LOGIN */}

            <div className="register-login">
              <span>Already have an account?</span>

              <Link to="/login">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
