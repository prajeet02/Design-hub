import React from "react";
import styles from "./Home.module.scss";
import Hero from "../../features/home/Hero";

function Home() {
  return (
    <div className={styles["home-container"]}>
      <div className={styles["hero-section"]}>
        <Hero />
      </div>
    </div>
  );
}

export default Home;
