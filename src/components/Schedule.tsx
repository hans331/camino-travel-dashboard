'use client';

import { useState, useMemo, useEffect } from 'react';
import { SCHEDULE, PHASES, BUDGET } from '@/lib/data';
import type { DayData } from '@/lib/types';
import CalendarView from './CalendarView';

type FilterKey = 'all' | DayData['phase'];
type ViewMode = 'list' | 'calendar';

const FILTERS: { key: FilterKey; label: string; emoji: string }[] = [
  { key: 'all', label: '전체', emoji: '🌍' },
  { key: 'porto', label: '포르토', emoji: '🇵🇹' },
  { key: 'camino', label: '카미노', emoji: '🐚' },
  { key: 'london', label: '런던·캠브리지', emoji: '🇬🇧' },
  { key: 'paris', label: '파리', emoji: '🇫🇷' },
];

interface PhaseSummary {
  key: DayData['phase'];
  label: string;
  emoji: string;
  dates: string;
  nights: string;
  daysRange: string;
  extra: string;
}

const PHASE_SUMMARIES: PhaseSummary[] = [
  { key: 'porto', label: '포르토', emoji: '🇵🇹', dates: '6/13(토) ~ 6/14(일)', nights: '2박 3일', daysRange: 'Day 1 - 2', extra: '🍷 시차 적응 + 포트와인 (부부 2명)' },
  { key: 'camino', label: '카미노 포르투게스', emoji: '🐚', dates: '6/15(월) ~ 6/25(목)', nights: '11박 11일', daysRange: 'Day 3 - 13', extra: '🥾 도보 242km (부부 2명) · 알베르게 10박 + 산티아고 1박' },
  { key: 'london', label: '런던·캠브리지', emoji: '🇬🇧', dates: '6/26(금) ~ 7/1(수)', nights: '5박 6일', daysRange: 'Day 14 - 19', extra: '👨‍👩‍👦‍👦 가족 합류 (런던 → 캠브리지) · 🎓 7/1 졸업식 · 둘째 귀국' },
  { key: 'paris', label: '파리·베르사유', emoji: '🇫🇷', dates: '7/1(수) ~ 7/5(일)', nights: '3박 5일', daysRange: 'Day 19 - 23', extra: '👨‍👩‍👦 부부 + 큰아들 3명 · 베르사유·루브르·오르세 · 7/5 점심 ICN 도착' },
];

function DayCard({ day }: { day: DayData }) {
  return (
    <div className="card day-card" data-phase={day.phase}>
      <div className="day-card-header">
        <span className={`day-badge ${day.phase}`}>
          Day {day.day}
        </span>
        <span className="day-card-title">
          {day.icon} {day.title}
        </span>
        <span className="day-card-date">
          {day.date}{day.dist ? ` · ${day.dist}` : ''}
        </span>
      </div>

      <div className="day-card-body">
        <p>{day.desc}</p>
        <div className="detail-row">
          <span className="detail-label">🍽️</span>
          <span>{day.food}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">🏠</span>
          <span>{day.stay}</span>
        </div>
      </div>

      {day.restaurants && day.restaurants.length > 0 && (
        <div className="day-card-restaurants">
          {day.restaurants.map((r) => (
            <span key={r} className="restaurant-tag">
              📍 {r}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Schedule() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (filter !== 'all') {
      setExpanded((prev) => ({ ...prev, [filter]: true }));
    }
  }, [filter]);

  const totalBudget = BUDGET.reduce((s, b) => s + b.amtNum, 0);
  const budgetMan = Math.round(totalBudget / 10000);

  const visiblePhases = useMemo(() => {
    if (filter === 'all') return PHASE_SUMMARIES;
    return PHASE_SUMMARIES.filter((p) => p.key === filter);
  }, [filter]);

  const toggle = (phase: string) => {
    setExpanded((prev) => ({ ...prev, [phase]: !prev[phase] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    PHASE_SUMMARIES.forEach((p) => (all[p.key] = true));
    setExpanded(all);
  };

  const collapseAll = () => {
    setExpanded({});
  };

  return (
    <div>
      <div className="section-header">
        <h2><span>📅</span> 23일 가족 여행</h2>
        <p>포르토 · 카미노 → 런던·캠브리지(졸업식) → 파리 → 인천 (7/5 점심 도착)</p>
      </div>

      <div className="trip-stats">
        <div className="stat-card">
          <div className="stat-card-emoji">📅</div>
          <div className="stat-card-value">23일</div>
          <div className="stat-card-label">6/13 → 7/5</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-emoji">👨‍👩‍👦‍👦</div>
          <div className="stat-card-value">2 → 4명</div>
          <div className="stat-card-label">단계별 가족 합류</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-emoji">🐚</div>
          <div className="stat-card-value">242km</div>
          <div className="stat-card-label">카미노 11일</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-emoji">💰</div>
          <div className="stat-card-value">{budgetMan}만</div>
          <div className="stat-card-label">예상 총 예산</div>
        </div>
      </div>

      <div className="view-toggle">
        <button
          className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => setViewMode('list')}
        >
          📋 목록 보기
        </button>
        <button
          className={`view-toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
          onClick={() => setViewMode('calendar')}
        >
          📆 캘린더 보기
        </button>
      </div>

      {viewMode === 'calendar' ? (
        <CalendarView />
      ) : (
        <>
          <div className="filter-bar">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className={`filter-btn ${filter === f.key ? 'active' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.emoji} {f.label}
              </button>
            ))}
          </div>

          <div className="expand-controls">
            <button className="expand-btn" onClick={expandAll}>📂 모두 펼치기</button>
            <button className="expand-btn" onClick={collapseAll}>📁 모두 접기</button>
          </div>

          {visiblePhases.map((phaseSummary) => {
            const phaseDays = SCHEDULE.filter((d) => d.phase === phaseSummary.key);
            const isExpanded = expanded[phaseSummary.key] ?? false;
            const phaseColor = PHASES[phaseSummary.key].color;

            return (
              <div key={phaseSummary.key} className="phase-section">
                <button
                  className={`phase-header ${isExpanded ? 'expanded' : ''}`}
                  onClick={() => toggle(phaseSummary.key)}
                  style={{ borderLeftColor: phaseColor }}
                  aria-expanded={isExpanded}
                >
                  <div className="phase-header-emoji">{phaseSummary.emoji}</div>
                  <div className="phase-header-main">
                    <div className="phase-header-title-row">
                      <h3 className="phase-header-title">{phaseSummary.label}</h3>
                      <span
                        className="phase-header-nights"
                        style={{ background: phaseColor }}
                      >
                        🌙 {phaseSummary.nights}
                      </span>
                    </div>
                    <div className="phase-header-meta">
                      <span>📅 {phaseSummary.dates}</span>
                      <span className="phase-header-range">{phaseSummary.daysRange}</span>
                    </div>
                    <div className="phase-header-extra">{phaseSummary.extra}</div>
                  </div>
                  <svg
                    className="phase-chevron"
                    width="24" height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isExpanded && (
                  <div className="phase-days">
                    {phaseDays.map((day) => (
                      <DayCard key={day.day} day={day} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
