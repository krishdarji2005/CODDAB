import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import AppMockup from './components/AppMockup/AppMockup';
import Features from './components/Features/Features';
import Footer from './components/Footer/Footer';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.page}>
      <div className={styles.column}>
        <Navbar />
        <Hero />
        <AppMockup />
        <Features />
        <Footer />
      </div>
    </div>
  );
};

export default Home;