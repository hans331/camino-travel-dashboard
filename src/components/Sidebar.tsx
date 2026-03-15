'use client';

import { useState, useMemo } from 'react';
import { NAV_ITEMS, PHASES } from '@/lib/data';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TRIP_START = new Date('2026-07-05');

function getDDay(): number {
  const now = new Date();
  const diff = TRIP_START.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

const PHASE_SEGMENTS = [
  { key: 'portugal', days: 3 },
  { key: 'camino', days: 10 },
  { key: 'andalusia', days: 6 },
  { key: 'madrid', days: 3 },
  { key: 'barcelona', days: 3 },
] as const;

const TOTAL_DAYS = 25;

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const dday = useMemo(() => getDDay(), []);

  const ddayText = dday > 0 ? `D-${dday}` : dday === 0 ? 'D-Day!' : `D+${Math.abs(dday)}`;

  const handleNavClick = (tabId: string) => {
    onTabChange(tabId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="topbar">
        <button className="topbar-hamburger" onClick={() => setIsOpen(true)}>
          ☰
        </button>
        <h2>🐚 Buen Camino!</h2>
      </div>

      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="sidebar-close" onClick={() => setIsOpen(false)}>
          ✕
        </button>

        <div className="sidebar-brand">
          <h1>🐚 Buen Camino!</h1>
          <p>포르투갈 · 스페인 25일</p>
        </div>

        <div className="sidebar-dday">
          <div className="dday-number">{ddayText}</div>
          <div className="dday-label">2026.07.05 출발</div>
        </div>

        <div className="sidebar-progress">
          <div className="progress-bar">
            {PHASE_SEGMENTS.map((seg) => (
              <div
                key={seg.key}
                className="progress-segment"
                style={{
                  flex: seg.days / TOTAL_DAYS,
                  backgroundColor: PHASES[seg.key as keyof typeof PHASES].color,
                }}
              />
            ))}
          </div>
          <div className="progress-labels">
            {PHASE_SEGMENTS.map((seg) => (
              <span key={seg.key}>
                {PHASES[seg.key as keyof typeof PHASES].label}
              </span>
            ))}
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <span className="nav-item-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
