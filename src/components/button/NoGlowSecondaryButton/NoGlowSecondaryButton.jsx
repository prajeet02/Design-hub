import React from "react";
import styles from "./NoGlowSecondaryButton.module.scss";

const NoGlowSecondaryButton = ({name}) => {
  return (
    <div>
      <button className={styles.button}>{name}</button>
    </div>
  );
};
export default NoGlowSecondaryButton;
