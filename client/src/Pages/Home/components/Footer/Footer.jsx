import React from 'react';
import { GitBranch } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.brand}>
        <img src="/CoddabLogoKrish.svg" alt="Coddab logo" className={styles.logoMark} />
        <span className={styles.brandName}>Coddab</span>
      </div>

      <span className={styles.copy}>
        © {new Date().getFullYear()} Coddab. 1v1 DSA battles and real-time collaborative coding.
      </span>

      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.ghLink}
      >
        <GitBranch size={13} />
        GitHub
      </a>
    </footer>
  );
};

export default Footer;
