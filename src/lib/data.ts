import type {
  DayData,
  CaminoStage,
  Experience,
  Food,
  Accommodation,
  BudgetItem,
  FlightData,
  Transport,
  ChecklistCategory,
  MeetingPoint,
  Airport,
} from './types';

// ============ KEY MEETING POINTS (가족 만남 거점) ============
export const MEETING_POINTS: MeetingPoint[] = [
  {
    id: 'zrh-airport-meeting',
    emoji: '🤝',
    label: '🇨🇭 ZRH 공항 — 가족 만남 거점 (Day 13)',
    desc: 'Day 13 (6/24 수): ⭐ 부부 SCQ→ZRH + 둘째 LON→ZRH 만남 (3명) → 기차로 Lucerne\nDay 14 (6/25 목): 큰아들 KE917 ICN→ZRH 17:25 도착 (혼자) → 기차로 Lucerne 호텔에서 가족과 합류 (4명 완성!)',
    lat: 47.4647,
    lng: 8.5492,
  },
];

// ============ KEY AIRPORTS (주요 공항) ============
export const AIRPORTS: Airport[] = [
  { code: 'ICN', name: '인천 국제공항', city: '인천', lat: 37.4602, lng: 126.4407, role: '🛫 출발 (6/12 LH713) + 🛬 귀국 (둘째 7/2, 가족 7/9)' },
  { code: 'FRA', name: '프랑크푸르트 공항', city: '프랑크푸르트', lat: 50.0379, lng: 8.5622, isLayover: true, role: '🔄 LH713→LH1180 환승 (6/12)' },
  { code: 'OPO', name: '포르토 공항', city: '포르토', lat: 41.2480, lng: -8.6814, role: '🛬 부부 도착 (6/12 22:55)' },
  { code: 'SCQ', name: '산티아고 공항', city: '산티아고 데 콤포스텔라', lat: 42.8963, lng: -8.4151, role: '🛫 부부 SCQ→MAD→ZRH (6/24)' },
  { code: 'MAD', name: '마드리드 공항', city: '마드리드', lat: 40.4983, lng: -3.5676, isLayover: true, role: '🔄 Iberia 환승 (6/24)' },
  { code: 'ZRH', name: '취리히 공항', city: '취리히', lat: 47.4647, lng: 8.5492, role: '🤝 가족 만남 거점 · 큰아들 KE917 도착 (6/25)' },
  { code: 'LHR', name: '런던 히드로 공항', city: '런던', lat: 51.4700, lng: -0.4543, role: '🛫 둘째 LHR→ZRH 6/23 LX333 · 🛬 가족 ZRH→LHR 6/30 LX332' },
  { code: 'LGW', name: '런던 개트윅 공항', city: '런던', lat: 51.1537, lng: -0.1821, role: '🛫 둘째 귀국 LGW→칭다오→ICN (7/1 21:10, JD484+QW901)' },
  { code: 'MUC', name: '뮌헨 공항', city: '뮌헨', lat: 48.3537, lng: 11.7860, isLayover: true, role: '🔄 LH2229→LH718 환승 (7/8 귀국)' },
  { code: 'CDG', name: '파리 샤를드골 공항', city: '파리', lat: 49.0097, lng: 2.5479, role: '🛫 가족 3명 LH 귀국 (7/8 12:00)' },
];

// Trip start: 2026-06-12 (Friday)
export const TRIP_START_ISO = '2026-06-12';

// Helper: compute calendar Date for a given trip day number
export function getDayDate(dayNum: number): Date {
  const d = new Date(TRIP_START_ISO + 'T00:00:00');
  d.setDate(d.getDate() + dayNum - 1);
  return d;
}

export function findTripDay(date: Date, schedule: DayData[]): DayData | undefined {
  const tripStart = new Date(TRIP_START_ISO + 'T00:00:00').getTime();
  const dayMs = 1000 * 60 * 60 * 24;
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const dayNum = Math.round((target - tripStart) / dayMs) + 1;
  return schedule.find((d) => d.day === dayNum);
}

export const PHASES = {
  porto: { label: '포르토', color: '#EA580C', emoji: '🇵🇹' },
  camino: { label: '카미노', color: '#16A34A', emoji: '🐚' },
  swiss: { label: '스위스', color: '#DC2626', emoji: '🇨🇭' },
  london: { label: '캠브리지', color: '#2563EB', emoji: '🇬🇧' },
  paris: { label: '파리', color: '#DB2777', emoji: '🇫🇷' },
} as const;

export const NAV_ITEMS = [
  { id: 'schedule', label: '일정', icon: '📅' },
  { id: 'map', label: '지도', icon: '🗺️' },
  { id: 'camino', label: '카미노', icon: '🐚' },
  { id: 'taste', label: '맛집·체험', icon: '🍷' },
  { id: 'accommodation', label: '숙소', icon: '🏠' },
  { id: 'budget', label: '예산', icon: '💰' },
  { id: 'transport', label: '교통', icon: '✈️' },
  { id: 'checklist', label: '준비물', icon: '✅' },
] as const;

export const SCHEDULE: DayData[] = [
  // ===== PORTO (Day 1-2) — 2일 =====
  {
    day: 1, date: '6/12 (금)', phase: 'porto', title: '👫 부부 출발: 인천 → 포르토 (Swiss Air)',
    icon: '✈️', desc: '👫 부부만 먼저 출발 (큰아들 6/25 스위스 합류, 둘째 6/24 ZRH 합류). 🇩🇪 Lufthansa LH713 ICN 12:20 → FRA 18:40 (A350-900, 13h 20m) → 2h 25m 환승 → LH1180 FRA 21:05 → OPO 22:55 도착 (A321NEO, 총 18h 35m, Economy Basic Plus, ₩2,311,000/2인, 예약번호 Y6RCMU). ⚠️ 22:55 늦은 도착 → 🚖 Uber 호출 (OPO → Vila Nova de Gaia, ~€25-30, 30-40분) → SANTA RITA Guesthouse 늦은 체크인 (~00:15-00:30). 호텔에 늦은 도착 사전 통보 + 휴식. 시내 관광·크리덴셜 수령은 Day 2로.',
    food: '기내식 (ICN-FRA: 다과+기내식, FRA-OPO: 다과)', stay: 'SANTA RITA Guesthouse B&B (Vila Nova de Gaia, 강 건너편 — 포트와인 셀러 옆) · 더블룸 조식포함 ₩354,271/2박',
    lat: 41.1280, lng: -8.6080,
    transit: '✈️ ICN 12:20 → OPO 22:55 (18h 35m, LH713+LH1180 FRA 환승) → 🚖 Uber OPO→Vila Nova de Gaia ~€30, 30-40분',
    restaurants: ['Cafe Santiago (프란세지냐 원조)', 'Cervejaria Brasão'],
    timeline: [
      { time: '12:20', emoji: '🛫', label: 'LH713 ICN 출발 (A350-900)', status: 'confirmed', detail: '👫 부부 · Economy Basic Plus · 좌석 30J·30K · PNR Y6RCMU' },
      { time: '18:40', emoji: '🛬', label: 'FRA 도착 (13h 20m)', status: 'confirmed', detail: '환승 대기 2h 25m' },
      { time: '21:05', emoji: '🛫', label: 'LH1180 FRA 출발 (A321NEO)', status: 'confirmed', detail: '좌석 20E·20F' },
      { time: '22:55', emoji: '🛬', label: 'OPO 포르토 도착 (Schengen 첫 입국 · 도장 받기)', status: 'confirmed', detail: '입국·짐 ~30분 예상' },
      { time: '23:35', emoji: '🚖', label: 'OPO 공항 → Uber 호출 (Vila Nova de Gaia行)', status: 'pending', detail: 'Uber 또는 Bolt · ~€25-30 · 30-40분 · 한국에서 미리 앱 설치 + 카드 등록' },
      { time: '00:15', emoji: '🏨', label: 'SANTA RITA Guesthouse 체크인 (Day 2 새벽)', status: 'pending', detail: '⚠️ 호텔에 늦은 도착 사전 통보 필수 (booking.com → 도착 시간 업데이트)' },
    ],
  },
  {
    day: 2, date: '6/13 (토)', phase: 'porto', title: '🍷 포르토 시내 관광 종일',
    icon: '🍷', desc: '여유로운 포르토 탐방 — ⭐ 포르토 대성당에서 순례자 크리덴셜 수령 (개관시간 확인 필수) → 동 루이스 1세 다리, 리베이라 지구 워킹, 도루강 크루즈, 빌라 노바 데 가이아 포트와인 셀러 투어 (Taylor\'s/Graham\'s), 클레리고스 탑, Cafe Majestic, Livraria Lello 서점.',
    food: '프란세지냐, 비파나, 포트와인', stay: 'SANTA RITA Guesthouse B&B (Vila Nova de Gaia) — 같은 숙소 연박 · 조식포함',
    lat: 41.1409, lng: -8.6132,
    restaurants: ['Cafe Santiago', 'Cafe Majestic', "Taylor's Port Cellar", 'Cervejaria Brasão'],
  },

  // ===== CAMINO HYBRID (Day 3-12) — 해안 4일 + 전환 + 중앙 5일 = 10일 (228km) =====
  {
    day: 3, date: '6/14 (일)', phase: 'camino', title: '카미노 Day 1 (해안): 포르토 → Vila do Conde',
    icon: '🌊', desc: '🌊 하이브리드 시작 — Senda Litoral 해변 보드워크. 포르토 대성당에서 크리덴셜 시작 도장 → 포르토 메트로 또는 도보 → 대서양 해변 따라 Vila do Conde (어촌 + Romanesque 수도원).',
    food: '해변 카페 점심, Vila do Conde 해산물 저녁', stay: '✅ Hotel Costa Verde ★★ (Avenida Vasco da Gama 56, 포보아드바르징) · 조식포함',
    lat: 41.3528, lng: -8.7461, dist: '27km',
  },
  {
    day: 4, date: '6/15 (월)', phase: 'camino', title: '카미노 Day 2 (해안): Vila do Conde → Esposende',
    icon: '🌊', desc: '대서양 해안선 따라 보드워크 + 어촌 마을. Esposende 도착, 강변 도시.',
    food: '신선한 해산물, Vinho Verde', stay: '✅ Parque do Rio Ofir Hotel ★★★★ (Caminho Padre Manuel Sá Pereira, Ofir) · 조식포함 · 발코니',
    lat: 41.5371, lng: -8.7838, dist: '24km',
  },
  {
    day: 5, date: '6/16 (화)', phase: 'camino', title: '카미노 Day 3 (해안): Esposende → Viana do Castelo',
    icon: '🌊', desc: 'Lima 강 하구의 역사적 도시. Santa Luzia 언덕 + 분홍빛 대성당.',
    food: 'Bacalhau, Viana 정통 식당', stay: '✅ Hotel Areias Claras ★★ (Rua da praia 54, Amorosa) · 조식포함 · 해변 5km',
    lat: 41.6946, lng: -8.8298, dist: '26km',
  },
  {
    day: 6, date: '6/17 (수)', phase: 'camino', title: '🌊🛥️ 카미노 Day 4 (해안): Viana → Caminha → 페리 → A Guarda ⭐ 스페인 입국',
    icon: '🌊', desc: '대서양 해안 마지막 도보 26km + 미뉴 강 페리 횡단으로 ⭐ 스페인 진입! 오전 Viana 출발 → ~14시 Caminha 도착 → Cais de Caminha 부두 → 오후 페리 (16–18시 편) → A Pasaxe → 도보/택시 3km → A Guarda 시내. 저녁 Santa Trega 켈트 유적 + 항구 해산물.',
    food: '문어, 정어리, A Guarda 해산물 만찬', stay: '✅ Hotel Monumento Convento de San Benito ★★ (16C 베네딕트 수도원 개조) · 바다 전망 · 조식 포함',
    lat: 41.9028, lng: -8.8786, dist: '26km + 페리',
  },
  {
    day: 7, date: '6/18 (목)', phase: 'camino', title: '🥾 카미노 Day 5 (강변): A Guarda → Tui 30km',
    icon: '🥾', desc: '미뉴 강변 따라 갈리시아 도보 30km. 새벽 6–7시 출발 가능 (페리 시간 의존 X). A Guarda → Goián → Tomiño → Tui. PO-552 도로 + 강변길 (정통 카미노 표식 약함, Wise Pilgrim/gronze.com GPS 필수). Tui 대성당 + 두 번째 도장. 다음날 31km 와 연속이라 페이스 보존.',
    food: '갈리시아 풀포 아 페이라', stay: '✅ Hotel Amoriño ★★★ (Rúa Arraial, 구시가) · 🏊 수영장 전망 · 조식 포함',
    lat: 42.0466, lng: -8.6448, dist: '30km',
  },
  {
    day: 8, date: '6/19 (금)', phase: 'camino', title: '카미노 Day 6 (중앙): Tui → Amieiro Longo (Redondela 직전) ~28km',
    icon: '💪', desc: '중앙길 합류 — Tui → O Porriño (17km, 산업단지) → Mt. Cornedo 등반 +305m → Amieiro Longo 마을 (Redondela 도심 3km 전). 새벽 6시 출발 권장, 점심 O Porriño 중간 휴식. 30km 컷오프 부합 (도심까지 가지 않고 카미노 본선 위 동네에서 1박).',
    food: '엠파나다 갈레가, 알바리뇨 · (조식 X — 아파트 주방 활용)', stay: '✅ Casa Amieiro ★★★ (Rúa Amieiro 10, 단독 1베드룸 아파트) · 주방+세탁기',
    lat: 42.2680, lng: -8.6160, dist: '~28km',
  },
  {
    day: 9, date: '6/20 (토)', phase: 'camino', title: '카미노 Day 7 (중앙): Amieiro Longo → Redondela 도심 → Pontevedra ~22km',
    icon: '🐚', desc: 'Amieiro Longo 출발 → Redondela 도심 통과 (3km, 아침 카페) → Arcade (Ponte Sampaio 역사 다리, 굴 산지) → Pontevedra 구시가. 호스트 대면 체크인 14–18시 — 새벽 6시 출발 권장. 저녁 광장 타파스 산책.',
    food: '아침: Redondela 카페 · 점심: Arcade 굴 · 저녁: Praza da Ferrería 타파스, 라콘', stay: '✅ MORC-beds & rooms ★ (Rua San Martiño 5, 구시가) · 더블룸 + 공용 욕실 (알베르게 체험)',
    lat: 42.4310, lng: -8.6440, dist: '~22km',
  },
  {
    day: 10, date: '6/21 (일)', phase: 'camino', title: '카미노 Day 8 (중앙): Pontevedra → Caldas de Reis',
    icon: '♨️', desc: '온천 마을 칼다스 데 레이스 도착. Caldas 시내 도착 후 호텔 무료 셔틀로 Umia 강변 농촌 retreat 이동. 발 피로 회복 + Caldas 온천 1km 옵션.',
    food: '엠파나다, 라콘 콘 그렐로스 · 호텔 레스토랑 (Torre do Rio)', stay: '✅ Torre do Rio (18C 물레방앗간 개조, Umia 강변) · 무료 카미노 셔틀',
    lat: 42.6050, lng: -8.6420, dist: '22km',
  },
  {
    day: 11, date: '6/22 (월)', phase: 'camino', title: '카미노 Day 9 (중앙): Caldas → Padrón',
    icon: '🌶️', desc: '유칼립투스 숲길. 파드론 고추(피미엔토스)의 고향. Padrón 도심 진입 후 카미노에서 750m 우회 → Pazo de Lestrove (16C 대주교 사저). 50,000m² 정원 + 야외 수영장에서 마지막 회복.',
    food: '피미엔토스 데 파드론 (꼭 먹기!) · Pazo 호텔 레스토랑', stay: '✅ Pazo de Lestrove ★★★★ (Fortunato Cruces 1, 16C 대주교 사저) · 조식 포함 · 50,000m² 정원',
    lat: 42.7400, lng: -8.6600, dist: '~19.7km',
  },
  {
    day: 12, date: '6/23 (화)', phase: 'camino', title: '⭐ Day 10: Padrón → Santiago + 둘째 스위스 도착',
    icon: '⭐', desc: '🥾 부부: 대망의 마지막 구간! 산티아고 대성당이 보이는 순간 감동. 12시 순례자 미사 참석. Compostela 증명서 발급. 저녁 자축 만찬. | 🛬 둘째: Cambridge 8:30 출발 → LHR T2 → Swiss LX333 13:50 → ZRH 16:35 도착 → 기차 ZRH→Lucerne 1h → 18시경 Lucerne 호텔 단독 체크인 (1박 추가) → 카펠교·구시가 야경 산책 + 저녁.',
    food: '🥾 부부: 타르타 데 산티아고, 풀포 아 페이라 · 🇨🇭 둘째: Lucerne 비어 가든', stay: '🥾 부부: ✅ Libredón Rooms ₩241,113 / 🇨🇭 둘째: ✅ Capsule Hotel — Lucerne Old Town (33 Zürichstrasse) 캡슐룸 고층 ₩182,214',
    lat: 42.8805, lng: -8.5457, dist: '24km',
    transit: '🥾 부부 Camino 24km · 🛬 둘째 Cambridge→LHR→ZRH→Lucerne',
    restaurants: ['O Curro da Parra', 'Abastos 2.0', 'Casa Marcelo'],
    timeline: [
      { time: '06:00', emoji: '🥾', label: '🥾 부부 Padrón → Santiago 출발 (24km 마지막 구간)', status: 'pending' },
      { time: '08:30', emoji: '🚂', label: '🧑 둘째 Cambridge 출발 → LHR T2 이동', status: 'pending' },
      { time: '12:00', emoji: '⛪', label: '🥾 부부 산티아고 도착 + 정오 순례자 미사 (Botafumeiro)', status: 'pending' },
      { time: '13:50', emoji: '🛫', label: '🧑 LX333 LHR T2 → ZRH 출발 (1h 45m)', status: 'confirmed', detail: 'Swiss · PNR XW2NMU · 개인물품만' },
      { time: '16:35', emoji: '🛬', label: '🧑 ZRH 도착', status: 'confirmed' },
      { time: '18:00', emoji: '🏨', label: '🧑 Capsule Hotel — Lucerne Old Town 체크인 (단독 1박)', status: 'confirmed', detail: '✅ 33 Zürichstrasse, 6004 Lucerne · 캡슐룸 고층 · Genius 10% 할인 ₩182,214' },
      { time: '저녁', emoji: '🍽️', label: '🥾 부부 산티아고 자축 만찬 · 🇨🇭 둘째 Lucerne 야경 + 비어 가든', status: 'pending' },
    ],
  },
  // ===== SWITZERLAND (Day 13-18) — 6일 (Lucerne + Matterhorn + Interlaken 통합) =====
  {
    day: 13, date: '6/24 (수)', phase: 'swiss', title: '🇨🇭 부부 SCQ→ZRH 합류 → 루체른 (3명, 둘째는 이미 스위스)',
    icon: '✈️', desc: '🥾 부부: 산티아고 시내 마지막 오전 + 점심 후 → Vueling SCQ 15:10 → BCN 16:50 → ZRH 20:25 (BCN 환승 1h 40m, 수하물 직통, 어머니 OK / 아빠 이름 정정 진행). | 🇨🇭 둘째: 종일 Lucerne 또는 근교 단독 관광 (Mt. Pilatus 또는 Lake Lucerne 보트 등). | 저녁 ZRH→Lucerne 기차 1h → 21시경 호텔에서 ⭐ 3명 합류 환영 만찬!',
    food: '기내식 + 루체른 정통 스위스 만찬 (Wirtshaus Galliker)', stay: '✅ Visionary Hospitality Rothenburg — Premium Apartment (3명, 단독 사용 6인 정원)',
    lat: 47.0502, lng: 8.3093,
    transit: '🛬 부부 SCQ→BCN→ZRH 20:25 · 🚂 →Lucerne 21시 · 🇨🇭 둘째 종일 Lucerne 단독 관광',
    restaurants: ['Wirtshaus Galliker', 'Restaurant Schwanen'],
    timeline: [
      { time: '오전', emoji: '🇨🇭', label: '🧑 둘째 종일 Lucerne 단독 관광 (Mt. Pilatus / Lake Lucerne)', status: 'pending' },
      { time: '15:10', emoji: '🛫', label: '👫 VY1673 SCQ → BCN 출발', status: 'confirmed', detail: 'Vueling · ✅ 아빠 이름 정정 완료 (6/10, 수수료 ₩111,854)' },
      { time: '16:50', emoji: '🛬', label: '👫 BCN 도착 (환승 1h 40m, 수하물 직통)', status: 'confirmed' },
      { time: '18:30', emoji: '🛫', label: '👫 VY6248 BCN → ZRH 출발', status: 'confirmed' },
      { time: '20:25', emoji: '🛬', label: '👫 ZRH 도착', status: 'confirmed' },
      { time: '21:00', emoji: '🚂', label: 'ZRH → Lucerne 기차 (~1h)', status: 'pending' },
      { time: '22:00', emoji: '🍽️', label: '⭐ Lucerne 호텔에서 3명 합류 환영 만찬', status: 'pending' },
    ],
  },
  {
    day: 14, date: '6/25 (목)', phase: 'swiss', title: '🏔️ Mt. Pilatus + 🇰🇷 큰아들 합류 (저녁, 4명 완성!)',
    icon: '🏔️', desc: 'Mt. Pilatus Golden Round Trip — 보트 → 세계 최가파른 톱니바퀴 열차 (48°) → 정상 2,128m → 케이블카 하산. 오후 Lake Lucerne 보트 크루즈 + 카펠교. ⭐ 저녁: 큰아들 합류 — ✅ KE917 ICN 11:05 → ZRH 17:25 직항 (B787-10) → 기차 ZRH→Lucerne 1h → 19시경 호텔 도착. 가족 4명 환영 만찬!',
    food: 'Pilatus 산정 점심 · 큰아들 환영 만찬 (스위스 정통 라클렛/퐁듀)', stay: '✅ Visionary Hospitality Rothenburg — Premium Apartment (4명 완성)',
    lat: 46.9789, lng: 8.2528,
    transit: '🇰🇷 큰아들 KE917 ICN→ZRH 13h 20m (17:25 도착) + 🚂 ZRH→Lucerne 1h',
    restaurants: ['Pilatus Kulm 산정', 'Old Swiss House', 'Wirtshaus Galliker (환영)'],
    timeline: [
      { time: '08:00', emoji: '🏔️', label: 'Mt. Pilatus Golden Round Trip 시작 (3명, ~5h)', status: 'pending' },
      { time: '11:05', emoji: '🛫', label: '🇰🇷 큰아들 KE917 ICN 출발 (B787-10 직항)', status: 'confirmed' },
      { time: '14:00', emoji: '⛵', label: '오후 Lake Lucerne 보트 크루즈 + 카펠교', status: 'pending' },
      { time: '17:25', emoji: '🛬', label: '🇰🇷 큰아들 ZRH 도착 (13h 20m)', status: 'confirmed' },
      { time: '18:30', emoji: '🚂', label: '큰아들 ZRH → Lucerne 기차 (~1h)', status: 'pending' },
      { time: '19:30', emoji: '🍽️', label: '⭐ 가족 4명 완성 — 환영 만찬 (라클렛/퐁듀)', status: 'pending' },
    ],
  },
  {
    day: 15, date: '6/26 (금)', phase: 'swiss', title: '🚂 루체른 → 체르마트 (가족 4명 함께, 3.5h)',
    icon: '🚂', desc: '4명 함께 — 오전 출발 Luzern → Bern → Visp 환승 → Zermatt (3h 30m, 풍경 좋은 노선). 오후 체르마트 도착, 차량 없는 알프스 마을 산책. 일몰 시 황금빛 마테호른 (Alpenglühen).',
    food: '기차 도시락 + 체르마트 정통 퐁듀', stay: '졸리몬트 아파트먼트 (Alpine Apartment, 4명)',
    lat: 46.0207, lng: 7.7491,
    transit: '🚂 Lucerne → Zermatt (3h 30m, Visp 환승) · 가족 4명 함께',
    restaurants: ['Whymper-Stube (퐁듀)', 'Restaurant Schäferstube', 'Stefanie\'s Crêperie'],
  },
  {
    day: 16, date: '6/27 (토)', phase: 'swiss', title: '⛰️ 마테호른 — Gornergrat + Sunnegga (Stellisee)',
    icon: '⛰️', desc: '⭐ 새벽 출발 (구름 없는 마테호른 뷰). Gornergrat 톱니바퀴 열차 → 3,089m 정상 (마테호른 클래식 뷰 + 29개 4,000m 봉우리 + Gorner 빙하). 오후 Sunnegga 케이블카 → Stellisee 호수 (마테호른 반영 ⭐ 인스타 명소).',
    food: 'Gornergrat 산정 레스토랑 점심 · Stellisee 피크닉 · 체르마트 저녁', stay: '졸리몬트 아파트먼트 (Alpine Apartment)',
    lat: 45.9836, lng: 7.7855,
    restaurants: ['Restaurant 3100 (Gornergrat 산정)', 'Schäferstube', 'Findlerhof'],
  },
  {
    day: 17, date: '6/28 (일)', phase: 'swiss', title: '🚂 체르마트 → 인터라켄 (~3h) + Harder Kulm',
    icon: '🚂', desc: '오전 체르마트 → Visp → Spiez → Interlaken (3h, 풍경 노선). 오후 도착 후 호텔 체크인. 늦은 오후 Harder Kulm 케이블카 → 전망대 (인터라켄 + 융프라우·아이거·묀히 삼봉 + Brienz·Thun 두 호수 조망).',
    food: '기차 도시락 · Harder Kulm 산정 만찬', stay: '✅ SWEET HOLIDAY HOME NO.1 (18 Rosenstrasse, 단독 아파트 + 테라스)',
    lat: 46.6863, lng: 7.8632,
    transit: '🚂 Zermatt → Interlaken (3h)',
    restaurants: ['Harder Kulm Restaurant', 'Hotel Restaurant Bären'],
  },
  {
    day: 18, date: '6/29 (월)', phase: 'swiss', title: '⛰️ 융프라우요호 — Top of Europe (3,454m)',
    icon: '⛰️', desc: '⭐ 인터라켄 → 라우터브룬넨 → 클라이네 샤이덱 → 융프라우요호. 유럽 最高 기차역, Aletsch 빙하 + Sphinx 전망대. 하산 후 라우터브룬넨 폭포 골짜기 (72개 폭포, 톨킨 영감지).',
    food: '융프라우 산정 레스토랑 · 라우터브룬넨 마을 저녁', stay: '✅ SWEET HOLIDAY HOME NO.1 (단독 아파트)',
    lat: 46.5470, lng: 7.9854,
    restaurants: ['Bollywood (Top of Europe 카레)', 'Restaurant Airtime'],
  },

  // ===== UK CAMBRIDGE (Day 19-20) =====
  {
    day: 19, date: '6/30 (화)', phase: 'london', title: '🛫 스위스 → 영국 → 캠브리지 (가족 4명 함께)',
    icon: '🛫', desc: '가족 4명 함께 이동 — 오전 인터라켄 → 취리히 기차 (2h). ZRH → LHR 비행 (Swiss/BA, 1h 45m). LHR → 캠브리지 (Elizabeth Line + LNER, ~2.5h). 캠브리지 저녁 도착. 졸업식 전야 가족 만찬.',
    food: '취리히 공항 점심 + 캠브리지 졸업 전야 가족 만찬', stay: '✅ Hyatt Centric Cambridge — 디럭스 패밀리룸 (3명·둘째 본인 학생 숙소)',
    lat: 52.2053, lng: 0.1218,
    transit: '🚂 →ZRH 2h · ✈️ ZRH→LHR 1h45 · 🚂 →Cambridge 2.5h',
    restaurants: ['Midsummer House (미슐랭 2★)', 'Restaurant 22', 'The Eagle (역사적 펍)'],
    timeline: [
      { time: '08:00', emoji: '🏨', label: 'Interlaken 호텔 체크아웃', status: 'pending' },
      { time: '08:30', emoji: '🚂', label: 'Interlaken → ZRH 공항 기차 (~2h)', status: 'pending' },
      { time: '12:05', emoji: '🛫', label: '✈️ LX332 ZRH → LHR 출발 (1h 55m)', status: 'confirmed', detail: 'Swiss · 4명 · 위탁 23kg+휴대 8kg/인 · PNR XTVN7K' },
      { time: '13:00', emoji: '🛬', label: 'LHR T2 도착', status: 'confirmed' },
      { time: '14:30', emoji: '🚂', label: 'LHR → Cambridge (Elizabeth Line + LNER, ~2.5h)', status: 'pending' },
      { time: '15:00', emoji: '🏨', label: 'Hyatt Centric Cambridge 체크인 (디럭스 패밀리룸, 37 Eddington Ave)', status: 'confirmed', detail: '예약번호 확보, 3인 1박' },
      { time: '19:00', emoji: '🍽️', label: '졸업식 전야 가족 만찬', status: 'pending' },
    ],
  },
  {
    day: 20, date: '7/1 (수)', phase: 'london', title: '🎓 졸업식 + 가족 분리 (둘째 귀국 / 3명 → 파리)',
    icon: '🎓', desc: '오전 ⭐ Senate House에서 캠브리지 졸업식 + 가족 사진. 점심 콜리지 가든 파티 + 펀팅. 오후 4명 함께 캠브리지→London King\'s Cross 도착 (~17시). 거기서 갈림길 — 둘째: 옆 St Pancras에서 🚂 Thameslink 직행 → LGW 18시 도착 → JD484 21:10 → 칭다오 → 7/2 ICN 21:35 (QW901, ₩964,900). 3명: 같은 St Pancras (도보 5분)에서 🚄 Eurostar 저녁편 → 파리 Gare du Nord 도착 + 첫 비스트로 만찬. ⭐ King\'s Cross↔St Pancras 도보 5분 옆 건물 — 환승 간단.',
    food: '졸업 축하 점심 · Eurostar 스낵 · 파리 비스트로 저녁', stay: '✅ Clichy 88m² 아파트 (예매완료, ₩2,435,389) · 23 Rue Gustave Eiffel · 침실 3+욕실 2+큰 창 view',
    lat: 52.2068, lng: 0.1181,
    transit: '🎓 졸업식 → 둘째 ✈️ LGW→칭다오→ICN · 3명 🚄 Eurostar →Paris',
    restaurants: ['Bistrot Paul Bert (파리)', 'Le Comptoir du Relais', 'The Eagle (펍)'],
    timeline: [
      { time: '11:00', emoji: '🎓', label: 'Senate House 졸업식 시작', status: 'pending' },
      { time: '12:30', emoji: '📸', label: '졸업식 끝 + 가족 사진 + 가운 반납', status: 'pending' },
      { time: '13:00', emoji: '🥂', label: '콜리지 가든 파티 + 점심 (formal hall)', status: 'pending' },
      { time: '14:30', emoji: '🛶', label: '펀팅 또는 캠브리지 마지막 산책', status: 'pending' },
      { time: '15:30', emoji: '🚂', label: 'Cambridge → London King\'s Cross 기차 (50min)', status: 'pending' },
      { time: '16:30', emoji: '🔀', label: 'St Pancras 도착 — 가족 작별 (도보 5분)', status: 'pending' },
      { time: '17:00', emoji: '🚂', label: '🧑 둘째 Thameslink St Pancras → LGW (~45min)', status: 'pending' },
      { time: '19:01', emoji: '🚄', label: '👨‍👩‍👦 3명 Eurostar St Pancras → Paris', status: 'confirmed', detail: 'Eurostar Standard · Coach 5 · 2h 18m · €351 (€117×3) = ₩626,439' },
      { time: '21:10', emoji: '🛫', label: '🧑 JD484 LGW → 칭다오 출발', status: 'confirmed', detail: '베이징캐피탈 · 칭다오 4h 10m 환승 · PNR NXSQX0' },
      { time: '22:19', emoji: '🛬', label: '👨‍👩‍👦 3명 Paris Gare du Nord 도착', status: 'confirmed' },
      { time: '22:45', emoji: '🚖', label: 'Gare du Nord → Clichy 아파트 (Uber ~€20, 15-20분)', status: 'pending', detail: 'Métro 13 환승 가능하나 야간+짐 = 택시 추천' },
      { time: '23:15', emoji: '🏨', label: 'Clichy 아파트 체크인 (호스트 Niko 미팅)', status: 'pending', detail: '⚠️ 호스트와 도착 시간 사전 컨펌 필수' },
    ],
  },

  // ===== PARIS (Day 21-28) — 8일 (7박), Mont-Saint-Michel 포함 =====
  {
    day: 21, date: '7/2 (목)', phase: 'paris', title: '🎨 오르세 · 에펠탑 · 세느강',
    icon: '🎨', desc: '오전 ⭐ 오르세 미술관 (인상파의 성지: 모네·고흐·세잔). 점심 후 에펠탑 + 트로카데로 전망. 늦은 오후 세느강 유람선 + 일몰. 라탱지구·생제르맹 저녁.',
    food: '오르세 카페 점심 · 크루아상 · 에스카르고 · 뵈프 부르기뇽', stay: '✅ Clichy 88m² 아파트 (예매완료) — 같은 숙소 연박',
    lat: 48.8600, lng: 2.3266,
    restaurants: ['Café de Flore', "L'Ami Jean", 'Le Procope'],
  },
  {
    day: 22, date: '7/3 (금)', phase: 'paris', title: '👑 베르사유 궁전 당일치기',
    icon: '👑', desc: 'RER C로 베르사유 도착 (45분). 궁전 + 정원 + 트리아농 전체 관람 (사전 예매 필수). 평일이라 토요일보다 한산. 저녁 파리 복귀 후 마레지구 비스트로.',
    food: '베르사유 정원 피크닉 + 마레지구 저녁', stay: '✅ Clichy 88m² 아파트 (예매완료) — 같은 숙소 연박',
    lat: 48.8048, lng: 2.1203,
    restaurants: ['Breizh Café', "L'As du Fallafel"],
  },
  {
    day: 23, date: '7/4 (토)', phase: 'paris', title: '🖼️ 루브르 + 마레 + 노트르담',
    icon: '🖼️', desc: '오전 루브르 박물관 (모나리자·비너스·니케). 점심 후 마레지구 산책 + 보주 광장 + 피카소 미술관. 늦은 오후 노트르담 + 생트샤펠 + 라탱지구.',
    food: '루브르 카페 점심 · 마레 팔라펠 · 라탱지구 저녁', stay: '✅ Clichy 88m² 아파트 (예매완료) — 같은 숙소 연박',
    lat: 48.8606, lng: 2.3376,
    restaurants: ['Bouillon Chartier', 'Le Marais Lounge'],
  },
  {
    day: 24, date: '7/5 (일)', phase: 'paris', title: '🌻 지베르니 당일치기 (모네의 정원)',
    icon: '🌻', desc: '⭐ 파리 → 지베르니 (1h 기차 + 셔틀). 모네의 집과 수련 연못 — 인상파의 발상지. 노르망디 시골 풍경. 저녁 파리 복귀, 노천 카페.',
    food: '지베르니 인근 비스트로 점심 · 파리 노천 카페 저녁', stay: '✅ Clichy 88m² 아파트 (예매완료) — 같은 숙소 연박',
    lat: 49.0758, lng: 1.5331,
    restaurants: ['Hôtel Baudy (지베르니, 모네 단골)', 'Le Café Marly'],
  },
  {
    day: 25, date: '7/6 (월)', phase: 'paris', title: '🏰 Mont-Saint-Michel 당일치기',
    icon: '🏰', desc: '⭐ 파리 → Mont-Saint-Michel (TGV 2h + 셔틀 1h 15m). 노르망디 바다 위 수도원 — 프랑스 최고 명소. 새벽 출발 → 저녁 귀환 (왕복 ~12h). 입장권·셔틀·TGV 사전 예매 필수.',
    food: 'TGV 도시락 · La Mère Poulard 오믈렛 (현지 명물) · 늦은 파리 저녁', stay: '✅ Clichy 88m² 아파트 (예매완료) — 같은 숙소 연박',
    lat: 48.6361, lng: -1.5114,
    restaurants: ['La Mère Poulard (Mont-Saint-Michel)', 'Le Pré Salé'],
  },
  {
    day: 26, date: '7/7 (화)', phase: 'paris', title: '🎭 몽마르뜨 + l\'Orangerie + 쇼핑',
    icon: '🎭', desc: '오전 몽마르뜨·사크레쾨르 + 예술가 광장 + 마지막 마카롱(Pierre Hermé). 점심 후 l\'Orangerie (모네 수련 대벽화) + Tuileries 정원. 저녁 Galeries Lafayette 옥상 + 쇼핑.',
    food: 'Pink Mamma 점심 · 마카롱 · 마지막 비스트로 만찬', stay: '✅ Clichy 88m² 아파트 (예매완료) — 같은 숙소 연박',
    lat: 48.8867, lng: 2.3431,
    restaurants: ['Pink Mamma', 'Pierre Hermé', 'Bouillon Pigalle'],
  },
  {
    day: 27, date: '7/8 (수)', phase: 'paris', title: '☕ 이른 출발 + 🛫 CDG → 뮌헨 → 인천',
    icon: '🛫', desc: '⚠️ 오전 일찍 호텔 체크아웃 (8시쯤) + Du Pain et des Idées 크루아상 마지막 한 입. RER B로 CDG 10:30 도착 목표. ✅ LH2229 CDG 12:00 → MUC 13:30 → 환승 2h 25m → LH718 MUC 15:55 → ICN 7/9 (목) 09:55 도착.',
    food: '간단 아침 + CDG 라운지 점심 + MUC 환승 시 가벼운 식사 + LH718 기내식', stay: '기내 (7/9 오전 ICN 도착)',
    lat: 49.0097, lng: 2.5479,
    transit: '✈️ CDG 12:00 → MUC 13:30 → ICN 09:55+1 (LH2229+LH718, 14h 55m)',
    restaurants: ['Du Pain et des Idées (아침)'],
    timeline: [
      { time: '08:00', emoji: '🏨', label: '파리 호텔 체크아웃 + 크루아상 마지막', status: 'pending' },
      { time: '09:00', emoji: '🚇', label: 'RER B → CDG (45-60min)', status: 'pending' },
      { time: '12:00', emoji: '🛫', label: 'LH2229 CDG 출발 → MUC', status: 'confirmed', detail: 'Lufthansa · 3명 · Economy Green · 위탁 23kg/휴대 8kg' },
      { time: '13:30', emoji: '🛬', label: 'MUC 도착 (환승 2h 25m)', status: 'confirmed' },
      { time: '15:55', emoji: '🛫', label: 'LH718 MUC 출발 → ICN', status: 'confirmed' },
    ],
  },
  {
    day: 28, date: '7/9 (목)', phase: 'paris', title: '🏠 인천 도착 (오전!)',
    icon: '🏠', desc: 'ICN 09:55 도착 ⭐ 오전 도착이라 회복 시간 충분. 입국 + 짐 찾기 → 점심 전 귀가 가능. 7/9 오후 + 7/10 (금) 회복 후 7/13 (월) 정상 출근.',
    food: '오랜만의 한식 — 도착 후 첫 끼 (점심)', stay: '집',
    lat: 37.4602, lng: 126.4407,
    transit: '🛬 ICN 09:55 도착',
    timeline: [
      { time: '09:55', emoji: '🛬', label: 'ICN 도착 (LH718)', status: 'confirmed' },
      { time: '11:00', emoji: '🏠', label: '입국·짐 찾기 → 귀가', status: 'pending' },
      { time: '점심', emoji: '🍚', label: '오랜만의 한식 — 첫 끼', status: 'pending' },
    ],
  },
];

// ============ CAMINO ROUTE VARIANTS (for map comparison) ============
export interface CaminoVariantStage {
  day: number;
  date: string;
  from: string;
  to: string;
  km: number;
  lat: number;
  lng: number;
  note?: string;
}

export interface CaminoVariant {
  key: 'central' | 'coastal' | 'hybrid';
  label: string;
  emoji: string;
  color: string;
  desc: string;
  totalKm: number;
  days: number;
  highlights: string[];
  stages: CaminoVariantStage[];
}

export const CAMINO_VARIANTS: Record<'central' | 'coastal' | 'hybrid', CaminoVariant> = {
  central: {
    key: 'central',
    label: '중앙길 (10일)',
    emoji: '🌳',
    color: '#16A34A',
    desc: '정통 1000년 루트 · 숲·시골·중세 마을 · Tui→Redondela 통합',
    totalKm: 242,
    days: 10,
    highlights: ['Ponte de Lima 중세 마을', 'Tui 대성당·국경 다리', '유칼립투스·소나무 숲 그늘', 'O Porriño 통과 (Day 6 31km, 새벽 출발)', '시골 알베르게 정통 경험'],
    stages: [
      { day: 3, date: '6/14 (일)', from: 'Porto', to: 'Vairão', km: 27, lat: 41.3411, lng: -8.6694 },
      { day: 4, date: '6/15 (월)', from: 'Vairão', to: 'Barcelos', km: 29, lat: 41.5314, lng: -8.6150 },
      { day: 5, date: '6/16 (화)', from: 'Barcelos', to: 'Ponte de Lima', km: 33, lat: 41.7674, lng: -8.5840 },
      { day: 6, date: '6/17 (수)', from: 'Ponte de Lima', to: 'Rubiães', km: 18, lat: 41.9089, lng: -8.5733 },
      { day: 7, date: '6/18 (목)', from: 'Rubiães', to: 'Tui', km: 20, lat: 42.0466, lng: -8.6448, note: '🇪🇸 스페인 진입' },
      { day: 8, date: '6/19 (금)', from: 'Tui', to: 'Redondela (O Porriño 통과)', km: 31, lat: 42.2839, lng: -8.6094, note: '⚠️ 최장일 31km' },
      { day: 9, date: '6/20 (토)', from: 'Redondela', to: 'Pontevedra', km: 19, lat: 42.4310, lng: -8.6440 },
      { day: 10, date: '6/21 (일)', from: 'Pontevedra', to: 'Caldas de Reis', km: 22, lat: 42.6050, lng: -8.6420 },
      { day: 11, date: '6/22 (월)', from: 'Caldas', to: 'Padrón', km: 19, lat: 42.7400, lng: -8.6600 },
      { day: 12, date: '6/23 (화)', from: 'Padrón', to: 'Santiago', km: 24, lat: 42.8805, lng: -8.5457, note: '⭐ 산티아고 도착' },
    ],
  },
  coastal: {
    key: 'coastal',
    label: '해안길',
    emoji: '🌊',
    color: '#0EA5E9',
    desc: '대서양 해안 · 어촌·페리·해변 보드워크',
    totalKm: 245,
    days: 11,
    highlights: ['🛥️ Caminha 페리 국경 통과', 'Senda Litoral 해변 보드워크', '어촌 도시 (Vila do Conde, Viana, Baiona)', '해풍으로 시원함', '신선한 해산물'],
    stages: [
      { day: 3, date: '6/15 (월)', from: 'Porto (🚇 메트로)', to: 'Vila do Conde → Esposende', km: 24, lat: 41.5371, lng: -8.7838, note: 'Day 1: 포르토 메트로로 Vila do Conde, 첫 도보' },
      { day: 4, date: '6/16 (화)', from: 'Esposende', to: 'Viana do Castelo', km: 26, lat: 41.6946, lng: -8.8298 },
      { day: 5, date: '6/17 (수)', from: 'Viana do Castelo', to: 'Caminha', km: 26, lat: 41.8714, lng: -8.8398 },
      { day: 6, date: '6/18 (목)', from: 'Caminha', to: '🛥️ ferry → A Guarda → Mougás', km: 20, lat: 41.9772, lng: -8.8538, note: '🇪🇸 페리로 스페인 진입' },
      { day: 7, date: '6/19 (금)', from: 'Mougás → Oia', to: 'Baiona', km: 24, lat: 42.1175, lng: -8.8474 },
      { day: 8, date: '6/20 (토)', from: 'Baiona', to: 'Vigo', km: 25, lat: 42.2406, lng: -8.7207 },
      { day: 9, date: '6/21 (일)', from: 'Vigo', to: 'Redondela', km: 16, lat: 42.2839, lng: -8.6094, note: '중앙길과 합류' },
      { day: 10, date: '6/22 (월)', from: 'Redondela', to: 'Pontevedra', km: 19, lat: 42.4310, lng: -8.6440 },
      { day: 11, date: '6/23 (화)', from: 'Pontevedra', to: 'Caldas de Reis', km: 22, lat: 42.6050, lng: -8.6420 },
      { day: 12, date: '6/24 (수)', from: 'Caldas', to: 'Padrón', km: 19, lat: 42.7400, lng: -8.6600 },
      { day: 13, date: '6/25 (목)', from: 'Padrón', to: 'Santiago', km: 24, lat: 42.8805, lng: -8.5457, note: '⭐ 산티아고 도착' },
    ],
  },
  hybrid: {
    key: 'hybrid',
    label: '하이브리드',
    emoji: '🌊🌳',
    color: '#8B5CF6',
    desc: '해안 4일 (Porto→Caminha) + 중앙 6일 (Tui→Santiago)',
    totalKm: 228,
    days: 11,
    highlights: ['전반 4일 대서양 해안', '🛥️ Caminha 페리 + Tui 진입', '후반 6일 숲·시골 (그늘)', '두 루트의 장점 모두', '가장 짧은 총 거리 (~228km)'],
    stages: [
      { day: 3, date: '6/15 (월)', from: 'Porto', to: 'Vila do Conde (Senda Litoral)', km: 27, lat: 41.3528, lng: -8.7461, note: '해안 보드워크 시작' },
      { day: 4, date: '6/16 (화)', from: 'Vila do Conde', to: 'Esposende', km: 24, lat: 41.5371, lng: -8.7838 },
      { day: 5, date: '6/17 (수)', from: 'Esposende', to: 'Viana do Castelo', km: 26, lat: 41.6946, lng: -8.8298 },
      { day: 6, date: '6/18 (목)', from: 'Viana do Castelo', to: 'Caminha', km: 26, lat: 41.8714, lng: -8.8398 },
      { day: 7, date: '6/19 (금)', from: 'Caminha 🛥️ ferry → A Guarda', to: '🚌 Tui (전환일)', km: 10, lat: 42.0466, lng: -8.6448, note: '페리 + 버스 이동, 짧은 도보. Tui 대성당 방문.' },
      { day: 8, date: '6/20 (토)', from: 'Tui', to: 'O Porriño (중앙길)', km: 16, lat: 42.1583, lng: -8.6189, note: '중앙길 합류' },
      { day: 9, date: '6/21 (일)', from: 'O Porriño', to: 'Redondela', km: 15, lat: 42.2839, lng: -8.6094 },
      { day: 10, date: '6/22 (월)', from: 'Redondela', to: 'Pontevedra', km: 19, lat: 42.4310, lng: -8.6440 },
      { day: 11, date: '6/23 (화)', from: 'Pontevedra', to: 'Caldas de Reis', km: 22, lat: 42.6050, lng: -8.6420 },
      { day: 12, date: '6/24 (수)', from: 'Caldas', to: 'Padrón', km: 19, lat: 42.7400, lng: -8.6600 },
      { day: 13, date: '6/25 (목)', from: 'Padrón', to: 'Santiago', km: 24, lat: 42.8805, lng: -8.5457, note: '⭐ 산티아고 도착' },
    ],
  },
};

// ============ SWISS ROUTE VARIANTS (for map comparison) ============
export interface SwissVariantStage {
  day: number;
  date: string;
  title: string;
  city: string;
  lat: number;
  lng: number;
  note?: string;
}

export interface SwissVariant {
  key: 'lucerne' | 'matterhorn';
  label: string;
  emoji: string;
  color: string;
  desc: string;
  days: number;
  highlights: string[];
  tradeoffs: { pro: string[]; con: string[] };
  stages: SwissVariantStage[];
}

export const SWISS_VARIANTS: Record<'lucerne' | 'matterhorn', SwissVariant> = {
  lucerne: {
    key: 'lucerne',
    label: '🏔️ 루체른 구간',
    emoji: '🏔️',
    color: '#16A34A',
    desc: 'Day 13-14 · Lucerne + Mt. Pilatus',
    days: 2,
    highlights: ['🌉 카펠교 + Lake Lucerne 크루즈', '🏔️ Mt. Pilatus Golden Round Trip (2,128m)', '🦁 사자 기념비', '🧀 정통 스위스 퐁듀'],
    tradeoffs: {
      pro: ['중세 도시 매력', '호수 + 산 결합', '취리히 가까움'],
      con: ['차량 통행 도시'],
    },
    stages: [
      { day: 13, date: '6/24 (수)', title: 'Santiago → 취리히 → Lucerne', city: 'Lucerne', lat: 47.0502, lng: 8.3093, note: '큰아들 합류' },
      { day: 14, date: '6/25 (목)', title: 'Mt. Pilatus Golden Round + 호수', city: 'Mt. Pilatus', lat: 46.9789, lng: 8.2528 },
    ],
  },
  matterhorn: {
    key: 'matterhorn',
    label: '⛰️ 마테호른 구간',
    emoji: '⛰️',
    color: '#DC2626',
    desc: 'Day 15-16 · Zermatt + Matterhorn (Gornergrat)',
    days: 2,
    highlights: ['⛰️ Matterhorn 클래식 뷰 (Gornergrat 3,089m)', '🪞 Stellisee 호수 Matterhorn 반영 (Sunnegga)', '🚙 차량 없는 청정 알프스 마을', '🧀 체르마트 정통 퐁듀'],
    tradeoffs: {
      pro: ['세계 최유명 산', '알프스 정점 경험', '차량 없는 청정 마을'],
      con: ['숙박비 ↑ (CHF 350+/박)', '날씨 의존도 ↑'],
    },
    stages: [
      { day: 15, date: '6/26 (금)', title: 'Lucerne → Zermatt (3.5h)', city: 'Zermatt', lat: 46.0207, lng: 7.7491 },
      { day: 16, date: '6/27 (토)', title: '⛰️ Gornergrat + Sunnegga (Matterhorn)', city: 'Gornergrat', lat: 45.9836, lng: 7.7855 },
    ],
  },
};

export const CAMINO_STAGES: CaminoStage[] = [
  { day: 1, from: '포르토', to: 'Vairão', km: 27, elev: '+350m / -280m', diff: 3, surface: '포장도로 60%, 흙길 40%', water: '3km마다', tip: '첫날이라 무리하지 말 것. 출발 전 발에 바셀린. 포르토 대성당 도장 필수.', albergue: 'Albergue do Mosteiro de Vairão' },
  { day: 2, from: 'Vairão', to: 'Barcelos', km: 29, elev: '+200m / -300m', diff: 3, surface: '시골길 65%, 포장 35%', water: '5km마다', tip: '바르셀로스 수탉 전설지 방문. 시내 진입 전 길고 평탄한 구간.', albergue: 'Albergue Cidade de Barcelos' },
  { day: 3, from: 'Barcelos', to: 'Ponte de Lima', km: 33, elev: '+450m / -400m', diff: 4, surface: '숲길 55%, 포장 45%', water: '4km마다', tip: '⚠️ 가장 긴 구간! 6시 일찍 출발 권장. 리마 강변 도착 시 감동.', albergue: 'Albergue de Ponte de Lima' },
  { day: 4, from: 'Ponte de Lima', to: 'Rubiães', km: 18, elev: '+580m / -350m', diff: 4, surface: '돌길 60%, 포장 40%', water: '3km마다', tip: 'Alto da Portela Grande 오르막 — 짧지만 가파름. 정상에서 휴식.', albergue: 'Albergue São Pedro de Rubiães' },
  { day: 5, from: 'Rubiães', to: 'Tui', km: 20, elev: '+280m / -420m', diff: 3, surface: '포장 50%, 흙길 50%', water: '4km마다', tip: '🇪🇸 국경 다리 통과! 여권 지참. 시간 변경 주의 (포르투갈→스페인 +1h). 투이 대성당 꼭 방문.', albergue: 'Albergue de Tui (Convento)' },
  { day: 6, from: 'Tui', to: 'Redondela (O Porriño 통과)', km: 31, elev: '+450m / -350m', diff: 4, surface: '숲길 60%, 산업지대 + 포장 40%', water: '5km마다', tip: '⚠️ 통합 구간 31km — 새벽 6시 출발 권장. O Porriño에서 점심·휴식. Redondela까지 오후 도착.', albergue: 'Albergue de Redondela (또는 사립 펜션)' },
  { day: 7, from: 'Redondela', to: 'Pontevedra', km: 19, elev: '+350m / -380m', diff: 3, surface: '숲길 60%, 포장 40%', water: '3km마다', tip: '폰테베드라 구시가지 매우 아름다움. 저녁에 광장 타파스 투어 필수.', albergue: 'Albergue Virxe Peregrina' },
  { day: 8, from: 'Pontevedra', to: 'Caldas de Reis', km: 22, elev: '+200m / -180m', diff: 2, surface: '포장 50%, 흙길 50%', water: '4km마다', tip: '♨️ 온천 마을! 도착 후 온천욕으로 발 피로 풀기. 발 관리 키트 활용.', albergue: 'Albergue de Caldas de Reis' },
  { day: 9, from: 'Caldas de Reis', to: 'Padrón', km: 19, elev: '+280m / -300m', diff: 3, surface: '유칼립투스 숲 65%, 포장 35%', water: '3km마다', tip: '🌶️ 파드론 고추 꼭 먹을 것! 산티아고가 가까워진다는 설렘.', albergue: 'Albergue de Padrón' },
  { day: 10, from: 'Padrón', to: 'Santiago de Compostela', km: 24, elev: '+320m / -200m', diff: 3, surface: '숲길 50%, 포장 50%', water: '4km마다', tip: '⭐ 마지막 구간! 정오 순례자 미사 (Botafumeiro). Compostela 증명서 발급.', albergue: '호텔 (자축!)' },
];

export const EXPERIENCES: Experience[] = [
  { title: '포트와인 셀러 투어', desc: '빌라 노바 데 가이아에서 100년 셀러 시음', where: '포르토', emoji: '🍷', imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400', bg: 'pt', day: 'Day 2' },
  { title: '도루강 일몰 크루즈', desc: '동 루이스 다리 아래 6개 다리 투어', where: '포르토', emoji: '🌅', imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400', bg: 'pt', day: 'Day 2' },
  { title: '카미노 첫 도장', desc: '포르토 대성당에서 크리덴셜 시작', where: '포르토', emoji: '📜', imageUrl: 'https://images.unsplash.com/photo-1533619239233-6280475a633a?w=400', bg: 'cam', day: 'Day 3' },
  { title: '리마 강변 산책', desc: '포르투갈에서 가장 오래된 마을', where: 'Ponte de Lima', emoji: '🌉', imageUrl: 'https://images.unsplash.com/photo-1599037149928-e8d77fb1aa66?w=400', bg: 'cam', day: 'Day 5' },
  { title: '국경 다리 건너기', desc: '미뉴강 다리 — 포르투갈에서 스페인으로', where: 'Tui', emoji: '🇪🇸', imageUrl: 'https://images.unsplash.com/photo-1518889222693-89dc25f3edfc?w=400', bg: 'cam', day: 'Day 7' },
  { title: '갈리시아 타파스 투어', desc: '폰테베드라 광장에서 저녁 타파스', where: 'Pontevedra', emoji: '🍤', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', bg: 'cam', day: 'Day 10' },
  { title: '산티아고 대성당 미사', desc: '정오 순례자 미사 + Botafumeiro 향로', where: '산티아고', emoji: '⛪', imageUrl: 'https://images.unsplash.com/photo-1583779457711-ab081de64105?w=400', bg: 'cam', day: 'Day 13' },
  { title: '🏔️ Mt. Pilatus Golden Round', desc: '세계 최가파른 톱니바퀴 + 케이블카 + 호수 보트', where: '루체른', emoji: '🏔️', imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=400', bg: 'ch', day: 'Day 15' },
  { title: '🌉 카펠교 + Lake Lucerne', desc: '14세기 목조 다리 + 호수 일몰 크루즈', where: '루체른', emoji: '🌉', imageUrl: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=400', bg: 'ch', day: 'Day 15' },
  { title: '🚂 GoldenPass 파노라마 열차', desc: '알프스 가로지르는 명품 노선', where: '루체른 ↔ 인터라켄', emoji: '🚂', imageUrl: 'https://images.unsplash.com/photo-1604147495798-57beb5d6af73?w=400', bg: 'ch', day: 'Day 16' },
  { title: '⛰️ 융프라우요호 (Top of Europe)', desc: '유럽 최고 기차역 3,454m · Aletsch 빙하', where: '인터라켄', emoji: '⛰️', imageUrl: 'https://images.unsplash.com/photo-1530841344095-502dd6a1bcf3?w=400', bg: 'ch', day: 'Day 17' },
  { title: '💦 라우터브룬넨 폭포 골짜기', desc: '72개 폭포 + 톨킨 영감지', where: '라우터브룬넨', emoji: '💦', imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400', bg: 'ch', day: 'Day 17' },
  { title: '🎓 캠브리지 졸업식', desc: 'Senate House에서 학위 수여식', where: '캠브리지', emoji: '🎓', imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400', bg: 'uk', day: 'Day 19' },
  { title: '🚄 Eurostar 영불해협', desc: 'London St Pancras → Paris Gare du Nord 2h 20m', where: 'London ↔ Paris', emoji: '🚄', imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400', bg: 'fr', day: 'Day 19' },
  { title: '오르세 미술관', desc: '인상파의 성지 — 모네·고흐·세잔', where: '파리', emoji: '🎨', imageUrl: 'https://images.unsplash.com/photo-1605361329547-c01a9e3aa17a?w=400', bg: 'fr', day: 'Day 20' },
  { title: '에펠탑 + 세느강', desc: '트로카데로 전망 + 일몰 유람선', where: '파리', emoji: '🗼', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400', bg: 'fr', day: 'Day 20' },
  { title: '👑 베르사유 궁전', desc: '루이 14세의 절대왕정 — 거울의 방·정원', where: '베르사유', emoji: '👑', imageUrl: 'https://images.unsplash.com/photo-1581420524920-50d76e5fcd2e?w=400', bg: 'fr', day: 'Day 21' },
  { title: '루브르 박물관', desc: '모나리자·비너스·니케 — 핵심 작품 동선', where: '파리', emoji: '🖼️', imageUrl: 'https://images.unsplash.com/photo-1503917988258-f87a78e3c995?w=400', bg: 'fr', day: 'Day 22' },
  { title: '몽마르뜨·사크레쾨르', desc: '예술가의 언덕 + 흰 대성당', where: '파리', emoji: '⛪', imageUrl: 'https://images.unsplash.com/photo-1551634979-2b11f8c946fe?w=400', bg: 'fr', day: 'Day 22' },
];

export const FOODS: Food[] = [
  { title: '프란세지냐', desc: '포르토 명물 — 고기·치즈·맥주소스 샌드위치', where: '포르토', emoji: '🥪', imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', bg: 'pt' },
  { title: '파스텔 드 나타', desc: '바삭한 커스터드 에그타르트', where: '포르토', emoji: '🥧', imageUrl: 'https://images.unsplash.com/photo-1626094309830-abbb0c99da4a?w=400', bg: 'pt' },
  { title: '포트와인', desc: '주정 강화 와인 — 토니/루비/빈티지', where: '포르토', emoji: '🍷', imageUrl: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=400', bg: 'pt' },
  { title: '풀포 아 페이라', desc: '갈리시아식 문어 + 파프리카·올리브유', where: '갈리시아 전역', emoji: '🐙', imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400', bg: 'cam' },
  { title: '피미엔토스 데 파드론', desc: '소금 뿌린 초록 고추 — 10개 중 1개는 매움', where: '파드론', emoji: '🌶️', imageUrl: 'https://images.unsplash.com/photo-1599909366516-6c1c8f4bf6e8?w=400', bg: 'cam' },
  { title: '엠파나다 갈레가', desc: '참치·돼지고기 들어간 갈리시아 파이', where: '갈리시아', emoji: '🥟', imageUrl: 'https://images.unsplash.com/photo-1604908176997-431b1c0c5fed?w=400', bg: 'cam' },
  { title: '타르타 데 산티아고', desc: '아몬드 케이크 + 산티아고 십자가 무늬', where: '산티아고', emoji: '🍰', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', bg: 'cam' },
  { title: '알바리뇨 와인', desc: 'Rías Baixas 화이트 — 해산물의 친구', where: '갈리시아', emoji: '🥂', imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400', bg: 'cam' },
  { title: '크루아상·바게트', desc: '파리 동네 빵집의 아침', where: '파리', emoji: '🥐', imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', bg: 'fr' },
  { title: '에스카르고', desc: '갈릭버터에 구운 달팽이', where: '파리', emoji: '🐌', imageUrl: 'https://images.unsplash.com/photo-1610614819513-58e34989848b?w=400', bg: 'fr' },
  { title: '스테이크 프리트', desc: '비스트로 클래식 — 스테이크 + 감자튀김', where: '파리', emoji: '🥩', imageUrl: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=400', bg: 'fr' },
  { title: '마카롱', desc: 'Ladurée·Pierre Hermé의 마카롱 한 상자', where: '파리', emoji: '🍪', imageUrl: 'https://images.unsplash.com/photo-1558326567-98166e232c45?w=400', bg: 'fr' },
  { title: '🧀 치즈 퐁듀', desc: '그뤼에르 + 에멘탈 — 스위스 정통', where: '루체른·인터라켄', emoji: '🧀', imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?w=400', bg: 'ch' },
  { title: '🥔 라클렛', desc: '녹인 치즈 + 감자 + 피클', where: '스위스 전역', emoji: '🥔', imageUrl: 'https://images.unsplash.com/photo-1631898039984-fd5a1f12b95a?w=400', bg: 'ch' },
  { title: '🍫 스위스 초콜릿', desc: 'Lindt·Sprüngli·Läderach 매장 투어', where: '루체른·취리히', emoji: '🍫', imageUrl: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?w=400', bg: 'ch' },
  { title: '🍞 뢰스티', desc: '스위스식 감자전 (스위스의 국민 음식)', where: '스위스 전역', emoji: '🥞', imageUrl: 'https://images.unsplash.com/photo-1626844131082-256783844137?w=400', bg: 'ch' },
  { title: 'Sunday Roast', desc: '캠브리지 펍에서 일요일 정찬', where: '캠브리지', emoji: '🍖', imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400', bg: 'uk' },
];

export const ACCOMMODATIONS: Accommodation[] = [
  { phase: 'porto', city: '포르토', name: 'SANTA RITA Guesthouse B&B (Vila Nova de Gaia)', type: '게스트하우스 (Booking.com)', price: '₩354,271 / 2박 (부부)', desc: '✅ 예매완료 · 6/12-13 · R. Santa Rita 58, Vila Nova de Gaia (강 건너편, 포트와인 셀러 옆) · 더블룸 외부욕실 · 조식포함 · 발코니+정원 전망 · ⚠️ 환불 불가.', emoji: '🏨',
    breakfast: { status: 'included', note: '포르투갈식 조식 (B&B 기본)' },
    booked: { lat: 41.1376, lng: -8.6094, address: 'R. Santa Rita 58, 4400 Vila Nova de Gaia, Portugal', dates: '6/12-13', nights: 2, pax: 2 } },
  { phase: 'camino', city: 'Vila do Conde / 포보아드바르징', name: 'Hotel Costa Verde ★★', type: '2성급 호텔 (Booking.com)', price: '₩137,164 / 1박 (부부)', desc: '✅ 예매완료 · 🌊 6/14 카미노 Day 1 — 해안 27km 종착 · Avenida Vasco da Gama 56, 4490-410 Póvoa de Varzim (대서양 100m, Vila do Conde 북쪽 3km) · 더블룸 + 발코니 + 바다/도시 전망 · 조식 뷔페 포함 · 24h 리셉션 · 위치 점수 9.4 · 평점 9.0 (2,799리뷰)', emoji: '🏨',
    breakfast: { status: 'included', note: '뷔페 (따뜻한+차가운 음식) · 객실 내 서비스 가능' },
    booked: { lat: 41.3825, lng: -8.7625, address: 'Avenida Vasco da Gama 56, 4490-410 Póvoa de Varzim, Portugal', dates: '6/14', nights: 1, pax: 2, bookingRef: '6088472537' } },
  { phase: 'camino', city: 'Esposende (Ofir)', name: 'Parque do Rio Ofir Hotel ★★★★', type: '4성급 리조트 호텔 (Booking.com Genius)', price: '₩139,473 / 1박 (부부)', desc: '✅ 예매완료 · 🌊 6/15 카미노 Day 2 — 해안 24km 종착 · Caminho Padre Manuel Sá Pereira, 4744-908 Ofir, Esposende (Cávado 강 하구 리조트 지역) · 더블/트윈룸 + 발코니 · 조식 포함 · 무료 주차 · 수영장 · 4성 리조트', emoji: '🏨',
    breakfast: { status: 'included' },
    booked: { lat: 41.4951, lng: -8.7842, address: 'Caminho Padre Manuel Sá Pereira, 4744-908 Esposende (Ofir), Portugal', dates: '6/15', nights: 1, pax: 2, bookingRef: '6796499497' } },
  { phase: 'camino', city: 'Viana do Castelo (Amorosa)', name: 'Hotel Areias Claras ★★', type: '2성급 호텔 (Booking.com Genius)', price: '₩139,534 / 1박 (부부)', desc: '✅ 예매완료 · 🌊 6/16 카미노 Day 3 · Rua da praia 54, Amorosa, 4935-580 Viana do Castelo (Amorosa 해변 마을, 시내 남쪽 ~5km) · 스탠다드 더블룸 · 조식 포함 · 18세 이상만 투숙 가능 · 체크인 15:00-22:30, 체크아웃 08:00-11:30', emoji: '🏨',
    breakfast: { status: 'included' },
    booked: { lat: 41.6437, lng: -8.8232, address: 'Rua da praia 54, Amorosa, 4935-580 Viana do Castelo, Portugal', dates: '6/16', nights: 1, pax: 2, bookingRef: '5251499876' } },
  { phase: 'camino', city: 'A Guarda', name: 'Hotel Monumento Convento de San Benito ★★', type: '역사 호텔 (16C 베네딕트 수도원 개조)', price: '₩218,421 / 1박 (부부)', desc: '✅ 예매완료 · 🛥️ 6/17 Caminha 페리 도착 후 1박 — ⭐ 스페인 입국 첫날 · Plaza de San Benito s/n, 36780 A Guarda, Pontevedra · 더블룸 + 🌊 바다 전망 · 조식 포함 · 체크인 15:00-23:00 · 페리 부두에서 도보 30분 또는 택시 ~€5 · 다음날 새벽 A Guarda → Tui 30km 강변 도보 시작', emoji: '🏨',
    breakfast: { status: 'included' },
    booked: { lat: 41.9028, lng: -8.8786, address: 'Plaza de San Benito s/n, 36780 A Guarda, Pontevedra, Spain', dates: '6/17', nights: 1, pax: 2, bookingRef: '6347680101' } },
  { phase: 'camino', city: 'Tui', name: 'Hotel Amoriño ★★★', type: '3성급 호텔 (구시가 부티크)', price: '₩222,676 / 1박 (부부)', desc: '✅ 예매완료 · 🥾 6/18 카미노 Day 5 도착 (A Guarda → Tui 30km 강변 종착) · Rúa Arraial, 36700 Tui, Pontevedra (구시가지 · 대성당 도보권) · 디럭스 더블룸/트윈룸 · 🏊 수영장 전망 · 대형 더블침대 · 조식 포함 · 체크인 15:00-22:00 · ⚠️ 환불 불가 (예약 후 23h grace) · 다음날 Tui → Redondela 31km 통합 출발', emoji: '🏨',
    breakfast: { status: 'included' },
    booked: { lat: 42.0467, lng: -8.6438, address: 'Rúa Arraial, 36700 Tui, Pontevedra, Spain', dates: '6/18', nights: 1, pax: 2, bookingRef: '5026083954' } },
  { phase: 'camino', city: 'Amieiro Longo (Redondela)', name: 'Casa Amieiro ★★★', type: '단독 1베드룸 아파트 (카미노 본선 위)', price: '₩176,350 / 1박 (부부)', desc: '✅ 예매완료 · 💪 6/19 카미노 Day 6 종착 — Tui → Amieiro Longo ~28km (Redondela 도심 3km 전, 카미노 본선 통과 마을) · Rúa Amieiro 10, Planta baja, 36800 Redondela · 단독 아파트 (4인 정원, 부부 둘만 사용) · 풀 주방 + 세탁기 + 욕조/샤워 + 무료 주차 · 조식 ❌ (주방 + 커피머신 활용) · 체크인 14:00-24:00 · ⚠️ 환불 불가 (23h grace)', emoji: '🏠',
    breakfast: { status: 'none', note: '주방 + 커피머신 있어 자체 조리 또는 다음날 Redondela 도심 통과 시 카페' },
    booked: { lat: 42.2680, lng: -8.6160, address: 'Rúa Amieiro 10, Planta baja, 36800 Redondela, Pontevedra, Spain', dates: '6/19', nights: 1, pax: 2, bookingRef: '6796463776' } },
  { phase: 'camino', city: 'Pontevedra', name: 'MORC-beds & rooms (home sharing) ★', type: 'Home sharing — 알베르게 체험 (부부 사적 침실 + 공용 욕실)', price: '₩157,111 / 1박 (부부, Genius 10%)', desc: '✅ 예매완료 · 🐚 6/20 카미노 Day 7 종착 — Amieiro Longo→Pontevedra ~22km · Rua San Martiño 5, 2º, 36002 Pontevedra (구시가 중심, Virxe Peregrina·Praza da Ferrería 도보 2-5분) · 더블룸 + 대형 더블침대 · 공용 욕실 (알베르게 분위기) · 전용 주방 · 평점 9.6/10 (544 리뷰) · 조식 ❌ · ⚠️ 환불 불가 · 호스트 대면 체크인 14:00-18:00 (시간 엄수) · 체크아웃 07:30-10:00', emoji: '🛏️',
    breakfast: { status: 'none', note: '구시가 카페 도보 1분' },
    booked: { lat: 42.4334, lng: -8.6442, address: 'Rua San Martiño 5, 2º, 36002 Pontevedra, Spain', dates: '6/20', nights: 1, pax: 2, bookingRef: '6051632446' } },
  { phase: 'camino', city: 'Caldas de Reis', name: 'Torre do Rio (18C 물레방앗간)', type: '농촌 호텔 (Umia 강변 retreat, 10,000m² 정원)', price: '₩285,357 / 1박 (부부)', desc: '✅ 예매완료 · ♨️ 6/21 카미노 Day 8 종착 — Pontevedra→Caldas 22km · Baxe 1, San Andres de Cesar, 36653 Caldas de Reis (시내에서 ~1km, 무료 카미노 셔틀 제공) · 18세기 물레방앗간 복원 + Umia 강변 + Rías Baixas 와인 루트 · 조식 포함 · 평점 9.3/10 (328 리뷰) · Caldas 온천 1km 옵션 · 호텔 자체 레스토랑', emoji: '🏞️',
    breakfast: { status: 'included' },
    booked: { lat: 42.6005, lng: -8.6280, address: 'Baxe 1, San Andres de Cesar, 36653 Caldas de Reis, Pontevedra, Spain', dates: '6/21', nights: 1, pax: 2, bookingRef: '6051623506' } },
  { phase: 'camino', city: 'Padrón (Lestrove)', name: 'Pazo de Lestrove by Pousadas de Compostela ★★★★', type: '4성 역사 호텔 (16C 대주교 사저 Pazo, Pousadas de Compostela 체인)', price: '₩269,504 / 1박 (부부)', desc: '✅ 예매완료 · 🌶️ 6/22 카미노 Day 9 종착 — Caldas→Padrón 19km + 카미노 우회 0.75km · Fortunato Cruces 1, 15916 Padrón (Lestrove, Dodro) · 16세기 산티아고 대주교 옛 사저 + 50,000m² 정원·숲 + 야외 수영장 · 스탠다드 더블룸 · 조식 포함 · 미니바·전화기·엘리베이터·휠체어 접근 가능 · 산티아고 진입 전 자축 retreat', emoji: '🏰',
    breakfast: { status: 'included' },
    booked: { lat: 42.7375, lng: -8.6709, address: 'Fortunato Cruces 1, 15916 Padrón (Lestrove, Dodro), A Coruña, Spain', dates: '6/22', nights: 1, pax: 2, bookingRef: '6282984426' } },
  { phase: 'camino', city: 'Barcelos', name: 'Albergue Cidade de Barcelos', type: '알베르게', price: '€8/박', desc: '시내 중심, 시장 근처. 깨끗하고 가성비 좋음.', emoji: '🛏️' },
  { phase: 'camino', city: 'Ponte de Lima', name: 'Albergue de Peregrinos', type: '공립 알베르게', price: '€7/박', desc: '강변, 마을 외곽. 일찍 도착 권장.', emoji: '🛏️' },
  { phase: 'camino', city: 'Rubiães', name: 'Albergue São Pedro de Rubiães', type: '공립 알베르게', price: '€6/박', desc: '작은 마을 — 미리 도착해 침대 확보.', emoji: '🛏️' },
  { phase: 'camino', city: 'Tui', name: 'Albergue de Tui (Convento)', type: '수도원 알베르게', price: '€8/박', desc: '13세기 수도원 — 분위기 압도적.', emoji: '🛏️' },
  { phase: 'camino', city: 'O Porriño', name: 'Albergue Municipal', type: '공립 알베르게', price: '€8/박', desc: '시설 신축, 주방 사용 가능.', emoji: '🛏️' },
  { phase: 'camino', city: 'Redondela', name: 'Casa da Torre', type: '알베르게', price: '€12/박', desc: '역사 건물, 정원 있음.', emoji: '🛏️' },
  { phase: 'camino', city: 'Pontevedra', name: 'Albergue Virxe Peregrina', type: '공립 알베르게', price: '€8/박', desc: '구시가지 중심. 저녁 타파스 동선 좋음.', emoji: '🛏️' },
  { phase: 'camino', city: 'Caldas de Reis', name: 'Albergue Municipal', type: '공립 알베르게', price: '€8/박', desc: '♨️ 온천 마을 — 도착 후 온천욕 가능.', emoji: '🛏️' },
  { phase: 'camino', city: 'Padrón', name: 'Albergue de Padrón', type: '공립 알베르게', price: '€8/박', desc: '강변, 시장 근처. 파드론 고추 꼭 먹기.', emoji: '🛏️' },
  { phase: 'camino', city: '산티아고', name: 'Libredón Rooms', type: '부티크 B&B', price: '₩241,113 (부부 1박)', desc: '✅ 예매완료 · ⭐ 6/23 — 카미노 완주 자축! Plaza de Fonseca 5 (대성당 광장 중 하나, 도보 30초) · 수페리어 트윈룸 정원 전망 · 전용 욕실·발코니 · 짐 보관 가능 (Camino 시작 전 캐리어 직송).', emoji: '🏨',
    breakfast: { status: 'none', note: '조식 미제공 (Picnic €5 옵션 요청 시 · 카미노 완주 후 자축 만찬으로 시내 추천 식당 多)' },
    booked: { lat: 42.8806, lng: -8.5440, address: 'Plaza de Fonseca 5, 15782 Santiago de Compostela', dates: '6/23', nights: 1, pax: 2 } },
  { phase: 'swiss', city: '루체른 (둘째 단독)', name: 'Capsule Hotel — Lucerne Old Town', type: '캡슐 호텔 (Booking.com Genius)', price: '₩182,214 / 1박 (1명, 캡슐룸 고층)', desc: '✅ 예매완료 · 6/23 1박 · 둘째 단독 (LX333 ZRH 16:35 도착 후) · 33 Zürichstrasse, 6004 Lucerne · Genius 10% 할인 · 고속 Wi-Fi, 에어컨, 공용 욕실 · 체크인 14:00-24:00, 체크아웃 01:00-10:30', emoji: '🛏️',
    breakfast: { status: 'none', note: '조식 미제공 (캡슐 호텔 — 시내 카펠교 옆 카페 多)' },
    booked: { lat: 47.0511, lng: 8.3013, address: '33 Zürichstrasse, 6004 Lucerne', dates: '6/23', nights: 1, pax: 1 } },
  { phase: 'swiss', city: '루체른', name: 'Visionary Hospitality Rothenburg — Premium Apartment', type: '아파트 (Booking.com Genius)', price: '₩1,198,404 / 2박 (4명, 단독 사용 아파트 6인 정원)', desc: '✅ 예매완료 · 6/24-26 2박 · 38 Bertiswilstrasse, 6023 Rothenburg (루체른역 북쪽 8.6km, PostBus 60번 무료 셔틀 ~15분 with Swiss Travel Pass) · 발코니·산 전망·주방·세탁기·전용 입구 · 무료 취소 · 체크인 15:00, 체크아웃 10:00', emoji: '🏨',
    breakfast: { status: 'none', note: '조식 미제공 (단독 아파트 — 풀 주방으로 자취 가능, 근처 식료품점 2곳)' },
    booked: { lat: 47.0958, lng: 8.2606, address: '38 Bertiswilstrasse, 6023 Rothenburg, Switzerland', dates: '6/24-26', nights: 2, pax: 4 } },
  { phase: 'swiss', city: '체르마트', name: '졸리몬트 아파트먼트 — Alpine Apartment', type: '아파트 (Booking.com ★★★★)', price: '₩1,430,285 / 2박 (4명, 무료 취소 옵션)', desc: '✅ 예매완료 · 6/26-27 2박 · Flecksteinweg 9, 3920 체르마트 · 4인 단독 아파트 (전용 욕실+발코니+산 전망+도시 전망) · 주방·식기세척기·세탁·DVD 등 풀옵션 · Booking 예약번호 6483632556 (PIN 9112) · 호스트 +41 27 967 24 65', emoji: '🏨',
    breakfast: { status: 'none', note: '조식 미제공 (단독 아파트 — 식기세척기·주방 풀옵션, 체르마트 정통 퐁듀 식당 多)' },
    booked: { lat: 46.0179, lng: 7.7468, address: 'Flecksteinweg 9, 3920 Zermatt', dates: '6/26-27', nights: 2, pax: 4, bookingRef: '6483632556' } },
  { phase: 'swiss', city: '인터라켄', name: 'SWEET HOLIDAY HOME NO.1 (Genius)', type: '아파트 - 테라스 (Booking.com Genius 10%)', price: '₩1,196,804 / 2박 (4명, 단독 사용 아파트 정원 5)', desc: '✅ 예매완료 · 6/28-29 2박 · 18 Rosenstrasse 1 floor, 3800 Interlaken (중심부 · 위치 점수 9.4 · 228리뷰) · 단독 아파트 + 테라스/파티오/발코니 · 전용 욕실 · 주방·소파·평면 TV·전자레인지·다리미 · 무료 취소 · ⚠️ 체크인 17:00-21:30, 체크아웃 07:00-10:00 (시간 좁음, Harder Kulm 다녀와서 21:30 전 입실)', emoji: '🏨',
    breakfast: { status: 'none', note: '조식 미제공 (단독 아파트 — 주방 풀옵션, 슈퍼 인근 · 인터라켄 비스트로 多)' },
    booked: { lat: 46.6858, lng: 7.8580, address: '18 Rosenstrasse, 3800 Interlaken, Switzerland', dates: '6/28-29', nights: 2, pax: 4 } },
  { phase: 'london', city: '캠브리지', name: 'Hyatt Centric Cambridge — 디럭스 패밀리룸', type: '4성급 호텔 (Booking.com)', price: '₩451,433 / 1박 (3명, 둘째 본인 학생 숙소)', desc: '✅ 예매완료 · 🎓 6/30 1박 · 37 Eddington Avenue, CB3 1SE (Eddington 북서 신개발지구, 시내 5.6km) · 디럭스 패밀리룸 31㎡ · 초대형 더블+소파베드 · 정원/안뜰 전망 · 무료 자전거·주차·피트니스 · 평점 8.5 (2,817리뷰).', emoji: '🏨',
    breakfast: { status: 'paid', price: '₩36,780/인', note: '영국식 정찬 뷔페 (평점 8.4)' },
    booked: { lat: 52.2147, lng: 0.0828, address: '37 Eddington Avenue, Cambridge CB3 1SE', dates: '6/30', nights: 1, pax: 3 } },
  { phase: 'paris', city: '파리', name: 'Clichy 88m² Appartement (4 pièces grande terrasse)', type: '단독 아파트 (Booking.com)', price: '₩2,435,389 / 7박 (3명, 환불불가)', desc: '✅ 예매완료 · 23 Rue Gustave Eiffel, 92110 Clichy-la-Garenne · 88m² 침실 3개 + 욕실 2개 + 큰 테라스 · 7층 with elevator + 컨시어지 + 큰 창 녹지 view · ★9.3 (31 리뷰), 청결 9.5, 편안함 9.5 · Île de la Jatte 인상파 트레일 도보 25분.', emoji: '🏨',
    breakfast: { status: 'none', note: '조식 미제공 (88㎡ 단독 아파트 — 풀 주방 · 파리 비스트로 동선 多)' },
    booked: { lat: 48.9028, lng: 2.3119, address: '23 Rue Gustave Eiffel, 92110 Clichy-la-Garenne', dates: '7/1-7', nights: 7, pax: 3, bookingRef: '6154757471' } },
];

export const BUDGET: BudgetItem[] = [
  {
    id: 'flight', cat: '✈️ 항공권', amt: '₩12,004,939', amtNum: 12004939,
    detail: '✅ 8건 모두 예매완료 + Vueling 이름 변경 수수료 ₩111,854 (6/10 결제) · 합계 ₩12,004,939',
    pct: 26, color: '#2563EB',
    breakdown: [
      { label: '👫 부부 ICN→FRA→OPO (LH713+LH1180, 6/12)', amt: 2311000, status: 'confirmed', note: 'Economy Basic Plus · 좌석 30J·30K/20E·20F · PNR Y6RCMU' },
      { label: '🧑 둘째 LHR→ZRH (Swiss LX333, 6/23)', amt: 292900, status: 'confirmed', note: '직항 1h 45m · 개인물품만 · PNR XW2NMU' },
      { label: '👫 부부 SCQ→BCN→ZRH (Vueling, 6/24)', amt: 890600, status: 'confirmed', note: '✅ 아빠 이름 정정 완료 (수수료 별도 라인) · 위탁 25kg/인 · TRIP 1658113176342997' },
      { label: '🔧 Vueling 아빠 이름 변경 수수료', amt: 111854, status: 'confirmed', note: '2026-06-10 결제 · JEONGKYEOM CHOI → CHULLYOUNG CHOI 정정' },
      { label: '🇰🇷 큰아들 ICN→ZRH (KE917, 6/25)', amt: 1273500, status: 'confirmed', note: 'B787-10 직항 13h 20m · Economy Standard' },
      { label: '👨‍👩‍👦‍👦 가족 4명 ZRH→LHR (Swiss LX332, 6/30)', amt: 1575600, status: 'confirmed', note: '직항 1h 55m · 위탁 23kg+휴대 8kg/인 · PNR XTVN7K' },
      { label: '🧑 둘째 LGW→칭다오→ICN (JD484+QW901, 7/1)', amt: 964900, status: 'confirmed', note: '칭다오 4h 10m 환승 · 수하물 재수속 · PNR NXSQX0' },
      { label: '🚄 Eurostar London → Paris (3명, 7/1)', amt: 626439, status: 'confirmed', note: '19:01 → 22:19 · Eurostar Standard · Coach 5 · €351 (€117×3)' },
      { label: '👨‍👩‍👦 3명 CDG→MUC→ICN (LH2229+LH718, 7/8)', amt: 3958146, status: 'confirmed', note: 'Economy Green · €2,198.97 @ ₩1,800/EUR' },
    ],
  },
  {
    id: 'accommodation', cat: '🏨 숙소', amt: '₩9,235,503', amtNum: 9235503,
    detail: '🎉 모든 숙소 예약 완료! 포르토 2박 + 카미노 10박 (Costa Verde·Ofir·Areias Claras·A Guarda Convento·Tui Amoriño·Amieiro Longo Casa Amieiro·Pontevedra MORC·Caldas Torre do Rio·Padrón Pazo de Lestrove·Santiago Libredón) + 둘째 6/23 1박 + 루체른 2박 + 체르마트 2박 + 인터라켄 2박 + 캠브리지 1박 + 파리 7박 — 총 27박 전부 확정 ✅',
    pct: 23, color: '#EA580C',
    breakdown: [
      { label: '🇵🇹 포르토 SANTA RITA Guesthouse B&B (Vila Nova de Gaia) 2박', amt: 354271, status: 'confirmed', note: '✅ 부킹닷컴 예매 · 더블룸 전용 외부욕실 · 조식포함 · 발코니+정원 전망 · ⚠️ 환불불가 · R. Santa Rita 58, Vila Nova de Gaia (강 건너편, 포트와인 셀러 옆)' },
      { label: '🌊 카미노 Day 1 (6/14) Vila do Conde — Hotel Costa Verde ★★', amt: 137164, status: 'confirmed', note: '✅ 부킹닷컴 Genius · 6088472537 (PIN 4729) · +351 252 298 600 · Avenida Vasco da Gama 56, Póvoa de Varzim · 더블룸 + 바다 전망 + 조식 포함 · 평점 9.0 (2,799리뷰)' },
      { label: '🌊 카미노 Day 2 (6/15) Esposende — Parque do Rio Ofir Hotel ★★★★', amt: 139473, status: 'confirmed', note: '✅ 부킹닷컴 Genius · 6796499497 (PIN 5305) · +351 966 620 927 · Caminho Padre Manuel Sá Pereira, Ofir (Cávado 강 하구) · 더블/트윈룸 발코니 + 조식 포함 + 수영장 + 무료 주차 · 4성 리조트' },
      { label: '🌊 카미노 Day 3 (6/16) Viana do Castelo — Hotel Areias Claras ★★', amt: 139534, status: 'confirmed', note: '✅ 부킹닷컴 Genius · 5251499876 (PIN 3281) · +351 962 928 292 · Rua da praia 54, Amorosa (해변 마을, 시내 남쪽 5km) · 스탠다드 더블룸 + 조식 포함 · 18세 이상만 투숙' },
      { label: '🛥️ 카미노 Day 4 (6/17) A Guarda — Hotel Monumento Convento de San Benito ★★ ⭐ 스페인 입국', amt: 218421, status: 'confirmed', note: '✅ 부킹닷컴 · 6347680101 (PIN 4630) · +34 986 61 11 66 · Plaza de San Benito s/n, 36780 A Guarda · 16C 베네딕트 수도원 개조 역사 호텔 · 더블룸 🌊 바다 전망 + 조식 포함 · 페리 부두에서 도보 30분/택시 €5 · 다음날 새벽 → Tui 30km 강변 도보' },
      { label: '🥾 카미노 Day 5 (6/18) Tui — Hotel Amoriño ★★★', amt: 222676, status: 'confirmed', note: '✅ 부킹닷컴 · 5026083954 (PIN 1369) · +34 623 13 38 54 · Rúa Arraial, 36700 Tui (구시가 · 대성당 도보권) · 디럭스 더블/트윈룸 🏊 수영장 전망 · 조식 포함 · ⚠️ 환불 불가 (예약 후 23h grace) · A Guarda→Tui 30km 강변 도보 종착 · 다음날 Tui→Redondela 31km 통합' },
      { label: '💪 카미노 Day 6 (6/19) Amieiro Longo — Casa Amieiro ★★★ (단독 아파트)', amt: 176350, status: 'confirmed', note: '✅ 부킹닷컴 · 6796463776 (PIN 3611) · +34 627 83 02 90 · Rúa Amieiro 10, Planta baja, 36800 Redondela (Amieiro Longo · 카미노 본선 통과 동네, Redondela 도심 3km 전) · 단독 1베드룸 아파트 (4인 정원) · 풀 주방+세탁기+욕조 · 조식 ❌ (주방 활용) · ⚠️ 환불 불가 (23h grace) · Tui→여기 ~28km (30km 컷 부합!)' },
      { label: '🐚 카미노 Day 7 (6/20) Pontevedra — MORC-beds & rooms ★ (home sharing, 알베르게 체험)', amt: 157111, status: 'confirmed', note: '✅ 부킹닷컴 Genius (10% 할인) · 6051632446 (PIN 9443) · +34 607 36 08 12 · Rua San Martiño 5, 2º, 36002 Pontevedra (구시가 중심, Virxe Peregrina·Praza da Ferrería 도보 2-5분) · 더블룸 + 대형 더블침대 · 공용 욕실 · 전용 주방 · 9.6/10 (544 리뷰) · 조식 ❌ · ⚠️ 환불 불가 · 호스트 대면 체크인 14:00-18:00 (시간 엄수)' },
      { label: '♨️ 카미노 Day 8 (6/21) Caldas de Reis — Torre do Rio (18C 물레방앗간 농촌 호텔)', amt: 285357, status: 'confirmed', note: '✅ 부킹닷컴 · 6051623506 (PIN 9456) · +34 986 54 05 13 · Baxe 1, San Andres de Cesar, 36653 Caldas de Reis (시내 1km, 무료 카미노 셔틀) · 18C 물레방앗간 복원 + Umia 강변 + 10,000m² 정원 · 조식 포함 · 9.3/10 (328 리뷰) · Caldas 온천 1km · 호텔 레스토랑' },
      { label: '🏰 카미노 Day 9 (6/22) Padrón — Pazo de Lestrove ★★★★ (Pousadas de Compostela, 16C 대주교 사저)', amt: 269504, status: 'confirmed', note: '✅ 부킹닷컴 Genius · 6282984426 (PIN 5143) · +34 981 56 93 50 · Fortunato Cruces 1, 15916 Padrón (Lestrove, Dodro · 카미노 750m 우회) · 4성 · 스탠다드 더블룸 · 16세기 대주교 옛 사저 + 50,000m² 정원·숲 + 야외 수영장 · 조식 포함 · 미니바·엘리베이터 · 산티아고 도착 전 자축 retreat' },
      { label: '⭐ 산티아고 Libredón Rooms 1박 (자축)', amt: 241113, status: 'confirmed', note: '✅ 부킹닷컴 예매 · Plaza de Fonseca 5 (대성당 광장 중 하나, 도보 30초!) · 수페리어 트윈룸 정원 전망 · 전용 욕실+발코니 · 짐 보관 OK (포르토에서 캐리어 직송 가능)' },
      { label: '🇨🇭 루체른 Visionary Hospitality 2박 (4명, 아파트)', amt: 1198404, status: 'confirmed', note: '✅ 부킹닷컴 Genius · 38 Bertiswilstrasse, 6023 Rothenburg (역 북쪽 8.6km) · 단독 사용 아파트 (정원 6인) · 발코니·주방·세탁기 · 6/24-26 · 무료 취소' },
      { label: '🧑 둘째 단독 6/23 1박 — Capsule Hotel Lucerne Old Town', amt: 182214, status: 'confirmed', note: '✅ 부킹닷컴 Genius (10% 할인) · 33 Zürichstrasse, 6004 Lucerne · 캡슐룸 고층 · 1명 · LX333 ZRH 16:35 도착 → 시내 카펠교 야경 + 비어가든' },
      { label: '⛰️ 체르마트 졸리몬트 아파트먼트 2박 (4명, Alpine Apartment)', amt: 1430285, status: 'confirmed', note: '✅ 부킹닷컴 예매 · ★★★★ · Flecksteinweg 9 · 4인 단독 아파트 · 예약번호 6483632556 (PIN 9112) · 무료 취소 옵션' },
      { label: '🇨🇭 인터라켄 SWEET HOLIDAY HOME NO.1 2박 (4명, 단독 아파트)', amt: 1196804, status: 'confirmed', note: '✅ 부킹닷컴 Genius (10% 할인) · 18 Rosenstrasse, 3800 Interlaken (중심부 9.4점) · 단독 아파트+테라스+전용 욕실+풀 주방 · 무료 취소 · 6/28-29 · 체크인 17-21:30' },
      { label: '🇬🇧 캠브리지 Hyatt Centric 1박 (3명, 디럭스 패밀리룸)', amt: 451433, status: 'confirmed', note: '✅ 부킹닷컴 예매 · 37 Eddington Avenue · 초대형 더블+소파베드 · 31㎡ · 둘째는 본인 학생 숙소 (3인) · 기존 ₩700k 대비 ₩248,567 절감' },
      { label: '🇫🇷 파리 Clichy 88m² 아파트 7박 (3명)', amt: 2435389, status: 'confirmed', note: '✅ 예매완료 (₩2,435,389 / €1,422.60) · 환불 불가 · 88m² 침실 3+욕실 2+테라스 · 23 Rue Gustave Eiffel · Booking 예약번호 6154757471 (PIN 1904) · 호스트 +33 6 50 38 50 89 · 청소비 €80 포함 · 기존 호텔 예산 대비 ~₩3.1M 절감' },
    ],
  },
  {
    id: 'food', cat: '🍽️ 식비', amt: '₩7,600,000', amtNum: 7600000,
    detail: '단계별 인원·일수 × 1일 예산 (전부 미정)',
    pct: 17, color: '#16A34A',
    breakdown: [
      { label: '🇵🇹 포르토 2일×2명 × ₩90K', amt: 360000, status: 'pending' },
      { label: '🐚 카미노 11일×2명 × ₩50K', amt: 1100000, status: 'pending', note: '알베르게 + 시골 식당 기준' },
      { label: '🇨🇭 스위스 6일×3-4명 × ₩120K', amt: 2520000, status: 'pending', note: '체르마트 비쌈, 라클렛/퐁듀 포함' },
      { label: '🇬🇧 캠브리지 2일×4명 × ₩100K', amt: 800000, status: 'pending', note: '졸업 만찬 포함' },
      { label: '🇫🇷 파리 8일×3명 × ₩115K', amt: 2820000, status: 'pending', note: '비스트로 + Mont-Saint-Michel 등 외식' },
    ],
  },
  {
    id: 'transport', cat: '🚄 교통', amt: '₩2,594,001', amtNum: 2594001,
    detail: 'Swiss Travel Pass + OPO Uber + 카미노 캐리어 운반 (TopSantiago ✅) + 시내 이동',
    pct: 5, color: '#7C3AED',
    breakdown: [
      { label: '🇨🇭 둘째 Swiss Travel Pass Youth 8일', amt: 527000, status: 'confirmed', note: '✅ 2026-06-14 SBB 공식 구매 · CHF 311 · 유효 6/23-7/1 05:00' },
      { label: '🇨🇭 부부+큰아들 Saver 6일 (3명)', amt: 1700000, status: 'pending', note: 'CHF 386/인 × 3 Saver 묶음 · 6/25 시작' },
      { label: '🚂 부부 6/24 ZRH→Luzern 점-점', amt: 90000, status: 'pending', note: 'CHF 27×2 SuperSaver · Saver 패스 시작 전 1시간 이동' },
      { label: '🚖 Uber OPO→Vila Nova de Gaia (6/12 야간)', amt: 45000, status: 'pending', note: '€25-30 · 22:55 도착 직행' },
      { label: '🐚 카미노 캐리어 픽업 × 2개 — TopSantiago', amt: 249001, status: 'confirmed', note: '✅ 예매완료 (topsantiago.com) · 부부 캐리어 2개 Porto→Santiago 구간 단위 운반 · 배송 추적: topsantiago.com/admin/' },
      { label: '🇫🇷 파리 Navigo 주간권 × 3명', amt: 135000, status: 'pending', note: '€30×3' },
      { label: '🇬🇧 LHR ↔ Cambridge + 시내 (4명)', amt: 250000, status: 'pending' },
    ],
  },
  {
    id: 'admission', cat: '🎫 체험·입장료', amt: '₩2,500,000', amtNum: 2500000,
    detail: '스위스 산악열차 + 파리 미술관·궁전·당일치기 (전부 미예매)',
    pct: 6, color: '#F59E0B',
    breakdown: [
      { label: '🏔️ Mt. Pilatus Golden Round × 4', amt: 480000, status: 'pending', note: 'CHF 78/인 (Swiss Pass 50% 할인)' },
      { label: '⛰️ Gornergrat (마테호른) × 4', amt: 815000, status: 'pending', note: 'CHF 132/인' },
      { label: '🏔️ 융프라우요호 × 4', amt: 1300000, status: 'pending', note: 'CHF 232/인 (Swiss Pass 25% 할인)' },
      { label: '🇫🇷 파리 6개 명소 × 3', amt: 540000, status: 'pending', note: '오르세·루브르·에펠탑·베르사유·l\'Orangerie·지베르니' },
      { label: '🏰 Mont-Saint-Michel TGV+셔틀+입장 × 3', amt: 510000, status: 'pending', note: '~₩170K/인' },
    ],
  },
  {
    id: 'misc', cat: '💝 기타·예비', amt: '₩1,000,000', amtNum: 1000000,
    detail: '기념품·쇼핑·예비비 (전부 미정)',
    pct: 3, color: '#475569',
    breakdown: [
      { label: '🎁 기념품·선물 (가족·지인)', amt: 400000, status: 'pending' },
      { label: '🛍️ 쇼핑 (파리·런던)', amt: 300000, status: 'pending' },
      { label: '⚠️ 예비비 (응급·환율 변동)', amt: 300000, status: 'pending', note: '스위스 물가 높음 고려' },
    ],
  },
];

export const FLIGHTS: FlightData[] = [
  { type: '출발', from: 'ICN 인천', to: 'OPO 포르토', date: '2026.06.12 (금) 12:20 → 22:55', note: '✅ 예매완료 · 👫 부부 2명 · 🇩🇪 Lufthansa LH713 (A350-900, ICN 12:20→FRA 18:40, 13h 20m) + LH1180 (A321NEO, FRA 21:05→OPO 22:55, 2h 50m) · FRA 환승 2h 25m · 총 18h 35m · Economy Basic Plus · 좌석 30J·30K/20E·20F · ₩2,311,000/2인 · 예약번호 Y6RCMU' },
  { type: '경유', from: 'SCQ 산티아고', to: 'ZRH 취리히', date: '2026.06.24 (수) 15:10 → 20:25', note: '✅ 예매완료 + 아빠 이름 정정 완료 (6/10, 수수료 ₩111,854 별도) · 👫 부부 2명 · 🇪🇸 부엘링 VY1673 (SCQ→BCN, 1h 40m) + VY6248 (BCN→ZRH, 1h 55m) · BCN 환승 1h 40m · 수하물 직통 ✅ 위탁 25kg/인 · ₩890,600 + 수수료 ₩111,854 = ₩1,002,454 · 트립닷컴 1658113176342997' },
  { type: '합류', from: 'LHR 런던', to: 'ZRH 취리히', date: '2026.06.23 (화) 13:50 → 16:35', note: '✅ 예매완료 · 🧑 둘째 1명 (하루 일찍 출발, 스위스 1일 단독 관광 후 가족 합류) · 🇨🇭 Swiss LX333 (Airbaltic BT 공동운항) LHR T2→ZRH 직항 · 1h 45m · 개인물품만 (휴대·위탁 없음) · ₩292,900 · 트립닷컴 1658113179296149 / PNR XW2NMU' },
  { type: '합류', from: 'ICN 인천', to: 'ZRH 취리히', date: '2026.06.25 (목) 11:05 → 17:25', note: '✅ 예매완료 🧑 큰아들 1명 · 🇰🇷 KE917 직항 (B787-10) · 13h 20m · ₩1,273,500 · 일반석 스탠다드' },
  { type: '경유', from: 'ZRH 취리히', to: 'LHR 런던', date: '2026.06.30 (화) 12:05 → 13:00', note: '✅ 예매완료 · 👨‍👩‍👧‍👦 가족 4명 · 🇨🇭 Swiss LX332 (Airbaltic BT 공동운항) ZRH→LHR T2 직항 · 1h 55m · 위탁 23kg/인 + 휴대 8kg/인 포함 · ₩393,900/인 × 4 = ₩1,575,600 · 트립닷컴 1658113176589013 / PNR XTVN7K' },
  { type: '귀국-둘째', from: 'LGW 런던 개트윅', to: 'ICN 인천', date: '2026.07.01 (수) 21:10 → 07.02 (목) 21:35', note: '✅ 예매완료 · 👤 둘째 1명 · 🇨🇳 베이징캐피탈 JD484 LGW→칭다오 + 🇨🇳 칭다오항공 QW901 칭다오→ICN · 칭다오 4h 10m 환승 (⚠️ 수하물 직통연결 불가, 재수속 필요) · 위탁 23kg×2 / 휴대 5kg×1 · ₩964,900 · 트립닷컴 1658113130253589 / PNR NXSQX0' },
  { type: '경유', from: 'London 세인트팬크라스', to: 'Paris 가르 뒤 노르', date: '2026.07.01 (수) 19:01 → 22:19', note: '✅ 예매완료 · 👨‍👩‍👦 3명 · 🚄 Eurostar Standard · 2h 18m · €351 (€117×3) = ₩626,439 · Coach 5' },
  { type: '귀국', from: 'CDG 파리', to: 'ICN 인천', date: '2026.07.08 (수) 12:00 → 07.09 (목) 09:55', note: '✅ 예매완료 👨‍👩‍👦 3명 · 🇩🇪 Lufthansa LH2229 + LH718 (MUC 환승, 2h 25m) · 14h 55m · Economy Green (위탁 23kg, 휴대 8kg) · €2,198.97 (3인 합계) = ₩3,958,146 @ ₩1,800/EUR' },
];

export const TRANSPORTS: Transport[] = [
  { route: 'OPO 공항 → Vila Nova de Gaia 호텔 (6/12 야간)', method: '🚖 Uber 또는 Bolt', time: '30-40분', price: '€25-30 (~₩45K) / 2인', tip: '⭐ 22:55 도착·메트로 환승 복잡·짐 있음 → Uber 직행 강추. 한국에서 미리 앱 설치+카드 등록. Bolt가 보통 Uber보다 €2-5 저렴' },
  { route: 'Vila Nova de Gaia ↔ 포르토 시내 (6/13)', method: '🚇 메트로 D선 (Jardim do Morro) 또는 🚶 동 루이스 1세 다리 도보', time: '도보 15-20분 / 메트로 5분', price: '€2 (메트로 1회권) 또는 무료(도보)', tip: '다리 도보는 도루강 뷰 + 포트와인 셀러 산책 코스. 짐 없을 때 도보 추천' },
  { route: '산티아고 → 취리히 (6/26)', method: '✈️ Iberia (MAD 환승)', time: '5-6h', price: '~₩400K × 2', tip: '부부 2명 동시 예매. 환승 1회' },
  { route: '취리히 공항 → 루체른 (6/26)', method: '🚂 IC/IR 직행 열차', time: '1h', price: 'CHF 25 × 3', tip: 'Swiss Travel Pass 적용 가능' },
  { route: '루체른 → 인터라켄 (6/28)', method: '🚂 GoldenPass Line', time: '~2h (파노라마)', price: 'CHF 35-60 × 4', tip: '⭐ 사전 좌석 예약 권장 (창가/파노라마칸)' },
  { route: 'Mt. Pilatus 왕복 (6/27)', method: '🚠 톱니바퀴 + 케이블카', time: '~5h (Golden Round)', price: 'CHF 78/인 × 3', tip: 'Swiss Travel Pass 50% 할인 적용' },
  { route: '인터라켄 → 융프라우요호 왕복 (6/29)', method: '🚂 산악열차 (Eiger Express)', time: '~7h (왕복)', price: 'CHF 232/인 × 4', tip: '⭐ Swiss Travel Pass 25% 할인 + 사전 예매 필수' },
  { route: '인터라켄 → 취리히 (6/30)', method: '🚂 IC 직행', time: '2h', price: 'CHF 60 × 4', tip: '오전 출발 권장' },
  { route: '취리히 → 런던 (6/30)', method: '✈️ Swiss/BA 직항', time: '1h 45m', price: '~₩200K × 3', tip: '오후 비행, LHR 도착 후 Cambridge 이동' },
  { route: 'LHR → 캠브리지 (6/30)', method: '🚇 Elizabeth Line + 🚂 LNER', time: '~2.5h (Paddington→Kings Cross→Cambridge)', price: '£12 + £40 × 3', tip: '둘째는 캠브리지서 합류' },
  { route: '3명: 캠브리지 → King\'s Cross → St Pancras → 파리 (7/1)', method: '🚂 GTR 기차 (Cambridge→King\'s Cross 50분) + 도보 5분 + 🚄 Eurostar 저녁편', time: '~4h', price: '£25 + £100 × 3', tip: '⭐ King\'s Cross 도착 후 둘째와 같은 St Pancras에서 갈림 (둘째 Thameslink LGW행 / 3명 Eurostar 파리행). 사전 예매 필수' },
  { route: '둘째: 캠브리지 → LGW 개트윅 (7/1 졸업식 후)', method: '🚂 Cambridge→London King\'s Cross + Thameslink 직행 (St Pancras→Gatwick)', time: '~2.5h', price: '£35-55', tip: '⚠️ JD484 21:10 — 18시까지 LGW 도착 목표 (3h 여유). Thameslink Gatwick 직행이 편리.' },
  { route: 'CDG → 파리 시내 (7/1)', method: '🚇 RER B', time: '45-60분', price: '€11.4 × 3', tip: 'Navigo Découverte 주간권 €30 권장' },
  { route: '파리 → 베르사유 왕복 (7/3)', method: '🚂 RER C', time: '45분', price: '€7.5 편도', tip: '베르사유 궁전 입장권 별도 사전 예매' },
  { route: '파리 → 지베르니 왕복 (7/5)', method: '🚂 SNCF + 셔틀', time: '1h 기차 + 15min 셔틀', price: '€20-30 왕복', tip: '🌻 모네의 정원 — 일요일 추천, 사전 예매 필수' },
  { route: '파리 시내 → CDG (7/6)', method: '🚇 RER B', time: '45-60분', price: '€11.4 × 3', tip: '✈️ KE5904 19:10 출발 — 17시까지 도착 목표' },
];

export const CHECKLIST: ChecklistCategory[] = [
  {
    title: '✈️ 항공권 예매 (7건, 출발일 순)',
    items: [
      {
        label: '👫 부부 ICN → FRA → OPO',
        day: 'Day 1', date: '6/12 (금)', target: '👫 부부', count: '2명', route: 'ICN → FRA → OPO', code: 'LH713+LH1180', time: '12:20 → 22:55', price: '₩2,311,000', status: 'completed',
        note: 'FRA 환승 2h 25m · A350-900+A321NEO · Economy Basic Plus · 좌석 30J·30K/20E·20F',
        booking: { ref: 'Y6RCMU', platform: 'Swiss Air shop (Lufthansa 운항)' },
      },
      {
        label: '🧑 둘째 LHR → ZRH (Swiss 직항)',
        day: 'Day 12', date: '6/23 (화)', target: '🧑 둘째', count: '1명', route: 'LHR → ZRH', code: 'LX333', time: '13:50 → 16:35', price: '₩292,900', status: 'completed',
        note: '직항 1h 45m · Airbaltic BT 공동운항 · 개인물품 1개만 · 하루 앞당겨 스위스 1일 단독 관광 · ⚠️ cabin baggage LHR 카운터에서 당일 추가 (€40-60)',
        booking: { ref: 'XW2NMU', platform: 'Trip.com (TRIP 1658113179296149)' },
      },
      {
        label: '👫 부부 SCQ → BCN → ZRH (Vueling)',
        day: 'Day 13', date: '6/24 (수)', target: '👫 부부', count: '2명', route: 'SCQ → BCN → ZRH', code: 'VY1673+VY6248', time: '15:10 → 20:25', price: '₩1,002,454', status: 'completed',
        note: '✅ 아빠 이름 정정 완료 (6/10, 수수료 ₩111,854 별도) · BCN 환승 1h 40m, 수하물 직통 · 위탁 25kg/인',
        booking: { platform: 'Trip.com (TRIP 1658113176342997)' },
      },
      {
        label: '🇰🇷 큰아들 ICN → ZRH (KE 직항)',
        day: 'Day 14', date: '6/25 (목)', target: '🇰🇷 큰아들', count: '1명', route: 'ICN → ZRH', code: 'KE917', time: '11:05 → 17:25', price: '₩1,273,500', status: 'completed',
        note: 'B787-10 직항 13h 20m · Economy Standard',
        booking: { platform: '네이버 항공권 (Korean Air 운항)' },
      },
      {
        label: '👨‍👩‍👦‍👦 가족 ZRH → LHR (Swiss 직항)',
        day: 'Day 19', date: '6/30 (화)', target: '👨‍👩‍👦‍👦 가족', count: '4명', route: 'ZRH → LHR T2', code: 'LX332', time: '12:05 → 13:00', price: '₩1,575,600', status: 'completed',
        note: '직항 1h 55m · 위탁 23kg+휴대 8kg/인 · ₩393,900/인',
        booking: { ref: 'XTVN7K', platform: 'Trip.com (TRIP 1658113176589013)' },
      },
      {
        label: '🧑 둘째 LGW → 칭다오 → ICN',
        day: 'Day 20', date: '7/1 (수)', target: '🧑 둘째', count: '1명', route: 'LGW → TAO → ICN', code: 'JD484+QW901', time: '21:10 → 7/2 21:35', price: '₩964,900', status: 'completed',
        note: '칭다오 4h 10m 환승 · ⚠️ 수하물 직통연결 불가 (재수속 필요)',
        booking: { ref: 'NXSQX0', platform: 'Trip.com (TRIP 1658113130253589)' },
      },
      {
        label: '👨‍👩‍👦 3명 CDG → MUC → ICN (LH 귀국)',
        day: 'Day 27', date: '7/8 (수)', target: '👨‍👩‍👦 가족', count: '3명', route: 'CDG → MUC → ICN', code: 'LH2229+LH718', time: '12:00 → 7/9 09:55', price: '₩3,958,146', status: 'completed',
        note: 'MUC 환승 2h 25m · Economy Green · 위탁 23kg+휴대 8kg · €2,198.97 @ ₩1,800/EUR',
        booking: { platform: 'Lufthansa 공식' },
      },
    ],
  },
  {
    title: '🚂 기차·페리·육상 교통',
    items: [
      { label: '🚖 Uber/Bolt 앱 설치 + 카드 등록 (OPO 도착 대비)', day: 'Day 1', date: '6/12 (금)', target: '👫 부부', count: '2명', route: 'OPO → Vila Nova de Gaia', price: '€25-30 (~₩45K)', status: 'pending', note: '⚠️ 출국 전 한국에서 미리 설치 + 결제수단 등록 (해외에서 SMS 인증 문제 회피). 22:55 도착이라 직행 Uber 필수. Bolt가 보통 €2-5 저렴' },
      {
        label: '🇨🇭 둘째 Swiss Travel Pass Youth 8일 (Continuous)',
        day: 'Day 12-19', date: '6/23-30', target: '🧑 둘째', count: '1명', code: 'CHF 311', price: 'CHF 311 (~₩527K)', status: 'completed',
        note: '✅ 2026-06-14 SBB 공식 구매 · Youth 16-24.99 · 2등석 · 유효 23.06.2026 → 01.07.2026 05:00 · 융프라우요호 25% 할인 + Pilatus·Gornergrat 50% 할인 + Lake Lucerne 보트·박물관·시내교통 무료',
        link: { url: 'https://www.sbb.ch/en/travelcards-and-tickets/tickets-for-switzerland/swiss-travel-pass.html', label: 'SBB Swiss Travel Pass' },
        booking: {
          contactName: 'CHOI JEONGKYEOM (둘째, DOB 26.09.2002)',
          platform: 'SBB.ch (공식)',
          accessNote: '📎 e-pass PDF 첨부 → 둘째 폰 SBB Mobile 앱에 reference로 등록 또는 PDF QR 직접 사용. 검표 시 QR 보여주기.',
        },
      },
      {
        label: '🇨🇭 부부+큰아들 Swiss Travel Pass Saver 6일',
        day: 'Day 14-19', date: '6/25-30', target: '👫🇰🇷 부부+큰아들', count: '3명 (Saver 묶음)', price: 'CHF 386/인 × 3 ≈ ~₩1.7M (예상)', status: 'pending',
        note: '🎫 Saver 15% 할인 · 3명 한 주문에 동시 결제 필수 · 첫 활성화 6/25 동일 · 부부 첫 사용 6/25 Pilatus + 큰아들 6/25 ZRH→Lucerne · 융프라우 25% + Gornergrat 50% 할인',
        link: { url: 'https://www.sbb.ch/en/travelcards-and-tickets/tickets-for-switzerland/swiss-travel-pass.html', label: 'SBB Swiss Travel Pass' },
      },
      {
        label: '🚂 부부 6/24 ZRH 공항 → Luzern (Swiss Pass 시작 전, 점-점 티켓)',
        day: 'Day 13', date: '6/24 (수)', target: '👫 부부', count: '2명', route: 'ZRH 공항 → Luzern', time: '21시경 출발, ~1h10m', price: 'CHF 27/인 × 2 ≈ ~₩90K (SuperSaver)', status: 'pending',
        note: '⚠️ Saver 6일 패스 시작이 6/25라 6/24 저녁 1시간 이동만 점-점 결제. 현지 도착 후 SBB Mobile 앱에서 SuperSaver 잡기 (정상가 CHF 38, SuperSaver CHF 15-27)',
      },
      { label: '🚤 Caminha → A Guarda 페리 (Río Miño)', day: 'Day 6', date: '6/17 (수)', target: '👫 부부', count: '2명', route: 'Caminha → A Guarda', price: '~€2', status: 'pending', note: '오후 16-18시편 추천 (전날 횡단으로 결정) · 시간표 사전 확인 필수' },
      { label: '🚂 둘째 Cambridge → LHR T2', day: 'Day 12', date: '6/23 (화)', target: '🧑 둘째', count: '1명', route: 'Cambridge → LHR T2', time: '08:30 출발, ~2h', status: 'pending', note: 'LX333 13:50 출발 3h 전 도착 목표 (10:50 LHR) · King\'s Cross 50min + Piccadilly Line 60min' },
      { label: '🚂 ZRH → Lucerne (저녁)', day: 'Day 13', date: '6/24 (수)', target: '👫👨‍👩‍👦 3명', count: '3명', route: 'ZRH → Lucerne', time: '~1h', status: 'pending', note: 'Swiss Pass 포함' },
      { label: '🚂 ZRH → Lucerne (큰아들)', day: 'Day 14', date: '6/25 (목)', target: '🇰🇷 큰아들', count: '1명', route: 'ZRH → Lucerne', time: '17:25 도착 후 ~1h', status: 'pending' },
      { label: '🚂 Lucerne → Zermatt (산악 풍경 구간)', day: 'Day 15', date: '6/26 (금)', target: '👨‍👩‍👦‍👦 가족', count: '4명', route: 'Lucerne → Zermatt', time: '~3.5h', status: 'pending', note: 'Bern/Visp 환승' },
      { label: '🚂 Zermatt → Interlaken', day: 'Day 17', date: '6/28 (일)', target: '👨‍👩‍👦‍👦 가족', count: '4명', route: 'Zermatt → Interlaken', time: '~2h 20m', status: 'pending', note: 'Visp 환승' },
      { label: '🚂 Interlaken → ZRH 공항', day: 'Day 19', date: '6/30 (화)', target: '👨‍👩‍👦‍👦 가족', count: '4명', route: 'Interlaken → ZRH', time: '~2h (8:00 출발)', status: 'pending', note: '공항 직결 · LX332 12:05 출발 위해 9:30 ZRH 도착 → 체크인 2h 여유' },
      { label: '🚂 LHR → Cambridge', day: 'Day 19', date: '6/30 (화)', target: '👨‍👩‍👦‍👦 가족', count: '4명', route: 'LHR → Cambridge', time: '~2h', status: 'pending', note: 'King\'s Cross 경유 또는 National Express 직행 버스' },
      { label: '🚂 둘째 Cambridge → LGW 개트윅', day: 'Day 20', date: '7/1 (수)', target: '🧑 둘째', count: '1명', route: 'Cambridge → LGW', time: '~2.5h (오후 15-16시)', status: 'pending', note: 'JD484 21:10 탑승 3h 여유 · King\'s Cross + Thameslink 직행' },
      {
        label: '🚄 Eurostar London → Paris',
        day: 'Day 20', date: '7/1 (수)', target: '👨‍👩‍👦 3명', count: '3명', route: 'St Pancras → Gare du Nord', code: 'Eurostar Standard', time: '19:01 → 22:19 (2h 18m)', price: '₩626,439', status: 'completed',
        note: 'Coach 5 · €351 (€117×3)',
        booking: { platform: 'Eurostar 공식' },
      },
    ],
  },
  {
    title: '🏨 호텔·숙소 예약 (9건, 총 26박)',
    items: [
      {
        label: '🇵🇹 포르토 SANTA RITA Guesthouse B&B',
        day: 'Day 1-2', date: '6/12-13', target: '👫 부부', count: '2명 · 더블룸', price: '₩354,271 (€199)', status: 'completed',
        note: '✅ 부킹닷컴 예매 · Vila Nova de Gaia (강 건너편, 포트와인 셀러 옆) · 더블룸 전용 외부욕실 · 조식포함 · 발코니+정원 · ⚠️ 환불불가',
        booking: {
          address: 'R. Santa Rita 58, 4430-219 Vila Nova de Gaia, Portugal',
          contactName: 'CHOI CHULLYOUNG (게스트명)',
          platform: 'Booking.com',
          accessNote: '⚠️ Eurostar 22:55 OPO 도착 → Uber로 ~00:15 도착 예정. Booking.com에서 도착시간 "23:00 이후"로 사전 업데이트 필수',
        },
      },
      { label: '🌊 해안길 알베르게/펜션 4박', day: 'Day 3-6', date: '6/14-17', target: '👫 부부', count: '2명 · 더블룸', note: 'Vila do Conde · Esposende · Viana do Castelo · Caminha · 사립 펜션 권장', status: 'pending' },
      { label: '🌳 중앙길 알베르게/펜션 5박', day: 'Day 7-11', date: '6/18-22', target: '👫 부부', count: '2명 · 더블룸', note: 'Tui · Redondela · Pontevedra · Caldas de Reis · Padrón · 사립 펜션 권장', status: 'pending' },
      {
        label: '⭐ 산티아고 Libredón Rooms (자축)',
        day: 'Day 12', date: '6/23', target: '👫 부부', count: '2명', price: '₩241,113', status: 'completed',
        note: '✅ 부킹닷컴 예매 · Plaza de Fonseca 5 (대성당 광장!) · 수페리어 트윈룸 정원 전망 · 짐 보관 OK (포르토에서 캐리어 직송 가능)',
        booking: {
          address: 'Plaza de Fonseca, 5, 15705 Santiago de Compostela, Spain',
          checkInTime: '14:00-23:00',
          checkOutTime: '12:00까지',
          contactName: 'CHOI CHULLYOUNG (게스트명)',
          platform: 'Booking.com',
          accessNote: '카미노 완주일 정오 미사 → 14시 이후 체크인. 큰 짐 보관 요청 사전 이메일 (Porto → Santiago 캐리어 직송)',
        },
      },
      {
        label: '🇨🇭 루체른 Visionary Hospitality Rothenburg (Premium Apartment)',
        day: 'Day 13-14', date: '6/24-25', target: '👨‍👩‍👦 → 👨‍👩‍👦‍👦', count: '3명 → 4명 (D14 저녁부터) · 단독 아파트 (정원 6인)', price: '₩1,198,404 (2박, 무료 취소, Genius)', status: 'completed',
        note: '✅ 예매완료 · 단독 사용 아파트 · 발코니·산 전망·주방·세탁기·전용 입구 · 무료 주차 · ⚠️ 루체른역 8.6km (PostBus 60번 시내 ~15분, Swiss Travel Pass 무료)',
        booking: {
          contactName: 'CHOI CHULLYOUNG (게스트명)',
          checkInTime: '15:00~',
          checkOutTime: '~10:00',
          address: '38 Bertiswilstrasse, 6023 Rothenburg, Switzerland',
          platform: 'Booking.com',
          accessNote: '⚠️ 6/24 부부 22시 도착 → ZRH 짐 + 기차 1h → Lucerne 22시 → PostBus 60번 막차 23시 전에 잡기 (지연 시 Uber CHF 30-40)',
        },
      },
      {
        label: '🧑 둘째 단독 6/23 1박 — Capsule Hotel Lucerne Old Town',
        day: 'Day 12', date: '6/23', target: '🧑 둘째', count: '1명 · 캡슐룸', price: '₩182,214 (Genius 10%)', status: 'completed',
        note: '✅ 예매완료 · 캡슐룸 고층 · 시내 위치 (카펠교 도보권) · 고속 Wi-Fi · 공용 욕실',
        booking: {
          contactName: 'CHOI JEONGKYEOM (둘째)',
          checkInTime: '14:00~24:00',
          checkOutTime: '01:00~10:30',
          address: '33 Zürichstrasse, 6004 Lucerne, Switzerland',
          platform: 'Booking.com',
          accessNote: 'LX333 ZRH 16:35 도착 → 기차 1h → 18시경 도착 → 캡슐 체크인 후 카펠교 야경/비어가든 단독 산책. 다음날 PostBus로 Visionary (Rothenburg) 합류',
        },
      },
      {
        label: '⛰️ 체르마트 졸리몬트 아파트먼트 (Alpine Apartment)',
        day: 'Day 15-16', date: '6/26-27', target: '👨‍👩‍👦‍👦 가족', count: '4명 · 단독 아파트', price: '₩1,430,285 (2박, 무료 취소)', status: 'completed',
        note: '✅ 예매완료 · ★★★★ · 4인 단독 아파트 · 전용 욕실+발코니+산 전망 · 주방·세탁·DVD 풀옵션',
        booking: {
          ref: '6483632556',
          pin: '9112',
          phone: '+41 27 967 24 65',
          contactName: 'CHOI CHULLYOUNG (게스트명)',
          checkInTime: '14:00-18:30',
          checkOutTime: '07:00-09:00',
          address: 'Flecksteinweg 9, 3920 체르마트, 스위스',
          platform: 'Booking.com',
          accessNote: '체크인 18:30 마감 — 산티아고 출발 일정 지연 시 호스트 사전 연락 필수. 체르마트 차량 통제, 역에서 e-taxi 또는 도보 이동',
        },
      },
      {
        label: '🇨🇭 인터라켄 SWEET HOLIDAY HOME NO.1 (단독 아파트 + 테라스)',
        day: 'Day 17-18', date: '6/28-29', target: '👨‍👩‍👦‍👦 가족', count: '4명 · 단독 아파트 정원 5', price: '₩1,196,804 (2박, Genius 10% 할인, 무료 취소)', status: 'completed',
        note: '✅ 예매완료 · 중심부 (위치 점수 9.4) · 단독 아파트 + 테라스 + 전용 욕실 + 풀 주방',
        booking: {
          contactName: 'CHOI CHULLYOUNG (게스트명)',
          checkInTime: '17:00~21:30 ⚠️',
          checkOutTime: '07:00~10:00',
          address: '18 Rosenstrasse 1 floor, 3800 Interlaken, Switzerland',
          platform: 'Booking.com',
          accessNote: '⚠️ 체크인 21:30 마감 — Harder Kulm은 17시 이후 도착 후 빠르게 다녀와도 시간 빠듯. 또는 다음날 (Day 18 융프라우 후) 저녁 일정으로 조정 검토',
        },
      },
      {
        label: '🎓 캠브리지 Hyatt Centric — 디럭스 패밀리룸',
        day: 'Day 19', date: '6/30', target: '👨‍👩‍👦 부부+큰아들', count: '3명 (둘째 본인 학생 숙소)', price: '₩451,433 (1박)', status: 'completed',
        note: '✅ 예매완료 · 31㎡ · 초대형 더블+소파베드 · 정원 전망 · 무료 자전거·주차·피트니스 · 4성 · 평점 8.5 (2,817리뷰)',
        booking: {
          contactName: 'CHOI CHULLYOUNG (게스트명)',
          checkInTime: '15:00~',
          checkOutTime: '~12:00',
          address: '37 Eddington Avenue, Cambridge, CB3 1SE, 영국',
          platform: 'Booking.com',
          accessNote: '⚠️ Eddington 북서 신개발지구 (시내 5.6km) · 7/1 졸업식 Senate House까지 자전거 15분 / 우버 ~£10-15. 호텔 무료 자전거 활용 가능. 18세 이상만 투숙 가능.',
        },
      },
      {
        label: '🇫🇷 파리 Clichy 88m² 아파트 7박 (4 pièces grande terrasse)',
        day: 'Day 20-27', date: '7/1-7', target: '👨‍👩‍👦 가족', count: '3명 · 단독 아파트', price: '₩2,435,389 (€1,422.60, 환불X)', status: 'completed',
        note: '✅ 예매완료 · 88m² 침실 3+욕실 2+큰 테라스 · 7층 with elevator + 컨시어지 · 큰 창 녹지 view · Île de la Jatte 인상파 트레일 도보 25분 · 청소비 €80·도시세 ₩95,478 포함',
        booking: {
          ref: '6154757471',
          pin: '1904',
          phone: '+33 6 50 38 50 89',
          contactName: 'Be my Guest (체크인 안내 서비스) — 사전 도착 시간 통보 필수',
          checkInTime: '14:00-20:00',
          checkOutTime: '08:00-11:00',
          address: '23 Rue Gustave Eiffel, 92110 Clichy-la-Garenne, France',
          platform: 'Booking.com',
          accessNote: '⚠️ 체크인 마감 20:00, Eurostar 22:19 도착 → "Be my Guest"에 늦은 도착 사전 컨펌 필수. 호스트 직원이 직접 안내 (셀프 체크인 X)',
        },
      },
    ],
  },
  {
    title: '🛂 비자·서류·ETA·금융',
    items: [
      {
        label: '🇬🇧 UK ETA 신청 (모바일 앱 권장)',
        date: '6/11 (목)', target: '👫부부+큰아들', count: '3명', price: '£60 (£20×3)', status: 'pending',
        note: '⚠️ 둘째는 영국 거주 중이라 불필요 (3명만) · 보통 수 분~수 시간 승인, 최대 72h · 유효 2년 · 출국 전 완료 권장 (산티아고/스위스 도중 X)',
        link: { url: 'https://apply-for-an-eta.homeoffice.gov.uk/apply/electronic-travel-authorisation', label: 'GOV.UK ETA 공식 신청 (웹 백업용)' },
        instructions: [
          '📱 ① **공식 앱 다운로드 (권장)** — 발행처: UK Home Office, 아이콘: 영국 정부 문장. 가짜 앱 주의!',
          '   • iOS: apps.apple.com/us/app/uk-eta/id6444912481 (iOS 16+, iPhone 7 이상)',
          '   • Android: play.google.com/store/apps/details?id=uk.gov.HomeOffice.ho3 (Android 12+)',
          '   • 웹 백업: apply-for-an-eta.homeoffice.gov.uk (앱 안 될 때만)',
          '👤 ② 신청자 정보 입력 — 영문 이름·생년월일·국적·여권번호·여권 만료일. **여권과 정확히 일치** (한 글자 오타도 거부 사유)',
          '📸 ③ 여권 NFC 스캔 (앱 자동 인식, 여권 뒷면을 폰에 밀착) + 본인 셀카 (밝은 곳·정면·안경·모자 X)',
          '✉️ ④ 이메일 + 전화번호 입력 (승인 통지 받을 곳)',
          '❓ ⑤ 질문 답변: 형사처벌·테러·정치단체 가입 등 — 전부 No',
          '💳 ⑥ 결제 £20/인 (2026-04-08 인상). 3명이면 **3건 별도 신청+결제**. 결제는 Google Pay/Apple Pay/카드',
          '⏰ ⑦ 승인 대기 보통 수 분~수 시간, 길어도 72h. 이메일로 결과',
          '✅ ⑧ ETA는 여권에 전자 연동 — 출력 불필요 · 유효 2년 (~2028-06) · 거부 시 visa 신청 안내',
        ],
      },
      {
        label: '🇪🇺 EU Schengen 90일 무비자 (이번 여행 신청 불필요)',
        target: '👨‍👩‍👦‍👦 가족', count: '4명', status: 'completed',
        note: '✅ ETIAS는 2026 Q4(10-12월) 시행 예정 — 이번 여행(6/12-7/8)에 신청 불필요. 한국 여권으로 90일 무비자 입국 가능',
        link: { url: 'https://travel-europe.europa.eu/etias_en', label: 'EU ETIAS 공식 페이지 (출국 직전 재확인용)' },
        instructions: [
          '✅ ① **결론**: 이번 여행엔 ETIAS 신청 불필요. 시행 시점 2026 Q4(10-12월) 예정 — 여러 차례 연기됨',
          '📅 ② 출국 직전(6/11~12) 마지막 재확인 권장 — 위 링크 "When does ETIAS apply?" 섹션',
          '🛂 ③ 첫 Schengen 입국: 6/12 OPO(포르토) — 여기서 입국 도장. 이후 카미노·스위스·프랑스 자유 이동',
          '📋 ④ 입국 시 준비: 여권 + 왕복 항공권 + 호텔 예약 확인서(첫·끝) + 보험 증명 + 자금 증명(카드 명세서로 충분)',
          '🆕 ⑤ (참고) 시행 후 신청 시: €7/인, 만 18-70세, 온라인 10분, 유효 3년',
        ],
      },
      { label: '📕 여권 유효기간 6개월 이상 확인', target: '👨‍👩‍👦‍👦 가족', count: '4명', status: 'pending' },
      { label: '🛡️ 여행자 보험 가입', target: '👨‍👩‍👦‍👦 가족', count: '4명', note: '하이킹·산악·의료 커버 포함', status: 'pending' },
      { label: '🐚 순례자 크리덴셜 (Credencial del Peregrino)', date: '6/14 첫날', target: '👫 부부', count: '2명', note: '포르토 대성당에서 수령', status: 'pending' },
      { label: '🎓 캠브리지 졸업식 초청장·드레스코드 확인', date: '7/1', target: '👨‍👩‍👦‍👦 가족', count: '4명', note: '둘째와 통화하여 시간·복장 확인', status: 'pending' },
      { label: '🏢 회사 휴가 신청 (6/12 ~ 7/9)', date: '6/12 ~ 7/9', target: '👫 부부', note: '7/10 금 또는 7/13 월 출근 권장', status: 'pending' },
      { label: '💳 신용카드 해외 사용 가능 확인', target: '👨‍👩‍👦‍👦 가족', count: '2장 이상', note: '카드사 출국 알림 + 한도 확인', status: 'pending' },
      { label: '💵 환전·현금 준비', target: '👨‍👩‍👦‍👦 가족', price: '€500 + £150 + CHF 100', note: '또는 현지 ATM 인출 계획', status: 'pending' },
      { label: '📄 예약 확인서 출력/PDF 저장', note: '항공·호텔·기차·입장권 · 이메일 폴더 정리', status: 'pending' },
      { label: '📋 여권 사본 별도 보관 (클라우드 백업)', target: '👨‍👩‍👦‍👦 가족', count: '4명', note: '분실 대비', status: 'pending' },
    ],
  },
  {
    title: '🎫 관광 입장권·체험 사전 예매',
    items: [
      { label: '🍷 포르토 포트와인 셀러 투어', day: 'Day 2', date: '6/13', target: '👫 부부', count: '2인', note: 'Taylor\'s 또는 Graham\'s', status: 'pending' },
      { label: '🏔️ Mt. Pilatus Golden Round Trip', day: 'Day 14', date: '6/25', target: '👨‍👩‍👦‍👦 가족', count: '4인', price: 'CHF 78/인', note: 'Swiss Pass 50% 할인 · 큰아들 합류 다음 날', status: 'pending' },
      { label: '⛰️ Gornergrat 톱니바퀴열차', day: 'Day 16', date: '6/27', target: '👨‍👩‍👦‍👦 가족', count: '4인', price: 'CHF 132/인', note: '마테호른 클래식 뷰', status: 'pending' },
      { label: '⛰️ 융프라우요호 Top of Europe', day: 'Day 18', date: '6/29', target: '👨‍👩‍👦‍👦 가족', count: '4인', price: 'CHF 232/인', note: 'Swiss Pass 25% 할인 · ⭐ 사전 예매 필수', status: 'pending' },
      { label: '🚣 캠브리지 펀팅 보트', day: 'Day 19-20', date: '6/30 or 7/1', target: '👨‍👩‍👦‍👦 가족', count: '4인', status: 'pending' },
      { label: '🎨 오르세 미술관 (인상파 핵심)', day: 'Day 21', date: '7/2', target: '👨‍👩‍👦 가족', count: '3인', note: '오전 시간대 권장', status: 'pending' },
      { label: '🗼 에펠탑 (시간 지정)', day: 'Day 21', date: '7/2', target: '👨‍👩‍👦 가족', count: '3인', note: '오후 · 사전 예매 필수', status: 'pending' },
      { label: '👑 베르사유 궁전 (정원+트리아농)', day: 'Day 22', date: '7/3', target: '👨‍👩‍👦 가족', count: '3인', status: 'pending' },
      { label: '🖼️ 루브르 박물관 (시간 지정)', day: 'Day 23', date: '7/4', target: '👨‍👩‍👦 가족', count: '3인', note: '오전 · 사전 예매 필수', status: 'pending' },
      { label: '🌻 지베르니 모네의 정원', day: 'Day 24', date: '7/5', target: '👨‍👩‍👦 가족', count: '3인', note: '사전 예매 권장', status: 'pending' },
      { label: '🏰 Mont-Saint-Michel TGV+셔틀+입장권', day: 'Day 25', date: '7/6', target: '👨‍👩‍👦 가족', count: '3인', price: '~₩170K/인', note: '⭐ 사전 예매 강력 권장', status: 'pending' },
      { label: '🎨 l\'Orangerie (모네 수련)', day: 'Day 26', date: '7/7', target: '👨‍👩‍👦 가족', count: '3인', note: '오전', status: 'pending' },
      { label: '⛪ 사크레쾨르·생트샤펠·노트르담 외부', target: '👨‍👩‍👦 가족', count: '3인', note: '무료 입장 · 예매 불필요', status: 'pending' },
    ],
  },
  {
    title: '🥾 카미노 준비물 (부부 2명)',
    items: [
      { label: '🥾 등산화', target: '👫 부부', count: '× 2', note: '⚠️ 출국 D-14부터 길들이기 시작!', status: 'pending' },
      { label: '🎒 배낭 35-40L', target: '👫 부부', count: '× 2', note: 'Osprey Stratos / Deuter Aircontact 권장', status: 'pending' },
      { label: '💤 여름용 침낭 + 실크 라이너', target: '👫 부부', count: '× 2', note: '알베르게용', status: 'pending' },
      { label: '🦯 접이식 트레킹 스틱', target: '👫 부부', count: '4개 (양손)', note: '카본/알루미늄', status: 'pending' },
      { label: '☔ 레인커버 + 가벼운 판초', target: '👫 부부', count: '× 2', note: '갈리시아 비 자주 옴', status: 'pending' },
      { label: '💡 헤드랜턴 (USB 충전식)', target: '👫 부부', count: '× 2', note: '이른 새벽 출발용', status: 'pending' },
      { label: '💧 물통 1L', target: '👫 부부', count: '× 2', note: 'Hydro Flask / Nalgene', status: 'pending' },
      { label: '🦶 발 관리 키트', target: '👫 부부', count: '1세트', note: '바셀린·콤피드·압박붕대·발톱깎이·반창고', status: 'pending' },
      { label: '🎒 데이팩 작은 가방', target: '👫 부부', count: '× 2', note: '짐 운반 서비스 사용 시 도시락·생수용', status: 'pending' },
      { label: '📖 카미노 가이드북', target: '👫 부부', count: '1권', note: 'Brierley "Camino Portugués"', status: 'pending' },
      { label: '📦 캐리어 픽업 — TopSantiago', target: '👫 부부', count: '캐리어 × 2', price: '₩249,001', note: '✅ 예약 완료 · 카미노 구간별 캐리어 운반 (Porto → Santiago). 배송 상태는 아래 추적 링크에서 확인.', status: 'completed',
        link: { url: 'https://www.topsantiago.com/admin/', label: '📍 배송 상태 추적 (TopSantiago Admin)' },
        booking: { platform: 'TopSantiago', contactName: 'topsantiago.com' } },
      { label: '🧺 빨래용품', target: '👫 부부', count: '1세트', note: '작은 빨래판·여행용 세제·빨래 줄+집게', status: 'pending' },
      { label: '⛩️ 가리비 조개 부적 (카미노 상징)', target: '👫 부부', count: '× 2', note: '출국 전 또는 포르토에서 구매', status: 'pending' },
    ],
  },
  {
    title: '🇨🇭 스위스 알프스 준비물 (4명)',
    items: [
      { label: '🧥 따뜻한 옷·플리스', target: '👨‍👩‍👦‍👦 가족', count: '× 4', note: '산정 0-5°C까지 — 융프라우 3,454m', status: 'pending' },
      { label: '🧤 장갑 + 비니', target: '👨‍👩‍👦‍👦 가족', count: '× 4', note: 'Gornergrat 3,089m, 융프라우 산정', status: 'pending' },
      { label: '🕶️ 선글라스 (UV 100%)', target: '👨‍👩‍👦‍👦 가족', count: '× 4', note: '눈빛 반사 강함', status: 'pending' },
      { label: '☀️ 자외선 차단제 SPF50', target: '👨‍👩‍👦‍👦 가족', count: '1-2개', note: '고지대 자외선 ↑↑', status: 'pending' },
      { label: '🥾 가벼운 트레킹 슈즈/운동화', target: '👫 부부', count: '× 2', note: '카미노 등산화 무거움 — 별도 신발 권장', status: 'pending' },
      { label: '📱 Swiss Travel Pass 모바일 활성화', target: '👨‍👩‍👦‍👦 가족', count: '4명', note: '출국 전 또는 ZRH 공항 즉시', status: 'pending' },
      { label: '🧳 체르마트 차량 통행 금지 — 가벼운 캐리어', target: '👨‍👩‍👦‍👦 가족', note: '호텔 짐 픽업 서비스 확인', status: 'pending' },
      { label: '⚡ 스위스 J타입 어댑터', target: '👨‍👩‍👦‍👦 가족', count: '× 2', note: '⚠️ 영국 G타입·유럽 C타입과 다름!', status: 'pending' },
      { label: '📷 카메라 풀충전', target: '👨‍👩‍👦‍👦 가족', note: '마테호른·융프라우 인생샷', status: 'pending' },
      { label: '🌡️ 출발 당일 산정 기온 체크', note: 'SBB 앱', status: 'pending' },
    ],
  },
  {
    title: '👕 의류·일상',
    items: [
      { label: '👕 속건성 티셔츠 (메리노 양모 권장)', target: '인당', count: '3장', note: '냄새 ↓ · 빨래 부담 ↓', status: 'pending' },
      { label: '🩳 트레킹 반바지', target: '👫 부부', count: '인당 2벌', status: 'pending' },
      { label: '👖 긴 바지', target: '👨‍👩‍👦‍👦 가족', count: '인당 1벌', note: '저녁·도시·졸업식 외', status: 'pending' },
      { label: '🧥 경량 방풍 자켓', target: '👨‍👩‍👦‍👦 가족', count: '인당 1벌', note: 'UNIQLO/노스페이스', status: 'pending' },
      { label: '🩲 속옷 + 등산 양말', target: '인당', count: '속옷 3벌 + 양말 3켤레', status: 'pending' },
      { label: '🩴 슬리퍼·샌들', target: '인당', count: '1켤레', note: '저녁·샤워·휴식용', status: 'pending' },
      {
        label: '🎓 졸업식 정장 — 한국에서 챙겨가기 (영국 렌탈 ₩500~670K 절감)',
        date: '7/1', target: '👨‍👩‍👦‍👦 가족', count: '4명',
        note: '✅ 결정: 한국 출국 전 준비. 영국 렌탈은 사이즈·동선·비용 부담 → 한국에서 핏 확인하고 가져가는 게 안전 + ₩400K+ 절감. 학사가운(둘째)만 캠브리지 현지 대여 (Ede & Ravenscroft, ~£40, 사전 예약).',
        status: 'pending',
        instructions: [
          '👨 ① 아빠: 다크 네이비 또는 블랙 정장 1벌 + 흰 셔츠 + 단색 타이. 기존 보유 정장이면 드라이클리닝만 (~₩30-50K).',
          '👩 ② 엄마: 무릎길이 원피스 (네이비/그레이/플로럴) + 단정한 슈즈 + 페시네이터·모자 옵션. 캠브리지 졸업식은 dressy day wear 권장.',
          '🧑 ③ 큰아들(형): 다크 정장 + 셔츠 + 타이. 아빠와 톤 맞추면 가족사진 통일감 ↑.',
          '🧥 ④ 6월말~7월초 영국 평균 18-22°C — 자켓 무난. 비 대비 가벼운 우산 추가.',
          '🧳 ⑤ 패킹: garment bag(양복 가방) 사용 → 캐리어 안 구겨짐 최소화. 출국 전 다림질 + 비닐 커버.',
          '🏨 ⑥ 도착 즉시: 캠브리지 University Arms 호텔 옷걸이에 걸어두기. 객실 다리미 또는 호텔 컨시어지에 다림질 요청 가능.',
          '📸 ⑦ 출국 전 가족사진 미리 찍어두기 옵션 — 졸업식 당일 시간 부족할 수 있음.',
          '🎓 ⑧ 학사가운(둘째)만 캠브리지 현지 대여 — 둘째가 사전 예약 (Senate House 근처 Ede & Ravenscroft, 졸업식 1-2주 전 예약 권장).',
        ],
      },
      { label: '👗 파리·런던 외출복', target: '👨‍👩‍👦‍👦 가족', note: '6월말~7월초 평균 18-22°C', status: 'pending' },
      { label: '🧦 가벼운 카디건/스카프', target: '인당', count: '1개', note: '실내 냉방·야간 기차 대비', status: 'pending' },
      { label: '🎩 모자 + 선글라스', target: '인당', count: '1세트', note: '자외선 강함', status: 'pending' },
    ],
  },
  {
    title: '💊 세면·건강',
    items: [
      { label: '☀️ 선크림 SPF50', count: '1-2개', note: '스페인·스위스·프랑스 자외선 강함', status: 'pending' },
      { label: '🧴 세면도구 100ml 이하', note: '액체류 별도 비닐 1L (기내 반입 대비)', status: 'pending' },
      { label: '🏖️ 속건성 수건 (마이크로파이버)', count: '× 2-4', status: 'pending' },
      { label: '💊 상비약 키트', note: '진통제·소화제·지사제·항히스타민·연고·반창고·근육이완제', status: 'pending' },
      { label: '🦟 벌레퇴치 스프레이', note: '카미노 시골길 모기·진드기', status: 'pending' },
      { label: '🎧 귀마개 + 안대', note: '알베르게 다인실 + 장거리 비행 필수', status: 'pending' },
      { label: '🦶 발 마사지 크림·근육통 연고', target: '👫 부부', note: '매일 저녁 케어', status: 'pending' },
      { label: '🦠 손소독제 + 마스크', note: '장거리 비행·환승 시', status: 'pending' },
      { label: '💊 개인 처방약', note: '영문 처방전 동봉', status: 'pending' },
      { label: '👜 여성용품', note: '필요 시', status: 'pending' },
    ],
  },
  {
    title: '📱 전자기기·결제',
    items: [
      { label: '📱 스마트폰 + USB-C 충전기', target: '👨‍👩‍👦‍👦 가족', count: '× 4명', status: 'pending' },
      { label: '🔋 보조 배터리 20000mAh', count: '× 2', note: '긴 도보·기차 대비', status: 'pending' },
      { label: '🔌 유럽 C타입 어댑터', count: '× 4', note: '포·스·프 공통', status: 'pending' },
      { label: '🔌 영국 G타입 어댑터', count: '× 2', note: '런던·캠브리지', status: 'pending' },
      { label: '🔌 스위스 J타입 어댑터', count: '× 2', note: '⚠️ 스위스 전용 — C타입과 다름!', status: 'pending' },
      { label: '📡 eSIM 사전 구매', target: '👨‍👩‍👦‍👦 가족', count: '4명', note: '유럽(Airalo/Holafly) + UK + 스위스 (또는 글로벌 통합)', status: 'pending' },
      { label: '📷 카메라', count: '1대', note: '선택 (또는 휴대폰)', status: 'pending' },
      { label: '📓 카미노 도장북·메모장', target: '👫 부부', count: '1권', note: '크리덴셜 외 추가', status: 'pending' },
      { label: '📲 여행 앱 설치', note: 'Google Maps · Translate · Camino Ninja · SBB · Trainline · Booking.com · Eurostar · Citymapper', status: 'pending' },
      { label: '🔐 비밀번호 관리 (1Password 등)', note: '호텔/항공 예약 확인 시 필요', status: 'pending' },
      { label: '💾 사진 백업: Google Photos 자동 업로드', note: '출국 전 설정 확인', status: 'pending' },
    ],
  },
];
