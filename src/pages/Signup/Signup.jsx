import React, { useState } from "react";
import { Link } from "react-router";
import styles from "./Signup.module.scss";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      // TODO: Implement backend registration
      console.log("Signup attempt:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For now, just show success message
      alert("Signup functionality will be implemented with backend!");
    } catch (error) {
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.signupContainer}>
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
                <h3>Invite unlimited colleagues</h3>
                <p>
                  Integrate with guaranteed developer-friendly APIs or openly to
                  choose a build-ready or low-code solution.
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

      {/* Right Side - Signup Form */}
      <div className={styles.rightSide}>
        <div className={styles.signupCard}>
          <div className={styles.socialLogin}>
            <p className={styles.registerText}>Register with:</p>
            <div className={styles.socialButtons}>
              <button type="button" className={styles.socialButton}>
                <i className="fab fa-google"></i>
                Google
              </button>
              <button type="button" className={styles.socialButton}>
                <i className="fab fa-github"></i>
                GitHub
              </button>
              <button type="button" className={styles.socialButton}>
                <i className="fab fa-gitlab"></i>
                GitLab
              </button>
            </div>
          </div>

          <div className={styles.divider}>
            <span>Or</span>
          </div>

          <form onSubmit={handleSubmit} className={styles.signupForm}>
            <div className={styles.nameRow}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`${styles.input} ${
                    errors.firstName ? styles.error : ""
                  }`}
                  required
                />
                <i className="fas fa-user"></i>
                {errors.firstName && (
                  <span className={styles.errorMessage}>
                    {errors.firstName}
                  </span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`${styles.input} ${
                    errors.lastName ? styles.error : ""
                  }`}
                  required
                />
                <i className="fas fa-user"></i>
                {errors.lastName && (
                  <span className={styles.errorMessage}>{errors.lastName}</span>
                )}
              </div>
            </div>

            <div className={styles.inputGroup}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                className={`${styles.input} ${
                  errors.username ? styles.error : ""
                }`}
                required
              />
              <i className="fas fa-at"></i>
              {errors.username && (
                <span className={styles.errorMessage}>{errors.username}</span>
              )}
            </div>

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
              className={styles.signupButton}
              disabled={isLoading}
            >
              {isLoading ? <div className={styles.spinner}></div> : "Sign Up"}
            </button>

            <p className={styles.termsText}>
              By creating an account, you agree to the Terms of Service. We'll
              occasionally send you account-related emails.
            </p>

            <p className={styles.loginText}>
              Already have an account?{" "}
              <Link to="/login" className={styles.loginLink}>
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
