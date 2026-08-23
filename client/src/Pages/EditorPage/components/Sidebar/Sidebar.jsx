import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, LogOut, Users, Swords } from 'lucide-react';
import toast from 'react-hot-toast';
import UserCard from '../UserCard/UserCard';
import styles from './Sidebar.module.css';

const Sidebar = ({ roomId, members, roomType }) => {
  const navigate = useNavigate();

  /* ── Copy room ID to clipboard ── */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success('Room ID copied!');
    } catch {
      toast.error('Failed to copy Room ID.');
    }
  };

  /* ── Leave room ── */
  const handleLeave = () => {
    navigate('/');
  };

  return (
    <aside className={styles.sidebar}>
      {/* ── Brand ── */}
      <div className={styles.brand} onClick={() => navigate('/')}>
        <img src="/CoddabLogoKrish.svg" alt="Coddab logo" className={styles.logoMark} />
        <span className={styles.brandName}>Coddab</span>
      </div>

      <div className={styles.divider} />

      {/* ── Room mode badge ── */}
      {roomType && (
        <div className={`${styles.modeBadge} ${roomType === 'battle' ? styles.modeBadgeBattle : styles.modeBadgeCollab}`}>
          {roomType === 'battle' ? <Swords size={13} /> : <Users size={13} />}
          {roomType === 'battle' ? 'Battle Mode' : 'Collab Mode'}
        </div>
      )}

      {/* ── Members ── */}
      <div className={styles.membersSection}>
        <span className={styles.sectionLabel}>
          Members
          <span className={styles.badge}>{members.length}</span>
        </span>

        <div className={styles.membersList}>
          {members.map((member) => (
            <UserCard
              key={member.socketId}
              username={member.username}
              socketId={member.socketId}
            />
          ))}
        </div>
      </div>

      {/* ── Actions ── */}
      <div className={styles.actions}>
        <button
          type="button"
          className={`tactile-btn-primary tactile-btn-sm ${styles.actionBtn}`}
          onClick={handleCopy}
        >
          <Copy size={14} />
          Copy Room ID
        </button>
        <button
          type="button"
          className={`tactile-btn-danger tactile-btn-sm ${styles.actionBtn}`}
          onClick={handleLeave}
        >
          <LogOut size={14} />
          Leave Room
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
