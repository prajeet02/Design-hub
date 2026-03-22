import React, { useEffect, useState } from "react";
import styles from "./AgeGateModal.module.scss";

const AgeGateModal = ({ open, minAge = 18, onConfirm, onExit }) => {
  const [isDenied, setIsDenied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (open) setIsDenied(false);
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Age verification">
        <h2 className={styles.title}>Age Verification</h2>
        {!isDenied ? (
          <p className={styles.body}>
            You must be <strong>{minAge}+</strong> to access this site.
            <br />
            Please confirm your age to continue.
          </p>
        ) : (
          <p className={styles.body}>
            Access denied. You must be <strong>{minAge}+</strong> to continue.
          </p>
        )}

        <div className={styles.actions}>
          {!isDenied ? (
            <>
              <button type="button" className={styles.primary} onClick={onConfirm}>
                I am {minAge} or older
              </button>
              <button
                type="button"
                className={styles.secondary}
                onClick={() => {
                  setIsDenied(true);
                }}
              >
                I am under {minAge}
              </button>
            </>
          ) : (
            <button type="button" className={styles.secondary} onClick={onExit}>
              Exit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgeGateModal;
