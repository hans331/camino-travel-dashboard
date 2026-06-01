'use client';

import { FLIGHTS, TRANSPORTS } from '@/lib/data';

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
    </div>
  );
}
