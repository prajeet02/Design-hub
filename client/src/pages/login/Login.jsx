import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import styles from "./Login.module.scss";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate login process (no real authentication)
      console.log("Login attempt:", formData);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store login state in localStorage for demo purposes
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', formData.email);

      // Redirect to home page
      navigate('/home');
    } catch (error) {
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Left Side - Features */}
      <div className={styles.leftSide}>
        {/* <div className={styles.logoContainer}>
          <img src={DesireHubLogo} alt="DesireHub" className={styles.logo} />
        </div> */}

        <div className={styles.featuresContent}>
          <h1 className={styles.mainTitle}>Start your 30-day free trial</h1>
          <p className={styles.subtitle}>No credit card required</p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <i className="fas fa-users"></i>
              </div>
              <div className={styles.featureContent}>
                <h3>Vip Experience Highlights</h3>
                <p>
                  Experience VIP access to exclusive content and experiences.
                </p>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <i className="fas fa-shield-alt"></i>
              </div>
              <div className={styles.featureContent}>
                <h3>Ensure compliance</h3>
                <p>
                  Receive detailed insights on all your numbers in real-time,
                  see where visitors are coming from.
                </p>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <i className="fas fa-lock"></i>
              </div>
              <div className={styles.featureContent}>
                <h3>Built-in security</h3>
                <p>
                  Keep your team members and customers in the loop by sharing
                  your dashboard publicly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className={styles.rightSide}>
        <div className={styles.loginCard}>
          <div className={styles.socialLogin}>
            <p className={styles.registerText}>Register with:</p>
            <div className={styles.socialButtons}>
              <button type="button" className={styles.socialButton}>
                <i className="fab fa-google"></i>
                Google
              </button>      
            </div>
          </div>

          <div className={styles.divider}>
            <span>Or</span>
          </div>

          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.inputGroup}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className={`${styles.input} ${
                  errors.email ? styles.error : ""
                }`}
                required
              />
              <i className="fas fa-envelope"></i>
              {errors.email && (
                <span className={styles.errorMessage}>{errors.email}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className={`${styles.input} ${
                  errors.password ? styles.error : ""
                }`}
                required
              />
              <i className="fas fa-lock"></i>
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </button>
              {errors.password && (
                <span className={styles.errorMessage}>{errors.password}</span>
              )}
            </div>

            <p className={styles.passwordHint}>
              Minimum length is 8 characters
            </p>

            <button
              type="submit"
              className={styles.loginButton}
              disabled={isLoading}
            >
              {isLoading ? <div className={styles.spinner}></div> : "Log In"}
            </button>
              
            <p className={styles.termsText}>
              By creating an account, you agree to the Terms of Service. We'll
              occasionally send you account-related emails.
            </p>

            <p className={styles.signupText}>
              Don't have an account?{" "}
              <Link to="/signup" className={styles.signupLink}>
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
