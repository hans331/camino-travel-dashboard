export type Phase = 'porto' | 'camino' | 'swiss' | 'london' | 'paris';

export interface MeetingPoint {
  id: string;
  emoji: string;
  label: string;
  desc: string;
  lat: number;
  lng: number;
}

export interface Airport {
  code: string; // IATA 3-letter code
  name: string;
  city: string;
  lat: number;
  lng: number;
  isLayover?: boolean; // 환승만 있는 공항
  role: string; // 어떤 일정에 사용되는지
}

export interface TimelineEvent {
  time: string; // "12:20" or "12:20→18:40" or "오후"
  emoji: string;
  label: string;
  status?: 'confirmed' | 'pending'; // 예매·확정 여부
  detail?: string; // optional sub-line (PNR, 항공편명 등)
}

export interface DayData {
  day: number;
  date: string;
  phase: Phase;
  title: string;
  icon: string;
  desc: string;
  food: string;
  stay: string;
  lat: number;
  lng: number;
  dist?: string;
  transit?: string; // 비행/기차/Eurostar 등 이동 시간 (캘린더에 표시)
  restaurants?: string[];
  timeline?: TimelineEvent[]; // 시간별 주요 이벤트 (특히 항공권 확정 시간)
}

export interface CaminoStage {
  day: number;
  from: string;
  to: string;
  km: number;
  elev: string;
  diff: number;
  surface: string;
  water: string;
  tip: string;
  albergue: string;
}

export interface Experience {
  title: string;
  desc: string;
  where: string;
  emoji: string;
  imageUrl: string;
  bg: 'pt' | 'cam' | 'uk' | 'fr' | 'ch';
  day?: string;
}

export interface Food {
  title: string;
  desc: string;
  where: string;
  emoji: string;
  imageUrl: string;
  bg: 'pt' | 'cam' | 'uk' | 'fr' | 'ch';
}

export interface Accommodation {
  phase: Phase;
  city: string;
  name: string;
  type: string;
  price: string;
  desc: string;
  emoji: string;
}

export interface BudgetLineItem {
  label: string;
  amt: number;
  status: 'confirmed' | 'pending';
  note?: string; // 항공편명·PNR·예약일 등 (확정 시)
}

export interface BudgetItem {
  id: string;
  cat: string;
  amt: string;
  amtNum: number;
  detail: string;
  pct: number;
  color: string;
  breakdown?: BudgetLineItem[]; // 확정 vs 미정 분리 표시
}

export interface FlightData {
  type: string;
  from: string;
  to: string;
  date: string;
  note: string;
}

export interface Transport {
  route: string;
  method: string;
  time: string;
  price: string;
  tip: string;
}

export type ChecklistState = 'pending' | 'in-progress' | 'attention' | 'completed';

export interface ChecklistItemTemplate {
  label: string;       // DB-friendly summary string (also used for seed); 표시할 핵심 내용
  day?: string;        // "Day 1" / "Day 12-13"
  date?: string;       // "6/12 (금)" / "6/14 ~ 6/17"
  target?: string;     // 👫 부부 · 🧑 둘째 · 🇰🇷 큰아들 · 👨‍👩‍👦‍👦 가족 등 대상
  count?: string;      // "2명" / "4명"
  route?: string;      // 항공권/기차 노선
  code?: string;       // 항공편명/PNR/예약번호
  time?: string;       // "12:20→22:55" / "13:50→16:35"
  price?: string;      // "₩2,311,000" / "CHF 379/인 × 4"
  status?: ChecklistState; // 기본 상태 — DB 값 없을 때 fallback
  note?: string;       // 부가 설명 (좌석·환승·주의사항 등)
  link?: { url: string; label: string }; // 신청 페이지 등 외부 링크
  instructions?: string[]; // 신청·작성 단계별 가이드 (펼침 영역에 표시)
}

export interface ChecklistCategory {
  title: string;
  items: ChecklistItemTemplate[];
}

// DB types
export interface BudgetActual {
  id: string;
  category: string;
  actual_amount: number;
  notes: string;
  updated_at: string;
}

export interface ChecklistItemDB {
  id: string;
  category_index: number;
  label: string;
  checked: boolean;            // legacy; new code uses `state`
  state: ChecklistState;       // 4-stage status
  memo: string;
  is_custom: boolean;
  sort_order: number;
  created_at: string;
}

export interface ChecklistAttachment {
  id: string;
  item_id: string;
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
}
