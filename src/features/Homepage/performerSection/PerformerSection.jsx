import React from "react";
import styles from "./PerformerSection.module.scss";
import Button from "../../../components/button/button";

const PerformerSection = () => {
  return (
    <div className={styles.performerSection}>
      <div className={styles.videoBackground}>
        <video autoPlay muted loop className={styles.video}>
          <source
            src="https://player.vimeo.com/external/477260057.sd.mp4?s=c3c2df7c9f886c4db5657ee7b192a0ea7b893c42&profile_id=164&oauth2_token_id=57447761"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className={styles.content}></div>
    </div>
  );
};

export default PerformerSection;
