import Navbar from "../../components/navbar/Navbar";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import styles from "./AboutUs.module.scss";

const AboutUs = () => {
  const location = useLocation();
  const missionRef = useRef(null);
  const teamRef = useRef(null);
  const valuesRef = useRef(null);

  // Handle hash links when page loads
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1); // remove the # symbol
      const element = document.getElementById(id);
      if (element) {
        // Add offset for navbar
        const yOffset = -90;
        const y =
          element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  }, [location]);

  // Scroll to section function
  const scrollToSection = (ref) => {
    window.scrollTo({
      top: ref.current.offsetTop - 90, // 90px offset for navbar
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.aboutUsContainer}>
      <Navbar />

      {/* Quick navigation */}
      <div className={styles.quickNav}>
        <button onClick={() => scrollToSection(missionRef)}>Our Mission</button>
        <button onClick={() => scrollToSection(valuesRef)}>Our Values</button>
        <button onClick={() => scrollToSection(teamRef)}>Our Team</button>
      </div>

      <main className={styles.aboutUsContent}>
        <h1>About Us</h1>
        <p>
          Welcome to DesireHub, your premier destination for exclusive content
          and premium experiences.
        </p>

        <section id="mission" ref={missionRef} className={styles.section}>
          <h2>Our Mission</h2>
          <p>
            At DesireHub, we're committed to providing a platform that connects
            creators with their audience in a secure, respectful environment.
            Our mission is to empower content creators while delivering
            exceptional experiences to our users.
          </p>
        </section>

        <section id="values" ref={valuesRef} className={styles.section}>
          <h2>Our Values</h2>
          <p>
            We believe in transparency, privacy, and respect. These core values
            guide everything we do, from how we build our platform to how we
            interact with our community.
          </p>
          <ul>
            <li>Privacy & Security</li>
            <li>Creator Empowerment</li>
            <li>User Experience</li>
            <li>Community Standards</li>
          </ul>
        </section>

        <section id="team" ref={teamRef} className={styles.section}>
          <h2>Our Team</h2>
          <p>
            Our diverse team of professionals is dedicated to creating the best
            possible platform for both creators and users. With backgrounds in
            technology, security, and content creation, we bring a wealth of
            experience to DesireHub.
          </p>
          <div className={styles.teamGrid}>
            {/* Team member cards would go here */}
            <div className={styles.teamMember}>
              <div className={styles.memberPhoto}></div>
              <h3>Jane Doe</h3>
              <p>Founder & CEO</p>
            </div>
            <div className={styles.teamMember}>
              <div className={styles.memberPhoto}></div>
              <h3>John Smith</h3>
              <p>CTO</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;
