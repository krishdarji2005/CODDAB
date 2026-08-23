import React, { useRef, useEffect, useState } from 'react';
import styles from './TextHoverEffect.module.css';

export const TextHoverEffect = ({ text = 'CODDAB' }) => {
  const svgRef = useRef(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: '50%', cy: '50%' });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  // Clean vector geometry matching CoddabLogoKrish.svg
  const renderLogo = () => (
    <g transform="translate(60, 15) scale(0.53)">
      {/* Outer Top Arc */}
      <path d="M 258.18 108.01 L 258.18 113.19 L 278.93 113.19 L 278.93 108.01 C 278.93 90.84 265 76.92 247.81 76.92 L 211.5 76.92 C 208.23 76.92 205.16 75.39 203.2 72.78 L 193.86 60.34 C 191.99 57.85 189.1 56.33 185.99 56.2 C 182.88 56.07 179.87 57.35 177.8 59.67 L 165.55 73.44 C 163.58 75.66 160.76 76.92 157.8 76.92 L 123.31 76.92 C 106.12 76.92 92.18 90.84 92.18 108.01 L 92.18 113.19 L 112.93 113.19 L 112.93 108.01 C 112.93 102.29 117.58 97.65 123.31 97.65 L 157.8 97.65 C 166.69 97.65 175.16 93.85 181.07 87.21 L 184.88 82.92 L 186.6 85.21 C 192.48 93.04 201.7 97.65 211.5 97.65 L 247.81 97.65 C 253.54 97.65 258.18 102.29 258.18 108.01 Z" />
      {/* Left Bracket */}
      <path d="M 102.7 137.73 L 107.13 137.73 L 107.13 119.98 L 102.7 119.98 C 88.01 119.98 76.1 131.9 76.1 146.6 L 76.1 177.67 C 76.1 180.46 74.78 183.09 72.55 184.76 L 61.91 192.75 C 59.78 194.35 58.48 196.82 58.37 199.49 C 58.26 202.15 59.35 204.72 61.34 206.49 L 73.12 216.96 C 75.01 218.65 76.1 221.07 76.1 223.6 L 76.1 253.1 C 76.1 267.81 88.01 279.73 102.7 279.73 L 107.13 279.73 L 107.13 261.98 L 102.7 261.98 C 97.8 261.98 93.83 258.01 93.83 253.1 L 93.83 223.6 C 93.83 216 90.58 208.75 84.9 203.7 L 81.23 200.44 L 83.19 198.97 C 89.89 193.94 93.83 186.05 93.83 177.67 L 93.83 146.6 C 93.83 141.7 97.8 137.73 102.7 137.73 Z" />
      {/* Right Bracket */}
      <path d="M 268.21 137.73 L 263.77 137.73 L 263.77 119.98 L 268.21 119.98 C 282.9 119.98 294.81 131.9 294.81 146.6 L 294.81 177.67 C 294.81 180.46 296.12 183.09 298.36 184.76 L 309 192.75 C 311.13 194.35 312.42 196.82 312.54 199.49 C 312.65 202.15 311.56 204.72 309.57 206.49 L 297.79 216.96 C 295.89 218.65 294.81 221.07 294.81 223.6 L 294.81 253.1 C 294.81 267.81 282.9 279.73 268.21 279.73 L 263.77 279.73 L 263.77 261.98 L 268.21 261.98 C 273.1 261.98 277.07 258.01 277.07 253.1 L 277.07 223.6 C 277.07 216 280.33 208.75 286.01 203.7 L 289.67 200.44 L 287.72 198.97 C 281.02 193.94 277.07 186.05 277.07 177.67 L 277.07 146.6 C 277.07 141.7 273.1 137.73 268.21 137.73 Z" />
      {/* Code Arrows */}
      <path d="M 139.42 130.72 L 139.42 140.45 L 105.3 126.75 L 105.3 117.67 L 139.42 103.98 L 139.42 113.66 L 117.92 121.8 L 117.92 122.59 Z" />
      <path d="M 265.36 126.75 L 231.23 140.45 L 231.23 130.72 L 252.77 122.59 L 252.77 121.8 L 231.23 113.66 L 231.23 103.98 L 265.36 117.67 Z" />
      {/* Inner Blocks */}
      <path d="M 91.97 109.91 L 164.05 109.91 L 164.05 173.01 L 91.97 173.01 Z" />
      <path d="M 91.97 237.35 L 162.39 237.35 L 162.39 300.44 L 91.97 300.44 Z" />
      <path d="M 208.05 109.91 L 278.94 109.91 L 278.94 173.01 L 208.05 173.01 Z" />
      <path d="M 209.71 237.35 L 278.94 237.35 L 278.94 300.44 L 209.71 300.44 Z" />
      <path d="M 154.29 109.91 L 216.62 109.91 L 216.62 300.44 L 154.29 300.44 Z" />
    </g>
  );

  const renderContent = () => (
    <g>
      {renderLogo()}
      <text
        x="50%"
        y="255"
        textAnchor="middle"
        dominantBaseline="middle"
        className={styles.brandText}
      >
        {text}
      </text>
    </g>
  );

  return (
    <div className={styles.container}>
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 320 290"
        xmlns="http://www.w3.org/2000/svg"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
        className={styles.svg}
      >
        <defs>
          {/* Pure Shiny Silver Chrome Gradient */}
          <linearGradient
            id="silverGradient"
            gradientUnits="userSpaceOnUse"
            cx="50%"
            cy="50%"
            r="30%"
          >
            {hovered && (
              <>
                <stop offset="0%" stopColor="#71717a" />
                <stop offset="25%" stopColor="#e4e4e7" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="75%" stopColor="#e4e4e7" />
                <stop offset="100%" stopColor="#71717a" />
              </>
            )}
          </linearGradient>

          {/* Aceternity Dynamic Radial Reveal Mask */}
          <radialGradient
            id="revealMask"
            gradientUnits="userSpaceOnUse"
            r="22%"
            cx={maskPosition.cx}
            cy={maskPosition.cy}
            style={{
              transition: 'cx 0.08s ease-out, cy 0.08s ease-out',
            }}
          >
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </radialGradient>

          <mask id="brandMask">
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="url(#revealMask)"
            />
          </mask>
        </defs>

        {/* ── Base Dark Contour Outline ── */}
        <g
          stroke="#27272a"
          strokeWidth="0.8"
          fill="none"
          className={styles.baseStroke}
          style={{ opacity: hovered ? 0.7 : 0.25 }}
        >
          {renderContent()}
        </g>

        {/* ── Animated Stroke Drawing ── */}
        <g
          stroke="#3f3f46"
          strokeWidth="0.8"
          fill="none"
          className={styles.animatedStroke}
        >
          {renderContent()}
        </g>

        {/* ── Masked Shiny Silver Chrome Reflection Revealed Under Cursor ── */}
        <g
          stroke="url(#silverGradient)"
          strokeWidth="1.2"
          fill="none"
          mask="url(#brandMask)"
          className={styles.maskedSilver}
        >
          {renderContent()}
        </g>
      </svg>
    </div>
  );
};

export default TextHoverEffect;
