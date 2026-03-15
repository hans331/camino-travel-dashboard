'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { BUDGET } from '@/lib/data';
import { supabase } from '@/lib/supabase';

function formatKRW(n: number): string {
  return '₩' + n.toLocaleString('ko-KR');
}

export default function BudgetTable() {
  const [actuals, setActuals] = useState<Record<string, number>>({});
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Fetch actuals from Supabase
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

    // Debounced save
    if (debounceTimers.current[id]) {
      clearTimeout(debounceTimers.current[id]);
    }
    debounceTimers.current[id] = setTimeout(() => {
      saveActual(id, num);
    }, 500);
  }, [saveActual]);

  const totalBudget = BUDGET.reduce((s, b) => s + b.amtNum, 0);
  const totalActual = BUDGET.reduce((s, b) => s + (actuals[b.id] ?? 0), 0);
  const totalDiff = totalBudget - totalActual;

  return (
    <div>
      <div className="section-header">
        <h2>💰 예산</h2>
        <p>총 예산 {formatKRW(totalBudget)} / 실제 {formatKRW(totalActual)}</p>
      </div>

      <div className="budget-table-wrap">
        <table className="budget-table">
          <thead>
            <tr>
              <th>항목</th>
              <th>예산</th>
              <th>실제 사용</th>
              <th>차이</th>
              <th>비율</th>
            </tr>
          </thead>
          <tbody>
            {BUDGET.map((item) => {
              const actual = actuals[item.id] ?? 0;
              const diff = item.amtNum - actual;
              const ratio = actual > 0 ? Math.round((actual / item.amtNum) * 100) : 0;

              return (
                <tr key={item.id}>
                  <td>
                    <strong>{item.cat}</strong>
                    <br />
                    <span style={{ fontSize: '0.75rem', color: '#999' }}>
                      {item.detail}
                    </span>
                  </td>
                  <td>{item.amt}</td>
                  <td>
                    <input
                      type="text"
                      className="budget-input"
                      value={actual > 0 ? actual.toLocaleString('ko-KR') : ''}
                      placeholder="0"
                      onChange={(e) => handleChange(item.id, e.target.value)}
                    />
                  </td>
                  <td>
                    {actual > 0 && (
                      <span className={diff >= 0 ? 'diff-positive' : 'diff-negative'}>
                        {diff >= 0 ? '-' : '+'}{formatKRW(Math.abs(diff))}
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="pct-bar">
                      <div
                        className="pct-bar-fill"
                        style={{
                          width: `${Math.min(ratio, 100)}%`,
                          backgroundColor: ratio > 100 ? '#C62828' : item.color,
                        }}
                      />
                    </div>
                    {actual > 0 ? `${ratio}%` : '-'}
                  </td>
                </tr>
              );
            })}
            <tr className="total-row">
              <td>합계</td>
              <td>{formatKRW(totalBudget)}</td>
              <td>{formatKRW(totalActual)}</td>
              <td>
                <span className={totalDiff >= 0 ? 'diff-positive' : 'diff-negative'}>
                  {totalDiff >= 0 ? '-' : '+'}{formatKRW(Math.abs(totalDiff))}
                </span>
              </td>
              <td>
                {totalActual > 0
                  ? `${Math.round((totalActual / totalBudget) * 100)}%`
                  : '-'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
