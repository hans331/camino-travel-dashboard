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
  links?: { url: string; label: string }[]; // 동선 지도·예약 페이지 등 외부 링크 버튼
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
  /** 조식 제공 여부 */
  breakfast?: {
    status: 'included' | 'paid' | 'none';
    price?: string;  // 유료 시 "₩36,780/인"
    note?: string;   // "영국식", "Picnic €5 옵션" 등
  };
  /** 확정 예매된 숙소 — 지도 마커 표시 */
  booked?: {
    lat: number;
    lng: number;
    address: string;
    dates: string;          // "6/12-13", "6/24-26"
    bookingRef?: string;
    nights: number;
    pax: number;
  };
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
  actual?: number;        // 결산 실지출 (카드 대조 기준). 있으면 예산 대비 결산 표시
  settleNote?: string;    // 결산 근거·비고 (어떤 카드/무엇으로 나갔는지)
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

export interface BookingInfo {
  ref?: string;          // 예약번호 / PNR / Confirmation Number
  pin?: string;          // PIN / 확인 코드
  phone?: string;        // 호스트·호텔·항공사 전화
  email?: string;        // 호스트·호텔 이메일
  contactName?: string;  // 컨택 담당자·서비스명 ("Be my Guest" 등)
  checkInTime?: string;  // "14:00-20:00"
  checkOutTime?: string; // "08:00-11:00"
  accessNote?: string;   // 입실 안내 (키박스 위치·직원 미팅 등)
  address?: string;      // 정확한 주소
  platform?: string;     // 예매 플랫폼 ("Booking.com", "트립닷컴" 등)
}

export interface ChecklistItemTemplate {
  label: string;       // DB-friendly summary string (also used for seed); 표시할 핵심 내용
  day?: string;        // "Day 1" / "Day 12-13"
  date?: string;       // "6/12 (금)" / "6/14 ~ 6/17"
  target?: string;     // 👫 부부 · 🧑 둘째 · 🇰🇷 큰아들 · 👨‍👩‍👦‍👦 가족 등 대상
  count?: string;      // "2명" / "4명"
  route?: string;      // 항공권/기차 노선
  code?: string;       // 항공편명/PNR/예약번호 (간단 표기)
  time?: string;       // "12:20→22:55" / "13:50→16:35"
  price?: string;      // "₩2,311,000" / "CHF 379/인 × 4"
  status?: ChecklistState; // 기본 상태 — DB 값 없을 때 fallback
  note?: string;       // 부가 설명 (좌석·환승·주의사항 등)
  link?: { url: string; label: string }; // 신청 페이지 등 외부 링크
  instructions?: string[]; // 신청·작성 단계별 가이드 (펼침 영역에 표시)
  booking?: BookingInfo; // 예약 세부 정보 (펼침 영역 카드형 표시)
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
