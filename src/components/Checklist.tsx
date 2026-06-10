'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { CHECKLIST } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import type { ChecklistItemDB, ChecklistAttachment, ChecklistItemTemplate, ChecklistState } from '@/lib/types';

const ATTACHMENT_BUCKET = 'attachments';
const COLLAPSED_KEY = 'camino-checklist-collapsed-cats';

function getTemplate(categoryIndex: number, sortOrder: number): ChecklistItemTemplate | undefined {
  return CHECKLIST[categoryIndex]?.items[sortOrder];
}

const STATE_META: Record<ChecklistState, { label: string; emoji: string; cls: string }> = {
  'pending':     { label: '예정',     emoji: '⏳', cls: 'state-pending' },
  'in-progress': { label: '진행중',   emoji: '🔄', cls: 'state-in-progress' },
  'attention':   { label: '확인필요', emoji: '⚠️', cls: 'state-attention' },
  'completed':   { label: '완료',     emoji: '✅', cls: 'state-completed' },
};

const STATE_OPTIONS: ChecklistState[] = ['pending', 'in-progress', 'attention', 'completed'];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function fileIcon(mime: string): string {
  if (mime.startsWith('image/')) return '🖼️';
  if (mime === 'application/pdf') return '📄';
  return '📎';
}

export default function Checklist() {
  const [items, setItems] = useState<ChecklistItemDB[]>([]);
  const [attachments, setAttachments] = useState<Record<string, ChecklistAttachment[]>>({});
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [expandedMemo, setExpandedMemo] = useState<Set<string>>(new Set());
  const [collapsedCategories, setCollapsedCategories] = useState<Set<number>>(new Set());
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Restore collapsed category state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(COLLAPSED_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as number[];
        if (Array.isArray(parsed)) {
          setCollapsedCategories(new Set(parsed.filter((n) => typeof n === 'number')));
        }
      } catch {
        // ignore corrupt storage
      }
    }
  }, []);

  const persistCollapsed = useCallback((next: Set<number>) => {
    try {
      localStorage.setItem(COLLAPSED_KEY, JSON.stringify(Array.from(next)));
    } catch {
      // ignore quota / private mode errors
    }
  }, []);

  const toggleCategory = useCallback((idx: number) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      persistCollapsed(next);
      return next;
    });
  }, [persistCollapsed]);

  const expandAllCategories = useCallback(() => {
    const next = new Set<number>();
    setCollapsedCategories(next);
    persistCollapsed(next);
  }, [persistCollapsed]);

  const collapseAllCategories = useCallback(() => {
    const next = new Set(CHECKLIST.map((_, i) => i));
    setCollapsedCategories(next);
    persistCollapsed(next);
  }, [persistCollapsed]);

  // Fetch or initialize checklist items
  useEffect(() => {
    fetchItems();
    fetchAttachments();
  }, []);

  async function fetchItems() {
    const { data } = await supabase
      .from('checklist_items')
      .select('*')
      .order('category_index', { ascending: true })
      .order('sort_order', { ascending: true });

    if (data && data.length > 0) {
      const dbCategoryCount = new Set(data.filter(d => !d.is_custom).map(d => d.category_index)).size;
      const codeCategoryCount = CHECKLIST.length;
      if (dbCategoryCount > 0 && dbCategoryCount !== codeCategoryCount) {
        console.log(`[Checklist] schema drift: DB ${dbCategoryCount} cats vs code ${codeCategoryCount} cats. Click Reset to sync.`);
      }
      setItems(data);
    } else {
      await initializeFromStatic();
    }
  }

  async function fetchAttachments() {
    const { data } = await supabase
      .from('checklist_attachments')
      .select('*')
      .order('uploaded_at', { ascending: true });

    if (data) {
      const grouped: Record<string, ChecklistAttachment[]> = {};
      data.forEach((att) => {
        if (!grouped[att.item_id]) grouped[att.item_id] = [];
        grouped[att.item_id].push(att);
      });
      setAttachments(grouped);
    }
  }

  async function initializeFromStatic() {
    const newItems: Omit<ChecklistItemDB, 'id' | 'created_at'>[] = [];
    CHECKLIST.forEach((cat, catIdx) => {
      cat.items.forEach((tpl, itemIdx) => {
        const state: ChecklistState = tpl.status ?? 'pending';
        newItems.push({
          category_index: catIdx,
          label: tpl.label,
          checked: state === 'completed', // keep legacy in sync
          state,
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
      '⚠️ 체크리스트를 초기 상태로 재설정합니다.\n\n현재 체크/메모/추가 항목이 모두 삭제되고, 최신 항목으로 다시 채워집니다.\n(첨부파일은 cascade로 함께 삭제됩니다)\n\n계속하시겠어요?'
    );
    if (!ok) return;

    await supabase.from('checklist_items').delete().not('id', 'is', null);
    setItems([]);
    setAttachments({});
    await initializeFromStatic();
  }, []);

  const updateState = useCallback(async (id: string, newState: ChecklistState) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, state: newState, checked: newState === 'completed' }
          : item
      )
    );
    await supabase
      .from('checklist_items')
      .update({ state: newState, checked: newState === 'completed' })
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
    setAttachments((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    await supabase.from('checklist_items').delete().eq('id', id);
  }, []);

  const uploadAttachment = useCallback(async (itemId: string, file: File) => {
    if (file.size > 20 * 1024 * 1024) {
      alert('파일 크기는 20MB 이하만 가능합니다.');
      return;
    }
    setUploadingId(itemId);
    try {
      const ext = file.name.split('.').pop() || 'bin';
      const storagePath = `${itemId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from(ATTACHMENT_BUCKET)
        .upload(storagePath, file, {
          contentType: file.type || 'application/octet-stream',
          upsert: false,
        });
      if (uploadErr) throw uploadErr;

      const { data: row, error: insertErr } = await supabase
        .from('checklist_attachments')
        .insert({
          item_id: itemId,
          file_path: storagePath,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type || 'application/octet-stream',
        })
        .select()
        .single();
      if (insertErr) throw insertErr;

      setAttachments((prev) => ({
        ...prev,
        [itemId]: [...(prev[itemId] || []), row as ChecklistAttachment],
      }));
    } catch (e) {
      console.error('Upload failed', e);
      alert(`업로드 실패: ${e instanceof Error ? e.message : '알 수 없는 오류'}`);
    } finally {
      setUploadingId(null);
    }
  }, []);

  const deleteAttachment = useCallback(async (att: ChecklistAttachment) => {
    if (!confirm(`"${att.file_name}" 첨부파일을 삭제할까요?`)) return;
    await supabase.storage.from(ATTACHMENT_BUCKET).remove([att.file_path]);
    await supabase.from('checklist_attachments').delete().eq('id', att.id);
    setAttachments((prev) => ({
      ...prev,
      [att.item_id]: (prev[att.item_id] || []).filter((a) => a.id !== att.id),
    }));
  }, []);

  function publicUrl(filePath: string): string {
    return supabase.storage.from(ATTACHMENT_BUCKET).getPublicUrl(filePath).data.publicUrl;
  }

  // Group items by category
  const grouped = CHECKLIST.map((cat, idx) => ({
    title: cat.title,
    items: items.filter((item) => item.category_index === idx),
    index: idx,
  }));

  const totalItems = items.length;
  const checkedItems = items.filter((i) => i.state === 'completed').length;
  const progressPct = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  // Per-category progress
  function categoryProgress(catIdx: number) {
    const catItems = items.filter((i) => i.category_index === catIdx);
    const done = catItems.filter((i) => i.state === 'completed').length;
    return { done, total: catItems.length };
  }

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
          💡 항목 이름을 <strong>클릭</strong>하면 메모창 + 파일 첨부가 열려요 · 항공권·예약 확인서 PDF/이미지를 첨부하면 휴대폰에서 바로 다운로드 가능
        </span>
      </div>

      <div className="checklist-cat-controls">
        <button className="checklist-cat-control-btn" onClick={expandAllCategories}>📂 모든 분류 펼치기</button>
        <button className="checklist-cat-control-btn" onClick={collapseAllCategories}>📁 모든 분류 접기</button>
      </div>

      {grouped.map((group) => {
        const { done, total } = categoryProgress(group.index);
        const catPct = total > 0 ? Math.round((done / total) * 100) : 0;
        const isCollapsed = collapsedCategories.has(group.index);

        return (
          <div key={group.index} className={`checklist-category ${isCollapsed ? 'is-collapsed' : ''}`}>
            <button
              type="button"
              className="checklist-category-header"
              onClick={() => toggleCategory(group.index)}
              aria-expanded={!isCollapsed}
            >
              <svg
                className={`checklist-category-chevron ${isCollapsed ? '' : 'rot'}`}
                width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
              <div className="checklist-category-title">{group.title}</div>
              <div className="checklist-category-progress">
                <span className="checklist-category-progress-num">
                  {done} / {total}
                </span>
                <div className="checklist-category-progress-bar">
                  <div
                    className="checklist-category-progress-fill"
                    style={{ width: `${catPct}%` }}
                  />
                </div>
                <span className="checklist-category-progress-pct">{catPct}%</span>
              </div>
            </button>

            {!isCollapsed && (<>
            <div className="checklist-rows">
              {group.items.map((item) => {
                const itemAtts = attachments[item.id] || [];
                const isExpanded = expandedMemo.has(item.id);
                const tpl = item.is_custom ? undefined : getTemplate(item.category_index, item.sort_order);
                const currentState: ChecklistState = item.state ?? 'pending';
                const meta = STATE_META[currentState];
                const hasMemo = !!(item.memo && item.memo.trim());

                return (
                  <div
                    key={item.id}
                    className={`checklist-row ${currentState === 'completed' ? 'is-checked' : ''} ${meta.cls}`}
                  >
                    <div className="checklist-row-main">
                      {/* State dropdown — replaces checkbox + status pill */}
                      <div className="checklist-col-status">
                        <details className="state-selector">
                          <summary
                            className={`state-pill ${meta.cls}`}
                            aria-label={`상태 변경 — 현재: ${meta.label}`}
                          >
                            <span className="state-emoji">{meta.emoji}</span>
                            <span className="state-text">{meta.label}</span>
                            <svg className="state-caret" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                              <polyline points="6 9 12 15 18 9"/>
                            </svg>
                            {hasMemo && (
                              <span className="memo-indicator" title="메모 있음">📝</span>
                            )}
                          </summary>
                          <div className="state-menu">
                            {STATE_OPTIONS.map((opt) => {
                              const m = STATE_META[opt];
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  className={`state-option ${m.cls} ${opt === currentState ? 'is-current' : ''}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateState(item.id, opt);
                                    // close the details element
                                    const details = e.currentTarget.closest('details');
                                    if (details) details.open = false;
                                  }}
                                >
                                  <span className="state-emoji">{m.emoji}</span>
                                  <span className="state-text">{m.label}</span>
                                  {opt === currentState && (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                      <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </details>
                      </div>

                      {/* Date column (Day + date) */}
                      <div className="checklist-col-date">
                        {tpl?.day && <div className="checklist-day-tag">{tpl.day}</div>}
                        {tpl?.date && <div className="checklist-date-text">{tpl.date}</div>}
                      </div>

                      {/* Target/count column */}
                      <div className="checklist-col-target">
                        {tpl?.target && <div className="checklist-target-text">{tpl.target}</div>}
                        {tpl?.count && <div className="checklist-count-text">{tpl.count}</div>}
                      </div>

                      {/* Main label + metadata */}
                      <div className="checklist-col-main">
                        <button
                          type="button"
                          className={`checklist-label-btn ${currentState === 'completed' ? 'checked' : ''}`}
                          onClick={() => toggleMemoExpand(item.id)}
                        >
                          <span className="checklist-label-text">
                            {tpl?.label ?? item.label}
                          </span>
                          {tpl?.booking && (tpl.booking.ref || tpl.booking.phone) && (
                            <span className="checklist-booking-badge" title="예약 정보 있음">📋</span>
                          )}
                          {itemAtts.length > 0 && (
                            <span className="checklist-attachment-badge">📎 {itemAtts.length}</span>
                          )}
                        </button>

                        {tpl && (tpl.route || tpl.code || tpl.time || tpl.price || tpl.note) && (
                          <div className="checklist-meta">
                            {tpl.route && (
                              <span className="checklist-meta-chip route">🛤 {tpl.route}</span>
                            )}
                            {tpl.code && (
                              <span className="checklist-meta-chip code">🆔 {tpl.code}</span>
                            )}
                            {tpl.time && (
                              <span className="checklist-meta-chip time">⏱ {tpl.time}</span>
                            )}
                            {tpl.price && (
                              <span className="checklist-meta-chip price">💶 {tpl.price}</span>
                            )}
                            {tpl.note && (
                              <span className="checklist-meta-note">📝 {tpl.note}</span>
                            )}
                          </div>
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

                    {isExpanded && (
                      <div className="checklist-row-expanded">
                        {tpl?.booking && (
                          <div className="checklist-booking">
                            <div className="checklist-booking-title">📋 예약 정보</div>
                            <div className="checklist-booking-grid">
                              {tpl.booking.ref && (
                                <div className="booking-cell">
                                  <span className="booking-label">예약번호</span>
                                  <span className="booking-value mono">{tpl.booking.ref}</span>
                                </div>
                              )}
                              {tpl.booking.pin && (
                                <div className="booking-cell">
                                  <span className="booking-label">PIN</span>
                                  <span className="booking-value mono">{tpl.booking.pin}</span>
                                </div>
                              )}
                              {tpl.booking.phone && (
                                <div className="booking-cell">
                                  <span className="booking-label">📞 전화</span>
                                  <a href={`tel:${tpl.booking.phone.replace(/\s/g, '')}`} className="booking-value mono linkish">
                                    {tpl.booking.phone}
                                  </a>
                                </div>
                              )}
                              {tpl.booking.email && (
                                <div className="booking-cell">
                                  <span className="booking-label">✉️ 이메일</span>
                                  <a href={`mailto:${tpl.booking.email}`} className="booking-value linkish">
                                    {tpl.booking.email}
                                  </a>
                                </div>
                              )}
                              {tpl.booking.contactName && (
                                <div className="booking-cell wide">
                                  <span className="booking-label">컨택</span>
                                  <span className="booking-value">{tpl.booking.contactName}</span>
                                </div>
                              )}
                              {tpl.booking.checkInTime && (
                                <div className="booking-cell">
                                  <span className="booking-label">체크인</span>
                                  <span className="booking-value">{tpl.booking.checkInTime}</span>
                                </div>
                              )}
                              {tpl.booking.checkOutTime && (
                                <div className="booking-cell">
                                  <span className="booking-label">체크아웃</span>
                                  <span className="booking-value">{tpl.booking.checkOutTime}</span>
                                </div>
                              )}
                              {tpl.booking.platform && (
                                <div className="booking-cell wide">
                                  <span className="booking-label">플랫폼</span>
                                  <span className="booking-value">{tpl.booking.platform}</span>
                                </div>
                              )}
                              {tpl.booking.address && (
                                <div className="booking-cell wide-full">
                                  <span className="booking-label">📍 주소</span>
                                  <a
                                    href={`https://maps.google.com/?q=${encodeURIComponent(tpl.booking.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="booking-value linkish"
                                  >
                                    {tpl.booking.address}
                                  </a>
                                </div>
                              )}
                              {tpl.booking.accessNote && (
                                <div className="booking-cell wide-full">
                                  <span className="booking-label">⚠️ 입실 안내</span>
                                  <span className="booking-value note">{tpl.booking.accessNote}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {tpl?.link && (
                          <a
                            href={tpl.link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="checklist-link-btn"
                          >
                            🔗 {tpl.link.label}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                              <polyline points="15 3 21 3 21 9"/>
                              <line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                          </a>
                        )}

                        {tpl?.instructions && tpl.instructions.length > 0 && (
                          <div className="checklist-instructions">
                            <div className="checklist-instructions-title">📋 신청·작성 가이드</div>
                            <ol className="checklist-instructions-list">
                              {tpl.instructions.map((step, si) => (
                                <li key={si}>{step}</li>
                              ))}
                            </ol>
                          </div>
                        )}

                        <textarea
                          className="checklist-memo"
                          value={item.memo}
                          placeholder="메모..."
                          rows={2}
                          onChange={(e) => updateMemo(item.id, e.target.value)}
                        />

                        {itemAtts.length > 0 && (
                          <div className="checklist-attachments">
                            {itemAtts.map((att) => (
                              <div key={att.id} className="checklist-attachment-row">
                                <a
                                  href={publicUrl(att.file_path)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="checklist-attachment-link"
                                  download={att.file_name}
                                >
                                  <span className="checklist-attachment-icon">{fileIcon(att.mime_type)}</span>
                                  <span className="checklist-attachment-name">{att.file_name}</span>
                                  <span className="checklist-attachment-size">{formatFileSize(att.file_size)}</span>
                                </a>
                                <button
                                  className="checklist-attachment-delete"
                                  onClick={() => deleteAttachment(att)}
                                  title="첨부 삭제"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <label className="checklist-attachment-upload">
                          <input
                            type="file"
                            accept="application/pdf,image/*"
                            disabled={uploadingId === item.id}
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) uploadAttachment(item.id, f);
                              e.target.value = '';
                            }}
                          />
                          <span>
                            {uploadingId === item.id ? '⏳ 업로드 중...' : '📎 파일 첨부 (PDF·사진)'}
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              className="checklist-add-btn"
              onClick={() => addItem(group.index)}
            >
              + 추가
            </button>
            </>)}
          </div>
        );
      })}
    </div>
  );
}
