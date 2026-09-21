import React, { useMemo, useRef, useState } from "react";
import styles from "./background-ripple-effect.module.css";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const BackgroundRippleEffect = ({
  rows = 9,
  cols = 28,
  cellSize = 52,
}) => {
  const [clickedCell, setClickedCell] = useState(null);
  const [rippleKey, setRippleKey] = useState(0);

  return (
    <div className={styles.rippleRoot}>
      <div className={styles.rippleOverlay} />
      <DivGrid
        key={`base-${rippleKey}`}
        className={styles.rippleGrid}
        rows={rows}
        cols={cols}
        cellSize={cellSize}
        clickedCell={clickedCell}
        onCellClick={(row, col) => {
          setClickedCell({ row, col });
          setRippleKey((k) => k + 1);
        }}
        interactive
      />
    </div>
  );
};

const DivGrid = ({
  className,
  rows = 9,
  cols = 28,
  cellSize = 52,
  clickedCell = null,
  onCellClick = () => {},
  interactive = true,
}) => {
  const cells = useMemo(
    () => Array.from({ length: rows * cols }, (_, idx) => idx),
    [rows, cols]
  );

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    width: cols * cellSize,
    height: rows * cellSize,
    marginInline: "auto",
  };

  return (
    <div className={cn(styles.divGrid, className)} style={gridStyle}>
      {cells.map((idx) => {
        const rowIdx = Math.floor(idx / cols);
        const colIdx = idx % cols;
        const distance = clickedCell
          ? Math.hypot(clickedCell.row - rowIdx, clickedCell.col - colIdx)
          : 0;
        const delay = clickedCell ? Math.max(0, distance * 55) : 0;
        const duration = 200 + distance * 80;

        const style = clickedCell
          ? {
              "--delay": `${delay}ms`,
              "--duration": `${duration}ms`,
            }
          : {};

        return (
          <div
            key={idx}
            className={cn(
              styles.cell,
              clickedCell && styles.cellRipple,
              !interactive && styles.noPointer
            )}
            style={style}
            onClick={
              interactive ? () => onCellClick(rowIdx, colIdx) : undefined
            }
          />
        );
      })}
    </div>
  );
};
