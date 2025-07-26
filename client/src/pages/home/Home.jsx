import React from "react";
import styles from "./Home.module.scss";
import Hero from "../../features/home/Hero";
import Footer from "../../components/footer/Footer";

function Home() {
  return (
    <>
      <div className={styles["home-container"]}>
        <div className={styles["hero-section"]}>
          <Hero />
        </div>
      </div>
      <div className={styles["footer-wrapper"]}>
        <Footer />
      </div>
    </>
  );
}

export default Home;
