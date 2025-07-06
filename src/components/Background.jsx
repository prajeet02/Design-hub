import React, { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const Background = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesOptions = {
    background: {
      color: {
        value: "#1a1a1a",
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "repulse",
        },
        resize: true,
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: "#ffffff", // Flake color
      },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: false, // Set to false for a non-connected look
        opacity: 0.1,
        width: 1,
      },
      collisions: {
        enable: false,
      },
      move: {
        direction: "bottom",
        enable: true,
        outModes: {
          default: "out",
        },
        random: true,
        speed: 0.69, // speed of the flakes falling
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 101, // number of particles
      },
      opacity: {
        value: { min: 0.1, max: 0.3 }, // flakes will have varying opacity
        animation: {
          enable: true,
          speed: 1,
          sync: false,
        },
      },
      shape: {
        type: "circle", // can change this
      },
      size: {
        value: { min: 1, max: 4 }, // flakes will have varying sizes
        animation: {
          enable: true,
          speed: 2,
          sync: false,
        },
      },
      detectRetina: true,
    },
  };

  return <Particles id="tsparticles" options={particlesOptions} />;
};

export default Background;
