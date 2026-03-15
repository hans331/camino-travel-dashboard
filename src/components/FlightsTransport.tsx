'use client';

import { FLIGHTS, TRANSPORTS } from '@/lib/data';

export default function FlightsTransport() {
  return (
    <div>
      <div className="section-header">
        <h2>✈️ 항공 · 교통</h2>
        <p>항공편 및 도시간 이동 정보</p>
      </div>

      {/* Flight cards */}
      {FLIGHTS.map((flight) => (
        <div key={flight.type} className="flight-card">
          <div className="flight-route">
            <div className="flight-city">
              <div className="code">{flight.from.split(' ')[0]}</div>
              <div className="name">{flight.from.split(' ').slice(1).join(' ')}</div>
            </div>
            <div className="flight-arrow">✈ →</div>
            <div className="flight-city">
              <div className="code">{flight.to.split(' ')[0]}</div>
              <div className="name">{flight.to.split(' ').slice(1).join(' ')}</div>
            </div>
          </div>
          <div className="flight-meta">
            <div>{flight.date}</div>
            <div>{flight.note}</div>
          </div>
        </div>
      ))}

      {/* Transport list */}
      <h3 style={{ margin: '28px 0 16px', fontSize: '1.1rem', fontWeight: 700 }}>
        🚂 도시간 이동
      </h3>

      {TRANSPORTS.map((t) => (
        <div key={t.route} className="card transport-card">
          <div>
            <div className="transport-route">{t.route}</div>
            <div className="transport-method">{t.method}</div>
          </div>
          <div className="transport-time">{t.time}</div>
          <div className="transport-price">{t.price}</div>
          <div className="transport-tip">💡 {t.tip}</div>
        </div>
      ))}
    </div>
  );
}
