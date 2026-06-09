'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { CHECKLIST } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import type { ChecklistItemDB, ChecklistAttachment, ChecklistItemTemplate } from '@/lib/types';

const ATTACHMENT_BUCKET = 'attachments';

function getTemplate(categoryIndex: number, sortOrder: number): ChecklistItemTemplate | undefined {
  return CHECKLIST[categoryIndex]?.items[sortOrder];
}

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
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

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
        newItems.push({
          category_index: catIdx,
          label: tpl.label,
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
      '⚠️ 체크리스트를 초기 상태로 재설정합니다.\n\n현재 체크/메모/추가 항목이 모두 삭제되고, 최신 항목으로 다시 채워집니다.\n(첨부파일은 cascade로 함께 삭제됩니다)\n\n계속하시겠어요?'
    );
    if (!ok) return;

    await supabase.from('checklist_items').delete().not('id', 'is', null);
    setItems([]);
    setAttachments({});
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
  const checkedItems = items.filter((i) => i.checked).length;
  const progressPct = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  // Per-category progress
  function categoryProgress(catIdx: number) {
    const catItems = items.filter((i) => i.category_index === catIdx);
    const done = catItems.filter((i) => i.checked).length;
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

      {grouped.map((group) => {
        const { done, total } = categoryProgress(group.index);
        const catPct = total > 0 ? Math.round((done / total) * 100) : 0;

        return (
          <div key={group.index} className="checklist-category">
            <div className="checklist-category-header">
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
            </div>

            <div className="checklist-rows">
              {group.items.map((item) => {
                const itemAtts = attachments[item.id] || [];
                const isExpanded = expandedMemo.has(item.id);
                const tpl = item.is_custom ? undefined : getTemplate(item.category_index, item.sort_order);
                const status = tpl?.status;

                return (
                  <div
                    key={item.id}
                    className={`checklist-row ${item.checked ? 'is-checked' : ''} ${status ? `status-${status}` : ''}`}
                  >
                    <div className="checklist-row-main">
                      <input
                        type="checkbox"
                        className="checklist-row-check"
                        checked={item.checked}
                        onChange={() => toggleCheck(item.id, item.checked)}
                      />

                      {/* Status badge column */}
                      <div className="checklist-col-status">
                        {status === 'confirmed' && (
                          <span className="checklist-status-pill confirmed">✅ 완료</span>
                        )}
                        {status === 'pending' && (
                          <span className="checklist-status-pill pending">⏳ 예정</span>
                        )}
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
                          className={`checklist-label-btn ${item.checked ? 'checked' : ''}`}
                          onClick={() => toggleMemoExpand(item.id)}
                        >
                          <span className="checklist-label-text">
                            {tpl?.label ?? item.label}
                          </span>
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
          </div>
        );
      })}
    </div>
  );
}
