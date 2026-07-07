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
  { key: 'swiss', label: '스위스', emoji: '🇨🇭' },
  { key: 'london', label: '캠브리지', emoji: '🇬🇧' },
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
  { key: 'porto', label: '포르토 (2일)', emoji: '🇵🇹', dates: '6/12(금) ~ 6/13(토)', nights: '2박 3일', daysRange: 'Day 1 - 2', extra: '🍷 시차 적응 + 포트와인 셀러 + 도루강 크루즈 (여유롭게)' },
  { key: 'camino', label: '카미노 (10일)', emoji: '🐚', dates: '6/14(일) ~ 6/23(화)', nights: '10박 10일', daysRange: 'Day 3 - 12', extra: '🥾 도보 242km (부부 2명) · Tui→Redondela 31km 통합 (Day 6 ⚠️)' },
  { key: 'swiss', label: '스위스 알프스 (6일)', emoji: '🇨🇭', dates: '6/24(수) ~ 6/29(월)', nights: '6박 6일', daysRange: 'Day 13 - 18', extra: '👨‍👩‍👦 Day 13 둘째 ZRH 합류 → Day 15 큰아들 ZRH 합류 (4명) · Lucerne+Matterhorn+Jungfraujoch' },
  { key: 'london', label: '캠브리지·런던', emoji: '🇬🇧', dates: '6/30(화) ~ 7/1(수)', nights: '1박 2일', daysRange: 'Day 19 - 20', extra: '⚠️ 아빠+둘째 결항으로 스위스 1박 추가 (7/1 대체편) · 7/1 둘째 귀국 + 3명 파리 이동' },
  { key: 'paris', label: '파리 (8일)', emoji: '🇫🇷', dates: '7/1(수) ~ 7/9(목)', nights: '7박 9일', daysRange: 'Day 20 - 28', extra: '👨‍👩‍👦 3명 · 베르사유·루브르·오르세·🌻 지베르니·🏰 Mont-Saint-Michel · 7/9 14:10 ICN' },
];

function DayCard({ day }: { day: DayData }) {
  const hasTimeline = day.timeline && day.timeline.length > 0;
  const confirmedCount = day.timeline?.filter((e) => e.status === 'confirmed').length ?? 0;

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

      {hasTimeline && (
        <div className="day-timeline">
          <div className="day-timeline-head">
            <span className="day-timeline-label">⏱ 하루 시간표</span>
            {confirmedCount > 0 && (
              <span className="day-timeline-count">
                ✅ 확정 {confirmedCount}건
              </span>
            )}
          </div>
          <ol className="day-timeline-list">
            {day.timeline!.map((ev, i) => (
              <li
                key={i}
                className={`day-timeline-item ${ev.status === 'confirmed' ? 'is-confirmed' : 'is-pending'}`}
              >
                <span className="day-timeline-time">{ev.time}</span>
                <span className="day-timeline-emoji">{ev.emoji}</span>
                <div className="day-timeline-body">
                  <div className="day-timeline-line">
                    <span className="day-timeline-text">{ev.label}</span>
                    {ev.status === 'confirmed' && (
                      <span className="day-timeline-badge confirmed">예매</span>
                    )}
                  </div>
                  {ev.detail && <div className="day-timeline-detail">{ev.detail}</div>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

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

      {day.links && day.links.length > 0 && (
        <div className="day-card-links">
          {day.links.map((l) => (
            <a key={l.url} className="checklist-link-btn" href={l.url} target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
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
        <h2><span>📅</span> 28일 가족 여행</h2>
        <p>포르토(2일) · 카미노(10일) → 🇨🇭 스위스(6일·🏔️⛰️) → 캠브리지 → 파리(8일) → 인천</p>
      </div>

      <div className="trip-stats">
        <div className="stat-card">
          <div className="stat-card-emoji">📅</div>
          <div className="stat-card-value">28일</div>
          <div className="stat-card-label">6/12 → 7/9</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-emoji">👨‍👩‍👦‍👦</div>
          <div className="stat-card-value">2 → 4명</div>
          <div className="stat-card-label">단계별 가족 합류</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-emoji">🐚</div>
          <div className="stat-card-value">242km</div>
          <div className="stat-card-label">카미노 10일</div>
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
