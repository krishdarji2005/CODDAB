import React from 'react';
import styles from './UserCard.module.css';

const UserCard = ({ username, socketId }) => {
  /* Generate a consistent avatar colour from the username */
  const hue = [...username].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  const initial = username.charAt(0).toUpperCase();

  return (
    <div className={styles.card} title={socketId}>
      <div
        className={styles.avatar}
        style={{ background: `hsl(${hue}, 55%, 50%)` }}
      >
        {initial}
      </div>
      <span className={styles.name}>{username}</span>
    </div>
  );
};

export default UserCard;
