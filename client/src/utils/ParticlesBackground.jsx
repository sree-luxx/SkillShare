import React from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const ParticlesBackground = () => {
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: { color: "transparent" },

        interactivity: {
          events: {
            onHover: { enable: true, mode: "grab" },
            onClick: { enable: true, mode: "repulse" },
          },
          modes: {
            grab: { distance: 180, line_linked: { opacity: 0.6 } },
            repulse: { distance: 200, duration: 0.4 },
          },
        },

        particles: {
          number: { value: 75, density: { enable: true, area: 900 } },

          // PERFECT MATCHING COLORS
          color: {
            value: ["#a78bfa", "#f472b6", "#fb923c", "#ffe0c2"],
          },

          links: {
            enable: true,
            distance: 160,
            color: "#ffe0c2",
            opacity: 0.45,
            width: 1.5,
          },

          move: {
            enable: true,
            speed: 1.4,
            direction: "none",
            outModes: { default: "bounce" },
          },

          size: { value: 4, random: true },
          opacity: { value: 0.7, random: true },
        },

        detectRetina: true,
      }}
    />
  );
};

export default ParticlesBackground;
