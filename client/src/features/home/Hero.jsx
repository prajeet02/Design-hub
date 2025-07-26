import React from "react";
import styles from "../../pages/home/Home.module.scss";
import PrimaryButton from "../../components/button/primarybutton/PrimaryButton";
import SecondaryButton from "../../components/button/secondarybutton/SecondaryButton";
import RotatingCard from "../../components/card/rotatingcard/RotatingCard";
import HoverCard from "../../components/card/hovercard/HoverCard";
import PricingCard from "../../components/card/pricingcard/PricingCard";

const Hero = () => {
  return (
    <>
      {/* Hero Header Section */}
      <div className={styles["hero-header"]}>
        <h1 className={styles["hero-title"]}>Welcome to DesireHub</h1>
        <p className={styles["hero-subtitle"]}>
          Your premier destination for exclusive content and premium experiences
        </p>
      </div>

      {/* Hero Buttons Section */}
      <div className={styles["hero-buttons"]}>
        <PrimaryButton text="Get Started" hasGlow={true} />
        <PrimaryButton text="Learn More" hasGlow={true} />
      </div>

      {/* Cards Section */}
      <div className={styles["cards-section"]}>
        {/* Rotating Cards Section */}
        <div className={styles["rotating-section"]}>
          <h2 className={styles["hero-title"]}>Featured Content</h2>
          <div className={styles["rotating-card-wrapper"]}>
            <RotatingCard />
          </div>
        </div>

        {/* Hover Cards Section */}
        <div className={styles["hover-cards-container"]}>
          <HoverCard
            firstContent="Premium"
            secondContent="Exclusive Access"
            color1="43, 26, 71"
            color2="160, 132, 232"
          />
          <HoverCard
            firstContent="VIP"
            secondContent="Special Features"
            color1="68, 71, 75"
            color2="212, 175, 55"
          />
        </div>
      </div>

      {/* Section Divider */}
      <div className={styles["section-divider"]}></div>

      {/* Pricing Section */}
      <div className={styles["pricing-section"]}>
        <h2 className={styles["pricing-title"]}>Choose Your Plan</h2>
        <div className={styles["pricing-cards-container"]}>
          <PricingCard />
          <PricingCard />
          <PricingCard />
        </div>
      </div>

      {/* Section Divider */}
      <div className={styles["section-divider"]}></div>

      {/* Performers Section */}
      <div className={styles["performers-section"]}>
        <h2 className={styles["performers-title"]}>Featured Performers</h2>
        <div className={styles["performers-container"]}>
          {/* Performer cards will go here */}
        </div>
      </div>
    </>
  );
};

export default Hero;
