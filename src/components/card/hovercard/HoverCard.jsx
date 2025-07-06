import React from "react";
import styles from "./HoverCard.module.scss";

const HoverCard = ({ firstContent, secondContent, color1, color2 }) => {
  return (
    <div
      className={styles.card}
      style={{
        "--color1": color1,
        "--color2": color2,
      }}
    >
      <div className={styles["first-content"]}>
        <span>{firstContent}</span>
      </div>
      <div className={styles["second-content"]}>
        <span>{secondContent}</span>
      </div>
    </div>
  );
};

export default HoverCard;
