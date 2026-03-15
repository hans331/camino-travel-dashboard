'use client';

import { useState, useMemo } from 'react';
import { SCHEDULE, PHASES } from '@/lib/data';
import type { DayData } from '@/lib/types';

type FilterKey = 'all' | DayData['phase'];

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'portugal', label: '포르투갈' },
  { key: 'camino', label: '카미노' },
  { key: 'andalusia', label: '안달루시아' },
  { key: 'madrid', label: '마드리드' },
  { key: 'barcelona', label: '바르셀로나' },
];

export default function Schedule() {
  const [filter, setFilter] = useState<FilterKey>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return SCHEDULE;
    return SCHEDULE.filter((d) => d.phase === filter);
  }, [filter]);

  // Group by phase for dividers
  const withDividers = useMemo(() => {
    const result: { type: 'divider'; phase: string; label: string; emoji: string }[] | DayData[] = [];
    let lastPhase = '';
    for (const day of filtered) {
      if (day.phase !== lastPhase) {
        const phaseInfo = PHASES[day.phase];
        (result as Array<unknown>).push({
          type: 'divider',
          phase: day.phase,
          label: phaseInfo.label,
          emoji: phaseInfo.emoji,
        });
        lastPhase = day.phase;
      }
      (result as Array<unknown>).push(day);
    }
    return result as Array<
      | { type: 'divider'; phase: string; label: string; emoji: string }
      | DayData
    >;
  }, [filtered]);

  return (
    <div>
      <div className="section-header">
        <h2>📅 25일 일정</h2>
        <p>포르투갈 · 카미노 · 안달루시아 · 마드리드 · 바르셀로나</p>
      </div>

      <div className="filter-bar">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`filter-btn ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {withDividers.map((item, i) => {
        if ('type' in item && item.type === 'divider') {
          return (
            <div
              key={`divider-${item.phase}`}
              className="phase-divider"
              style={{ color: PHASES[item.phase as keyof typeof PHASES]?.color }}
            >
              {item.emoji} {item.label}
            </div>
          );
        }

        const day = item as DayData;
        return (
          <div
            key={day.day}
            className="card day-card"
            data-phase={day.phase}
          >
            <div className="day-card-header">
              <span className={`day-badge ${day.phase}`}>
                Day {day.day}
              </span>
              <span className="day-card-title">
                {day.icon} {day.title}
              </span>
              <span className="day-card-date">{day.date}</span>
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
      })}
    </div>
  );
}
