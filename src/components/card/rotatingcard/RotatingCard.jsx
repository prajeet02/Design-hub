import React from "react";
// import styled from "styled-components";
import styles from "./RotatingCard.module.scss";

const COLORS = [
  "220, 220, 235", // soft lavender grey
  "210, 230, 255", // pale sky blue
  "240, 230, 200", // light cream
  "220, 245, 220", // minty pastel
  "255, 240, 210", // light peach
  "230, 220, 255", // pastel purple
  "255, 230, 230", // blush pink
  "255, 255, 220", // pale yellow
  "210, 255, 240", // aqua mint
  "245, 220, 255", // soft lilac
];

const RotatingCard = () => {
  const quantity = COLORS.length;
  return (
    <div
      className={styles.wrapper}
      style={{ height: "400px", width: "1200px" }}
    >
      <div className={styles.inner} style={{ "--quantity": quantity }}>
        {COLORS.map((color, idx) => (
          <div
            className={styles.card}
            key={idx}
            style={{
              "--index": idx,
              "--color-card": color,
            }}
          >
            <div className={styles.img} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RotatingCard;
