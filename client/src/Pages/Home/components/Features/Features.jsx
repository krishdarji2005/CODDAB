import React from 'react';
import { Swords, Terminal, Users, CheckCircle2, Share2, Zap, ArrowRight } from 'lucide-react';
import styles from './Features.module.css';

const Features = () => {
  return (
    <section className={styles.section} id="features">

      {/* ── Section Header (shadcn/studio style) ── */}
      <div className={styles.header}>
        <span className={styles.handwrittenTag}>Core Capabilities</span>
        <h2 className={styles.title}>
          All Essentials <span className={styles.highlight}>in One Place</span>
        </h2>
        <p className={styles.subtitle}>
          Everything built for practicing data structures and algorithms under pressure, competing in live 1v1 duels, and pair-programming with teammates.
        </p>
      </div>

      {/* ── Bento Grid Wrapped in Borders (Image 3 Reference) ── */}
      <div className={styles.bentoGrid}>

        {/* ── Top Row — Card 1 (Large 1v1 Battles) ── */}
        <div className={`${styles.card} ${styles.cardTopLeft}`}>
          <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
              <span className={styles.cardBadge}>Primary Mode</span>
              <h3 className={styles.cardTitle}>1v1 Real-Time Algorithm Duels</h3>
            </div>
            <p className={styles.cardDesc}>
              Challenge another developer to a timed battle on identical problem sets. Watch real-time progress indicators as test cases pass, and lock in your win the second all assertions succeed.
            </p>
          </div>

          {/* Visual Widget: Live duel orbit / comparison diagram */}
          <div className={styles.duelWidget}>
            <div className={styles.duelOrbit}>
              <div className={styles.orbitCircle} />
              <div className={styles.centerNode}>
                <Swords size={18} />
              </div>
              <div className={`${styles.orbitNode} ${styles.orbitNode1}`}>
                <span>YOU</span>
              </div>
              <div className={`${styles.orbitNode} ${styles.orbitNode2}`}>
                <span>OPP</span>
              </div>
              <div className={`${styles.orbitNode} ${styles.orbitNode3}`}>
                <Zap size={11} />
              </div>
              <div className={`${styles.orbitNode} ${styles.orbitNode4}`}>
                <span>4/4</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Top Row — Card 2 (Sandboxed Runner) ── */}
        <div className={`${styles.card} ${styles.cardTopRight}`}>
          <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
              <span className={styles.cardBadge}>Execution</span>
              <h3 className={styles.cardTitle}>Multi-Language Sandboxed Runner</h3>
            </div>
            <p className={styles.cardDesc}>
              Execute C++, Python, and JavaScript solutions against hidden edge cases in isolated runtimes. Receive instant feedback on runtime, memory usage, and assertion results.
            </p>
          </div>

          {/* Visual Widget: Runner Terminal / Test Case card */}
          <div className={styles.runnerWidget}>
            <div className={styles.runnerCard}>
              <div className={styles.runnerCardHead}>
                <div className={styles.langChip}>
                  <Terminal size={12} />
                  <span>C++20 (GCC 13.2)</span>
                </div>
                <span className={styles.runnerStatus}>Passed 4/4</span>
              </div>
              <div className={styles.runnerStatsRow}>
                <div className={styles.runnerStatItem}>
                  <span className={styles.statLabel}>Runtime</span>
                  <span className={styles.statVal}>12 ms</span>
                </div>
                <div className={styles.runnerStatItem}>
                  <span className={styles.statLabel}>Memory</span>
                  <span className={styles.statVal}>8.2 MB</span>
                </div>
                <div className={styles.runnerStatItem}>
                  <span className={styles.statLabel}>Output</span>
                  <span className={styles.statValGreen}>Accepted</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Row — Card 3 (Collab Rooms) ── */}
        <div className={`${styles.card} ${styles.cardBottom1}`}>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitleSmall}>Real-Time Collaborative Rooms</h3>
            <p className={styles.cardDescSmall}>
              Spin up collaborative coding rooms with synchronized multi-cursor editing, shared syntax highlighting, and live compilation.
            </p>
          </div>
          <div className={styles.collabWidget}>
            <div className={styles.cursorPillA}>
              <span className={styles.cursorDotA} />
              <span>alice · editing</span>
            </div>
            <div className={styles.cursorWave} />
            <div className={styles.cursorPillB}>
              <span className={styles.cursorDotB} />
              <span>bob · viewing</span>
            </div>
          </div>
        </div>

        {/* ── Bottom Row — Card 4 (Automated Validation) ── */}
        <div className={`${styles.card} ${styles.cardBottom2}`}>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitleSmall}>Automated Test Validation</h3>
            <p className={styles.cardDescSmall}>
              Instant verification of edge cases, time limits (TLE), and memory thresholds (MLE) for every submission.
            </p>
          </div>
          <div className={styles.validationWidget}>
            <div className={styles.valNodeActive}>
              <CheckCircle2 size={13} className={styles.greenCheck} />
              <span>Test 1: Normal</span>
            </div>
            <div className={styles.valBranch} />
            <div className={styles.valNodeActive}>
              <CheckCircle2 size={13} className={styles.greenCheck} />
              <span>Test 2: Edge Bounds</span>
            </div>
            <div className={styles.valBranch} />
            <div className={styles.valNodeActive}>
              <CheckCircle2 size={13} className={styles.greenCheck} />
              <span>Test 3: Large Array</span>
            </div>
          </div>
        </div>

        {/* ── Bottom Row — Card 5 (Instant Room Sharing) ── */}
        <div className={`${styles.card} ${styles.cardBottom3}`}>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitleSmall}>Instant Room Sharing</h3>
            <p className={styles.cardDescSmall}>
              No installs or complex setup. Generate a unique room URL, send it to a friend, and start coding in your browser within seconds.
            </p>
          </div>
          <div className={styles.shareWidget}>
            <div className={styles.shareFlow}>
              <span className={styles.shareTag}>Generate Link</span>
              <ArrowRight size={13} className={styles.arrowIcon} />
              <span className={styles.shareTagActive}>1v1 Battle Arena</span>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};

export default Features;
