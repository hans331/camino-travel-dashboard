'use client';

import { useState, useMemo, useEffect } from 'react';
import { NAV_ITEMS, PHASES } from '@/lib/data';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCollapsedChange?: (collapsed: boolean) => void;
  onPhaseSelect?: (phase: string) => void;
}

const TRIP_START = new Date('2026-06-16');

function getDDay(): number {
  const now = new Date();
  const diff = TRIP_START.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

const PHASE_SEGMENTS = [
  { key: 'porto', days: 2 },
  { key: 'camino', days: 11 },
  { key: 'london', days: 3 },
  { key: 'paris', days: 5 },
] as const;

const TOTAL_DAYS = 21;

export default function Sidebar({ activeTab, onTabChange, onCollapsedChange, onPhaseSelect }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const dday = useMemo(() => getDDay(), []);
  const ddayText = dday > 0 ? `D-${dday}` : dday === 0 ? 'D-Day!' : `D+${Math.abs(dday)}`;

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    onCollapsedChange?.(next);
  };

  const handleNavClick = (tabId: string) => {
    onTabChange(tabId);
    setIsOpen(false);
  };

  const handlePhaseClick = (phaseKey: string) => {
    onTabChange('map');
    onPhaseSelect?.(phaseKey);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="topbar">
        <button className="topbar-hamburger" onClick={() => setIsOpen(true)} aria-label="메뉴">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <h2><span>🐚</span> Walk Camino Together</h2>
        <span style={{ marginLeft: 'auto', fontSize: '0.88rem', color: 'var(--primary-dark)', fontWeight: 700 }}>{ddayText}</span>
      </div>

      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <button className="sidebar-close" onClick={() => setIsOpen(false)} aria-label="닫기">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        {/* Top row: brand + dark mode toggle */}
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <h1>
              <span className="sidebar-brand-emoji">🐚</span>
              <span className="sidebar-brand-emoji-text">Walk Camino Together</span>
            </h1>
            {!isCollapsed && <p>포르토 · 카미노 · 캠브리지 · 파리 21일</p>}
          </div>
          <button className="theme-btn" onClick={toggleTheme} title={isDark ? '라이트 모드' : '다크 모드'} aria-label="테마 전환">
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="sidebar-dday">
          <div className="dday-number">{ddayText}</div>
          {!isCollapsed && <div className="dday-label">2026.06.16 (화) 출발 ✈️</div>}
        </div>

        {!isCollapsed && (
          <div className="sidebar-party">
            <div className="sidebar-party-row">
              <span><span className="party-emoji">👨‍👩‍👦</span> 한국 출발</span>
              <span className="party-count">3명</span>
            </div>
            <div className="sidebar-party-row">
              <span><span className="party-emoji">👨‍👩‍👦‍👦</span> 런던 합류 ~</span>
              <span className="party-count">4명</span>
            </div>
          </div>
        )}

        {!isCollapsed && (
          <div className="sidebar-progress">
            <div className="progress-bar">
              {PHASE_SEGMENTS.map((seg) => (
                <div
                  key={seg.key}
                  className="progress-segment"
                  style={{
                    flex: seg.days / TOTAL_DAYS,
                    backgroundColor: PHASES[seg.key as keyof typeof PHASES]?.color,
                  }}
                  title={`${PHASES[seg.key as keyof typeof PHASES]?.label} (${seg.days}일)`}
                  onClick={() => handlePhaseClick(seg.key)}
                />
              ))}
            </div>
            <div className="progress-labels">
              {PHASE_SEGMENTS.map((seg) => (
                <span
                  key={seg.key}
                  onClick={() => handlePhaseClick(seg.key)}
                >
                  {PHASES[seg.key as keyof typeof PHASES]?.emoji} {PHASES[seg.key as keyof typeof PHASES]?.label}
                </span>
              ))}
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
              title={isCollapsed ? item.label : undefined}
            >
              <span className="nav-item-icon">{item.icon}</span>
              <span className="nav-item-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="collapse-toggle" onClick={toggleCollapse} title={isCollapsed ? '메뉴 펼치기' : '메뉴 접기'}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: isCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {!isCollapsed && <span>접기</span>}
        </button>
      </aside>
    </>
  );
}
