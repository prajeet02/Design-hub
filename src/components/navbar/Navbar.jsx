import React, { useEffect, useState } from "react";
import styles from "./Navbar.module.scss";
import DesireHubLogo from "../../assets/images/Desirehublogo.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    console.log("Scroll position:", scrollPosition); // Debug log
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
          <a href="#shop">PERFORMERS PAGE</a>
          <a href="#commercial">VIP</a>
          <a href="#commercial">LOGIN</a>
        </div>
        <div className={`${styles.navbar__section} ${styles.navbar__center}`}>
          <div
            className={`${styles.logo}${isScrolled ? ` ${styles.shrink}` : ""}`}
          >
            <img src={DesireHubLogo} alt="Logo" />
          </div>
          <div className={styles["logo-text"]}>
            <span className={styles.brand}></span>
            <span className={styles.subtitle}></span>
          </div>
        </div>
        <div
          className={`${styles.navbar__section} ${styles.navbar__right}${
            isScrolled ? ` ${styles.scrolled}` : ""
          }`}
        >
          <a href="#warranty">ABOUT</a>
        </div>
      </div>
      <div style={{ height: "200vh", background: "#eee" }}></div>
    </header>
  );
};

export default Navbar;
