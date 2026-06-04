'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { CHECKLIST } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import type { ChecklistItemDB } from '@/lib/types';

const CATEGORY_ICONS = ['✈️', '🏨', '🛂', '🎫', '🥾', '🇨🇭', '👕', '💊', '📱'];

export default function Checklist() {
  const [items, setItems] = useState<ChecklistItemDB[]>([]);
  const [expandedMemo, setExpandedMemo] = useState<Set<string>>(new Set());
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Fetch or initialize checklist items
  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const { data } = await supabase
      .from('checklist_items')
      .select('*')
      .order('category_index', { ascending: true })
      .order('sort_order', { ascending: true });

    // Detect schema mismatch: if existing DB has fewer/more categories than CHECKLIST,
    // or known non-custom labels don't match, we should reset.
    if (data && data.length > 0) {
      const dbCategoryCount = new Set(data.filter(d => !d.is_custom).map(d => d.category_index)).size;
      const codeCategoryCount = CHECKLIST.length;
      if (dbCategoryCount > 0 && dbCategoryCount !== codeCategoryCount) {
        // Schema changed — keep current items but the user may want to reset
        console.log(`[Checklist] schema drift: DB ${dbCategoryCount} cats vs code ${codeCategoryCount} cats. Click Reset to sync.`);
      }
      setItems(data);
    } else {
      await initializeFromStatic();
    }
  }

  async function initializeFromStatic() {
    const newItems: Omit<ChecklistItemDB, 'id' | 'created_at'>[] = [];
    CHECKLIST.forEach((cat, catIdx) => {
      cat.items.forEach((label, itemIdx) => {
        newItems.push({
          category_index: catIdx,
          label,
          checked: false,
          memo: '',
          is_custom: false,
          sort_order: itemIdx,
        });
      });
    });

    const { data: inserted } = await supabase
      .from('checklist_items')
      .insert(newItems)
      .select();

    if (inserted) {
      setItems(inserted);
    }
  }

  const resetChecklist = useCallback(async () => {
    const ok = confirm(
      '⚠️ 체크리스트를 초기 상태로 재설정합니다.\n\n현재 체크/메모/추가 항목이 모두 삭제되고, 최신 항목으로 다시 채워집니다.\n\n계속하시겠어요?'
    );
    if (!ok) return;

    await supabase.from('checklist_items').delete().not('id', 'is', null);
    setItems([]);
    await initializeFromStatic();
  }, []);

  const toggleCheck = useCallback(async (id: string, checked: boolean) => {
    const newChecked = !checked;
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: newChecked } : item
      )
    );
    await supabase
      .from('checklist_items')
      .update({ checked: newChecked })
      .eq('id', id);
  }, []);

  const updateMemo = useCallback((id: string, memo: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, memo } : item
      )
    );

    if (debounceTimers.current[id]) {
      clearTimeout(debounceTimers.current[id]);
    }
    debounceTimers.current[id] = setTimeout(async () => {
      await supabase
        .from('checklist_items')
        .update({ memo })
        .eq('id', id);
    }, 500);
  }, []);

  const toggleMemoExpand = useCallback((id: string) => {
    setExpandedMemo((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const addItem = useCallback(async (categoryIndex: number) => {
    const label = prompt('추가할 항목 이름:');
    if (!label?.trim()) return;

    const maxOrder = items
      .filter((i) => i.category_index === categoryIndex)
      .reduce((max, i) => Math.max(max, i.sort_order), -1);

    const { data } = await supabase
      .from('checklist_items')
      .insert({
        category_index: categoryIndex,
        label: label.trim(),
        checked: false,
        memo: '',
        is_custom: true,
        sort_order: maxOrder + 1,
      })
      .select()
      .single();

    if (data) {
      setItems((prev) => [...prev, data]);
    }
  }, [items]);

  const deleteItem = useCallback(async (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    await supabase
      .from('checklist_items')
      .delete()
      .eq('id', id);
  }, []);

  // Group items by category
  const grouped = CHECKLIST.map((cat, idx) => ({
    title: cat.title,
    icon: CATEGORY_ICONS[idx],
    items: items.filter((item) => item.category_index === idx),
    index: idx,
  }));

  const totalItems = items.length;
  const checkedItems = items.filter((i) => i.checked).length;

  const progressPct = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  return (
    <div>
      <div className="section-header">
        <h2><span>✅</span> 준비물 체크리스트</h2>
        <p>
          <strong>{checkedItems} / {totalItems}</strong> 완료 ({progressPct}%) · 하나씩 체크해가며 준비
        </p>
      </div>

      <div className="checklist-progress-bar">
        <div className="checklist-progress-fill" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="checklist-toolbar">
        <button className="checklist-reset-btn" onClick={resetChecklist}>
          🔄 체크리스트 새로고침 (최신 항목으로 재설정)
        </button>
        <span className="checklist-toolbar-hint">
          💡 항목별로 + 추가 / 메모 / 삭제 가능
        </span>
      </div>

      {grouped.map((group) => (
        <div key={group.index} className="checklist-category">
          <div className="checklist-category-title">
            {group.icon} {group.title}
          </div>

          {group.items.map((item) => (
            <div key={item.id} className="checklist-item">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleCheck(item.id, item.checked)}
              />
              <div style={{ flex: 1 }}>
                <span
                  className={`checklist-label ${item.checked ? 'checked' : ''}`}
                  onClick={() => toggleMemoExpand(item.id)}
                >
                  {item.label}
                </span>
                {(expandedMemo.has(item.id) || item.memo) && (
                  <textarea
                    className="checklist-memo"
                    value={item.memo}
                    placeholder="메모..."
                    rows={2}
                    onChange={(e) => updateMemo(item.id, e.target.value)}
                  />
                )}
              </div>
              {item.is_custom && (
                <button
                  className="checklist-delete-btn"
                  onClick={() => deleteItem(item.id)}
                  title="삭제"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button
            className="checklist-add-btn"
            onClick={() => addItem(group.index)}
          >
            + 추가
          </button>
        </div>
      ))}
    </div>
  );
}
