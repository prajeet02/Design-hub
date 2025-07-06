import React from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/footer";
import "./Homepage.module.scss";
import PerformerSection from "../../features/Homepage/performerSection/PerformerSection";

function Homepage() {
  return (
    <>
      <div className="">
        <Navbar />
        <PerformerSection />
        <Footer />
      </div>
    </>
  );
}

export default Homepage;
