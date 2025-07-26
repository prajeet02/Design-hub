import React from "react";
import styles from "./PricingCard.module.scss";

const PricingCard = () => {
  return (
    <div className={styles.card}>
      <div className={styles.ribbon}>
        <div className={styles["ribbon-inner"]}>🎉 50% Off</div>
      </div>

      <section className={styles.content}>
        <div>
          <div className={styles.heading}>Full Access</div>
          <div className={styles.price}>
            $9<span className={styles.per}>/month</span>
          </div>
          <p className={styles.desc}>
            Ideal for individuals and hobbyists who want access to all essential
            features without limitations.
          </p>
        </div>

        <div className={styles.cta}>
          <a className={styles.button} href="#">
            Get Started
          </a>
        </div>
      </section>
    </div>
  );
};

export default PricingCard;
