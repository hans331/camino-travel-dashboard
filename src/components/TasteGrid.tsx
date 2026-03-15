'use client';

import { EXPERIENCES, FOODS } from '@/lib/data';

export default function TasteGrid() {
  return (
    <div>
      <div className="section-header">
        <h2>🍷 맛집 · 체험</h2>
        <p>꼭 해보고 꼭 먹어봐야 할 것들</p>
      </div>

      <h3 style={{ margin: '20px 0 12px', fontSize: '1.1rem', fontWeight: 700 }}>
        ✨ 체험
      </h3>
      <div className="taste-grid">
        {EXPERIENCES.map((exp) => (
          <div key={exp.title} className="taste-card">
            <img
              className="taste-card-img"
              src={exp.imageUrl}
              alt={exp.title}
              loading="lazy"
            />
            <div className="taste-card-body">
              <h3>{exp.emoji} {exp.title}</h3>
              <p>{exp.desc}</p>
              <div className="taste-card-meta">
                <span>📍 {exp.where}</span>
                {exp.day && <span>{exp.day}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ margin: '32px 0 12px', fontSize: '1.1rem', fontWeight: 700 }}>
        🍽️ 음식
      </h3>
      <div className="taste-grid">
        {FOODS.map((food) => (
          <div key={food.title} className="taste-card">
            <img
              className="taste-card-img"
              src={food.imageUrl}
              alt={food.title}
              loading="lazy"
            />
            <div className="taste-card-body">
              <h3>{food.emoji} {food.title}</h3>
              <p>{food.desc}</p>
              <div className="taste-card-meta">
                <span>📍 {food.where}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
