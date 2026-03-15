'use client';

import { useState, useMemo } from 'react';
import { ACCOMMODATIONS } from '@/lib/data';
import type { Accommodation } from '@/lib/types';

type FilterKey = 'all' | Accommodation['phase'];

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'portugal', label: '포르투갈' },
  { key: 'camino', label: '카미노' },
  { key: 'spain', label: '스페인' },
];

export default function AccommodationList() {
  const [filter, setFilter] = useState<FilterKey>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return ACCOMMODATIONS;
    return ACCOMMODATIONS.filter((a) => a.phase === filter);
  }, [filter]);

  // Group by city
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
        <h2>🏠 숙소</h2>
        <p>도시별 숙소 정보</p>
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

      {Array.from(grouped.entries()).map(([city, accs]) => (
        <div key={city}>
          <div className="accom-section-title">
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
      ))}
    </div>
  );
}
