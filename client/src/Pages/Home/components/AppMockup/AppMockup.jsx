import React, { useState } from 'react';
import { Warp } from '@paper-design/shaders-react';
import {
  Swords,
  Users,
  Terminal,
  RefreshCw,
  ClipboardList,
  Code2,
  MessageSquare,
  BarChart2,
  Settings,
  Clock,
  ChevronDown,
  ChevronRight,
  Check,
} from 'lucide-react';
import styles from './AppMockup.module.css';

const CODE_LINES = [
  { num: 1,  text: '#include <bits/stdc++.h>' },
  { num: 2,  text: 'using namespace std;' },
  { num: 3,  text: '' },
  { num: 4,  text: 'int twoSum(vector<int>& nums, int target) {' },
  { num: 5,  text: '    unordered_map<int, int> mp;' },
  { num: 6,  text: '    for (int i = 0; i < nums.size(); i++) {' },
  { num: 7,  text: '        int rem = target - nums[i];', highlighted: true },
  { num: 8,  text: '        if (mp.count(rem)) return i;' },
  { num: 9,  text: '        mp[nums[i]] = i;' },
  { num: 10, text: '    }' },
  { num: 11, text: '    return -1;' },
  { num: 12, text: '}' },
  { num: 13, text: '' },
  { num: 14, text: 'int main(){' },
  { num: 15, text: '    ios::sync_with_stdio(false);' },
  { num: 16, text: '    cin.tie(nullptr);' },
  { num: 17, text: '    return 0;' },
  { num: 18, text: '}' },
];

const BOTTOM_FEATURES = [
  {
    id: 'battles',
    icon: Swords,
    title: '1v1 Battles',
    subtitle: 'Real-time duels',
    desc: 'Timed head-to-head algorithmic duels with instant Judge0 evaluation. Wrong answer keeps the match alive — only a correct solution ends it.',
  },
  {
    id: 'collab',
    icon: Users,
    title: 'Collab Rooms',
    subtitle: 'Code together',
    desc: 'Zero-latency shared editing powered by WebSockets. Multiple cursors, live presence, and a synced execution environment.',
  },
  {
    id: 'execution',
    icon: Terminal,
    title: 'Code Execution',
    subtitle: 'Instant results',
    desc: 'Sub-15ms sandboxed execution via Judge0 for C++, Python, JavaScript, and more — with full stdout, stderr, and stdin support.',
  },
  {
    id: 'sync',
    icon: RefreshCw,
    title: 'Live Sync',
    subtitle: 'Real-time updates',
    desc: 'Every keystroke propagated in real time. Room state, test results, and opponent progress all update without a single page reload.',
  },
  {
    id: 'analysis',
    icon: ClipboardList,
    title: 'Duel Analysis',
    subtitle: 'Improve & track',
    desc: 'Post-match breakdown of runtime, memory, and test-case pass rates. Track improvement across sessions and benchmark against opponents.',
  },
];

const AppMockup = () => {
  const [activeRail, setActiveRail] = useState('code');

  return (
    <section className={styles.wrapper}>


      {/* ══════════════════════════════════════════
          PREMIUM SHOWCASE FRAME
          ══════════════════════════════════════════ */}
      <div className={styles.showcaseFrame}>

        {/* ── Warp Shader background ── */}
        <div className={styles.shaderBg}>
          <Warp
            speed={0.18}
            colorBack="#09090b"
            colorFront="#1a1a2e"
            scale={1.2}
            style={{ width: '100%', height: '100%' }}
          />
          {/* Edge fade to blend into page */}
          <div className={styles.shaderEdgeFade} />
        </div>

        {/* ── Glow orbs for depth ── */}
        <div className={styles.glowOrb1} />
        <div className={styles.glowOrb2} />
        <div className={styles.glowOrb3} />



        {/* ══════════════════════════════════════════
            APP WINDOW MOCKUP
            ══════════════════════════════════════════ */}
        <div className={styles.appWindow}>

          {/* Window chrome dots + title */}
          <div className={styles.windowChrome}>
            <div className={styles.chromeDots}>
              <span className={styles.dot} style={{ background: '#ff5f57' }} />
              <span className={styles.dot} style={{ background: '#ffbd2e' }} />
              <span className={styles.dot} style={{ background: '#28c940' }} />
            </div>
            <span className={styles.chromeTitle}>Coddab — Room AB12CD</span>
            <div className={styles.chromePills}>
              <span className={styles.chromeLive}>
                <span className={styles.livePulse} />
                Live
              </span>
              <span className={styles.chromeTimer}>
                <Clock size={11} />
                28:14
              </span>
            </div>
          </div>

          {/* Window body */}
          <div className={styles.windowBody}>

            {/* Left rail */}
            <aside className={styles.sidebarRail}>
              {[
                { id: 'code',      Icon: () => <span className={styles.railCodeText}>&lt;/&gt;</span> },
                { id: 'users',     Icon: () => <Users size={16} /> },
                { id: 'chat',      Icon: () => <MessageSquare size={16} /> },
                { id: 'analytics', Icon: () => <BarChart2 size={16} /> },
                { id: 'settings',  Icon: () => <Settings size={16} /> },
              ].map(({ id, Icon }) => (
                <button
                  key={id}
                  className={`${styles.railBtn} ${activeRail === id ? styles.railActive : ''}`}
                  onClick={() => setActiveRail(id)}
                  aria-label={id}
                >
                  <Icon />
                </button>
              ))}
            </aside>

            {/* Split panes */}
            <div className={styles.panesLayout}>

              {/* ── Left: Code Editor ── */}
              <div className={styles.editorPane}>
                <div className={styles.editorTabBar}>
                  <span className={styles.activeTab}>main.cpp</span>
                  <div className={styles.editorMeta}>
                    <span className={styles.langChip}>C++ (GCC 14)</span>
                    <ChevronDown size={11} opacity={0.5} />
                  </div>
                </div>

                <div className={styles.codeCanvas}>
                  {CODE_LINES.map((line) => (
                    <div
                      key={line.num}
                      className={`${styles.codeLine} ${line.highlighted ? styles.codeLineActive : ''}`}
                    >
                      <span className={styles.lineNum}>{line.num}</span>
                      <span className={styles.lineCode}>{line.text}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.editorFooter}>
                  <span className={styles.savedStatus}>
                    <Check size={11} strokeWidth={3} /> All changes saved
                  </span>
                  <span className={styles.cursorPos}>Ln 7, Col 25</span>
                </div>
              </div>

              {/* ── Right: Battle Panel ── */}
              <div className={styles.battlePane}>

                <div className={styles.battleTopBar}>
                  <div className={styles.battleBadge}>
                    <Swords size={12} />
                    1v1 Match Active
                  </div>
                  <div className={styles.battleClock}>
                    <Clock size={12} />
                    03:18
                  </div>
                </div>

                <div className={styles.problemBlock}>
                  <div className={styles.problemHeader}>
                    <span className={styles.problemIcon}>&lt;/&gt;</span>
                    <span className={styles.problemTitle}>Two Sum (O(N) Required)</span>
                  </div>
                  <span className={styles.diffTag}>Easy</span>
                </div>

                <p className={styles.problemDesc}>
                  Find two numbers in the array that add up to the target value.
                </p>

                {/* VS Box */}
                <div className={styles.vsBox}>
                  <div className={styles.playerCol}>
                    <div className={styles.avatarYou}>KD</div>
                    <span className={styles.playerName}>You</span>
                    <span className={styles.scoreBadgeGreen}>4/4 ✓</span>
                    <span className={styles.playerSpec}>C++20 · 12ms</span>
                  </div>
                  <div className={styles.vsOrb}>VS</div>
                  <div className={styles.playerCol}>
                    <div className={styles.avatarOp}>OP</div>
                    <span className={styles.playerName}>Opponent</span>
                    <span className={styles.scoreBadgeAmber}>3/4</span>
                    <span className={styles.playerSpec}>Python · 34ms</span>
                  </div>
                </div>

                {/* Test cases */}
                <div className={styles.testBox}>
                  <span className={styles.testTitle}>Test Cases</span>
                  <div className={styles.testDots}>
                    {[1,2,3,4].map(i => (
                      <div key={i} className={styles.testDot}>
                        <Check size={10} strokeWidth={3} />
                      </div>
                    ))}
                  </div>
                  <span className={styles.testScore}>4 / 4 Passed</span>
                </div>

                <button className={styles.analysisBtn}>
                  <BarChart2 size={14} />
                  <span>View Match Analysis</span>
                  <ChevronRight size={13} />
                </button>

              </div>
            </div>
          </div>
        </div>

      </div>



    </section>
  );
};

export default AppMockup;
