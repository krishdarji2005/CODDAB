import React from 'react';
import { Warp } from '@paper-design/shaders-react';
import {
  Swords,
  Zap,
  Terminal,
  Users,
  ShieldCheck,
  Share2,
  ArrowRight
} from 'lucide-react';
import styles from './feature-shader-cards.module.css';

const DEFAULT_FEATURES = [
  {
    title: "1v1 Algorithm Duels",
    description:
      "Timed head-to-head battles on identical problem sets with real-time test execution races and instant verdicts.",
    icon: <Swords size={26} className={styles.iconSvg} />,
  },
  {
    title: "Sandboxed Multi-Language",
    description:
      "Sub-15ms execution for C++, Python, TypeScript, and Rust against strict time and memory limits.",
    icon: <Terminal size={26} className={styles.iconSvg} />,
  },
  {
    title: "Real-Time Collaboration",
    description:
      "Zero-latency multi-cursor editing with operational transform, live presence, and synchronized compilation.",
    icon: <Users size={26} className={styles.iconSvg} />,
  },
  {
    title: "Automated Stress Testing",
    description:
      "Comprehensive test matrices verifying corner bounds, 10^5 constraints, TLE guardrails, and memory limits.",
    icon: <ShieldCheck size={26} className={styles.iconSvg} />,
  },
  {
    title: "Instant Room Sharing",
    description:
      "Zero install or setup required. Generate a unique room URL, invite peers, and start coding in seconds.",
    icon: <Share2 size={26} className={styles.iconSvg} />,
  },
  {
    title: "Pro Keybindings & Speed",
    description:
      "Full keyboard-first workflow with command palette (⌘K), quick execution (⌃↵), and fast room controls.",
    icon: <Zap size={26} className={styles.iconSvg} />,
  },
];

const SHADER_CONFIGS = [
  {
    proportion: 0.3,
    softness: 0.8,
    distortion: 0.15,
    swirl: 0.6,
    swirlIterations: 8,
    shape: "checks",
    shapeScale: 0.08,
    colors: ["hsl(280, 100%, 30%)", "hsl(320, 100%, 60%)", "hsl(340, 90%, 40%)", "hsl(300, 100%, 70%)"],
  },
  {
    proportion: 0.4,
    softness: 1.2,
    distortion: 0.2,
    swirl: 0.9,
    swirlIterations: 12,
    shape: "dots",
    shapeScale: 0.12,
    colors: ["hsl(200, 100%, 25%)", "hsl(180, 100%, 65%)", "hsl(160, 90%, 35%)", "hsl(190, 100%, 75%)"],
  },
  {
    proportion: 0.35,
    softness: 0.9,
    distortion: 0.18,
    swirl: 0.7,
    swirlIterations: 10,
    shape: "checks",
    shapeScale: 0.1,
    colors: ["hsl(120, 100%, 25%)", "hsl(140, 100%, 60%)", "hsl(100, 90%, 30%)", "hsl(130, 100%, 70%)"],
  },
  {
    proportion: 0.45,
    softness: 1.1,
    distortion: 0.22,
    swirl: 0.8,
    swirlIterations: 15,
    shape: "dots",
    shapeScale: 0.09,
    colors: ["hsl(30, 100%, 35%)", "hsl(50, 100%, 65%)", "hsl(40, 90%, 40%)", "hsl(45, 100%, 75%)"],
  },
  {
    proportion: 0.38,
    softness: 0.95,
    distortion: 0.16,
    swirl: 0.85,
    swirlIterations: 11,
    shape: "checks",
    shapeScale: 0.11,
    colors: ["hsl(250, 100%, 30%)", "hsl(270, 100%, 65%)", "hsl(260, 90%, 35%)", "hsl(265, 100%, 70%)"],
  },
  {
    proportion: 0.42,
    softness: 1.0,
    distortion: 0.19,
    swirl: 0.75,
    swirlIterations: 9,
    shape: "dots",
    shapeScale: 0.13,
    colors: ["hsl(330, 100%, 30%)", "hsl(350, 100%, 60%)", "hsl(340, 90%, 35%)", "hsl(345, 100%, 75%)"],
  },
];

export default function FeaturesCards({
  features = DEFAULT_FEATURES,
  kicker = "Capabilities",
  title = "Everything you need to compete.",
  subtitle = "Engineered for algorithmic speed, real-time peer duels, and zero-latency pair programming."
}) {
  const getShaderConfig = (index) => {
    return SHADER_CONFIGS[index % SHADER_CONFIGS.length];
  };

  return (
    <section className={styles.section} id="features">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.kickerRow}>
            <span className={styles.kickerDot} />
            <span className={styles.kickerText}>{kicker}</span>
          </div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        <div className={styles.grid}>
          {features.map((feature, index) => {
            const shaderConfig = getShaderConfig(index);
            return (
              <div key={index} className={styles.cardWrapper}>
                {/* Background WebGL Shader Layer */}
                <div className={styles.shaderBackground}>
                  <Warp
                    style={{ height: "100%", width: "100%" }}
                    proportion={shaderConfig.proportion}
                    softness={shaderConfig.softness}
                    distortion={shaderConfig.distortion}
                    swirl={shaderConfig.swirl}
                    swirlIterations={shaderConfig.swirlIterations}
                    shape={shaderConfig.shape}
                    shapeScale={shaderConfig.shapeScale}
                    scale={1}
                    rotation={0}
                    speed={0.8}
                    colors={shaderConfig.colors}
                  />
                </div>

                {/* Frosted Glass Overlay Card */}
                <div className={styles.cardContent}>
                  <div className={styles.iconWrapper}>{feature.icon}</div>

                  <h3 className={styles.cardTitle}>{feature.title}</h3>

                  <p className={styles.cardDescription}>{feature.description}</p>

                  <div className={styles.cardFooter}>
                    <span>Learn more</span>
                    <ArrowRight size={15} className={styles.arrowIcon} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
