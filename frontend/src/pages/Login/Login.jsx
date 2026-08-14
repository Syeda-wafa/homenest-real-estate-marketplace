import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import api from "../../services/api";
import { loginSuccess } from "../../redux/authSlice";

import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================
  // LOGIN
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      console.log("Login response:", response.data);

      // Save user + token in Redux
      dispatch(loginSuccess(response.data));

      toast.success("Login successful!");

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      console.log("Status:", error.response?.status);
      console.log("Response:", error.response?.data);

      toast.error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* =========================
            LEFT BRAND SECTION
        ========================= */}

        <div className="login-brand">
          <div className="login-brand-content">
            <span className="login-logo">H</span>

            <h1>
              Welcome back
              <br />
              to <span>HomeNest.</span>
            </h1>

            <p>
              Find your next home, manage your properties, and keep everything
              in one place.
            </p>
          </div>
        </div>

        {/* =========================
            RIGHT FORM SECTION
        ========================= */}

        <div className="login-form-section">
          <div className="login-form-container">
            <div className="login-heading">
              <span>WELCOME BACK</span>

              <h2>Sign in to your account</h2>

              <p>Enter your details to continue to HomeNest.</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* EMAIL */}

              <div className="form-group">
                <label htmlFor="email">Email Address</label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={loading}
                />
              </div>

              {/* PASSWORD */}

              <div className="form-group">
                <label htmlFor="password">Password</label>

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={loading}
                />
              </div>

              {/* SUBMIT */}

              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* REGISTER */}

            <div className="login-register">
              <span>Don't have an account?</span>

              <Link to="/register">Create account</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
