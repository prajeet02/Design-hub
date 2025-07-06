import React from "react";
import PrimaryButton from "../../../components/button/primarybutton/PrimaryButton";
import SecondaryButton from "../../../components/button/secondarybutton/SecondaryButton";
import RotatingCard from "../../../components/card/rotatingcard/RotatingCard";
import HoverCard from "../../../components/card/hovercard/HoverCard";
import TestButton from "../../../components/button/testbutton/TestButton";
import PricingCard from "../../../components/card/pricingcard/PricingCard";

const HeroSection = () => {
  return (
    <div
      className="hero-section-container flex flex-col items-center justify-center"
      style={{ marginTop: "100px" }}
    >
      <h1>this is the hero section</h1>
      <div className="hero-section-buttons flex flex-col gap-4">
        <PrimaryButton />
        <SecondaryButton />
        <TestButton />
      </div>
      <div className="rotating-card-container">
        <RotatingCard />
      </div>
      <div className="hover-card-container flex gap-10">
        <div className="hover-card-container-first">
          <HoverCard
            firstContent="Front"
            secondContent="Back"
            color1="43, 26, 71" // deep purple
            color2="160, 132, 232" // accent purple
          />
        </div>
        <div className="hover-card-container-second">
          <HoverCard
            firstContent="Hello"
            secondContent="World"
            color1="68, 71, 75" // graphite
            color2="212, 175, 55" // gold accent
          />
        </div>
        <div className="pricing-card-container">
          <PricingCard />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
