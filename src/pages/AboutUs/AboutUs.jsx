import Navbar from "../../components/navbar/Navbar";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import styles from "./AboutUs.module.scss";
import Footer from "../../components/footer/Footer";

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
      {/* <Navbar /> */}

      {/* Quick navigation */}
      <div className={styles.quickNav}>
        <button onClick={() => scrollToSection(missionRef)}>Our Mission</button>
        <button onClick={() => scrollToSection(valuesRef)}>Our Values</button>
        <button onClick={() => scrollToSection(teamRef)}>Our Team</button>
      </div>

      <main className={styles.aboutUsContent}>
        <h1>About Us</h1>
        <p>
          DesireHub: From Fan to Fantasy. Where premium meets personal.
        </p>

        <section id="mission" ref={missionRef} className={styles.section}>
          <h2>Our Mission</h2>
          <p>
            At DesireHub, we believe adult entertainment can be more than just content — it can be art, connection, and unforgettable experience. We bring fans and elite performers together to co-create cinematic, safe, and luxury-driven scenes. Our mission is to empower both sides: performers as artists, fans as co-stars, and the industry as a place of respect and innovation.
          </p>
        </section>

        <section id="values" ref={valuesRef} className={styles.section}>
          <h2>Our Values</h2>
          <p>
            Elegance: Luxury in every detail — from booking to production.
            Safety: Consent, privacy, and professionalism, always.
            Innovation: Pioneering the next era of adult fantasy experiences.
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
            A global mix of industry pros, creative directors, and fan experience designers — united to deliver the best fantasy production platform on earth.
          </p>
        </section>
      </main>
      <div className={styles["footer-wrapper"]}>
        <Footer />
      </div>
    </div>
  );
};

export default AboutUs;
