import React from "react";
import styles from "./PrimaryButton.module.scss";

const PrimaryButton = ({
  text = "Primary Button",
  hasGlow = false,
  onClick,
  className = "",
}) => {
  const buttonClasses = [
    styles.primaryButton,
    hasGlow ? styles["glow-effect"] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={buttonClasses} onClick={onClick}>
      {text}
    </button>
  );
};

export default PrimaryButton;
