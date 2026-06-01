'use client';

import { useState, useMemo } from 'react';
import { ACCOMMODATIONS, PHASES } from '@/lib/data';
import type { Accommodation } from '@/lib/types';

type FilterKey = 'all' | Accommodation['phase'];

const FILTERS: { key: FilterKey; label: string; emoji: string }[] = [
  { key: 'all', label: '전체', emoji: '🌍' },
  { key: 'porto', label: '포르토', emoji: '🇵🇹' },
  { key: 'camino', label: '카미노', emoji: '🐚' },
  { key: 'london', label: '런던·캠브리지', emoji: '🇬🇧' },
  { key: 'paris', label: '파리', emoji: '🇫🇷' },
];

export default function AccommodationList() {
  const [filter, setFilter] = useState<FilterKey>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return ACCOMMODATIONS;
    return ACCOMMODATIONS.filter((a) => a.phase === filter);
  }, [filter]);

  // Group by city, preserve order from data
  const grouped = useMemo(() => {
    const map = new Map<string, Accommodation[]>();
    for (const acc of filtered) {
      const existing = map.get(acc.city) ?? [];
      map.set(acc.city, [...existing, acc]);
    }
    return map;
  }, [filtered]);

  return (
    <div>
      <div className="section-header">
        <h2><span>🏠</span> 숙소</h2>
        <p>도시별 숙소 정보 · 알베르게 + 부티크 호텔 혼합</p>
      </div>

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

      {Array.from(grouped.entries()).map(([city, accs]) => {
        const phase = accs[0]?.phase;
        const phaseColor = phase ? PHASES[phase]?.color : 'var(--primary)';
        return (
          <div key={city}>
            <div
              className="accom-section-title"
              style={{ borderBottomColor: phaseColor, color: phaseColor }}
            >
              📍 {city}
            </div>
            {accs.map((acc) => (
              <div key={acc.name} className="card accom-card">
                <div className="accom-emoji">{acc.emoji}</div>
                <div className="accom-info">
                  <h3>{acc.name}</h3>
                  <div>
                    <span className="accom-type">{acc.type}</span>
                    <span className="accom-price">{acc.price}</span>
                  </div>
                  <p className="accom-desc">{acc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
