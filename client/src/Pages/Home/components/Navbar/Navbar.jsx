import React from 'react';
import { ArrowRight, LogOut, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  };

  return (
    <nav className={styles.nav}>
      {/* ── Brand Logo ── */}
      <Link to="/" className={styles.logo}>
        <img src="/CoddabLogoKrish.svg" alt="Coddab logo" className={styles.logoMark} />
        <span className={styles.logoText}>Coddab</span>
      </Link>

      {/* ── Center Nav Links ── */}
      <div className={styles.centerLinks}>
        <Link to="/join" className={styles.link}>1v1 Battles</Link>
        <Link to="/join" className={styles.link}>Collab Rooms</Link>
        <a href="#features" className={styles.link}>Features</a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          GitHub
        </a>
      </div>

      {/* ── Right Auth Area ── */}
      <div className={styles.right}>
        {loading ? (
          <div className={styles.authSkeleton} />
        ) : isAuthenticated ? (
          <div className={styles.userArea}>
            <div className={styles.avatar} title={user?.name || 'User'}>
              {user?.name ? getInitials(user.name) : <User size={14} />}
            </div>
            <span className={styles.userName}>{user?.name || 'User'}</span>
            <button
              className={styles.primaryBtn}
              onClick={() => navigate('/join')}
            >
              Start Coding
              <ArrowRight size={13} />
            </button>
            <button
              className={styles.logoutBtn}
              onClick={handleLogout}
              aria-label="Sign out"
            >
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <div className={styles.authLinks}>
            <Link to="/login" className={styles.loginLink}>
              Sign in
            </Link>
            <button
              className={styles.signUpBtn}
              onClick={() => navigate('/login')}
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
