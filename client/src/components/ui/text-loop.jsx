import React, { useEffect, useState, useRef } from "react";
import styles from "./text-loop.module.css";
import { cn } from "../../lib/utils";

export default function TextLoop({
  staticText = "Design",
  rotatingTexts = ["Limitless", "Timeless", "Flawless"],
  className,
  interval = 3000,
  staticTextClassName,
  rotatingTextClassName,
  backgroundClassName,
  cursorClassName,
}) {
  const [index, setIndex] = useState(0);
  const [animStatus, setAnimStatus] = useState("visible"); // 'visible' | 'exiting' | 'entering'
  const [measuredWidth, setMeasuredWidth] = useState("auto");
  const measureRef = useRef(null);

  // Measure text width dynamically for smooth expanding/collapsing container
  useEffect(() => {
    if (measureRef.current) {
      setMeasuredWidth(measureRef.current.offsetWidth + 8);
    }
  }, [index, rotatingTexts]);

  useEffect(() => {
    if (!rotatingTexts || rotatingTexts.length <= 1) return;

    const timer = setInterval(() => {
      // Step 1: Slide & fade out old text
      setAnimStatus("exiting");

      // Step 2: Switch to next text and trigger enter
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % rotatingTexts.length);
        setAnimStatus("entering");

        // Step 3: Trigger visible state
        requestAnimationFrame(() => {
          setTimeout(() => {
            setAnimStatus("visible");
          }, 30);
        });
      }, 240);
    }, interval);

    return () => clearInterval(timer);
  }, [rotatingTexts, interval]);

  const currentText = rotatingTexts[index] || "";

  return (
    <div className={cn(styles.container, className)}>
      {staticText && (
        <span className={cn(styles.staticText, staticTextClassName)}>
          {staticText}
        </span>
      )}

      <div className={styles.rotatingContainer}>
        {/* Offscreen element for instantaneous accurate text measurement */}
        <span
          ref={measureRef}
          className={cn(styles.rotatingText, styles.measureHelper, rotatingTextClassName)}
          aria-hidden="true"
        >
          {currentText}
        </span>

        <div
          className={styles.textWrapper}
          style={{ width: measuredWidth !== "auto" ? `${measuredWidth}px` : "auto" }}
        >
          {/* Subtle theme gradient box */}
          <div className={cn(styles.bgGradient, backgroundClassName)} />

          <span
            className={cn(
              styles.rotatingText,
              animStatus === "visible" && styles.textVisible,
              animStatus === "exiting" && styles.textExiting,
              animStatus === "entering" && styles.textEntering,
              rotatingTextClassName
            )}
          >
            {currentText}
          </span>
        </div>

        {/* Blinking Cursor Bar */}
        <span className={cn(styles.cursor, cursorClassName)} />
      </div>
    </div>
  );
}
export { TextLoop };
