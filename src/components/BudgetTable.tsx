'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { BUDGET } from '@/lib/data';
import { supabase } from '@/lib/supabase';

function formatKRW(n: number): string {
  return '₩' + n.toLocaleString('ko-KR');
}

function formatMan(n: number): string {
  const man = Math.round(n / 10000);
  return `${man.toLocaleString('ko-KR')}만`;
}

export default function BudgetTable() {
  const [actuals, setActuals] = useState<Record<string, number>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    async function fetchActuals() {
      const { data } = await supabase
        .from('budget_actuals')
        .select('*');

      if (data) {
        const map: Record<string, number> = {};
        for (const row of data) {
          map[row.category] = row.actual_amount;
        }
        setActuals(map);
      }
    }
    fetchActuals();
  }, []);

  const saveActual = useCallback(async (category: string, amount: number) => {
    await supabase
      .from('budget_actuals')
      .upsert(
        { category, actual_amount: amount, updated_at: new Date().toISOString() },
        { onConflict: 'category' }
      );
  }, []);

  const handleChange = useCallback((id: string, value: string) => {
    const num = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;

    setActuals((prev) => ({ ...prev, [id]: num }));

    if (debounceTimers.current[id]) {
      clearTimeout(debounceTimers.current[id]);
    }
    debounceTimers.current[id] = setTimeout(() => {
      saveActual(id, num);
    }, 500);
  }, [saveActual]);

  const totals = useMemo(() => {
    let confirmed = 0;
    let pending = 0;
    for (const item of BUDGET) {
      if (item.breakdown && item.breakdown.length > 0) {
        for (const b of item.breakdown) {
          if (b.status === 'confirmed') confirmed += b.amt;
          else pending += b.amt;
        }
      } else {
        pending += item.amtNum;
      }
    }
    return { confirmed, pending, total: confirmed + pending };
  }, []);

  const totalBudget = BUDGET.reduce((s, b) => s + b.amtNum, 0);
  const totalActual = BUDGET.reduce((s, b) => s + (actuals[b.id] ?? 0), 0);
  const totalDiff = totalBudget - totalActual;
  const confirmedPct = Math.round((totals.confirmed / totals.total) * 100);

  const toggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <div className="section-header">
        <h2>💰 예산</h2>
        <p>예산 항목별 ✅ 확정 vs ⏳ 미정 구분 · 클릭하면 세부 내역 펼침</p>
      </div>

      {/* Top stat cards — confirmed vs pending */}
      <div className="budget-summary">
        <div className="budget-summary-card is-confirmed">
          <div className="budget-summary-label">✅ 확정 (예매·발권 완료)</div>
          <div className="budget-summary-value">{formatKRW(totals.confirmed)}</div>
          <div className="budget-summary-sub">{formatMan(totals.confirmed)}원 · 전체의 {confirmedPct}%</div>
        </div>
        <div className="budget-summary-card is-pending">
          <div className="budget-summary-label">⏳ 미정 (예상치)</div>
          <div className="budget-summary-value">{formatKRW(totals.pending)}</div>
          <div className="budget-summary-sub">{formatMan(totals.pending)}원 · 전체의 {100 - confirmedPct}%</div>
        </div>
        <div className="budget-summary-card is-total">
          <div className="budget-summary-label">📊 총 예산</div>
          <div className="budget-summary-value">{formatKRW(totals.total)}</div>
          <div className="budget-summary-sub">{formatMan(totals.total)}원</div>
        </div>
      </div>

      {/* Confirmed/pending progress bar */}
      <div className="budget-progress">
        <div className="budget-progress-bar">
          <div
            className="budget-progress-confirmed"
            style={{ width: `${confirmedPct}%` }}
            title={`확정 ${confirmedPct}%`}
          />
          <div
            className="budget-progress-pending"
            style={{ width: `${100 - confirmedPct}%` }}
            title={`미정 ${100 - confirmedPct}%`}
          />
        </div>
        <div className="budget-progress-labels">
          <span><span className="dot confirmed" /> 확정 {confirmedPct}%</span>
          <span><span className="dot pending" /> 미정 {100 - confirmedPct}%</span>
        </div>
      </div>

      {/* Detailed budget items */}
      <div className="budget-list">
        {BUDGET.map((item) => {
          const actual = actuals[item.id] ?? 0;
          const diff = item.amtNum - actual;
          const ratio = actual > 0 ? Math.round((actual / item.amtNum) * 100) : 0;
          const isOpen = expanded[item.id] ?? false;
          const breakdown = item.breakdown ?? [];
          const itemConfirmed = breakdown.filter((b) => b.status === 'confirmed').reduce((s, b) => s + b.amt, 0);
          const itemPending = breakdown.filter((b) => b.status === 'pending').reduce((s, b) => s + b.amt, 0);
          const hasConfirmed = itemConfirmed > 0;
          const itemConfirmedPct = item.amtNum > 0 ? Math.round((itemConfirmed / item.amtNum) * 100) : 0;

          return (
            <div key={item.id} className="budget-item-card">
              <button
                className={`budget-item-head ${isOpen ? 'is-open' : ''}`}
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
              >
                <div className="budget-item-head-left" style={{ borderLeftColor: item.color }}>
                  <div className="budget-item-cat">{item.cat}</div>
                  <div className="budget-item-detail">{item.detail}</div>
                  {breakdown.length > 0 && (
                    <div className="budget-item-pill-row">
                      {hasConfirmed && (
                        <span className="status-pill confirmed">
                          ✅ 확정 {formatKRW(itemConfirmed)} ({itemConfirmedPct}%)
                        </span>
                      )}
                      {itemPending > 0 && (
                        <span className="status-pill pending">
                          ⏳ 미정 {formatKRW(itemPending)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="budget-item-head-right">
                  <div className="budget-item-amt">{item.amt}</div>
                  <div className="budget-item-actual-wrap">
                    <label>실제</label>
                    <input
                      type="text"
                      className="budget-input"
                      value={actual > 0 ? actual.toLocaleString('ko-KR') : ''}
                      placeholder="0"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleChange(item.id, e.target.value)}
                    />
                  </div>
                  {actual > 0 && (
                    <div className="budget-item-diff">
                      <span className={diff >= 0 ? 'diff-positive' : 'diff-negative'}>
                        {diff >= 0 ? '-' : '+'}{formatKRW(Math.abs(diff))}
                      </span>
                      <span className="budget-item-ratio">({ratio}%)</span>
                    </div>
                  )}
                  <svg
                    className={`budget-item-chevron ${isOpen ? 'rot' : ''}`}
                    width="20" height="20" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor"
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </button>

              {isOpen && breakdown.length > 0 && (
                <div className="budget-breakdown">
                  {breakdown.map((b, i) => (
                    <div
                      key={i}
                      className={`budget-breakdown-row ${b.status === 'confirmed' ? 'is-confirmed' : 'is-pending'}`}
                    >
                      <span className={`status-pill ${b.status}`}>
                        {b.status === 'confirmed' ? '✅ 확정' : '⏳ 미정'}
                      </span>
                      <div className="budget-breakdown-main">
                        <div className="budget-breakdown-label">{b.label}</div>
                        {b.note && <div className="budget-breakdown-note">{b.note}</div>}
                      </div>
                      <div className="budget-breakdown-amt">{formatKRW(b.amt)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Grand total */}
        <div className="budget-grand-total">
          <div className="budget-grand-label">합계</div>
          <div className="budget-grand-amounts">
            <div>
              <span className="budget-grand-mini">예산</span>
              <span className="budget-grand-value">{formatKRW(totalBudget)}</span>
            </div>
            <div>
              <span className="budget-grand-mini">실제</span>
              <span className="budget-grand-value">{formatKRW(totalActual)}</span>
            </div>
            <div>
              <span className="budget-grand-mini">차이</span>
              <span className={`budget-grand-value ${totalDiff >= 0 ? 'diff-positive' : 'diff-negative'}`}>
                {totalDiff >= 0 ? '-' : '+'}{formatKRW(Math.abs(totalDiff))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
