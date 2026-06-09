'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { BUDGET } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import type { BudgetItem } from '@/lib/types';

function formatKRW(n: number): string {
  return '₩' + n.toLocaleString('ko-KR');
}

function formatMan(n: number): string {
  const man = Math.round(n / 10000);
  return `${man.toLocaleString('ko-KR')}만`;
}

function lineKey(itemId: string, idx: number): string {
  return `${itemId}:${idx}`;
}

function DiffCell({ diff, ratio }: { diff: number; ratio: number | null }) {
  if (diff === 0 && ratio === null) {
    return <span className="diff-cell empty">─</span>;
  }
  const cls = diff >= 0 ? 'diff-positive' : 'diff-negative';
  const sign = diff >= 0 ? '-' : '+';
  return (
    <span className={`diff-cell ${cls}`}>
      <span className="diff-amount">{sign}{formatKRW(Math.abs(diff))}</span>
      {ratio !== null && <span className="diff-ratio">({ratio}%)</span>}
    </span>
  );
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

  const saveActual = useCallback(async (key: string, amount: number) => {
    await supabase
      .from('budget_actuals')
      .upsert(
        { category: key, actual_amount: amount, updated_at: new Date().toISOString() },
        { onConflict: 'category' }
      );
  }, []);

  const handleLineChange = useCallback((itemId: string, idx: number, value: string) => {
    const key = lineKey(itemId, idx);
    const num = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;

    setActuals((prev) => ({ ...prev, [key]: num }));

    if (debounceTimers.current[key]) {
      clearTimeout(debounceTimers.current[key]);
    }
    debounceTimers.current[key] = setTimeout(() => {
      saveActual(key, num);
    }, 500);
  }, [saveActual]);

  // Resolve a line's actual amount.
  // - 확정(confirmed) 항목: 사용자가 입력하지 않았으면 예산 금액을 그대로 실제 사용으로 자동 반영
  // - 미정(pending) 항목: 사용자가 입력한 값만 반영, 미입력은 0
  const resolveLineActual = useCallback((itemId: string, idx: number, b: { amt: number; status: 'confirmed' | 'pending' }): number => {
    const explicit = actuals[lineKey(itemId, idx)];
    if (explicit !== undefined) return explicit;
    return b.status === 'confirmed' ? b.amt : 0;
  }, [actuals]);

  // Compute category actual from sum of its line actuals (falls back to legacy
  // category-key entry if no breakdown exists).
  const categoryActual = useCallback((item: BudgetItem): number => {
    if (!item.breakdown || item.breakdown.length === 0) {
      return actuals[item.id] ?? 0;
    }
    return item.breakdown.reduce(
      (sum, b, idx) => sum + resolveLineActual(item.id, idx, b),
      0
    );
  }, [actuals, resolveLineActual]);

  const totals = useMemo(() => {
    let plannedConfirmed = 0;
    let plannedPending = 0;
    let plannedTotal = 0;
    let actualTotal = 0;

    for (const item of BUDGET) {
      plannedTotal += item.amtNum;
      if (item.breakdown && item.breakdown.length > 0) {
        for (const b of item.breakdown) {
          if (b.status === 'confirmed') plannedConfirmed += b.amt;
          else plannedPending += b.amt;
        }
      } else {
        plannedPending += item.amtNum;
      }
      actualTotal += categoryActual(item);
    }

    return {
      plannedConfirmed,
      plannedPending,
      plannedTotal,
      actualTotal,
      diff: plannedTotal - actualTotal,
    };
  }, [categoryActual]);

  const confirmedPct = totals.plannedTotal > 0
    ? Math.round((totals.plannedConfirmed / totals.plannedTotal) * 100)
    : 0;
  const usedPct = totals.plannedTotal > 0
    ? Math.round((totals.actualTotal / totals.plannedTotal) * 100)
    : 0;

  const toggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    for (const item of BUDGET) all[item.id] = true;
    setExpanded(all);
  };

  const collapseAll = () => setExpanded({});

  return (
    <div>
      <div className="section-header">
        <h2>💰 예산</h2>
        <p>각 세부 항목별 <strong>예산 / 실제</strong> 입력 · 카테고리·총액 자동 합산 · 차이는 실시간 계산</p>
      </div>

      {/* Top stat cards */}
      <div className="budget-summary">
        <div className="budget-summary-card is-confirmed">
          <div className="budget-summary-label">✅ 확정 예산 (예매·발권)</div>
          <div className="budget-summary-value">{formatKRW(totals.plannedConfirmed)}</div>
          <div className="budget-summary-sub">{formatMan(totals.plannedConfirmed)}원 · {confirmedPct}%</div>
        </div>
        <div className="budget-summary-card is-pending">
          <div className="budget-summary-label">⏳ 미정 예산 (예상치)</div>
          <div className="budget-summary-value">{formatKRW(totals.plannedPending)}</div>
          <div className="budget-summary-sub">{formatMan(totals.plannedPending)}원 · {100 - confirmedPct}%</div>
        </div>
        <div className="budget-summary-card is-total">
          <div className="budget-summary-label">📊 총 예산</div>
          <div className="budget-summary-value">{formatKRW(totals.plannedTotal)}</div>
          <div className="budget-summary-sub">{formatMan(totals.plannedTotal)}원</div>
        </div>
        <div className="budget-summary-card is-actual">
          <div className="budget-summary-label">💵 실제 사용 합계</div>
          <div className="budget-summary-value">{formatKRW(totals.actualTotal)}</div>
          <div className="budget-summary-sub">
            {totals.actualTotal > 0 ? `${formatMan(totals.actualTotal)}원 · 예산 대비 ${usedPct}%` : '아직 입력 없음'}
          </div>
        </div>
        <div className={`budget-summary-card is-diff ${totals.diff >= 0 ? 'is-under' : 'is-over'}`}>
          <div className="budget-summary-label">
            {totals.diff >= 0 ? '✨ 예산 잔여' : '⚠️ 예산 초과'}
          </div>
          <div className={`budget-summary-value ${totals.diff >= 0 ? 'positive' : 'negative'}`}>
            {totals.diff >= 0 ? '' : '+'}{formatKRW(Math.abs(totals.diff))}
          </div>
          <div className="budget-summary-sub">
            {totals.actualTotal > 0
              ? `${totals.diff >= 0 ? '남음' : '오버'} · ${formatMan(Math.abs(totals.diff))}원`
              : '예산 = 총액'}
          </div>
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
          <span><span className="dot confirmed" /> 확정 예산 {confirmedPct}%</span>
          <span><span className="dot pending" /> 미정 예산 {100 - confirmedPct}%</span>
          {totals.actualTotal > 0 && (
            <span><span className="dot used" /> 실제 사용 {usedPct}%</span>
          )}
        </div>
      </div>

      <div className="budget-controls">
        <button className="budget-control-btn" onClick={expandAll}>📂 모두 펼치기</button>
        <button className="budget-control-btn" onClick={collapseAll}>📁 모두 접기</button>
      </div>

      {/* Detailed budget items */}
      <div className="budget-list">
        {BUDGET.map((item) => {
          const itemActual = categoryActual(item);
          const itemDiff = item.amtNum - itemActual;
          const itemRatio = item.amtNum > 0 && itemActual > 0
            ? Math.round((itemActual / item.amtNum) * 100)
            : null;
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
                  <div className="budget-item-totals">
                    <div className="budget-item-total-cell">
                      <span className="budget-item-total-label">예산</span>
                      <span className="budget-item-total-value">{item.amt}</span>
                    </div>
                    <div className="budget-item-total-cell">
                      <span className="budget-item-total-label">실제 합계</span>
                      <span className="budget-item-total-value actual">
                        {itemActual > 0 ? formatKRW(itemActual) : '─'}
                      </span>
                    </div>
                    <div className="budget-item-total-cell">
                      <span className="budget-item-total-label">차이</span>
                      <span className="budget-item-total-value">
                        {itemActual > 0
                          ? <DiffCell diff={itemDiff} ratio={itemRatio} />
                          : <span className="diff-cell empty">─</span>}
                      </span>
                    </div>
                  </div>
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
                  <div className="budget-breakdown-header">
                    <span>상태</span>
                    <span>항목</span>
                    <span>예산</span>
                    <span>실제 사용</span>
                    <span>차이</span>
                  </div>
                  {breakdown.map((b, i) => {
                    const key = lineKey(item.id, i);
                    const explicitActual = actuals[key];
                    const lineActual = resolveLineActual(item.id, i, b);
                    const isAutoConfirmed = explicitActual === undefined && b.status === 'confirmed';
                    const lineDiff = b.amt - lineActual;
                    const lineRatio = b.amt > 0 && lineActual > 0
                      ? Math.round((lineActual / b.amt) * 100)
                      : null;
                    return (
                      <div
                        key={i}
                        className={`budget-breakdown-row ${b.status === 'confirmed' ? 'is-confirmed' : 'is-pending'} ${isAutoConfirmed ? 'is-auto' : ''}`}
                      >
                        <span className={`status-pill ${b.status}`}>
                          {b.status === 'confirmed' ? '✅ 확정' : '⏳ 미정'}
                        </span>
                        <div className="budget-breakdown-main">
                          <div className="budget-breakdown-label">{b.label}</div>
                          {b.note && <div className="budget-breakdown-note">{b.note}</div>}
                        </div>
                        <div className="budget-breakdown-planned">{formatKRW(b.amt)}</div>
                        <div className="budget-breakdown-actual">
                          <input
                            type="text"
                            className={`budget-input budget-line-input ${isAutoConfirmed ? 'is-auto' : ''}`}
                            value={lineActual > 0 ? lineActual.toLocaleString('ko-KR') : ''}
                            placeholder={b.status === 'confirmed' ? '예매가 자동 반영' : '₩0'}
                            onChange={(e) => handleLineChange(item.id, i, e.target.value)}
                            onFocus={(e) => isAutoConfirmed && e.target.select()}
                            aria-label={`${b.label} 실제 사용`}
                            title={isAutoConfirmed ? '예매 확정 → 예산과 동일 자동 반영. 클릭하면 직접 수정 가능.' : undefined}
                            inputMode="numeric"
                          />
                          {isAutoConfirmed && <span className="auto-tag" title="자동 반영">✨ 자동</span>}
                        </div>
                        <div className="budget-breakdown-diff">
                          {explicitActual !== undefined && explicitActual > 0
                            ? <DiffCell diff={lineDiff} ratio={lineRatio} />
                            : isAutoConfirmed
                              ? <span className="diff-cell zero">±₩0</span>
                              : <span className="diff-cell empty">─</span>}
                        </div>
                      </div>
                    );
                  })}
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
              <span className="budget-grand-value">{formatKRW(totals.plannedTotal)}</span>
            </div>
            <div>
              <span className="budget-grand-mini">실제 사용</span>
              <span className="budget-grand-value">
                {totals.actualTotal > 0 ? formatKRW(totals.actualTotal) : '─'}
              </span>
            </div>
            <div>
              <span className="budget-grand-mini">차이</span>
              <span className={`budget-grand-value ${totals.diff >= 0 ? 'diff-positive' : 'diff-negative'}`}>
                {totals.actualTotal > 0
                  ? `${totals.diff >= 0 ? '-' : '+'}${formatKRW(Math.abs(totals.diff))}`
                  : '─'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
