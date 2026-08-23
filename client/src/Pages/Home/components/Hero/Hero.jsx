import React from 'react';
import { ArrowUpRight, Users, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
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

      {/* ── Announcement pill badge ── */}
      <div className={styles.announceBadge} onClick={handleStartBattle}>
        <span className={styles.badgeNew}>
          ⚡ 1v1 Duels
        </span>
        <span className={styles.badgeText}>Real-time DSA battles are live</span>
      </div>

      {/* ── Main Headline — Geist font, bold, direct ── */}
      <h1 className={styles.heading}>
        Practice DSA under pressure.<br />
        Battle 1v1 in real time.
      </h1>

      {/* ── Subtitle ── */}
      <p className={styles.subtitle}>
        Challenge peers to live algorithmic duels, execute test cases instantly, or spin up collaborative rooms to write code together.
      </p>

      {/* ── Tactile Button Pair (As Attached Reference Image) ── */}
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

      {/* ── Honest Product Badges (No Fake Numbers/Reviews) ── */}
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

    </section>
  );
};

export default Hero;
