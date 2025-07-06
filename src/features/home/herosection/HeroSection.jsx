import React from "react";
import PrimaryButton from "../../../components/button/primarybutton/PrimaryButton";
import SecondaryButton from "../../../components/button/secondarybutton/SecondaryButton";
import RotatingCard from "../../../components/card/rotatingcard/RotatingCard";
import HoverCard from "../../../components/card/hovercard/HoverCard";
import PricingCard from "../../../components/card/pricingcard/PricingCard";

const HeroSection = () => {
  return (
    <div
      className="hero-section-container flex flex-col items-center justify-center"
      style={{ marginTop: "200px" }}
    >
      <div className="hero-section-buttons flex gap-10 justify-center items-center">
        <PrimaryButton />
        <SecondaryButton />
      </div>
      {/* <div className="rotating-card-container flex justify-center items-center">
        <RotatingCard />
        <div className="hover-card-container flex gap-1">
          <HoverCard
            firstContent="Front"
            secondContent="Back"
            color1="43, 26, 71" // deep purple
            color2="160, 132, 232" // accent purple
          />
          <HoverCard
            firstContent="Hello"
            secondContent="World"
            color1="68, 71, 75" // graphite
            color2="212, 175, 55" // gold accent
          />
        </div>
      </div> */}
      <div className="rotating-card-container flex justify-center items-center">
        <RotatingCard />
        <div className="hover-card-container flex gap-7">
          <HoverCard
            firstContent="First"
            secondContent="Third"
            color1="43, 26, 71" // deep purple
            color2="160, 132, 232" // accent purple
          />
          <HoverCard
            firstContent="Second"
            secondContent="Fourth"
            color1="68, 71, 75" // graphite
            color2="212, 175, 55" // gold accent
          />
          x
        </div>
      </div>
      <div className="pricing-card-container flex justify-center items-center gap-10 ">
        <PricingCard />
        <PricingCard />
        <PricingCard />
      </div>
    </div>
  );
};

export default HeroSection;
