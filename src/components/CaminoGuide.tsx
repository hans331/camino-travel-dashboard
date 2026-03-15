'use client';

import { CAMINO_STAGES } from '@/lib/data';

const TOTAL_KM = CAMINO_STAGES.reduce((sum, s) => sum + s.km, 0);
const TOTAL_DAYS = CAMINO_STAGES.length;
const AVG_KM = Math.round(TOTAL_KM / TOTAL_DAYS);

function DifficultyDots({ level }: { level: number }) {
  return (
    <span className="difficulty-dots">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`difficulty-dot ${n <= level ? 'filled' : ''}`}
        />
      ))}
    </span>
  );
}

export default function CaminoGuide() {
  return (
    <div>
      <div className="section-header">
        <h2>🐚 카미노 데 산티아고</h2>
        <p>포르투게스 루트 (Caminho Portugues)</p>
      </div>

      <div className="camino-banner">
        <div className="camino-stat">
          <div className="stat-value">{TOTAL_KM}km</div>
          <div className="stat-label">총 거리</div>
        </div>
        <div className="camino-stat">
          <div className="stat-value">{TOTAL_DAYS}일</div>
          <div className="stat-label">소요 기간</div>
        </div>
        <div className="camino-stat">
          <div className="stat-value">{AVG_KM}km</div>
          <div className="stat-label">일 평균</div>
        </div>
      </div>

      {CAMINO_STAGES.map((stage) => (
        <div key={stage.day} className="card stage-card">
          <div className="stage-header">
            <span className="stage-route">
              Day {stage.day}: {stage.from} → {stage.to}
            </span>
            <span className="stage-km">{stage.km}km</span>
          </div>

          <dl className="stage-details">
            <dt>고도</dt>
            <dd>{stage.elev}</dd>

            <dt>난이도</dt>
            <dd><DifficultyDots level={stage.diff} /></dd>

            <dt>노면</dt>
            <dd>{stage.surface}</dd>

            <dt>급수</dt>
            <dd>{stage.water}</dd>

            <dt>알베르게</dt>
            <dd>{stage.albergue}</dd>
          </dl>

          <div className="stage-tip">
            💡 {stage.tip}
          </div>
        </div>
      ))}
    </div>
  );
}
