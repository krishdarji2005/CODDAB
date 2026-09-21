import React from 'react';
import { ArrowUpRight, Users, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { BackgroundRippleEffect } from '../../../../components/ui/background-ripple-effect';
import TextLoop from '../../../../components/ui/text-loop';
import styles from './Hero.module.css';

const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleStartBattle = () => {
    navigate(isAuthenticated ? '/join' : '/login');
  };

  const handleCreateCollab = () => {
    navigate(isAuthenticated ? '/join' : '/login');
  };

  return (
    <section className={styles.section}>

      {/* ── Interactive Grid Background ── */}
      <BackgroundRippleEffect rows={9} cols={28} cellSize={52} />

      {/* ── Content sits above the grid ── */}
      <div className={styles.content}>

        {/* ── Announcement pill badge ── */}
        <div className={styles.announceBadge} onClick={handleStartBattle}>
          <span className={styles.badgeNew}>
            ⚡ 1v1 Duels
          </span>
          <span className={styles.badgeText}>Real-time DSA battles are live</span>
        </div>

        {/* ── Main Headline — Geist font, bold, direct with TextLoop ── */}
        <h1 className={styles.heading}>
          <span className={styles.headingLine}>Practice DSA under pressure.</span>
          <div className={styles.loopContainer}>
            <TextLoop
              staticText="Battle 1v1"
              rotatingTexts={[
                "in real time.",
                "under pressure.",
                "with peers.",
                "to level up.",
              ]}
              interval={3000}
              className={styles.heroTextLoop}
            />
          </div>
        </h1>

        {/* ── Subtitle ── */}
        <p className={styles.subtitle}>
          Challenge peers to live algorithmic duels, execute test cases instantly, or spin up collaborative rooms to write code together.
        </p>

        {/* ── Tactile Button Pair ── */}
        <div className={styles.ctaRow}>
          <button className={styles.btnPrimary} onClick={handleStartBattle}>
            <ArrowUpRight size={18} strokeWidth={2.4} />
            Start 1v1 Battle
          </button>
          <button className={styles.btnSecondary} onClick={handleCreateCollab}>
            <Users size={16} />
            Create Collab Room
          </button>
        </div>

        {/* ── Honest Product Badges ── */}
        <div className={styles.trustRow}>
          <div className={styles.trustItem}>
            <Check size={14} className={styles.checkIcon} strokeWidth={2.5} />
            <span>Real-time collaboration</span>
          </div>
          <span className={styles.trustDot}>•</span>
          <div className={styles.trustItem}>
            <Check size={14} className={styles.checkIcon} strokeWidth={2.5} />
            <span>Instant room sharing</span>
          </div>
          <span className={styles.trustDot}>•</span>
          <div className={styles.trustItem}>
            <Check size={14} className={styles.checkIcon} strokeWidth={2.5} />
            <span>Built for DSA practice</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
