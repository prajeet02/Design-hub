import React from "react";
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

const RotatingCard = ({ items = [], onItemClick }) => {
  const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];
  const hasItems = safeItems.length > 0;
  const quantity = hasItems ? safeItems.length : COLORS.length;
  return (
    <div
      className={styles.wrapper}
      style={{ height: "400px", width: "1200px" }}
    >
      <div className={styles.inner} style={{ "--quantity": quantity }}>
        {(hasItems ? safeItems : COLORS).map((item, idx) => (
          <div
            className={`${styles.card} ${hasItems ? styles.cardClickable : ""}`}
            key={item?.id || idx}
            style={{
              "--index": idx,
              "--color-card": COLORS[idx % COLORS.length],
            }}
            onClick={hasItems ? () => onItemClick?.(item) : undefined}
            role={hasItems ? "button" : undefined}
            tabIndex={hasItems ? 0 : undefined}
            onKeyDown={
              hasItems
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onItemClick?.(item);
                    }
                  }
                : undefined
            }
          >
            <div
              className={styles.img}
              style={{
                "--img":
                  hasItems && item?.image
                    ? `url(${item.image})`
                    : "none",
              }}
            />
            {hasItems && (
              <div className={styles.label}>
                <div className={styles.name}>{item?.title || "Performer"}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RotatingCard;
