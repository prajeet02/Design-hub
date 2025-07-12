import React from "react";
import "./Home.module.scss";
import Hero from "../../features/home/Hero";

function Home() {
  return (
    <>
      <div className="home-container">
        <Hero />
      </div>
    </>
  );
}

export default Home;
