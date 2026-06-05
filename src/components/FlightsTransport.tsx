'use client';

import { FLIGHTS, TRANSPORTS } from '@/lib/data';

const AIRPORT_ROUTES = [
  {
    airport: 'LGW',
    label: '🇬🇧 LGW 개트윅',
    method: 'St Pancras → Thameslink 직행',
    time: '1h 45m',
    price: '£20-25',
    transfers: '환승 1회 (도보 5분)',
    note: '⭐ 둘째 7/1 귀국편. 짐 들고 가장 편한 동선.',
    recommended: true,
  },
  {
    airport: 'LHR',
    label: '🇬🇧 LHR 히드로 (Heathrow Express)',
    method: 'King\'s Cross → Paddington → Heathrow Express',
    time: '1h 20m',
    price: '£25',
    transfers: '환승 2회',
    note: '가장 빠름. 다만 Tube + Express 환승 부담.',
    recommended: false,
  },
  {
    airport: 'LHR',
    label: '🇬🇧 LHR 히드로 (Elizabeth Line)',
    method: 'King\'s Cross → Paddington → Elizabeth Line',
    time: '1h 35m',
    price: '£12-15',
    transfers: '환승 2회',
    note: '가성비 균형.',
    recommended: false,
  },
  {
    airport: 'LHR',
    label: '🇬🇧 LHR 히드로 (Piccadilly Line)',
    method: 'King\'s Cross → Piccadilly Line 직행',
    time: '1h 50m',
    price: '£6',
    transfers: '환승 0회',
    note: '가장 저렴. 다만 느리고 짐 들고 Tube 부담.',
    recommended: false,
  },
];

export default function FlightsTransport() {
  return (
    <div>
      <div className="section-header">
        <h2><span>✈️</span> 항공 · 교통</h2>
        <p>항공편 3장 + 도시간 이동 정보</p>
      </div>

      {/* Flight cards */}
      {FLIGHTS.map((flight) => (
        <div key={flight.type + flight.date} className="flight-card">
          <div style={{ textAlign: 'center', fontSize: '0.82rem', fontWeight: 700, opacity: 0.85, marginBottom: '10px', letterSpacing: '1px', textTransform: 'uppercase' }}>
            {flight.type === '출발' ? '🛫 출발' : flight.type === '귀국' ? '🛬 귀국' : '🔁 경유'}
          </div>
          <div className="flight-route">
            <div className="flight-city">
              <div className="code">{flight.from.split(' ')[0]}</div>
              <div className="name">{flight.from.split(' ').slice(1).join(' ')}</div>
            </div>
            <div className="flight-arrow">→</div>
            <div className="flight-city">
              <div className="code">{flight.to.split(' ')[0]}</div>
              <div className="name">{flight.to.split(' ').slice(1).join(' ')}</div>
            </div>
          </div>
          <div className="flight-meta">
            <div><strong>{flight.date}</strong></div>
            <div style={{ marginTop: '4px' }}>{flight.note}</div>
          </div>
        </div>
      ))}

      {/* Transport list */}
      <h3 className="taste-section-title" style={{ marginTop: '36px' }}>
        🚂 도시간·공항 이동
      </h3>

      {TRANSPORTS.map((t) => (
        <div key={t.route} className="card transport-card">
          <div>
            <div className="transport-route">{t.route}</div>
            <div className="transport-method">{t.method}</div>
          </div>
          <div className="transport-time">⏱ {t.time}</div>
          <div className="transport-price">💶 {t.price}</div>
          <div className="transport-tip">💡 {t.tip}</div>
        </div>
      ))}

      {/* Cambridge → London 공항 비교 */}
      <h3 className="taste-section-title" style={{ marginTop: '36px' }}>
        🆚 Cambridge → 런던 공항 비교
      </h3>
      <p style={{ color: 'var(--text-light)', fontSize: '0.98rem', margin: '0 0 16px', lineHeight: 1.6 }}>
        Cambridge에서 어느 공항을 가든 <strong>King&apos;s Cross</strong>까지 GTR 기차 50분 동행 후 환승. 거기서부터 경로별 시간·가격·환승 비교.
      </p>
      <div className="airport-compare-grid">
        {AIRPORT_ROUTES.map((r, i) => (
          <div key={i} className={`card airport-compare-card${r.recommended ? ' is-recommended' : ''}`}>
            {r.recommended && <div className="airport-compare-badge">⭐ 선택</div>}
            <div className="airport-compare-title">{r.label}</div>
            <div className="airport-compare-method">{r.method}</div>
            <div className="airport-compare-stats">
              <div><span className="airport-compare-stat-label">⏱ 시간</span><strong>{r.time}</strong></div>
              <div><span className="airport-compare-stat-label">💶 가격</span><strong>{r.price}</strong></div>
              <div><span className="airport-compare-stat-label">🔁 환승</span><strong>{r.transfers}</strong></div>
            </div>
            <div className="airport-compare-note">{r.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
