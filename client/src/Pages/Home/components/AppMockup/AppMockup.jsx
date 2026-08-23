import React, { useState } from 'react';
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
  PanelRightClose
} from 'lucide-react';
import styles from './AppMockup.module.css';

const BOTTOM_FEATURES = [
  {
    id: 'battles',
    icon: Swords,
    title: '1v1 Battles',
    subtitle: 'Real-time duels',
  },
  {
    id: 'collab',
    icon: Users,
    title: 'Collab Rooms',
    subtitle: 'Code together',
  },
  {
    id: 'execution',
    icon: Terminal,
    title: 'Code Execution',
    subtitle: 'Instant results',
  },
  {
    id: 'sync',
    icon: RefreshCw,
    title: 'Live Sync',
    subtitle: 'Real-time updates',
  },
  {
    id: 'analysis',
    icon: ClipboardList,
    title: 'Duel Analysis',
    subtitle: 'Improve & track',
  },
];

const CODE_LINES = [
  { num: 1, text: '#include <bits/stdc++.h>', hasSplitIcon: true },
  { num: 2, text: 'using namespace std;' },
  { num: 3, text: '' },
  { num: 4, text: 'int twoSum(vector<int>& nums, int target) {' },
  { num: 5, text: '    unordered_map<int, int> mp;' },
  { num: 6, text: '    for (int i = 0; i < nums.size(); i++) {' },
  { num: 7, text: '        int rem = target - nums[i];', highlighted: true },
  { num: 8, text: '        if (mp.count(rem)) return i;' },
  { num: 9, text: '        mp[nums[i]] = i;' },
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

const AppMockup = () => {
  const [activeRail, setActiveRail] = useState('code');

  return (
    <section className={styles.wrapper}>
      {/* ══════════════════════════════════════════════
         DOT-GRID CANVAS WORKFLOW
         ══════════════════════════════════════════════ */}
      <div className={styles.canvas}>

        {/* ── Top-Left Floating Badge & Arc ── */}
        <div className={styles.topLeftFloating}>
          <div className={styles.floatingPill}>
            <Swords size={16} className={styles.pillIcon} />
            <span>Real-time 1v1 Battles</span>
          </div>
          {/* Dashed connector line */}
          <svg className={styles.leftCurveSvg} viewBox="0 0 160 100" fill="none">
            <path
              d="M 50 15 C -10 20, -35 60, -40 95"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <circle cx="-40" cy="95" r="4.5" fill="#09090b" />
          </svg>
        </div>

        {/* ── Top-Right Floating Badge & Arc ── */}
        <div className={styles.topRightFloating}>
          <div className={styles.floatingPill}>
            <Users size={16} className={styles.pillIcon} />
            <span>Collaborative Rooms</span>
          </div>
          {/* Dashed connector line */}
          <svg className={styles.rightCurveSvg} viewBox="0 0 160 100" fill="none">
            <path
              d="M 110 15 C 170 20, 195 60, 200 95"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <circle cx="200" cy="95" r="4.5" fill="#09090b" />
          </svg>
        </div>

        {/* ── Left Floating Code Tile ── */}
        <div className={styles.leftFloatCode}>
          <div className={styles.floatCard}>
            <span className={styles.floatCodeText}>&lt;/&gt;</span>
          </div>
        </div>

        {/* ── Left Floating 3D Trophy ── */}
        <div className={styles.leftFloatTrophy}>
          <div className={styles.trophyWrapper}>
            <div className={styles.trophyCupBody}>
              <svg viewBox="0 0 44 44" className={styles.trophyVector} fill="none">
                {/* Metallic Cup SVG */}
                <path
                  d="M14 10 H30 V21 C30 26 26 29 22 29 C18 29 14 26 14 21 V10 Z"
                  fill="url(#trophyGrad)"
                />
                {/* Left handle */}
                <path
                  d="M14 13 H10 C8.5 13 7.5 14.5 8 16.5 C8.8 19.5 11 21 14 21.5"
                  stroke="#94a3b8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Right handle */}
                <path
                  d="M30 13 H34 C35.5 13 36.5 14.5 36 16.5 C35.2 19.5 33 21 30 21.5"
                  stroke="#94a3b8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Stem */}
                <path d="M20 29 H24 V34 H20 Z" fill="#94a3b8" />
                {/* Star on Cup */}
                <path
                  d="M22 17 L23.2 20.5 H26.8 L23.9 22.5 L25 26 L22 23.8 L19 26 L20.1 22.5 L17.2 20.5 H20.8 Z"
                  fill="#ffffff"
                />
                <defs>
                  <linearGradient id="trophyGrad" x1="14" y1="10" x2="30" y2="29" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#e2e8f0" />
                    <stop offset="0.5" stopColor="#cbd5e1" />
                    <stop offset="1" stopColor="#94a3b8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className={styles.trophyBasePlatform} />
          </div>
        </div>

        {/* ── Right Floating Analytics Tile ── */}
        <div className={styles.rightFloatChart}>
          <div className={styles.floatCard}>
            <BarChart2 size={24} className={styles.floatChartIcon} />
          </div>
        </div>

        {/* Scattered background dots */}
        <div className={styles.dotAccent1} />
        <div className={styles.dotAccent2} />

        {/* ══════════════════════════════════════════════
           CENTRAL CODDAB APP WINDOW MOCKUP
           ══════════════════════════════════════════════ */}
        <div className={styles.appWindow}>

          {/* Window Header */}
          <div className={styles.windowHeader}>
            <div className={styles.headerLeft}>
              <div className={styles.logoBadge}>
                <div className={styles.logoInnerDots} />
              </div>
              <span className={styles.logoTitle}>Coddab</span>
            </div>

            <div className={styles.headerRight}>
              <div className={styles.roomSelectPill}>
                <span>Room ID: <strong>AB12CD</strong></span>
                <ChevronDown size={14} className={styles.chevron} />
              </div>

              <div className={styles.liveIndicatorPill}>
                <span className={styles.liveDot} />
                <span>Live</span>
              </div>

              <div className={styles.timerDisplay}>
                <span>01:24:37</span>
              </div>

              <div className={styles.participantsCount}>
                <Users size={14} />
                <span>2</span>
              </div>
            </div>
          </div>

          {/* Window Body: Sidebar Rail + 2 Panes */}
          <div className={styles.windowBody}>

            {/* Left Vertical Icon Bar */}
            <aside className={styles.sidebarRail}>
              <button
                className={`${styles.railButton} ${activeRail === 'code' ? styles.railActive : ''}`}
                onClick={() => setActiveRail('code')}
                aria-label="Code Editor"
              >
                <span className={styles.railCodeText}>&lt;/&gt;</span>
              </button>
              <button
                className={`${styles.railButton} ${activeRail === 'users' ? styles.railActive : ''}`}
                onClick={() => setActiveRail('users')}
                aria-label="Users"
              >
                <Users size={18} />
              </button>
              <button
                className={`${styles.railButton} ${activeRail === 'chat' ? styles.railActive : ''}`}
                onClick={() => setActiveRail('chat')}
                aria-label="Chat"
              >
                <MessageSquare size={18} />
              </button>
              <button
                className={`${styles.railButton} ${activeRail === 'analytics' ? styles.railActive : ''}`}
                onClick={() => setActiveRail('analytics')}
                aria-label="Stats"
              >
                <BarChart2 size={18} />
              </button>
              <button
                className={`${styles.railButton} ${activeRail === 'settings' ? styles.railActive : ''}`}
                onClick={() => setActiveRail('settings')}
                aria-label="Settings"
              >
                <Settings size={18} />
              </button>
            </aside>

            {/* Main Center Area: Split Panes */}
            <div className={styles.panesLayout}>

              {/* ── Left Pane: Code Editor ── */}
              <div className={styles.editorContainer}>
                {/* Editor Tab Header */}
                <div className={styles.editorTabHeader}>
                  <span className={styles.activeFileName}>main.cpp</span>
                  <div className={styles.editorHeaderRight}>
                    <div className={styles.languageDropdown}>
                      <span>C++ (GCC 14)</span>
                      <ChevronDown size={13} />
                    </div>
                    <button className={styles.splitBtn} title="Split view">
                      <span className={styles.splitIconSymbol}>↳</span>
                    </button>
                  </div>
                </div>

                {/* Dark Code Area */}
                <div className={styles.codeCanvas}>
                  {CODE_LINES.map((line) => (
                    <div
                      key={line.num}
                      className={`${styles.codeRow} ${line.highlighted ? styles.codeRowActive : ''}`}
                    >
                      <span className={styles.rowNumber}>{line.num}</span>
                      <span className={styles.rowContent}>
                        {line.text}
                        {line.hasSplitIcon && (
                          <span className={styles.lineEndSymbol}>↦</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Editor Footer Bar */}
                <div className={styles.editorFooterBar}>
                  <div className={styles.editorStatus}>
                    <span className={styles.checkIconWrap}>
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span>All changes saved</span>
                  </div>
                  <div className={styles.editorPosition}>
                    <span>Ln 7, Col 25</span>
                    <span>Spaces: 4</span>
                  </div>
                </div>
              </div>

              {/* ── Right Pane: 1v1 Battle Panel ── */}
              <div className={styles.battlePanelContainer}>

                {/* Top Status Badges */}
                <div className={styles.battleTopStatus}>
                  <div className={styles.battleActiveBadge}>
                    <Swords size={13} />
                    <span>1v1 Match Active</span>
                  </div>
                  <div className={styles.battleClock}>
                    <Clock size={13} />
                    <span>03:18</span>
                  </div>
                </div>

                {/* Problem Name & Tag */}
                <div className={styles.problemHeadingGroup}>
                  <div className={styles.problemTitleWrapper}>
                    <div className={styles.problemIconBadge}>
                      <span>&lt;/&gt;</span>
                    </div>
                    <h3 className={styles.problemHeading}>Two Sum (O(N) Required)</h3>
                  </div>
                  <span className={styles.difficultyTag}>Easy</span>
                </div>

                <p className={styles.problemPrompt}>
                  Find two numbers that add up to the target.
                </p>

                {/* Player VS Battle Status Inset Box */}
                <div className={styles.combatantsBox}>
                  {/* Left: You */}
                  <div className={styles.playerSection}>
                    <div className={styles.avatarCircleYou}>KD</div>
                    <div className={styles.playerDetails}>
                      <span className={styles.playerLabel}>You</span>
                      <span className={styles.badgePass}>4/4 Passed ✓</span>
                      <span className={styles.playerSpecs}>C++20 · 12ms · 8.2MB</span>
                    </div>
                  </div>

                  {/* Center: VS Circle */}
                  <div className={styles.vsCircle}>
                    <span>VS</span>
                  </div>

                  {/* Right: Opponent */}
                  <div className={styles.playerSection}>
                    <div className={styles.avatarCircleOpponent}>OP</div>
                    <div className={styles.playerDetails}>
                      <span className={styles.playerLabel}>Opponent</span>
                      <span className={styles.badgeOpponent}>3/4 Passed</span>
                      <span className={styles.playerSpecs}>Python 3.11 · 34ms · 14.0MB</span>
                    </div>
                  </div>
                </div>

                {/* Test Cases Summary Box */}
                <div className={styles.testCasesBox}>
                  <span className={styles.testCasesTitle}>Test Cases</span>
                  <div className={styles.testCasesStatus}>
                    <span className={styles.testPassedText}>4 / 4 Passed</span>
                    <div className={styles.checkPills}>
                      <div className={styles.checkCircleFilled}><Check size={11} strokeWidth={2.5} /></div>
                      <div className={styles.checkCircleFilled}><Check size={11} strokeWidth={2.5} /></div>
                      <div className={styles.checkCircleFilled}><Check size={11} strokeWidth={2.5} /></div>
                      <div className={styles.checkCircleFilled}><Check size={11} strokeWidth={2.5} /></div>
                    </div>
                  </div>
                </div>

                {/* Match Analysis Ready Action Button */}
                <button className={styles.matchAnalysisAction}>
                  <div className={styles.analysisActionLeft}>
                    <BarChart2 size={16} />
                    <span>Match Analysis Ready</span>
                  </div>
                  <ChevronRight size={16} className={styles.analysisArrow} />
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* ══════════════════════════════════════════════
           BOTTOM FEATURE STRIP (5 Items)
           ══════════════════════════════════════════════ */}
        <div className={styles.featureStripContainer}>
          {BOTTOM_FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className={styles.featureColumn}>
                <div className={styles.featureColumnInner}>
                  <Icon size={20} className={styles.featureItemIcon} />
                  <div className={styles.featureTexts}>
                    <div className={styles.featureMainTitle}>{item.title}</div>
                    <div className={styles.featureSubTitle}>{item.subtitle}</div>
                  </div>
                </div>
                {idx < BOTTOM_FEATURES.length - 1 && (
                  <div className={styles.columnDivider} />
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default AppMockup;
