import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import styles from "./Navbar.module.scss";
import DesireLogo from "../../assets/Desire.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    setIsScrolled(scrollPosition > 20);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`${styles.navbar__header} ${
        isScrolled ? styles.scrolled : ""
      }`}
    >
      <div className={styles.navbar__container}>
        <div
          className={`${styles.navbar__section} ${styles.navbar__left}${
            isScrolled ? ` ${styles.scrolled}` : ""
          }`}
        >
          <a href="/performers">PERFORMERS PAGE</a>
          <Link to="/">LOGIN</Link>
        </div>
        <div className={`${styles.navbar__section} ${styles.navbar__center}`}>
          <Link to="/home">
            <div
              className={`${styles.logo}${isScrolled ? ` ${styles.shrink}` : ""}`}
            >
              <img src={DesireLogo} alt="DesireHub Logo" />
            </div>
            <div className={styles["logo-text"]}>
              <span className={styles.brand}></span>
              <span className={styles.subtitle}></span>
            </div>
          </Link>
        </div>
        <div
          className={`${styles.navbar__section} ${styles.navbar__right}${
            isScrolled ? ` ${styles.scrolled}` : ""
          }`}
        >
          <Link to="/aboutus">ABOUT US</Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
