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
  { code: 'LHR', name: '런던 히드로 공항', city: '런던', lat: 51.4700, lng: -0.4543, role: '🛫 둘째 LHR→ZRH 6/23 LX333 · 🛬 엄마+큰아들 6/30 LX332 (아빠+둘째는 결항으로 7/1 대체편)' },
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
    icon: '✈️', desc: '👫 부부만 먼저 출발 (큰아들 6/25 스위스 합류, 둘째 6/24 ZRH 합류). 🇩🇪 Lufthansa LH713 ICN 12:20 → FRA 18:40 (A350-900, 13h 20m) → 2h 25m 환승 → LH1180 FRA 21:05 → OPO 22:55 도착 (A321NEO, 총 18h 35m, Economy Basic Plus). ⚠️ 22:55 늦은 도착 → 🚖 Uber 호출 (OPO → Vila Nova de Gaia, 30-40분) → SANTA RITA Guesthouse 늦은 체크인 (~00:15-00:30). 호텔에 늦은 도착 사전 통보 + 휴식. 시내 관광·크리덴셜 수령은 Day 2로.',
    food: '기내식 (ICN-FRA: 다과+기내식, FRA-OPO: 다과)', stay: 'SANTA RITA Guesthouse B&B (Vila Nova de Gaia, 강 건너편 — 포트와인 셀러 옆) · 더블룸 조식포함 (2박)',
    lat: 41.1280, lng: -8.6080,
    transit: '✈️ ICN 12:20 → OPO 22:55 (18h 35m, LH713+LH1180 FRA 환승) → 🚖 Uber OPO→Vila Nova de Gaia 30-40분',
    restaurants: ['Cafe Santiago (프란세지냐 원조)', 'Cervejaria Brasão'],
    timeline: [
      { time: '12:20', emoji: '🛫', label: 'LH713 ICN 출발 (A350-900)', status: 'confirmed', detail: '👫 부부 · Economy Basic Plus · 좌석 30J·30K' },
      { time: '18:40', emoji: '🛬', label: 'FRA 도착 (13h 20m)', status: 'confirmed', detail: '환승 대기 2h 25m' },
      { time: '21:05', emoji: '🛫', label: 'LH1180 FRA 출발 (A321NEO)', status: 'confirmed', detail: '좌석 20E·20F' },
      { time: '22:55', emoji: '🛬', label: 'OPO 포르토 도착 (Schengen 첫 입국 · 도장 받기)', status: 'confirmed', detail: '입국·짐 ~30분 예상' },
      { time: '23:35', emoji: '🚖', label: 'OPO 공항 → Uber 호출 (Vila Nova de Gaia行)', status: 'pending', detail: 'Uber 또는 Bolt · 30-40분 · 한국에서 미리 앱 설치 + 카드 등록' },
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
    food: '🥾 부부: 타르타 데 산티아고, 풀포 아 페이라 · 🇨🇭 둘째: Lucerne 비어 가든', stay: '🥾 부부: ✅ Libredón Rooms / 🇨🇭 둘째: ✅ Capsule Hotel — Lucerne Old Town (33 Zürichstrasse) 캡슐룸 고층',
    lat: 42.8805, lng: -8.5457, dist: '24km',
    transit: '🥾 부부 Camino 24km · 🛬 둘째 Cambridge→LHR→ZRH→Lucerne',
    restaurants: ['O Curro da Parra', 'Abastos 2.0', 'Casa Marcelo'],
    timeline: [
      { time: '06:00', emoji: '🥾', label: '🥾 부부 Padrón → Santiago 출발 (24km 마지막 구간)', status: 'pending' },
      { time: '08:30', emoji: '🚂', label: '🧑 둘째 Cambridge 출발 → LHR T2 이동', status: 'pending' },
      { time: '12:00', emoji: '⛪', label: '🥾 부부 산티아고 도착 + 정오 순례자 미사 (Botafumeiro)', status: 'pending' },
      { time: '13:50', emoji: '🛫', label: '🧑 LX333 LHR T2 → ZRH 출발 (1h 45m)', status: 'confirmed', detail: 'Swiss · 개인물품만' },
      { time: '16:35', emoji: '🛬', label: '🧑 ZRH 도착', status: 'confirmed' },
      { time: '18:00', emoji: '🏨', label: '🧑 Capsule Hotel — Lucerne Old Town 체크인 (단독 1박)', status: 'confirmed', detail: '✅ 33 Zürichstrasse, 6004 Lucerne · 캡슐룸 고층 · Genius 10% 할인' },
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
      { time: '15:10', emoji: '🛫', label: '👫 VY1673 SCQ → BCN 출발', status: 'confirmed', detail: 'Vueling · ✅ 아빠 이름 정정 완료 (6/10)' },
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
    day: 16, date: '6/27 (토)', phase: 'swiss', title: '⛰️ 마테호른 — Gornergrat 새벽 + Riffelsee + 오후 5-호수길',
    icon: '⛰️',
    desc: '⭐ 새벽 07:00 첫차 후속 — Gornergrat 톱니바퀴 (STP 50% 할인 2등석) → 3,089m 정상 알펜글로우 마테호른 + 29개 4,000m 봉우리 + Gorner 빙하. Kulmhotel 3100 정상 카페 → Rotenboden 한 정거장 내려 Riffelsee 트레일 (왕복 1h, 마테호른 반영 인스타 명소 #1) → 11:30 Zermatt 하산. 오후 14시 Sunnegga 푸니쿨라 → Blauherd 케이블카 → 5-호수길 단축 (Stellisee·Grindjisee·Leisee, 2-2.5h). ⚠️ 12시 이후 산정 천둥 risk — 오전 집중, 오후 5-호수길은 천둥 신호 즉시 푸니쿨라 하산. 비 와도 천둥 X면 OK.',
    food: '🍙 김밥 (아파트 준비) — 새벽·점심 분할 · ☕ Kulmhotel 3100 정상 따뜻한 음료 · 🍽️ 마지막 체르마트 만찬 (Whymper-Stube 퐁듀 사전예약)',
    stay: '졸리몬트 아파트먼트 (Alpine Apartment, 마지막 1박)',
    lat: 45.9836, lng: 7.7855,
    transit: '🚂 Gornergrat Bahn 왕복 (07:00↗·11:15↘) + 🚠 Sunnegga 푸니쿨라+Blauherd 케이블카 (14:00↗·16:30↘)',
    restaurants: ['Kulmhotel 3100 (Gornergrat 산정 카페)', 'Whymper-Stube (퐁듀 ⭐)', 'Findlerhof', 'Schäferstube'],
    timeline: [
      { time: '05:30', emoji: '🛌', label: '기상 + 가벼운 스트레칭', status: 'confirmed', detail: '✅ 완료' },
      { time: '06:30', emoji: '🚶', label: '호텔 → Gornergrat Bahn 역', status: 'confirmed', detail: '✅ 완료' },
      { time: '07:00', emoji: '🚂', label: 'Gornergrat Bahn 4명 2등석 왕복 (STP 50% 할인)', status: 'confirmed', detail: '✅ 완료' },
      { time: '07:34-11:30', emoji: '🏔️', label: 'Gornergrat 정상 + Kulmhotel 3100 + Riffelsee 트레일 + 하산', status: 'confirmed', detail: '✅ 완료 — 알펜글로우 마테호른 + 29개 4,000m 봉우리 + Gorner 빙하 + Riffelsee 반영' },
      { time: '12:00-13:30', emoji: '🍽️', label: '체르마트 시내 가벼운 점심 + 카페 휴식', status: 'pending', detail: '저녁 든든하니 가볍게 · Bahnhofstrasse 카페' },
      { time: '13:30-14:00', emoji: '🛌', label: '호텔에서 짧은 휴식 + 배낭 정리 (옷·물·우비·SPF·김밥)', status: 'pending', detail: '천둥 ETA 한 번 더 확인 — Zermatt.ch 웹캠 + Bergfex' },
      { time: '14:00', emoji: '🚶', label: '호텔 → Matterhorn-Express 역 (Sunnegga 입구) 도보 ~10분', status: 'pending' },
      { time: '14:15', emoji: '🎫', label: 'Sunnegga+Blauherd 왕복 콤보 4명 구매 (STP 50%)', status: 'pending', detail: '⚠️ Pay in CHF (DCC USD 거절)' },
      { time: '14:20', emoji: '🚠', label: 'Sunnegga 푸니쿨라 (1,608 → 2,288m, ~3분)', status: 'pending' },
      { time: '14:30', emoji: '🚠', label: 'Sunnegga → Blauherd 케이블카 (2,288 → 2,571m, ~5분) = 5-호수길 들머리', status: 'pending' },
      { time: '14:40', emoji: '🥾', label: 'Blauherd → Stellisee 도보 (~20분, 평탄)', status: 'pending', detail: '노란 등산 표지 "5-Seenweg" 따라가기' },
      { time: '15:00-15:45', emoji: '⭐', label: 'Stellisee (2,537m) — 마테호른 반영 인스타 #2 + 김밥 휴식', status: 'pending', detail: '호수 한 바퀴 + 사진 + 점심 마무리. 바람 잠잠하면 거울 반영' },
      { time: '15:45-16:15', emoji: '🥾', label: 'Stellisee → Grindjisee (~30분, 약간 내리막)', status: 'pending', detail: '숲속 작은 호수, 분위기 ↑' },
      { time: '16:15-16:45', emoji: '🥾', label: 'Grindjisee → Leisee (~30분)', status: 'pending' },
      { time: '16:45-17:00', emoji: '⭐', label: 'Leisee (2,232m) — 잔디·벤치, 가족 사진 + 마테호른 정면 뷰', status: 'pending', detail: '발 담그기 가능 (물 차가움 주의)' },
      { time: '17:00-17:15', emoji: '🥾', label: 'Leisee → Sunnegga 도보 (~10분)', status: 'pending' },
      { time: '17:15', emoji: '🚠', label: 'Sunnegga → Zermatt 푸니쿨라 하산 (~3분, 도보 X)', status: 'pending', detail: '⚠️ Sunnegga→Zermatt는 푸니쿨라 필수 (수직 680m, 도보 1.5-2h 무리)' },
      { time: '17:30-19:00', emoji: '🏨', label: '호텔 휴식 — 샤워, 짐 정리 (내일 인터라켄 이동 대비)', status: 'pending', detail: '내일 6/28 10:27 Zermatt → 12:53 Interlaken Ost 기차' },
      { time: '19:00-21:00', emoji: '🍽️', label: '⭐ 마지막 체르마트 만찬 — Whymper-Stube (퐁듀 4인 사전예약)', status: 'pending', detail: 'Whymper-Stube = 마테호른 초등정자 이름의 전통 레스토랑 · 또는 Findlerhof' },
      { time: '21:30', emoji: '🛌', label: '일찍 취침', status: 'pending', detail: '6/29 융프라우 06:30 기상 → 08:04 Interlaken Ost 출발' },
    ],
  },
  {
    day: 17, date: '6/28 (일)', phase: 'swiss', title: '🚂 체르마트 → 인터라켄 + 🚢 Brienz 호수 + 🌅 Harder Kulm 만찬',
    icon: '🚂', desc: '오전 10:27 Zermatt 출발 → 12:53 Interlaken Ost 도착 (Visp 환승, ~2h 26m). 호텔 짐 보관 후 늦은 점심. 오후 ⭐ Brienz 호수 보트 크루즈 (STP 무료, 에메랄드 호수 + Iseltwald 사랑의 불시착 촬영지). 저녁 ⭐ Harder Kulm 푸니쿨라 → Panorama 레스토랑 만찬 (삼봉 + 두 호수 일몰 뷰).',
    food: '인터라켄 시내 점심 · ⭐ Harder Kulm Panorama 만찬', stay: '✅ SWEET HOLIDAY HOME NO.1 (18 Rosenstrasse, 단독 아파트 + 테라스)',
    lat: 46.6863, lng: 7.8632,
    transit: '🚂 Zermatt 10:27 → Interlaken Ost 12:53 (~2h 26m, Visp 환승)',
    restaurants: ['⭐ Harder Kulm Panorama Restaurant', 'Restaurant Schuh (인터라켄 점심)'],
    timeline: [
      { time: '08:00', emoji: '🛌', label: '기상 + 아파트 정리', status: 'pending' },
      { time: '08:30-09:30', emoji: '🍳', label: '아파트 아침 — 잔여 식자재 정리', status: 'pending', detail: '빵·치즈·과일·차/커피 · 김밥 잔여분 데이팩에' },
      { time: '09:30-10:00', emoji: '🧳', label: '짐 패킹 + 체크아웃', status: 'pending', detail: 'Flecksteinweg 9 → Zermatt 역 도보 ~10-15분' },
      { time: '10:00', emoji: '🚉', label: 'Zermatt 역 도착 (출발 27분 전 여유)', status: 'pending' },
      { time: '10:27', emoji: '🚂', label: '🚂 Zermatt 출발 → Visp 환승', status: 'pending', detail: 'STP 무료 · 좌석 자유석 · 진행방향 우측에 앉으면 협곡 뷰' },
      { time: '12:53', emoji: '🚉', label: '🚉 Interlaken Ost 도착', status: 'pending', detail: 'Visp/Spiez 경유 ~2h 26m' },
      { time: '13:00-13:20', emoji: '🚶', label: 'Ost역 → 호텔 도보 (~15-20분)', status: 'pending', detail: 'Rosenstrasse 18, SWEET HOLIDAY HOME NO.1' },
      { time: '13:20-13:40', emoji: '🎒', label: '호텔 짐 보관 (체크인 17시 전)', status: 'pending', detail: '⚠️ 호스트에 사전 메시지 필수: "13시 도착, 짐 보관 가능?"' },
      { time: '13:45-14:30', emoji: '🍽️', label: '인터라켄 시내 늦은 점심', status: 'pending', detail: 'Höhematte 잔디밭 옆 카페 · Restaurant Schuh (전통 스위스) · Migros 푸드코트' },
      { time: '14:30', emoji: '🚶', label: '시내 → Interlaken Ost 옆 선착장 도보', status: 'pending', detail: 'BLS Brienzersee Schifffahrt · STP 무료' },
      { time: '14:45-15:55', emoji: '🚢', label: '⭐ Brienz 호수 보트 — Interlaken Ost → Iseltwald', status: 'pending', detail: 'STP 무료 · 1h 10m · 에메랄드 빙하 호수 + 알프스 뷰 · 우측 갑판 추천' },
      { time: '15:55-16:30', emoji: '🏞️', label: 'Iseltwald 산책 — ⭐ "사랑의 불시착" 촬영지', status: 'pending', detail: '작은 어촌 마을 · 잔교 + 호수 사진 · 카페 한 잔' },
      { time: '16:30', emoji: '🚂', label: 'Iseltwald → Interlaken Ost 복귀 (보트 또는 버스 #103)', status: 'pending', detail: '버스 STP 무료 · ~30분' },
      { time: '17:00-17:45', emoji: '🏨', label: '🏨 호텔 정식 체크인 + 옷 갈아입기', status: 'pending', detail: '체크인 17-21:30 · 테라스·풀 주방 확인 · 만찬용 가벼운 정장' },
      { time: '17:50', emoji: '🚶', label: '호텔 → Harderbahn 하부역 도보 (Ost 옆, ~10분)', status: 'pending' },
      { time: '18:00', emoji: '🚠', label: '🚠 Harderbahn 푸니쿨라 탑승 (8분, 1,322m)', status: 'pending', detail: 'STP 50% 할인 · 30분 간격 운행' },
      { time: '18:10-21:00', emoji: '🍽️', label: '⭐ Harder Kulm Panorama 레스토랑 만찬', status: 'pending', detail: '⚠️ 사전 예약 권장 (4명, 창가) · 삼봉(융프라우·묀히·아이거) + Brienz·Thun 두 호수 뷰 · 일몰 ~21:30' },
      { time: '21:10', emoji: '🚠', label: 'Harder Kulm 푸니쿨라 하산', status: 'pending', detail: '⚠️ 막차 시간 jungfrau.ch에서 출발 전 재확인 (여름 시즌 보통 ~21:40)' },
      { time: '21:30-22:00', emoji: '🏨', label: '호텔 복귀', status: 'pending' },
      { time: '21:30', emoji: '🛒', label: '🛒 ⚠️ 우비/판초 + 비닐백 구매 (Interlaken Migros·Coop)', status: 'pending', detail: '⚠️ 6/29 우천 100% 예보 (11-20mm + 천둥번개) · 4명분 1회용 판초 또는 재사용 우비 · 큰 비닐백 4-5장 (카메라·폰·여권·티켓 PDF 보호용) · Migros/Coop 22시 폐점 전' },
      { time: '22:00', emoji: '🎒', label: '🎒 6/29 융프라우 데이팩 최종 점검 (우천 대비)', status: 'pending', detail: '⚠️ 우천 대비 필수: 방수자켓·우비·비닐백·방수 신발·여분 양말 · 공통: 메리노+플리스+비니+장갑+선글라스+SPF50 · e-ticket 4장 + 캡처 백업 · 두통약·물·초콜릿 · 05:00 기상 (웹캠 체크)' },
      { time: '22:30', emoji: '🛌', label: '일찍 취침', status: 'pending', detail: '내일 06:30 기상 → 08:04 Interlaken Ost 출발' },
    ],
  },
  {
    day: 18, date: '6/29 (월)', phase: 'swiss', title: '⛰️ 융프라우요호 ✅ (☀️/🌧️ 2개 버전 — 우천 예보 100%)',
    icon: '⛰️', desc: '⭐ ✅ 예매완료 (4명, STP 2nd class) · 08:04 Ost → 09:45 융프라우 · 산정 체류 4h (09:45-13:45) · 13:45 출발 → 14:51 Ost 복귀. ⚠️ 6/29 우천·천둥번개 예보 (강수확률 100%, 11-20mm, 9°C) → GO 결정 (실내 위주 대안). 산정 2가지 버전: ☀️ 맑음 시 = Sphinx 짧게 → ⭐ Mönchsjoch Hütte 빙하 트레킹 (3,650m, 1.7km×2) → Bollywood → Lindt → Plateau·Snow Fun 사진. 🌧️ 우천 시 = Sphinx 길게 → ⭐ Ice Palace → Alpine Sensation 멀티미디어 → Bollywood (천천히) → Lindt → Snow Fun 짧게. 오후 Lauterbrunnen 폭포 골짜기 (비 와도 OK, 방수 차림). 저녁 인터라켄 만찬 + 6/30 영국 짐 정리. ⚠️ 우비·방수 신발·비닐백 챙기기.',
    food: '⭐ Bollywood 융프라우 산정 카레 점심 · 인터라켄 만찬', stay: '✅ SWEET HOLIDAY HOME NO.1 (단독 아파트)',
    lat: 46.5470, lng: 7.9854,
    transit: '🚂 Ost 08:04 → 융프라우 09:45 → 14:51 Ost 복귀 · 오후 🚂 Lauterbrunnen 30분',
    restaurants: ['⭐ Bollywood (Top of Europe 카레)', 'Restaurant Airtime (인터라켄)', 'Hotel Restaurant Bären'],
    timeline: [
      // ===== 오전 — 융프라우 이동 (CEST) =====
      { time: '05:00', emoji: '📱', label: '📱 ⭐ jungfrau.ch 정상 웹캠 + MeteoSwiss 체크 (☀️/🌧️ 결정)', status: 'pending', detail: '⚠️ jungfrau.ch/en-gb/live/webcams · 비/구름 시 🌧️ 우천 버전 · 맑으면 ☀️ 트레킹 버전' },
      { time: '06:30', emoji: '🛌', label: '🛌 기상 + 스트레칭', status: 'pending', detail: '정상 9°C 예보, 우천 시 비·천둥번개 가능' },
      { time: '06:45', emoji: '🍳', label: '아파트 가벼운 아침', status: 'pending', detail: '김밥 잔여 / 빵·치즈 / 차·커피' },
      { time: '07:15', emoji: '🎒', label: '🎒 짐 분리 — 데이팩만 (캐리어는 호텔)', status: 'pending', detail: '6/30 영국행 캐리어는 그대로 보관 · 데이팩: 우비·비닐백·물·초콜릿·SPF·선글라스·약·e-ticket' },
      { time: '07:30', emoji: '🧥', label: '🧥 ⚠️ 우천 양파 옷 — 메리노+플리스+⭐방수자켓(필수)+우비/판초+비니·장갑', status: 'pending', detail: '⚠️ 우천 100% 예보 · 방수자켓 hood + 우비 백업 · 면 옷 금지 (젖으면 추움) · 방수 신발 + 여분 양말 · 비닐백에 카메라·폰·여권' },
      { time: '07:45', emoji: '🚶', label: '호텔(Rosenstrasse 18) → Interlaken Ost 역 도보 (~15-20분)', status: 'pending' },
      { time: '07:55', emoji: '🎫', label: '🎫 게이트 도착 — 10분 전 필수!', status: 'pending', detail: '⚠️ "with seat reservation" 파란 표지판 따라가기' },
      { time: '08:04', emoji: '🚂', label: '🚂 Interlaken Ost → Grindelwald Terminal', status: 'confirmed', detail: '✅ ~30분 일반 산악열차' },
      { time: '08:43', emoji: '🚠', label: '🚠 Grindelwald Terminal → Eigergletscher (Eiger Express 3S 곤돌라) ⭐', status: 'confirmed', detail: '~15분 · 아이거 북벽 정면 뷰' },
      { time: '09:13', emoji: '🚂', label: '🚂 Eigergletscher → 융프라우요호 (좌석예약)', status: 'confirmed', detail: '톱니바퀴 터널 ~30분' },
      { time: '09:45', emoji: '🏔️', label: '🏔️ 융프라우요호 도착 — Top of Europe 3,454m ⭐', status: 'confirmed', detail: '유럽 最高 기차역' },

      // ===== 정상 체류 4h (09:45-13:45) — ☀️ 맑음 / 🌧️ 우천 2개 버전 =====
      // ⚠️ 새벽 05:00 jungfrau.ch 정상 웹캠 확인 후 ☀️/🌧️ 결정
      { time: '09:45-10:00', emoji: '⏸️', label: '⏸️ 고도 적응 + 화장실 + 장비 점검 (공통)', status: 'pending', detail: '⛅ 공통 · 천천히 호흡 · 어지러우면 야외 활동 포기 · 우천 시 방수자켓 hood 점검 · 카메라 비닐백 보호' },

      // ☀️ ─── 맑음 버전 (Sphinx 짧게 + Mönchsjoch Hütte 트레킹) ───
      { time: '☀️ 10:00-10:20', emoji: '🔭', label: '☀️ Sphinx 전망대 (3,571m) — 빠르게', status: 'pending', detail: '☀️ 맑음 시 · 엘리베이터 30초 · ⭐ Aletsch 빙하 + 융프라우·묀히·아이거 360° · 사진 위주 (산장 트레킹이 메인이라 짧게)' },
      { time: '☀️ 10:20-10:30', emoji: '🥾', label: '☀️ 본관 동쪽 출구 → 빙하 트레일 입구', status: 'pending', detail: '☀️ 맑음 시 · "Mönchsjochhütte" 표지판 따라 · 등산화 끈 단단히 · 트레킹 폴 (있으면) 장착' },
      { time: '☀️ 10:30-11:00', emoji: '🥾', label: '☀️ ⭐ Mönchsjoch Hütte 트레킹 (편도 1.7km, +130m)', status: 'pending', detail: '☀️ 맑음 시 · 🚩 빨간 깃발 루트 따라 만년설 평탄 트레일 · 카미노 페이스 ~30분 · 양옆 융프라우·묀히 절벽 · 천천히 호흡, 깃발 절대 벗어나지 말 것 (크레바스 위험)' },
      { time: '☀️ 11:00-11:25', emoji: '🏠', label: '☀️ ⭐ Mönchsjoch Hütte 도착 (3,650m, 알프스 最高 산장)', status: 'pending', detail: '☀️ 맑음 시 · 따뜻한 음료 (핫초콜릿/차) · 산장 인증샷 · ⭐ Aletsch 빙하 上 뷰 (산악인 多)' },
      { time: '☀️ 11:25-11:55', emoji: '🥾', label: '☀️ 복귀 트레킹 → 융프라우요호', status: 'pending', detail: '☀️ 맑음 시 · 약간 내리막 · ~30분 · 다리 풀린 느낌 주의' },

      // 🌧️ ─── 우천 버전 (Sphinx 길게 + Ice Palace + Alpine Sensation) ───
      { time: '🌧️ 10:00-10:45', emoji: '🔭', label: '🌧️ Sphinx 전망대 — 실내 위주 길게', status: 'pending', detail: '🌧️ 우천 시 · 실내 전망실 위주 (야외 데크는 잠깐) · 운 좋으면 구름 사이로 Aletsch 빙하 일부 보일 수 있음 · 방수자켓 hood 착용' },
      { time: '🌧️ 10:45-11:30', emoji: '🧊', label: '🌧️ ⭐ Ice Palace (얼음 궁전) — 트레킹 대체', status: 'pending', detail: '🌧️ 우천 시 · 빙하 내부 동굴 사진 명소 · 진짜 빙하 트레킹 못 가는 대신 인공 빙하 동굴 체험 · 얼음 조각상 + 미끄러움 주의' },
      { time: '🌧️ 11:30-12:15', emoji: '🎬', label: '🌧️ ⭐ Alpine Sensation 멀티미디어 전시', status: 'pending', detail: '🌧️ 우천 시 · 융프라우 100주년 역사·과학·예술 전시 (실내 통로 따뜻함) · 멀티미디어 영상·조각·인물 ·  비 올 때 가장 좋은 대체 활동' },

      // ─── 점심·기념품 (날씨 따라 시간만 다름) ───
      { time: '☀️ 11:55-12:50', emoji: '🍽️', label: '☀️ Bollywood 인도 카레 점심', status: 'pending', detail: '☀️ 맑음 시 · 트레킹 후 보상 · 따뜻한 카레로 체온 회복' },
      { time: '🌧️ 12:15-13:15', emoji: '🍽️', label: '🌧️ Bollywood 인도 카레 점심 (천천히)', status: 'pending', detail: '🌧️ 우천 시 · 비 잠시 피하며 따뜻하게 60분 · 알프스 最高 高 카레' },
      { time: '☀️ 12:50-13:10', emoji: '🍫', label: '☀️ Lindt Swiss Chocolate Heaven', status: 'pending', detail: '☀️ 맑음 시 · "Top of Europe" 한정판 박스 · ⚠️ Pay in CHF (DCC USD 거절)' },
      { time: '🌧️ 13:15-13:30', emoji: '🍫', label: '🌧️ Lindt + Snow Fun 짧게', status: 'pending', detail: '🌧️ 우천 시 · Lindt 시식 + Snow Fun 지붕 있는 부분만 사진 · Pay in CHF' },
      { time: '☀️ 13:10-13:30', emoji: '🏔️', label: '☀️ Plateau + Snow Fun 가족 사진 (마무리)', status: 'pending', detail: '☀️ 맑음 시 · 융프라우 깃발 옆 가족 사진 + Snow Fun 만년설 사진 ⭐' },

      { time: '13:35', emoji: '🎫', label: '게이트 도착 (좌석예약 10분 전) (공통)', status: 'pending', detail: '⛅ 공통 · "with seat reservation" 파란 표지 · 4명 모이기' },

      // ===== 복귀 =====
      { time: '13:45', emoji: '🚂', label: '🚂 융프라우 → Eigergletscher 출발', status: 'confirmed' },
      { time: '14:20', emoji: '🚠', label: '🚠 Eigergletscher → Grindelwald Terminal (Eiger Express)', status: 'confirmed' },
      { time: '14:51', emoji: '🚉', label: '🏠 Interlaken Ost 복귀', status: 'confirmed' },

      // ===== 오후 자유시간 — Lauterbrunnen 폭포 골짜기 ⭐ =====
      { time: '15:00-15:30', emoji: '🏨', label: '🏨 호텔 잠시 들러 옷 갈아입기 (공통)', status: 'pending', detail: '⛅ 공통 · 우천 시 우비/판초 챙기기 + 방수 신발 · 6/30 영국 짐 정리 시작' },
      { time: '15:35', emoji: '🚶', label: '호텔 → Interlaken Ost 역 도보 (공통)', status: 'pending', detail: '⛅ 공통 · ~15분' },
      { time: '15:51', emoji: '🚂', label: '🚂 Interlaken Ost → Lauterbrunnen (BOB) (공통)', status: 'pending', detail: '⛅ 공통 · STP 무료 · ~22분' },
      { time: '16:13', emoji: '🚉', label: 'Lauterbrunnen 도착 (공통)', status: 'pending', detail: '⛅ 공통 · 정문 나오면 마을 메인 거리 (Hauptstrasse)' },

      // ☀️ ─── 맑음 버전 Lauterbrunnen (Staubbach + 폭포 뒤편 동굴 + 마을 산책) ───
      { time: '☀️ 16:15-17:00', emoji: '🥾', label: '☀️ ⭐ Staubbach Falls 정면 + 폭포 뒤편 동굴', status: 'pending', detail: '☀️ 맑음 시 · 메인 거리 따라 297m 폭포 정면 사진 → 오른쪽 산기슭 계단 → ⭐ 폭포 뒤편 동굴 산책 (약간 가파름)' },
      { time: '☀️ 17:00-17:30', emoji: '☕', label: '☀️ 카페 한 잔 + 마을 마무리', status: 'pending', detail: '☀️ 맑음 시 · Hotel Restaurant Oberland 또는 노천 카페 · 사진 마무리' },
      { time: '☀️ 17:35', emoji: '🚂', label: '☀️ Lauterbrunnen → Interlaken Ost 복귀', status: 'pending', detail: '☀️ 맑음 시 · STP 무료 · 17:57 Ost 도착' },

      // 🌧️ ─── 우천 버전 Lauterbrunnen (Staubbach 짧게 + Trümmelbach 실내) ───
      { time: '🌧️ 16:13-16:30', emoji: '📸', label: '🌧️ Staubbach Falls 정면 사진 (짧게, 우비)', status: 'pending', detail: '🌧️ 우천 시 · 마을 메인 거리에서 정면 사진만 · ⚠️ 절벽 동굴 산책 SKIP (미끄러움 + 천둥번개 위험)' },
      { time: '🌧️ 16:30-16:42', emoji: '🚌', label: '🌧️ 버스 #141 → Trümmelbach Falls', status: 'pending', detail: '🌧️ 우천 시 · STP 무료 · ~10분 · Lauterbrunnen 메인 정류장 (역 옆) 탑승' },
      { time: '🌧️ 16:42-17:30', emoji: '🏔️', label: '🌧️ ⭐ Trümmelbach Falls — 산 내부 빙하 폭포 (100% 실내!)', status: 'pending', detail: '🌧️ 우천 시 · ⚠️ Pay in CHF (DCC 거절) · 엘리베이터 + 터널 + 10단 폭포 · 빙하수 초당 20,000L · ⚠️ 마지막 입장 17:30 엄수' },
      { time: '🌧️ 17:35-17:50', emoji: '🚌', label: '🌧️ 버스 #141 → Lauterbrunnen 마을 복귀', status: 'pending', detail: '🌧️ 우천 시 · ~10분 · STP 무료' },
      { time: '🌧️ 17:50-18:00', emoji: '☕', label: '🌧️ 마을 카페 한 잔 (몸 데우기)', status: 'pending', detail: '🌧️ 우천 시 · Hotel Restaurant Oberland 또는 Airtime Café · 따뜻한 음료 + 우비 정리' },
      { time: '🌧️ 18:05', emoji: '🚂', label: '🌧️ Lauterbrunnen → Interlaken Ost 복귀', status: 'pending', detail: '🌧️ 우천 시 · STP 무료 · 18:27 Ost 도착' },

      { time: '18:00-18:30', emoji: '🚿', label: '호텔 — 샤워 + 옷 정돈 (공통)', status: 'pending', detail: '⛅ 공통 · ☀️ 맑음 18:15부터 / 🌧️ 우천 18:45부터 (30분 늦음) · 만찬은 30분 늦춰서 19:00 또는 19:30' },

      // ===== 저녁 =====
      { time: '18:30-20:30', emoji: '🍽️', label: '🍽️ 인터라켄 만찬', status: 'pending', detail: 'Restaurant Airtime / Hotel Restaurant Bären / 시내 비스트로 · 알프스 만찬 마지막 밤' },
      { time: '21:00-21:30', emoji: '🧳', label: '🧳 영국 캐리어 최종 정리', status: 'pending', detail: '내일 6/30 ZRH 12:05 LX332 → LHR · 위탁 23kg+휴대 8kg/인 · UK ETA 3명 승인 메일 폰 캡처 확인' },
      { time: '21:30', emoji: '🛌', label: '취침', status: 'pending', detail: '내일 영국 이동일 · ⭐ 06:00 기상 (07:00 체크아웃 → 07:30 기차) — 12:05 국제선 대비 2h 15분 버퍼' },
    ],
  },

  // ===== UK CAMBRIDGE (Day 19-20) =====
  {
    day: 19, date: '6/30 (화)', phase: 'london', title: '🛫 스위스 → 영국 (엄마+큰아들) ⚠️ 아빠+둘째 비행기 놓침 → 스위스 1박 추가',
    icon: '🛫', desc: '⚠️ 실제 — ZRH 공항에서 아빠+둘째 LX332 탑승 실패 (비행기 놓침) → 재예약한 대체편마저 결항 → 아빠+둘째 스위스 1박 추가. 엄마+큰아들만 LX332 12:05 ZRH → LHR 13:00 → 캠브리지 이동, Hyatt Centric 체크인.',
    food: '취리히 공항 점심', stay: '엄마+큰아들: ✅ Hyatt Centric Cambridge · 아빠+둘째: 취리히 (예정 외 1박)',
    lat: 52.2053, lng: 0.1218,
    transit: '🚂 Interlaken 07:30 → ZRH 공항 · ✈️ LX332 엄마+큰아들만 탑승 · ⚠️ 아빠+둘째 스위스 잔류',
    restaurants: ['The Eagle (캠브리지 역사적 펍)'],
    timeline: [
      { time: '07:30', emoji: '🚂', label: 'Interlaken Ost → Zurich Flughafen (직행 IC)', status: 'confirmed', detail: '✅ 완료 · 4명 함께 공항 도착' },
      { time: '12:05', emoji: '🛫', label: '✈️ LX332 ZRH → LHR — 엄마+큰아들만 탑승', status: 'confirmed', detail: '⚠️ 아빠+둘째 비행기 놓침 · 엄마+큰아들 2명만 출발' },
      { time: '오후', emoji: '⚠️', label: '아빠+둘째 대체편 재예약 → 결항', status: 'confirmed', detail: '⚠️ 재예약편 결항으로 당일 출발 불가 확정 → 스위스 1박 추가' },
      { time: '13:00', emoji: '🛬', label: '엄마+큰아들 LHR T2 도착 → 캠브리지 이동 (~2.5h)', status: 'confirmed' },
      { time: '저녁', emoji: '🏨', label: '엄마+큰아들 Hyatt Centric Cambridge 체크인 · 아빠+둘째 취리히 숙박', status: 'confirmed', detail: '아빠+둘째 다음날 대체편으로 이동' },
    ],
  },
  {
    day: 20, date: '7/1 (수)', phase: 'london', title: '🚄 가족 분리 + 파리 이동 (아빠+둘째 스위스 출발 · 둘째 귀국 / 3명 파리 재집결)',
    icon: '🚄', desc: '⚠️ 실제 — 아빠+둘째 스위스에서 대체편으로 런던 이동. 둘째: LGW → JD484 21:10 → 칭다오 → 7/2 ICN 21:35 (QW901). 엄마+큰아들 캠브리지 → London King\'s Cross → St Pancras에서 아빠 합류 → 3명 🚄 Eurostar 저녁편 → 파리 Gare du Nord 도착.',
    food: 'Eurostar 스낵 · 파리 도착 후 늦은 저녁', stay: '✅ Hôtel Sanso by HappyCulture (7/1 1박 arrival) · Grande Bibliothèque 지역',
    lat: 52.2068, lng: 0.1181,
    transit: '🛫 아빠+둘째 스위스 → 런던 (대체편) · 둘째 ✈️ LGW→칭다오→ICN · 3명 🚄 Eurostar →Paris',
    restaurants: ['Bistrot Paul Bert (파리)', 'Le Comptoir du Relais'],
    timeline: [
      { time: '오전', emoji: '🛫', label: '아빠+둘째 스위스 → 런던 이동 (대체편)', status: 'confirmed', detail: '⚠️ 6/30 결항 여파 · 하루 늦게 출발' },
      { time: '오후', emoji: '🚂', label: '엄마+큰아들 Cambridge → London King\'s Cross (50min)', status: 'confirmed' },
      { time: '16:30', emoji: '🔀', label: 'St Pancras — 가족 합류 + 둘째 작별', status: 'confirmed' },
      { time: '17:00', emoji: '🚂', label: '🧑 둘째 Thameslink St Pancras → LGW (~45min)', status: 'confirmed' },
      { time: '19:01', emoji: '🚄', label: '👨‍👩‍👦 3명 Eurostar St Pancras → Paris', status: 'confirmed', detail: 'Eurostar Standard · Coach 5 · 2h 18m' },
      { time: '21:10', emoji: '🛫', label: '🧑 JD484 LGW → 칭다오 출발', status: 'confirmed', detail: '베이징캐피탈 · 칭다오 4h 10m 환승' },
      { time: '22:19', emoji: '🛬', label: '👨‍👩‍👦 3명 Paris Gare du Nord 도착', status: 'confirmed' },
      { time: '22:45', emoji: '🚖', label: 'Gare du Nord → Hôtel Sanso (7/1 arrival 호텔, Uber 15-20분)', status: 'confirmed', detail: 'Sanso by HappyCulture · Grande Bibliothèque 지역 (13구) · 다음날 오전 Hampton by Hilton으로 이동' },
      { time: '23:15', emoji: '🏨', label: 'Hôtel Sanso by HappyCulture 체크인', status: 'confirmed', detail: '✅ 7/1 arrival 1박 · Grande Bibliothèque 지역' },
    ],
  },

  // ===== PARIS (Day 21-28) — 8일 (7박), Mont-Saint-Michel 포함 =====
  {
    day: 21, date: '7/2 (목)', phase: 'paris', title: '🎨 오르세 도슨트 ✅ 13:30 + 🍽️ Vendredi gourmand 저녁 ✅ (실제 완료)',
    icon: '🎨', desc: '✅ 완료 — 오르세 도슨트 13:30 (한국어 3h) + Vendredi gourmand 김어준 레스토랑 18:00-19:30 저녁. 에펠탑은 시간·컨디션상 방문 못함 (7/5 일요일로 이동).',
    food: '⭐ Vendredi gourmand 김어준 레스토랑 저녁 (18:00-19:30 ✅ 예매완료) · 오르세 카페 점심', stay: '✅ Hampton By Hilton Paris Saint Ouen — 같은 숙소 연박',
    lat: 48.8600, lng: 2.3266,
    transit: '🚇 Saint-Ouen (RER C) 직행 → Musée d\'Orsay 정거장 (~15분) · 저녁 Uber',
    restaurants: ['⭐ Vendredi gourmand 김어준 레스토랑 ✅ (저녁 18:00)', 'Café Campana (오르세 5층)', 'Café de Flore (생제르맹)'],
    timeline: [
      { time: '09:00-10:00', emoji: '🍳', label: '늦은 아침 + 호텔 휴식', status: 'pending', detail: '오후 시작 일정이라 여유 · 짐 정리 가능' },
      { time: '10:00-12:00', emoji: '🚶', label: '시내 가벼운 산책 — Marché aux Puces 벼룩시장 (호텔 인근)', status: 'pending', detail: 'Saint-Ouen 벼룩시장은 세계 최대급 · 아침엔 조용, 오후 붐빔 · 또는 몽마르뜨 미리 산책' },
      { time: '12:00-12:30', emoji: '🚂', label: '🚂 ⭐ Saint-Ouen (RER C) → Musée d\'Orsay 직행 (~15분)', status: 'pending', detail: '⭐ RER C에 Musée d\'Orsay 전용 정거장 있음 · 오르세 미술관 코앞 · 환승 X' },
      { time: '13:00-13:25', emoji: '🍽️', label: '간단 점심 — 오르세 근처 또는 5층 카페', status: 'pending', detail: 'Café Campana (오르세 5층) 또는 강 변 카페 · 도슨트 13:30 전 식사' },
      { time: '13:25', emoji: '🎫', label: '오르세 미술관 도슨트 미팅 포인트 도착', status: 'pending', detail: '⚠️ 가이드 안내 따라 입구 또는 사전 약속 장소' },
      { time: '13:30', emoji: '🎨', label: '🎨 ⭐ 오르세 미술관 도슨트 ✅ 완료', status: 'confirmed', detail: '✅ 방문 완료 (7/2) · 한국어 도슨트 가이드 · 인상파 핵심 (모네·고흐·세잔·드가·르누아르) 5층 우선' },
      { time: '13:30-16:30', emoji: '🖼️', label: '⭐ 도슨트 인솔 인상파 핵심 동선 (약 3h) ✅ 완료', status: 'confirmed', detail: '✅ 완료 · 5층 인상파 → 0층 조각 → 2층 르동·휘슬러' },
      { time: '16:30-17:30', emoji: '🚶', label: '오르세 자유 추가 관람 또는 강 변 산책', status: 'pending', detail: '도슨트 종료 후 사진·추가 작품 · 또는 강변 따라 Vendredi gourmand 이동' },
      { time: '17:30-18:00', emoji: '🚇', label: '식당으로 이동 (Vendredi gourmand)', status: 'pending', detail: '⚠️ 식당 정확 주소·교통편 사용자 확인 필요 (Métro 라인)' },
      { time: '18:00-19:30', emoji: '🍽️', label: '🍽️ ⭐⭐ Vendredi gourmand 김어준 레스토랑 ✅ 저녁', status: 'confirmed', detail: '✅ 예매완료 · 18:00-19:30 · 한국식·프랑스 융합 (사용자 검증 필요)' },
      { time: '19:30-20:00', emoji: '🚇', label: '식당 → 호텔 복귀 (Saint-Ouen)', status: 'confirmed', detail: '✅ 완료 · Métro 14 또는 Uber' },
      { time: '20:00', emoji: '🏨', label: '호텔 복귀 + 휴식', status: 'confirmed', detail: '✅ 실제 완료 · 에펠탑은 시간·컨디션상 미방문 → 7/5 일요일로 이동' },
    ],
  },
  {
    day: 22, date: '7/3 (금)', phase: 'paris', title: '👑 베르사유 궁전 + 트리아농 ✅ 완료 (10:30 Entrance A)',
    icon: '👑', desc: '✅ 완료 — Billet Passeport · 10:30 Entrance A · 궁전 → 트리아농 → 정원. ⚠️ 분수쇼 당일 미운영으로 못 봄. 저녁 파리 복귀 → 마레지구 비스트로.',
    food: '베르사유 정원 카페 점심 + 마레지구 저녁', stay: '✅ Hampton By Hilton Paris Saint Ouen — 같은 숙소 연박',
    lat: 48.8048, lng: 2.1203,
    transit: '🚂 ⭐ RER C 직행 (Saint-Ouen → Versailles Château Rive Gauche, ~45분)',
    restaurants: ['Breizh Café (마레, 브르통 갈레트)', "L'As du Fallafel (마레, 전설적 팔라펠)", 'Angelina Café (베르사유 성내 점심)'],
    timeline: [
      { time: '08:30-09:00', emoji: '🍳', label: 'Hampton By Hilton Saint Ouen 아침', status: 'pending', detail: '커피 + 크루아상 + 과일' },
      { time: '09:00-09:15', emoji: '🚇', label: 'Saint-Ouen 역 → RER C 환승 (베르사유 직행)', status: 'pending', detail: '⭐ Saint-Ouen 역 = RER C 정거장 · 베르사유 Château Rive Gauche 직행 가능 · 도보 1분' },
      { time: '09:15-10:15', emoji: '🚂', label: '🚂 RER C → Versailles Château Rive Gauche', status: 'pending', detail: '~45분 · Navigo 1일권 또는 편도 × 3' },
      { time: '10:15-10:25', emoji: '🚶', label: '베르사유 역 → 궁전 도보 (~10분)', status: 'pending', detail: 'Entrance A 방향' },
      { time: '10:30', emoji: '👑', label: '👑 ⭐ 베르사유 궁전 입장 (Entrance A) ✅ 예매완료', status: 'confirmed', detail: '✅ Billet Passeport · 예약자 명의 · ⚠️ 10:30 슬롯 → 11:00 전 입장 필수' },
      { time: '10:30-10:40', emoji: '🎧', label: '🎧 ⭐ 한국어 오디오 가이드 활성화', status: 'pending', detail: '⭐ Palace of Versailles 공식 앱 (한국어, 오프라인 미리 다운로드) 또는 Dufour Pavilion Vestibule에서 무료 기기 대여 (Passport 포함) · 이어폰 3명분 준비' },
      { time: '10:40-12:00', emoji: '🏛️', label: '⭐ 궁전 핵심 동선 — 거울의 방·왕실 침전·전쟁의 방', status: 'pending', detail: 'Hall of Mirrors (거울의 방) 먼저 → 인파 폭증 전 사진 확보 · 한국어 오디오 가이드로 작품 해설' },
      { time: '12:00-13:00', emoji: '🍽️', label: '정원 카페 점심 (트리아농 오픈 타이밍)', status: 'pending', detail: 'Angelina Café (성내) 또는 La Petite Venise (정원 호숫가)' },
      { time: '13:00-15:00', emoji: '🌳', label: '⭐ Grand Trianon + Petit Trianon + Queen\'s Hamlet', status: 'pending', detail: '마리 앙투아네트 시골 마을 · 양·풍차·전원 풍경 (12시 오픈)' },
      { time: '15:00-17:30', emoji: '🌳', label: '🌳 정원 산책 (분수쇼 없는 날)', status: 'confirmed', detail: '⚠️ 실제: 분수쇼 당일 미운영 → 정원만 산책 · Le Nôtre 설계 거대 정원 · Latona·Apollo 분수 (물 없이)' },
      { time: '18:00', emoji: '🚂', label: 'Versailles → Paris 복귀', status: 'pending', detail: 'RER C ~45분' },
      { time: '19:00-19:30', emoji: '🚇', label: '마레지구 (Le Marais) 이동', status: 'pending', detail: 'Métro 1선 Saint-Paul' },
      { time: '19:30-21:30', emoji: '🍽️', label: '🍽️ 마레지구 비스트로 저녁', status: 'pending', detail: 'Breizh Café 갈레트 / L\'As du Fallafel 팔라펠 / 마레 바롱 르 듀퐁' },
      { time: '22:00', emoji: '🏨', label: 'Hampton By Hilton Saint Ouen 복귀', status: 'pending', detail: 'Métro 또는 Uber (야간)' },
    ],
  },
  {
    day: 23, date: '7/4 (토)', phase: 'paris', title: '🖼️ 루브르 ✅ 11:30 입장 + 🎧 한국어 오디오 가이드 + 마레 + 노트르담',
    icon: '🖼️', desc: '✅ 루브르 11:30 입장 예매완료 (Entrée Plein tarif hors EEE, 예약자 명의) · ⭐ 한국어 오디오 가이드로 자유 관람. 모나리자·비너스·니케 핵심 작품. 점심 후 마레지구 산책 + 보주 광장 + 피카소 미술관. 늦은 오후 노트르담 + 생트샤펠 + 라탱지구.',
    food: '루브르 카페 점심 · 마레 팔라펠 · 라탱지구 저녁', stay: '✅ Hampton By Hilton Paris Saint Ouen — 같은 숙소 연박',
    lat: 48.8606, lng: 2.3376,
    transit: '🚇 Saint-Ouen (Métro 14) → Pyramides 도보 5분 (~20분)',
    restaurants: ['Bouillon Chartier (전통)', "L'As du Fallafel (마레 팔라펠)", 'Café Marly (루브르 카페)'],
    timeline: [
      { time: '09:30-10:20', emoji: '🍳', label: 'Hampton By Hilton Saint Ouen 여유 아침', status: 'pending', detail: '11:30 슬롯이라 여유 · 조식 유료 옵션 또는 호텔 근처 카페' },
      { time: '10:30', emoji: '🚪', label: '호텔 출발', status: 'pending' },
      { time: '10:35-10:55', emoji: '🚇', label: 'Saint-Ouen (Métro 14) → Pyramides 직행 (~15분)', status: 'pending', detail: '⭐ Métro 14 자동 열차 · Pyramides 역이 루브르 도보 5분 · Navigo 또는 개별권 × 3' },
      { time: '11:00-11:10', emoji: '🚶', label: '⭐ Carrousel 지하 입구 도착 (줄 짧음)', status: 'pending', detail: '⭐ Rue de Rivoli 99 지하 쇼핑몰 통해 접근 · Pyramide 정문보다 줄 짧음 · 또는 Porte des Lions (17:30 폐쇄)' },
      { time: '11:10-11:25', emoji: '🎫', label: '보안 검색 + 슬롯 대기', status: 'pending', detail: '⚠️ 11:30 슬롯 = 30분+ 일찍 도착 시 밖 대기 요청 · 15-20분 전 도착 권장' },
      { time: '11:30', emoji: '🖼️', label: '🖼️ ⭐ 루브르 박물관 입장 ✅ 예매완료', status: 'confirmed', detail: '✅ 11:30 시간 슬롯 예매완료 · Entrée Plein tarif hors EEE (Non-EEA 성인) · 예약자 명의' },
      { time: '11:30-11:45', emoji: '🎧', label: '🎧 ⭐ 한국어 오디오 가이드 대여 (Nintendo 3DS)', status: 'pending', detail: '입장 후 안내 데스크 · 신분증 보증 · ⚠️ 도슨트 X = 개인 티켓 사용 OK' },
      { time: '11:45-12:30', emoji: '🎨', label: '⭐ 모나리자 (Denon 동, 1층) — 가장 먼저!', status: 'pending', detail: '한국어 오디오 가이드 작품번호 입력 · 사진 명소' },
      { time: '12:30-14:00', emoji: '🏛️', label: '비너스·니케·라파엘로·다비드·이집트관', status: 'pending', detail: 'Denon 동 → Sully 동 동선 · 오디오 가이드 작품번호로 핵심만 집중' },
      { time: '14:00-15:00', emoji: '🍽️', label: 'Café Marly 또는 Tuileries 정원 피크닉 점심', status: 'pending', detail: '루브르 관람 후 여유 · 20시 복귀 목표로 시간 관리' },
      { time: '15:00-16:15', emoji: '🚶', label: '⭐ 마레지구 산책 — 보주 광장 + 마레 거리 (핵심만)', status: 'pending', detail: '17세기 귀족 저택가 · 피카소 미술관 스킵 (시간 절약)' },
      { time: '16:15-17:00', emoji: '⛪', label: '⛪ 생트샤펠 (13세기 스테인드글라스, 도보 15분)', status: 'pending', detail: '짧은 관람 45분 · 마레→시테섬 도보' },
      { time: '17:00-17:30', emoji: '⛪', label: '⛪ 노트르담 외부 + Île de la Cité 강변 산책', status: 'pending', detail: '외부만 (짧게)' },
      { time: '17:30-19:00', emoji: '🍽️', label: '🍽️ 이른 저녁 (라탱지구 또는 마레)', status: 'pending', detail: '⭐ Bouillon Chartier (가성비 전통) 또는 마레 팔라펠 · 빠르게 90분' },
      { time: '19:00-19:45', emoji: '🚇', label: '호텔로 이동 — Métro 14 직결', status: 'confirmed', detail: '✅ 완료' },
      { time: '19:45-20:00', emoji: '🏨', label: '🏨 호텔 복귀 (20시 전) ✅', status: 'confirmed', detail: '✅ 완료' },
      { time: '20:00-22:00', emoji: '🗼', label: '🗼 ⭐ 저녁 자유 — 샹젤리제 + 개선문 + 에펠탑 야경 (실제 방문)', status: 'confirmed', detail: '✅ 완료 (7/4 밤) — 낮 루브르 후 저녁 야경 코스: 샹젤리제 → 개선문 → 에펠탑 반짝이 조명' },
    ],
  },
  {
    day: 24, date: '7/5 (일)', phase: 'paris', title: '📚 라탱지구 ✅ — 아내+큰아들 (Hans는 업무로 호텔)',
    icon: '📚', desc: '✅ 실제 — 아내+큰아들 둘이 라탱지구 점심 (Bouillon Racine) + 셰익스피어 & 컴퍼니 서점 + 시테섬 강변 산책 후 복귀. Hans는 업무로 호텔에서 근무. 저녁 후 7/6 메르시파리 05:30 기상 대비 일찍 취침.',
    food: '아내+큰아들 라탱지구 점심 (Bouillon Racine)', stay: '✅ Hampton By Hilton Paris Saint Ouen — 같은 숙소 연박',
    lat: 48.8584, lng: 2.3237,
    transit: '🚇 Métro 14 (Saint-Ouen 직결) → Châtelet → Métro 4 (라탱지구)',
    restaurants: ['⭐ Bouillon Racine (라탱지구 1906년 전통)'],
    timeline: [
      { time: '11:30-12:00', emoji: '🚇', label: '👥 아내+큰아들: 호텔 → Saint-Michel (Métro 14 → 4)', status: 'confirmed', detail: '✅ 완료 · Hans는 업무로 호텔에 남음' },
      { time: '12:00-13:30', emoji: '🍽️', label: '🍽️ ⭐ 아내+큰아들 라탱지구 점심 — Bouillon Racine', status: 'confirmed', detail: '✅ 완료 · 1906년 전통 파리 비스트로 · 아르누보 인테리어' },
      { time: '13:30-14:30', emoji: '📚', label: '📚 셰익스피어 & 컴퍼니 서점 + 시테섬 강변 산책', status: 'confirmed', detail: '✅ 완료' },
      { time: '오후', emoji: '🏨', label: '산책 후 호텔 복귀 · Hans 종일 업무', status: 'confirmed' },
      { time: '21:00', emoji: '📱', label: '📱 메르시파리 카톡 — 픽업 시간 재확인', status: 'confirmed' },
      { time: '22:00', emoji: '🛌', label: '취침', status: 'confirmed', detail: '7/6 05:30 기상 → 06:30 호텔 로비 (메르시파리 픽업)' },
    ],
  },
  {
    day: 25, date: '7/6 (월)', phase: 'paris', title: '🏰 메르시파리 패키지 ✅ — 몽생미셀 + 지베르니 + 옹플뢰르 (한국어 가이드 16h, 🚐 호텔 픽업)',
    icon: '🏰', desc: '⭐ ✅ 예매완료 (메르시파리 한국어 가이드 투어, 3명, 16시간) · 🚐 ⭐ 호텔 픽업 확정 (Hampton by Hilton Saint Ouen = 2존 추가) → 지베르니 모네 정원 → 옹플뢰르 항구 (또는 고흐마을) → 몽생미셀 일몰 → 새벽 1-2시 호텔 샌딩. ⚠️ 입장료 별도 (MSM + 지베르니). 다음날 7/7은 회복일.',
    food: '점심 자유 · 몽생미셀 La Mère Poulard 또는 마을 비스트로 저녁 · 차내 간식', stay: '✅ Hampton By Hilton Paris Saint Ouen — 같은 숙소 연박',
    lat: 48.6361, lng: -1.5114,
    transit: '🚐 메르시파리 차량 (한국어 가이드, 환승 X) — 트로카데로 ↔ 노르망디 왕복',
    restaurants: ['⭐ La Mère Poulard (몽생미셸 명물 오믈렛)', 'Hôtel Baudy (지베르니, 모네 단골)'],
    timeline: [
      { time: '05:30', emoji: '🛌', label: '🛌 기상 + 빠른 준비', status: 'pending', detail: '메르시파리 호텔 픽업 대비 (Uber 불필요)' },
      { time: '06:00-06:30', emoji: '🍳', label: '간단 아침 + 데이팩 최종 체크', status: 'pending', detail: '카메라·우산·자켓·간식·물·SPF·선글라스·현금 (입장료 + 픽업비 + 점심)' },
      { time: '06:30-06:45', emoji: '🏨', label: '🏨 호텔 로비 대기 (메르시파리 픽업)', status: 'pending', detail: '⚠️ 정확 픽업 시간 메르시파리 카톡 사전 확인 · 가이드와 직접 통화 가능 폰 준비' },
      { time: '06:50-07:10', emoji: '🚐', label: '🚐 ⭐ 메르시파리 호텔 픽업 (Hampton by Hilton Saint Ouen → 차량 탑승)', status: 'pending', detail: '⭐ 🚐 호텔 픽업 추가비 (Saint-Ouen 2존, 현장 결제 또는 사전 송금) · Hampton By Hilton Paris Saint Ouen 정문' },
      { time: '07:10-07:20', emoji: '🚐', label: '🚐 트로카데로 이동 (다른 참가자 합류)', status: 'pending', detail: '16구 Trocadéro 2·3번 출구 Café le Malakoff 앞' },
      { time: '07:20', emoji: '🎫', label: '🎫 ⭐ 트로카데로 합류 — 가이드 미팅 + 수신기·이어폰 수령', status: 'confirmed', detail: '✅ 메르시파리 예매완료' },
      { time: '07:30', emoji: '🚐', label: '🚐 차량 출발 (한국어 가이드)', status: 'pending' },
      { time: '08:20-12:30', emoji: '🌻', label: '🌻 ⭐ 지베르니 모네 정원 + 옹플뢰르 (또는 고흐마을)', status: 'pending', detail: '⚠️ 지베르니 입장료 별도 결제 · 모네의 집·수련 연못·일본식 다리 · 점심 자유' },
      { time: '12:30-15:30', emoji: '🚐', label: '🚐 노르망디 이동 → 몽생미셸', status: 'pending', detail: '차내 휴식 + 가이드 역사 설명' },
      { time: '15:30-16:50', emoji: '🏰', label: '🏰 몽생미셸 도착 + 마을 산책', status: 'pending' },
      { time: '16:50-19:00', emoji: '🏛️', label: '🏛️ ⭐ 수도원 입장 + 자유 시간', status: 'pending', detail: '⚠️ 수도원 입장료 별도 결제 · 가이드 동행' },
      { time: '19:00-21:00', emoji: '🍽️', label: '🍽️ 저녁 식사 (자유)', status: 'pending', detail: '⭐ La Mère Poulard 명물 오믈렛 (비쌈) 또는 마을 비스트로 (가성비)' },
      { time: '21:00-22:00', emoji: '🌅', label: '🌅 ⭐⭐ 몽생미셸 일몰 관람 (7월 일몰 ~21:50)', status: 'pending', detail: '갯벌 + 수도원 실루엣 + 만조 시 마법 같은 풍경' },
      { time: '22:00', emoji: '🚐', label: '🚐 파리 복귀 출발', status: 'pending' },
      { time: '01:00-02:00+1', emoji: '🏨', label: '🏨 ⚠️ 새벽 1-2시 호텔 도착 (메르시파리 샌딩)', status: 'pending', detail: '⭐ Hampton by Hilton Saint Ouen 호텔까지 직행 (픽업비에 왕복 포함) · 차량에서 내려 호텔로' },
      { time: '02:30', emoji: '🛌', label: '🛌 취침 (다음날 7/7 회복일)', status: 'pending' },
    ],
  },
  {
    day: 26, date: '7/7 (화)', phase: 'paris', title: '🎨⛪ 마지막 날 — 몽마르뜨 + 노트르담 재개관 (12시 출발)',
    icon: '⛪', desc: '⭐ 여행 마지막 날 — 12시 출발 2코스 집중. 오후 몽마르뜨 (점심 + 사크레쾨르 + 테르트르 광장) → 16시 노트르담 내부 (2024 재개관 · 무료 · 슬롯 예약) → 생트샤펠 또는 세느 강변 → 셰익스피어 & 컴퍼니 → 생제르맹 마지막 만찬 → 21시 복귀 + 7/8 출국 짐 정리. ⚠️ l\'Orangerie·루브르는 화요일 휴관. 호텔(Saint-Ouen)에서 몽마르뜨가 가장 가까워 몽마르뜨 먼저.',
    food: '몽마르뜨 골목 점심 · 생제르맹 마지막 만찬 (Le Comptoir du Relais 또는 Bouillon Chartier)', stay: '✅ Hampton By Hilton Paris Saint Ouen — 같은 숙소 연박 (마지막 밤)',
    lat: 48.8867, lng: 2.3431,
    transit: '🚇 M13 Mairie de Saint-Ouen → Place de Clichy → M2 Anvers (몽마르뜨, ~25분) · M4 Barbès → Cité (노트르담, ~20분)',
    restaurants: ['Le Consulat (몽마르뜨 화가 카페)', 'La Maison Rose (사진 명소)', '⭐ Le Comptoir du Relais (생제르맹 만찬, 예약)', 'Bouillon Chartier (전통 가성비 대안)'],
    links: [
      { url: 'https://www.notredamedeparis.fr/en/visit/', label: '⛪ 노트르담 취소표 확인' },
    ],
    timeline: [
      { time: '12:00', emoji: '📱', label: '📱 ⭐ 출발 전 노트르담 오후 슬롯 예약 (무료)', status: 'pending', detail: '⚠️ notredamedeparis.fr 또는 공식 앱에서 16:00-16:30 슬롯 · 없으면 현장 줄 20-40분 (화요일 폐관 19:00)' },
      { time: '12:10-12:35', emoji: '🚇', label: '호텔 → 몽마르뜨 이동', status: 'pending', detail: 'M13 Mairie de Saint-Ouen → Place de Clichy → M2 → Anvers (~25분) · 또는 Uber ~10분' },
      { time: '12:40-13:50', emoji: '🍽️', label: '🍽️ 몽마르뜨 골목 점심', status: 'pending', detail: 'Le Consulat 주변 골목 비스트로 · 크레페 간단 옵션 · 언덕 위 관광지 물가 감안' },
      { time: '13:50-14:40', emoji: '⛪', label: '⛪ ⭐ 사크레쾨르 대성당 (무료) + 파리 전경', status: 'pending', detail: 'Anvers 쪽에서 푸니쿨라 (Navigo/t+ 티켓) 또는 계단 · 성당 앞 계단 = 파리 파노라마 · 돔 옵션' },
      { time: '14:40-15:20', emoji: '🎨', label: '🎨 테르트르 광장 (화가 광장) + La Maison Rose + 골목 산책', status: 'pending', detail: '초상화 화가들 · 달리다 흉상 · Mur des Je t\'aime (Abbesses 쪽, "사랑해" 벽) 옵션' },
      { time: '15:20-15:55', emoji: '🚇', label: '몽마르뜨 → 시테섬 이동', status: 'pending', detail: '도보 → Barbès-Rochechouart (M4) → Cité 직행 (~20분) · 또는 Anvers M2 1정거장 + M4 환승' },
      { time: '16:00-17:00', emoji: '⛪', label: '⛪ ⭐⭐ 노트르담 대성당 내부 (2024 재개관)', status: 'pending', detail: '⚠️ 무료 · 예약 슬롯 우선 입장 · 화요일 폐관 19:00 (마지막 입장 ~18:40) · 재개관 후 새 조명·복원된 장미창' },
      { time: '17:00-17:45', emoji: '💠', label: '💠 생트샤펠 (13세기 스테인드글라스) — 옵션', status: 'pending', detail: '노트르담 도보 5분 · 여름 19:00까지 · 컨디션 따라 스킵하고 강변 산책 대체' },
      { time: '17:45-18:30', emoji: '📚', label: '📚 셰익스피어 & 컴퍼니 + 부키니스트 강변', status: 'pending', detail: 'Hans 첫 방문 (7/5는 아내+큰아들만) · 노트르담 정면 뷰 다리에서 가족 사진' },
      { time: '18:45-20:30', emoji: '🍽️', label: '🍽️ ⭐ 마지막 파리 만찬 — 생제르맹', status: 'pending', detail: '⭐ Le Comptoir du Relais (아껴둔 곳, 웨이팅 가능성) · 대안 Bouillon Chartier / Café de Flore 테라스' },
      { time: '20:30-21:00', emoji: '🚇', label: '호텔 복귀', status: 'pending', detail: 'Odéon (M4) → Châtelet → M14 Saint-Ouen · 또는 Uber' },
      { time: '21:00-22:30', emoji: '🧳', label: '🧳 ⭐ 7/8 출국 짐 최종 정리', status: 'pending', detail: '위탁(23kg)·휴대(8kg) × 3 · LH2229 CDG 12:00 · 여권·boarding pass 앱 저장' },
      { time: '22:30', emoji: '🛌', label: '취침', status: 'pending', detail: '내일 06:30 기상 → 08:00 체크아웃 → CDG 10:00 도착 목표' },
    ],
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
      { time: '09:00-10:00', emoji: '🚇', label: 'Saint-Ouen (Métro 14) → Châtelet-Les Halles → RER B → CDG (~55분)', status: 'pending', detail: 'Métro 14: 5정거장 · RER B: 30분 · 트렁크 다수 → Uber 대안' },
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
      con: ['숙박비 ↑', '날씨 의존도 ↑'],
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
  { phase: 'porto', city: '포르토', name: 'SANTA RITA Guesthouse B&B (Vila Nova de Gaia)', type: '게스트하우스 (Booking.com)', price: '', desc: '✅ 예매완료 · 6/12-13 · R. Santa Rita 58, Vila Nova de Gaia (강 건너편, 포트와인 셀러 옆) · 더블룸 외부욕실 · 조식포함 · 발코니+정원 전망 · ⚠️ 환불 불가.', emoji: '🏨',
    breakfast: { status: 'included', note: '포르투갈식 조식 (B&B 기본)' },
    booked: { lat: 41.1376, lng: -8.6094, address: 'R. Santa Rita 58, 4400 Vila Nova de Gaia, Portugal', dates: '6/12-13', nights: 2, pax: 2 } },
  { phase: 'camino', city: 'Vila do Conde / 포보아드바르징', name: 'Hotel Costa Verde ★★', type: '2성급 호텔 (Booking.com)', price: '', desc: '✅ 예매완료 · 🌊 6/14 카미노 Day 1 — 해안 27km 종착 · Avenida Vasco da Gama 56, 4490-410 Póvoa de Varzim (대서양 100m, Vila do Conde 북쪽 3km) · 더블룸 + 발코니 + 바다/도시 전망 · 조식 뷔페 포함 · 24h 리셉션 · 위치 점수 9.4 · 평점 9.0 (2,799리뷰)', emoji: '🏨',
    breakfast: { status: 'included', note: '뷔페 (따뜻한+차가운 음식) · 객실 내 서비스 가능' },
    booked: { lat: 41.3825, lng: -8.7625, address: 'Avenida Vasco da Gama 56, 4490-410 Póvoa de Varzim, Portugal', dates: '6/14', nights: 1, pax: 2, bookingRef: '' } },
  { phase: 'camino', city: 'Esposende (Ofir)', name: 'Parque do Rio Ofir Hotel ★★★★', type: '4성급 리조트 호텔 (Booking.com Genius)', price: '', desc: '✅ 예매완료 · 🌊 6/15 카미노 Day 2 — 해안 24km 종착 · Caminho Padre Manuel Sá Pereira, 4744-908 Ofir, Esposende (Cávado 강 하구 리조트 지역) · 더블/트윈룸 + 발코니 · 조식 포함 · 무료 주차 · 수영장 · 4성 리조트', emoji: '🏨',
    breakfast: { status: 'included' },
    booked: { lat: 41.4951, lng: -8.7842, address: 'Caminho Padre Manuel Sá Pereira, 4744-908 Esposende (Ofir), Portugal', dates: '6/15', nights: 1, pax: 2, bookingRef: '' } },
  { phase: 'camino', city: 'Viana do Castelo (Amorosa)', name: 'Hotel Areias Claras ★★', type: '2성급 호텔 (Booking.com Genius)', price: '', desc: '✅ 예매완료 · 🌊 6/16 카미노 Day 3 · Rua da praia 54, Amorosa, 4935-580 Viana do Castelo (Amorosa 해변 마을, 시내 남쪽 ~5km) · 스탠다드 더블룸 · 조식 포함 · 18세 이상만 투숙 가능 · 체크인 15:00-22:30, 체크아웃 08:00-11:30', emoji: '🏨',
    breakfast: { status: 'included' },
    booked: { lat: 41.6437, lng: -8.8232, address: 'Rua da praia 54, Amorosa, 4935-580 Viana do Castelo, Portugal', dates: '6/16', nights: 1, pax: 2, bookingRef: '' } },
  { phase: 'camino', city: 'A Guarda', name: 'Hotel Monumento Convento de San Benito ★★', type: '역사 호텔 (16C 베네딕트 수도원 개조)', price: '', desc: '✅ 예매완료 · 🛥️ 6/17 Caminha 페리 도착 후 1박 — ⭐ 스페인 입국 첫날 · Plaza de San Benito s/n, 36780 A Guarda, Pontevedra · 더블룸 + 🌊 바다 전망 · 조식 포함 · 체크인 15:00-23:00 · 페리 부두에서 도보 30분 또는 택시 · 다음날 새벽 A Guarda → Tui 30km 강변 도보 시작', emoji: '🏨',
    breakfast: { status: 'included' },
    booked: { lat: 41.9028, lng: -8.8786, address: 'Plaza de San Benito s/n, 36780 A Guarda, Pontevedra, Spain', dates: '6/17', nights: 1, pax: 2, bookingRef: '' } },
  { phase: 'camino', city: 'Tui', name: 'Hotel Amoriño ★★★', type: '3성급 호텔 (구시가 부티크)', price: '', desc: '✅ 예매완료 · 🥾 6/18 카미노 Day 5 도착 (A Guarda → Tui 30km 강변 종착) · Rúa Arraial, 36700 Tui, Pontevedra (구시가지 · 대성당 도보권) · 디럭스 더블룸/트윈룸 · 🏊 수영장 전망 · 대형 더블침대 · 조식 포함 · 체크인 15:00-22:00 · ⚠️ 환불 불가 (예약 후 23h grace) · 다음날 Tui → Redondela 31km 통합 출발', emoji: '🏨',
    breakfast: { status: 'included' },
    booked: { lat: 42.0467, lng: -8.6438, address: 'Rúa Arraial, 36700 Tui, Pontevedra, Spain', dates: '6/18', nights: 1, pax: 2, bookingRef: '' } },
  { phase: 'camino', city: 'Amieiro Longo (Redondela)', name: 'Casa Amieiro ★★★', type: '단독 1베드룸 아파트 (카미노 본선 위)', price: '', desc: '✅ 예매완료 · 💪 6/19 카미노 Day 6 종착 — Tui → Amieiro Longo ~28km (Redondela 도심 3km 전, 카미노 본선 통과 마을) · Rúa Amieiro 10, Planta baja, 36800 Redondela · 단독 아파트 (4인 정원, 부부 둘만 사용) · 풀 주방 + 세탁기 + 욕조/샤워 + 무료 주차 · 조식 ❌ (주방 + 커피머신 활용) · 체크인 14:00-24:00 · ⚠️ 환불 불가 (23h grace)', emoji: '🏠',
    breakfast: { status: 'none', note: '주방 + 커피머신 있어 자체 조리 또는 다음날 Redondela 도심 통과 시 카페' },
    booked: { lat: 42.2680, lng: -8.6160, address: 'Rúa Amieiro 10, Planta baja, 36800 Redondela, Pontevedra, Spain', dates: '6/19', nights: 1, pax: 2, bookingRef: '' } },
  { phase: 'camino', city: 'Pontevedra', name: 'MORC-beds & rooms (home sharing) ★', type: 'Home sharing — 알베르게 체험 (부부 사적 침실 + 공용 욕실)', price: '', desc: '✅ 예매완료 · 🐚 6/20 카미노 Day 7 종착 — Amieiro Longo→Pontevedra ~22km · Rua San Martiño 5, 2º, 36002 Pontevedra (구시가 중심, Virxe Peregrina·Praza da Ferrería 도보 2-5분) · 더블룸 + 대형 더블침대 · 공용 욕실 (알베르게 분위기) · 전용 주방 · 평점 9.6/10 (544 리뷰) · 조식 ❌ · ⚠️ 환불 불가 · 호스트 대면 체크인 14:00-18:00 (시간 엄수) · 체크아웃 07:30-10:00', emoji: '🛏️',
    breakfast: { status: 'none', note: '구시가 카페 도보 1분' },
    booked: { lat: 42.4334, lng: -8.6442, address: 'Rua San Martiño 5, 2º, 36002 Pontevedra, Spain', dates: '6/20', nights: 1, pax: 2, bookingRef: '' } },
  { phase: 'camino', city: 'Caldas de Reis', name: 'Torre do Rio (18C 물레방앗간)', type: '농촌 호텔 (Umia 강변 retreat, 10,000m² 정원)', price: '', desc: '✅ 예매완료 · ♨️ 6/21 카미노 Day 8 종착 — Pontevedra→Caldas 22km · Baxe 1, San Andres de Cesar, 36653 Caldas de Reis (시내에서 ~1km, 무료 카미노 셔틀 제공) · 18세기 물레방앗간 복원 + Umia 강변 + Rías Baixas 와인 루트 · 조식 포함 · 평점 9.3/10 (328 리뷰) · Caldas 온천 1km 옵션 · 호텔 자체 레스토랑', emoji: '🏞️',
    breakfast: { status: 'included' },
    booked: { lat: 42.6005, lng: -8.6280, address: 'Baxe 1, San Andres de Cesar, 36653 Caldas de Reis, Pontevedra, Spain', dates: '6/21', nights: 1, pax: 2, bookingRef: '' } },
  { phase: 'camino', city: 'Padrón (Lestrove)', name: 'Pazo de Lestrove by Pousadas de Compostela ★★★★', type: '4성 역사 호텔 (16C 대주교 사저 Pazo, Pousadas de Compostela 체인)', price: '', desc: '✅ 예매완료 · 🌶️ 6/22 카미노 Day 9 종착 — Caldas→Padrón 19km + 카미노 우회 0.75km · Fortunato Cruces 1, 15916 Padrón (Lestrove, Dodro) · 16세기 산티아고 대주교 옛 사저 + 50,000m² 정원·숲 + 야외 수영장 · 스탠다드 더블룸 · 조식 포함 · 미니바·전화기·엘리베이터·휠체어 접근 가능 · 산티아고 진입 전 자축 retreat', emoji: '🏰',
    breakfast: { status: 'included' },
    booked: { lat: 42.7375, lng: -8.6709, address: 'Fortunato Cruces 1, 15916 Padrón (Lestrove, Dodro), A Coruña, Spain', dates: '6/22', nights: 1, pax: 2, bookingRef: '' } },
  { phase: 'camino', city: 'Barcelos', name: 'Albergue Cidade de Barcelos', type: '알베르게', price: '', desc: '시내 중심, 시장 근처. 깨끗하고 가성비 좋음.', emoji: '🛏️' },
  { phase: 'camino', city: 'Ponte de Lima', name: 'Albergue de Peregrinos', type: '공립 알베르게', price: '', desc: '강변, 마을 외곽. 일찍 도착 권장.', emoji: '🛏️' },
  { phase: 'camino', city: 'Rubiães', name: 'Albergue São Pedro de Rubiães', type: '공립 알베르게', price: '', desc: '작은 마을 — 미리 도착해 침대 확보.', emoji: '🛏️' },
  { phase: 'camino', city: 'Tui', name: 'Albergue de Tui (Convento)', type: '수도원 알베르게', price: '', desc: '13세기 수도원 — 분위기 압도적.', emoji: '🛏️' },
  { phase: 'camino', city: 'O Porriño', name: 'Albergue Municipal', type: '공립 알베르게', price: '', desc: '시설 신축, 주방 사용 가능.', emoji: '🛏️' },
  { phase: 'camino', city: 'Redondela', name: 'Casa da Torre', type: '알베르게', price: '', desc: '역사 건물, 정원 있음.', emoji: '🛏️' },
  { phase: 'camino', city: 'Pontevedra', name: 'Albergue Virxe Peregrina', type: '공립 알베르게', price: '', desc: '구시가지 중심. 저녁 타파스 동선 좋음.', emoji: '🛏️' },
  { phase: 'camino', city: 'Caldas de Reis', name: 'Albergue Municipal', type: '공립 알베르게', price: '', desc: '♨️ 온천 마을 — 도착 후 온천욕 가능.', emoji: '🛏️' },
  { phase: 'camino', city: 'Padrón', name: 'Albergue de Padrón', type: '공립 알베르게', price: '', desc: '강변, 시장 근처. 파드론 고추 꼭 먹기.', emoji: '🛏️' },
  { phase: 'camino', city: '산티아고', name: 'Libredón Rooms', type: '부티크 B&B', price: '', desc: '✅ 예매완료 · ⭐ 6/23 — 카미노 완주 자축! Plaza de Fonseca 5 (대성당 광장 중 하나, 도보 30초) · 수페리어 트윈룸 정원 전망 · 전용 욕실·발코니 · 짐 보관 가능 (Camino 시작 전 캐리어 직송).', emoji: '🏨',
    breakfast: { status: 'none', note: '조식 미제공 (Picnic 옵션 요청 시 · 카미노 완주 후 자축 만찬으로 시내 추천 식당 多)' },
    booked: { lat: 42.8806, lng: -8.5440, address: 'Plaza de Fonseca 5, 15782 Santiago de Compostela', dates: '6/23', nights: 1, pax: 2 } },
  { phase: 'swiss', city: '루체른 (둘째 단독)', name: 'Capsule Hotel — Lucerne Old Town', type: '캡슐 호텔 (Booking.com Genius)', price: '', desc: '✅ 예매완료 · 6/23 1박 · 둘째 단독 (LX333 ZRH 16:35 도착 후) · 33 Zürichstrasse, 6004 Lucerne · Genius 10% 할인 · 고속 Wi-Fi, 에어컨, 공용 욕실 · 체크인 14:00-24:00, 체크아웃 01:00-10:30', emoji: '🛏️',
    breakfast: { status: 'none', note: '조식 미제공 (캡슐 호텔 — 시내 카펠교 옆 카페 多)' },
    booked: { lat: 47.0511, lng: 8.3013, address: '33 Zürichstrasse, 6004 Lucerne', dates: '6/23', nights: 1, pax: 1 } },
  { phase: 'swiss', city: '루체른', name: 'Visionary Hospitality Rothenburg — Premium Apartment', type: '아파트 (Booking.com Genius)', price: '', desc: '✅ 예매완료 · 6/24-26 2박 · 38 Bertiswilstrasse, 6023 Rothenburg (루체른역 북쪽 8.6km, PostBus 60번 무료 셔틀 ~15분 with Swiss Travel Pass) · 발코니·산 전망·주방·세탁기·전용 입구 · 무료 취소 · 체크인 15:00, 체크아웃 10:00', emoji: '🏨',
    breakfast: { status: 'none', note: '조식 미제공 (단독 아파트 — 풀 주방으로 자취 가능, 근처 식료품점 2곳)' },
    booked: { lat: 47.0958, lng: 8.2606, address: '38 Bertiswilstrasse, 6023 Rothenburg, Switzerland', dates: '6/24-26', nights: 2, pax: 4 } },
  { phase: 'swiss', city: '체르마트', name: '졸리몬트 아파트먼트 — Alpine Apartment', type: '아파트 (Booking.com ★★★★)', price: '', desc: '✅ 예매완료 · 6/26-27 2박 · Flecksteinweg 9, 3920 체르마트 · 4인 단독 아파트 (전용 욕실+발코니+산 전망+도시 전망) · 주방·식기세척기·세탁·DVD 등 풀옵션', emoji: '🏨',
    breakfast: { status: 'none', note: '조식 미제공 (단독 아파트 — 식기세척기·주방 풀옵션, 체르마트 정통 퐁듀 식당 多)' },
    booked: { lat: 46.0179, lng: 7.7468, address: 'Flecksteinweg 9, 3920 Zermatt', dates: '6/26-27', nights: 2, pax: 4, bookingRef: '' } },
  { phase: 'swiss', city: '인터라켄', name: 'SWEET HOLIDAY HOME NO.1 (Genius)', type: '아파트 - 테라스 (Booking.com Genius 10%)', price: '', desc: '✅ 예매완료 · 6/28-29 2박 · 18 Rosenstrasse 1 floor, 3800 Interlaken (중심부 · 위치 점수 9.4 · 228리뷰) · 단독 아파트 + 테라스/파티오/발코니 · 전용 욕실 · 주방·소파·평면 TV·전자레인지·다리미 · 무료 취소 · ⚠️ 체크인 17:00-21:30, 체크아웃 07:00-10:00 (시간 좁음, Harder Kulm 다녀와서 21:30 전 입실)', emoji: '🏨',
    breakfast: { status: 'none', note: '조식 미제공 (단독 아파트 — 주방 풀옵션, 슈퍼 인근 · 인터라켄 비스트로 多)' },
    booked: { lat: 46.6858, lng: 7.8580, address: '18 Rosenstrasse, 3800 Interlaken, Switzerland', dates: '6/28-29', nights: 2, pax: 4 } },
  { phase: 'london', city: '캠브리지', name: 'Hyatt Centric Cambridge — 디럭스 패밀리룸', type: '4성급 호텔 (Booking.com)', price: '', desc: '✅ 예매완료 · 🎓 6/30 1박 · 37 Eddington Avenue, CB3 1SE (Eddington 북서 신개발지구, 시내 5.6km) · 디럭스 패밀리룸 31㎡ · 초대형 더블+소파베드 · 정원/안뜰 전망 · 무료 자전거·주차·피트니스 · 평점 8.5 (2,817리뷰).', emoji: '🏨',
    breakfast: { status: 'paid', price: '', note: '영국식 정찬 뷔페 (평점 8.4)' },
    booked: { lat: 52.2147, lng: 0.0828, address: '37 Eddington Avenue, Cambridge CB3 1SE', dates: '6/30', nights: 1, pax: 3 } },
  { phase: 'paris', city: '파리', name: 'Hôtel Sanso by HappyCulture (arrival 1박)', type: '호텔 (Booking.com)', price: '', desc: '✅ 7/1 (수) 도착 후 1박 · Grande Bibliothèque 지역 (13구) · Eurostar 22:19 도착 → Gare du Nord → Sanso · Métro 접근 편리 · 도착 다음날 7/2 오전에 Hampton By Hilton Saint Ouen으로 이동.', emoji: '🏨',
    breakfast: { status: 'none', note: '⚠️ 조식 정보 예약 확인 필요 (아침 근처 카페 이용 가능)' },
    booked: { lat: 48.8321, lng: 2.3766, address: 'Grande Bibliothèque 지역, 파리 13구', dates: '7/1', nights: 1, pax: 3 } },
  { phase: 'paris', city: '파리', name: 'Hampton By Hilton Paris Saint Ouen (main stay)', type: '호텔 (Booking.com)', price: '', desc: '✅ 예매완료 · Saint-Ouen-sur-Seine (파리 北 인접, 93구) · Métro 13 + Métro 14 + RER C · Saint-Ouen 역 도보 1분 · Hilton 체인 · 조식 별도 옵션 · 몽마르뜨·사크레쾨르 20분 거리 · Marché aux Puces 벼룩시장 인근. ⚠️ 원래 Clichy 아파트에서 변경 · 아들친구용 추가 방 2박 (7/2-7/4) 별도.', emoji: '🏨',
    breakfast: { status: 'paid', note: '⚠️ Hilton 조식 별도 옵션 (현장 예약 시 유료)' },
    booked: { lat: 48.9061, lng: 2.3363, address: 'Saint-Ouen-sur-Seine (Métro 14 · RER C 도보 1분)', dates: '7/2-7/8', nights: 6, pax: 3 } },
];

export const BUDGET: BudgetItem[] = [
  {
    id: 'flight', cat: '✈️ 항공권', amt: '₩12,004,939', amtNum: 12004939,
    detail: '✅ 8건 모두 예매완료 + Vueling 이름 변경 수수료 ₩111,854 (6/10 결제) · 합계 ₩12,004,939',
    pct: 26, color: '#2563EB',
    actual: 14112420,
    settleNote: '결산 ₩14,112,420 — 루프트한자(귀국 등)·유로스타·부엘링 수수료·6/30 결항 재발권 스위스항공(현대카드) + SWISS·대한항공(토스카드). 예산 대비 +₩2.1M (결항 재발권 영향)',
    breakdown: [
      { label: '👫 부부 ICN→FRA→OPO (LH713+LH1180, 6/12)', amt: 2311000, status: 'confirmed', note: 'Economy Basic Plus · 좌석 30J·30K/20E·20F' },
      { label: '🧑 둘째 LHR→ZRH (Swiss LX333, 6/23)', amt: 292900, status: 'confirmed', note: '직항 1h 45m · 개인물품만' },
      { label: '👫 부부 SCQ→BCN→ZRH (Vueling, 6/24)', amt: 890600, status: 'confirmed', note: '✅ 아빠 이름 정정 완료 (수수료 별도 라인) · 위탁 25kg/인' },
      { label: '🔧 Vueling 아빠 이름 변경 수수료', amt: 111854, status: 'confirmed', note: '2026-06-10 결제 · 예약자 명의 정정' },
      { label: '🇰🇷 큰아들 ICN→ZRH (KE917, 6/25)', amt: 1273500, status: 'confirmed', note: 'B787-10 직항 13h 20m · Economy Standard' },
      { label: '👨‍👩‍👦‍👦 가족 4명 ZRH→LHR (Swiss LX332, 6/30)', amt: 1575600, status: 'confirmed', note: '직항 1h 55m · 위탁 23kg+휴대 8kg/인' },
      { label: '🧑 둘째 LGW→칭다오→ICN (JD484+QW901, 7/1)', amt: 964900, status: 'confirmed', note: '칭다오 4h 10m 환승 · 수하물 재수속' },
      { label: '🚄 Eurostar London → Paris (3명, 7/1)', amt: 626439, status: 'confirmed', note: '19:01 → 22:19 · Eurostar Standard · Coach 5 · €351 (€117×3)' },
      { label: '👨‍👩‍👦 3명 CDG→MUC→ICN (LH2229+LH718, 7/8)', amt: 3958146, status: 'confirmed', note: 'Economy Green · €2,198.97 @ ₩1,800/EUR' },
    ],
  },
  {
    id: 'accommodation', cat: '🏨 숙소', amt: '₩9,235,503', amtNum: 9235503,
    detail: '🎉 모든 숙소 예약 완료! 포르토 2박 + 카미노 10박 (Costa Verde·Ofir·Areias Claras·A Guarda Convento·Tui Amoriño·Amieiro Longo Casa Amieiro·Pontevedra MORC·Caldas Torre do Rio·Padrón Pazo de Lestrove·Santiago Libredón) + 둘째 6/23 1박 + 루체른 2박 + 체르마트 2박 + 인터라켄 2박 + 캠브리지 1박 + 파리 7박 — 총 27박 전부 확정 ✅',
    pct: 23, color: '#EA580C',
    actual: 11240652,
    settleNote: '결산 ₩11,240,652 — 부킹닷컴 완료 20건 ₩10,043,848 (현대카드 선결제·현장결제 + 파리 숙소 ₩2.82M 아내 결제) + 인터라켄 2박 ₩1,196,804(부킹 실수취소→현금 재결제, 일기 확인). 취리히 Belvoir 1박 추가 등으로 예산 대비 +₩2.0M',
    breakdown: [
      { label: '🇵🇹 포르토 SANTA RITA Guesthouse B&B (Vila Nova de Gaia) 2박', amt: 354271, status: 'confirmed', note: '✅ 부킹닷컴 예매 · 더블룸 전용 외부욕실 · 조식포함 · 발코니+정원 전망 · ⚠️ 환불불가 · R. Santa Rita 58, Vila Nova de Gaia (강 건너편, 포트와인 셀러 옆)' },
      { label: '🌊 카미노 Day 1 (6/14) Vila do Conde — Hotel Costa Verde ★★', amt: 137164, status: 'confirmed', note: '✅ 부킹닷컴 Genius · +351 252 298 600 · Avenida Vasco da Gama 56, Póvoa de Varzim · 더블룸 + 바다 전망 + 조식 포함 · 평점 9.0 (2,799리뷰)' },
      { label: '🌊 카미노 Day 2 (6/15) Esposende — Parque do Rio Ofir Hotel ★★★★', amt: 139473, status: 'confirmed', note: '✅ 부킹닷컴 Genius · +351 966 620 927 · Caminho Padre Manuel Sá Pereira, Ofir (Cávado 강 하구) · 더블/트윈룸 발코니 + 조식 포함 + 수영장 + 무료 주차 · 4성 리조트' },
      { label: '🌊 카미노 Day 3 (6/16) Viana do Castelo — Hotel Areias Claras ★★', amt: 139534, status: 'confirmed', note: '✅ 부킹닷컴 Genius · +351 962 928 292 · Rua da praia 54, Amorosa (해변 마을, 시내 남쪽 5km) · 스탠다드 더블룸 + 조식 포함 · 18세 이상만 투숙' },
      { label: '🛥️ 카미노 Day 4 (6/17) A Guarda — Hotel Monumento Convento de San Benito ★★ ⭐ 스페인 입국', amt: 218421, status: 'confirmed', note: '✅ 부킹닷컴 · +34 986 61 11 66 · Plaza de San Benito s/n, 36780 A Guarda · 16C 베네딕트 수도원 개조 역사 호텔 · 더블룸 🌊 바다 전망 + 조식 포함 · 페리 부두에서 도보 30분/택시 €5 · 다음날 새벽 → Tui 30km 강변 도보' },
      { label: '🥾 카미노 Day 5 (6/18) Tui — Hotel Amoriño ★★★', amt: 222676, status: 'confirmed', note: '✅ 부킹닷컴 · +34 623 13 38 54 · Rúa Arraial, 36700 Tui (구시가 · 대성당 도보권) · 디럭스 더블/트윈룸 🏊 수영장 전망 · 조식 포함 · ⚠️ 환불 불가 (예약 후 23h grace) · A Guarda→Tui 30km 강변 도보 종착 · 다음날 Tui→Redondela 31km 통합' },
      { label: '💪 카미노 Day 6 (6/19) Amieiro Longo — Casa Amieiro ★★★ (단독 아파트)', amt: 176350, status: 'confirmed', note: '✅ 부킹닷컴 · +34 627 83 02 90 · Rúa Amieiro 10, Planta baja, 36800 Redondela (Amieiro Longo · 카미노 본선 통과 동네, Redondela 도심 3km 전) · 단독 1베드룸 아파트 (4인 정원) · 풀 주방+세탁기+욕조 · 조식 ❌ (주방 활용) · ⚠️ 환불 불가 (23h grace) · Tui→여기 ~28km (30km 컷 부합!)' },
      { label: '🐚 카미노 Day 7 (6/20) Pontevedra — MORC-beds & rooms ★ (home sharing, 알베르게 체험)', amt: 157111, status: 'confirmed', note: '✅ 부킹닷컴 Genius (10% 할인) · +34 607 36 08 12 · Rua San Martiño 5, 2º, 36002 Pontevedra (구시가 중심, Virxe Peregrina·Praza da Ferrería 도보 2-5분) · 더블룸 + 대형 더블침대 · 공용 욕실 · 전용 주방 · 9.6/10 (544 리뷰) · 조식 ❌ · ⚠️ 환불 불가 · 호스트 대면 체크인 14:00-18:00 (시간 엄수)' },
      { label: '♨️ 카미노 Day 8 (6/21) Caldas de Reis — Torre do Rio (18C 물레방앗간 농촌 호텔)', amt: 285357, status: 'confirmed', note: '✅ 부킹닷컴 · +34 986 54 05 13 · Baxe 1, San Andres de Cesar, 36653 Caldas de Reis (시내 1km, 무료 카미노 셔틀) · 18C 물레방앗간 복원 + Umia 강변 + 10,000m² 정원 · 조식 포함 · 9.3/10 (328 리뷰) · Caldas 온천 1km · 호텔 레스토랑' },
      { label: '🏰 카미노 Day 9 (6/22) Padrón — Pazo de Lestrove ★★★★ (Pousadas de Compostela, 16C 대주교 사저)', amt: 269504, status: 'confirmed', note: '✅ 부킹닷컴 Genius · +34 981 56 93 50 · Fortunato Cruces 1, 15916 Padrón (Lestrove, Dodro · 카미노 750m 우회) · 4성 · 스탠다드 더블룸 · 16세기 대주교 옛 사저 + 50,000m² 정원·숲 + 야외 수영장 · 조식 포함 · 미니바·엘리베이터 · 산티아고 도착 전 자축 retreat' },
      { label: '⭐ 산티아고 Libredón Rooms 1박 (자축)', amt: 241113, status: 'confirmed', note: '✅ 부킹닷컴 예매 · Plaza de Fonseca 5 (대성당 광장 중 하나, 도보 30초!) · 수페리어 트윈룸 정원 전망 · 전용 욕실+발코니 · 짐 보관 OK (포르토에서 캐리어 직송 가능)' },
      { label: '🇨🇭 루체른 Visionary Hospitality 2박 (4명, 아파트)', amt: 1198404, status: 'confirmed', note: '✅ 부킹닷컴 Genius · 38 Bertiswilstrasse, 6023 Rothenburg (역 북쪽 8.6km) · 단독 사용 아파트 (정원 6인) · 발코니·주방·세탁기 · 6/24-26 · 무료 취소' },
      { label: '🧑 둘째 단독 6/23 1박 — Capsule Hotel Lucerne Old Town', amt: 182214, status: 'confirmed', note: '✅ 부킹닷컴 Genius (10% 할인) · 33 Zürichstrasse, 6004 Lucerne · 캡슐룸 고층 · 1명 · LX333 ZRH 16:35 도착 → 시내 카펠교 야경 + 비어가든' },
      { label: '⛰️ 체르마트 졸리몬트 아파트먼트 2박 (4명, Alpine Apartment)', amt: 1430285, status: 'confirmed', note: '✅ 부킹닷컴 예매 · ★★★★ · Flecksteinweg 9 · 4인 단독 아파트 · 무료 취소 옵션' },
      { label: '🇨🇭 인터라켄 SWEET HOLIDAY HOME NO.1 2박 (4명, 단독 아파트)', amt: 1196804, status: 'confirmed', note: '✅ 부킹닷컴 Genius (10% 할인) · 18 Rosenstrasse, 3800 Interlaken (중심부 9.4점) · 단독 아파트+테라스+전용 욕실+풀 주방 · 무료 취소 · 6/28-29 · 체크인 17-21:30' },
      { label: '🇬🇧 캠브리지 Hyatt Centric 1박 (3명, 디럭스 패밀리룸)', amt: 451433, status: 'confirmed', note: '✅ 부킹닷컴 예매 · 37 Eddington Avenue · 초대형 더블+소파베드 · 31㎡ · 둘째는 본인 학생 숙소 (3인) · 기존 ₩700k 대비 ₩248,567 절감' },
      { label: '🇫🇷 파리 Hôtel Sanso by HappyCulture (7/1 arrival 1박)', amt: 479202, status: 'confirmed', note: '✅ 예매완료 · Grande Bibliothèque 지역 (13구) · Eurostar 도착 후 1박 · Booking.com' },
      { label: '🇫🇷 파리 Hampton By Hilton Saint Ouen (7/2-7/8, 6박, 3명)', amt: 2949756, status: 'confirmed', note: '✅ 예매완료 · Saint-Ouen (파리 北 인접, Métro 13+14 + RER C 트리플 연결) · ⚠️ 원래 Clichy 아파트에서 변경 (2026-07-02)' },
      { label: '🇫🇷 파리 Hampton by Hilton 아들친구 방 2박 (7/2-7/4)', amt: 658573, status: 'confirmed', note: '✅ 예매완료 · 아들친구용 추가 방 (동일 호텔) · 2박' },
    ],
  },
  {
    id: 'food', cat: '🍽️ 식비', amt: '₩7,600,000', amtNum: 7600000,
    detail: '단계별 인원·일수 × 1일 예산 (전부 미정)',
    pct: 17, color: '#16A34A',
    actual: 3313638,
    settleNote: '결산 ₩3,313,638 — 포르투갈·스페인 카미노(알베르게·마트) + 스위스(Coop·Migros) + 파리 식당 (VIVA X·현대카드). 예산 대비 −₩4.29M 절감 (자취·마트 활용)',
    breakdown: [
      { label: '🇵🇹 포르토 2일×2명 × ₩90K', amt: 360000, status: 'pending' },
      { label: '🐚 카미노 11일×2명 × ₩50K', amt: 1100000, status: 'pending', note: '알베르게 + 시골 식당 기준' },
      { label: '🇨🇭 스위스 6일×3-4명 × ₩120K', amt: 2520000, status: 'pending', note: '체르마트 비쌈, 라클렛/퐁듀 포함' },
      { label: '🇬🇧 캠브리지 2일×4명 × ₩100K', amt: 800000, status: 'pending' },
      { label: '🇫🇷 파리 8일×3명 × ₩115K', amt: 2820000, status: 'pending', note: '비스트로 + Mont-Saint-Michel 등 외식' },
    ],
  },
  {
    id: 'transport', cat: '🚄 교통', amt: '₩2,594,001', amtNum: 2594001,
    detail: 'Swiss Travel Pass + OPO Uber + 카미노 캐리어 운반 (TopSantiago ✅) + 시내 이동',
    pct: 5, color: '#7C3AED',
    actual: 4580530,
    settleNote: '결산 ₩4,580,530 — 스위스트래블패스(SBB)·공항기차·영국 Trainline(재발권)·파리 Navigo·우버·택시·캐리어운반(TopSantiago). 예산 대비 +₩2.0M',
    breakdown: [
      { label: '🇨🇭 둘째 Swiss Travel Pass Youth 8일', amt: 527000, status: 'confirmed', note: '✅ 2026-06-14 SBB 공식 구매 · CHF 311 · 유효 6/23-7/1 05:00' },
      { label: '🇨🇭 부부+큰아들 Saver 6일 (3명)', amt: 1700000, status: 'pending', note: 'CHF 386/인 × 3 Saver 묶음 · 6/25 시작' },
      { label: '🚂 부부 6/24 ZRH→Luzern 점-점', amt: 90000, status: 'pending', note: 'CHF 27×2 SuperSaver · Saver 패스 시작 전 1시간 이동' },
      { label: '🚖 Uber OPO→Vila Nova de Gaia (6/12 야간)', amt: 45000, status: 'pending', note: '€25-30 · 22:55 도착 직행' },
      { label: '🐚 카미노 캐리어 픽업 × 2개 — TopSantiago', amt: 249001, status: 'confirmed', note: '✅ 예매완료 (topsantiago.com) · 부부 캐리어 2개 Porto→Santiago 구간 단위 운반 · 배송 추적: topsantiago.com' },
      { label: '🇫🇷 파리 Navigo 주간권 × 3명', amt: 135000, status: 'pending', note: '€30×3' },
      { label: '🇬🇧 LHR ↔ Cambridge + 시내 (4명)', amt: 250000, status: 'pending' },
    ],
  },
  {
    id: 'admission', cat: '🎫 체험·입장료', amt: '₩2,500,000', amtNum: 2500000,
    detail: '스위스 산악열차 + 파리 미술관·궁전·당일치기 (전부 미예매)',
    pct: 6, color: '#F59E0B',
    actual: 3069008,
    settleNote: '결산 ₩3,069,008 — 융프라우·고르너그라트·수네가·필라투스(산악열차) + 베르사유·지베르니 모네·생트샤펠·오디오가이드·투어(MY TOP TOUR). 예산 대비 +₩0.57M',
    breakdown: [
      { label: '🏔️ Mt. Pilatus Golden Round × 4', amt: 480000, status: 'pending', note: 'CHF 78/인 (Swiss Pass 50% 할인)' },
      { label: '⛰️ Gornergrat (마테호른) × 4', amt: 815000, status: 'pending', note: 'CHF 132/인' },
      { label: '🏔️ 융프라우요호 × 4 ✅', amt: 1300000, status: 'confirmed', note: '✅ jungfrau.ch · 08:04 Interlaken Ost · STP 2nd class 할인' },
      { label: '👑 베르사유 Passport ✅ × 3', amt: 185000, status: 'confirmed', note: '✅ 예매완료 · Billet Passeport €35/인 × 3 = €105 · 7/3 (금) 10:30 Entrance A · 예약자 명의' },
      { label: '🖼️ 루브르 박물관 ✅ × 3', amt: 170000, status: 'confirmed', note: '✅ 예매완료 · 7/4 (토) 11:30 입장 · Entrée Plein tarif hors EEE (Non-EEA 성인) €32/인 × 3 = €96 (~₩170K)' },
      { label: '🏰 메르시파리 패키지 ✅ × 3 (몽생미셀+지베르니+옹플뢰르 한국어 가이드 16h)', amt: 717000, status: 'confirmed', note: '✅ 예매완료 · 7/6 (월) 07:20 트로카데로 집합 · 239,000원/인 × 3 · 입장료/식사 별도' },
      { label: '🎫 메르시파리 입장료 (MSM €16 + 지베르니 €13) × 3', amt: 155000, status: 'pending', note: '⚠️ 현장 결제 — 7/6 가이드 안내에 따라' },
      { label: '🚐 메르시파리 Saint-Ouen 호텔 픽업 추가비 (2존)', amt: 64000, status: 'pending', note: '⚠️ €40 (Saint-Ouen 2존, 메르시파리 카톡 확정) · Hampton by Hilton 호텔 직접 픽업 + 새벽 샌딩 포함' },
      { label: '🎨 오르세 도슨트 + 입장 ✅ × 3', amt: 0, status: 'confirmed', note: '✅ 예매완료 · 7/2 (목) 13:30 한국어 도슨트 · 사용자 직접 결제' },
      { label: '🍽️ Vendredi gourmand 김어준 저녁 ✅', amt: 0, status: 'confirmed', note: '✅ 예매완료 · 7/2 (목) 18:00-19:30 · 식비 카테고리 별도' },
      { label: '🎧 루브르 한국어 오디오 가이드 × 3', amt: 27000, status: 'pending', note: '⚠️ 현장 결제 €5/인 × 3 = €15 · 입장 후 안내데스크' },
      { label: '⛪ 노트르담 대성당 내부 (2024 재개관, 무료)', amt: 0, status: 'pending', note: '⚠️ 슬롯 예약 · notredamedeparis.fr 또는 공식 앱 · 7/7 (화) 16:00 슬롯 목표 · 폐관 19:00' },
      { label: '⛪ 생트샤펠 × 3 (7/7)', amt: 24000, status: 'pending', note: '€13/인 × 3 = €39 (~₩70K) · 노트르담 옆 · 여름 폐관 19:00' },
    ],
  },
  {
    id: 'misc', cat: '💝 기타·예비', amt: '₩1,000,000', amtNum: 1000000,
    detail: '기념품·쇼핑·예비비 (전부 미정)',
    pct: 3, color: '#475569',
    actual: 72169,
    settleNote: '결산 ₩72,169 — 영국 ETA(전자여행허가) ₩43,185 + 셰익스피어앤코 서점 ₩28,984. 기념품·쇼핑은 카드 외(현금) 가능성. 예산 대비 −₩0.93M',
    breakdown: [
      { label: '🎁 기념품·선물 (가족·지인)', amt: 400000, status: 'pending' },
      { label: '🛍️ 쇼핑 (파리·런던)', amt: 300000, status: 'pending' },
      { label: '⚠️ 예비비 (응급·환율 변동)', amt: 300000, status: 'pending', note: '스위스 물가 높음 고려' },
    ],
  },
];

export const FLIGHTS: FlightData[] = [
  { type: '출발', from: 'ICN 인천', to: 'OPO 포르토', date: '2026.06.12 (금) 12:20 → 22:55', note: '✅ 예매완료 · 👫 부부 2명 · 🇩🇪 Lufthansa LH713 (A350-900, ICN 12:20→FRA 18:40, 13h 20m) + LH1180 (A321NEO, FRA 21:05→OPO 22:55, 2h 50m) · FRA 환승 2h 25m · 총 18h 35m · Economy Basic Plus · 좌석 30J·30K/20E·20F' },
  { type: '경유', from: 'SCQ 산티아고', to: 'ZRH 취리히', date: '2026.06.24 (수) 15:10 → 20:25', note: '✅ 예매완료 + 아빠 이름 정정 완료 (6/10) · 👫 부부 2명 · 🇪🇸 부엘링 VY1673 (SCQ→BCN, 1h 40m) + VY6248 (BCN→ZRH, 1h 55m) · BCN 환승 1h 40m · 수하물 직통 ✅ 위탁 25kg/인' },
  { type: '합류', from: 'LHR 런던', to: 'ZRH 취리히', date: '2026.06.23 (화) 13:50 → 16:35', note: '✅ 예매완료 · 🧑 둘째 1명 (하루 일찍 출발, 스위스 1일 단독 관광 후 가족 합류) · 🇨🇭 Swiss LX333 (Airbaltic BT 공동운항) LHR T2→ZRH 직항 · 1h 45m · 개인물품만 (휴대·위탁 없음)' },
  { type: '합류', from: 'ICN 인천', to: 'ZRH 취리히', date: '2026.06.25 (목) 11:05 → 17:25', note: '✅ 예매완료 🧑 큰아들 1명 · 🇰🇷 KE917 직항 (B787-10) · 13h 20m · 일반석 스탠다드' },
  { type: '경유', from: 'ZRH 취리히', to: 'LHR 런던', date: '2026.06.30 (화) 12:05 → 13:00', note: '✅ 예매완료 · 👨‍👩‍👧‍👦 가족 4명 · 🇨🇭 Swiss LX332 (Airbaltic BT 공동운항) ZRH→LHR T2 직항 · 1h 55m · 위탁 23kg/인 + 휴대 8kg/인 포함' },
  { type: '귀국-둘째', from: 'LGW 런던 개트윅', to: 'ICN 인천', date: '2026.07.01 (수) 21:10 → 07.02 (목) 21:35', note: '✅ 예매완료 · 👤 둘째 1명 · 🇨🇳 베이징캐피탈 JD484 LGW→칭다오 + 🇨🇳 칭다오항공 QW901 칭다오→ICN · 칭다오 4h 10m 환승 (⚠️ 수하물 직통연결 불가, 재수속 필요) · 위탁 23kg×2 / 휴대 5kg×1' },
  { type: '경유', from: 'London 세인트팬크라스', to: 'Paris 가르 뒤 노르', date: '2026.07.01 (수) 19:01 → 22:19', note: '✅ 예매완료 · 👨‍👩‍👦 3명 · 🚄 Eurostar Standard · 2h 18m · Coach 5' },
  { type: '귀국', from: 'CDG 파리', to: 'ICN 인천', date: '2026.07.08 (수) 12:00 → 07.09 (목) 09:55', note: '✅ 예매완료 👨‍👩‍👦 3명 · 🇩🇪 Lufthansa LH2229 + LH718 (MUC 환승, 2h 25m) · 14h 55m · Economy Green (위탁 23kg, 휴대 8kg)' },
];

export const TRANSPORTS: Transport[] = [
  { route: 'OPO 공항 → Vila Nova de Gaia 호텔 (6/12 야간)', method: '🚖 Uber 또는 Bolt', time: '30-40분', price: '', tip: '⭐ 22:55 도착·메트로 환승 복잡·짐 있음 → Uber 직행 강추. 한국에서 미리 앱 설치+카드 등록. Bolt가 보통 Uber보다 저렴' },
  { route: 'Vila Nova de Gaia ↔ 포르토 시내 (6/13)', method: '🚇 메트로 D선 (Jardim do Morro) 또는 🚶 동 루이스 1세 다리 도보', time: '도보 15-20분 / 메트로 5분', price: '', tip: '다리 도보는 도루강 뷰 + 포트와인 셀러 산책 코스. 짐 없을 때 도보 추천' },
  { route: '산티아고 → 취리히 (6/26)', method: '✈️ Iberia (MAD 환승)', time: '5-6h', price: '', tip: '부부 2명 동시 예매. 환승 1회' },
  { route: '취리히 공항 → 루체른 (6/26)', method: '🚂 IC/IR 직행 열차', time: '1h', price: '', tip: 'Swiss Travel Pass 적용 가능' },
  { route: '루체른 → 인터라켄 (6/28)', method: '🚂 GoldenPass Line', time: '~2h (파노라마)', price: '', tip: '⭐ 사전 좌석 예약 권장 (창가/파노라마칸)' },
  { route: 'Mt. Pilatus 왕복 (6/27)', method: '🚠 톱니바퀴 + 케이블카', time: '~5h (Golden Round)', price: '', tip: 'Swiss Travel Pass 50% 할인 적용' },
  { route: '인터라켄 → 융프라우요호 왕복 (6/29)', method: '🚂 산악열차 (Eiger Express)', time: '08:04→09:13(정상 09:45경) · 13:45→14:51 복귀', price: '', tip: '✅ 예매완료 · 좌석예약 (10분 전 도착) · 4명 PDF 체크리스트 첨부' },
  { route: '인터라켄 → 취리히 (6/30)', method: '🚂 IC 직행', time: '2h', price: '', tip: '오전 출발 권장' },
  { route: '취리히 → 런던 (6/30)', method: '✈️ Swiss/BA 직항', time: '1h 45m', price: '', tip: '오후 비행, LHR 도착 후 Cambridge 이동' },
  { route: 'LHR → 캠브리지 (6/30)', method: '🚇 Elizabeth Line + 🚂 LNER', time: '~2.5h (Paddington→Kings Cross→Cambridge)', price: '', tip: '둘째는 캠브리지서 합류' },
  { route: '3명: 캠브리지 → King\'s Cross → St Pancras → 파리 (7/1)', method: '🚂 GTR 기차 (Cambridge→King\'s Cross 50분) + 도보 5분 + 🚄 Eurostar 저녁편', time: '~4h', price: '', tip: '⭐ King\'s Cross 도착 후 둘째와 같은 St Pancras에서 갈림 (둘째 Thameslink LGW행 / 3명 Eurostar 파리행). 사전 예매 필수' },
  { route: '둘째: 런던 → LGW 개트윅 (7/1)', method: '🚂 Thameslink 직행 (St Pancras→Gatwick)', time: '~45min', price: '', tip: '⚠️ JD484 21:10 — 18시까지 LGW 도착 목표 (3h 여유). Thameslink Gatwick 직행이 편리.' },
  { route: 'CDG → 파리 시내 (7/1)', method: '🚇 RER B', time: '45-60분', price: '', tip: 'Navigo Découverte 주간권 권장' },
  { route: '파리 → 베르사유 왕복 (7/3)', method: '🚂 RER C → Château Rive Gauche', time: '45분', price: '', tip: '✅ 베르사유 Passport 예매완료 (10:30 Entrance A) · 09:15 RER 탑승 → 10:15 도착 → 10:30 입장' },
  { route: '🏰 ✅ 메르시파리 패키지 (7/6) — 몽생미셀+지베르니+옹플뢰르', method: '🚐 한국어 가이드 차량 16h', time: '07:20 출발 → 새벽 1-2시 복귀', price: '', tip: '✅ 예매완료 · 트로카데로 2·3번 출구 Café le Malakoff 앞 집합 · 입장료 별도 (MSM + 지베르니)' },
  { route: '파리 시내 → CDG (7/6)', method: '🚇 RER B', time: '45-60분', price: '', tip: '✈️ KE5904 19:10 출발 — 17시까지 도착 목표' },
];

export const CHECKLIST: ChecklistCategory[] = [
  {
    title: '✈️ 항공권 예매 (7건, 출발일 순)',
    items: [
      {
        label: '👫 부부 ICN → FRA → OPO',
        day: 'Day 1', date: '6/12 (금)', target: '👫 부부', count: '2명', route: 'ICN → FRA → OPO', code: 'LH713+LH1180', time: '12:20 → 22:55', price: '', status: 'completed',
        note: 'FRA 환승 2h 25m · A350-900+A321NEO · Economy Basic Plus · 좌석 30J·30K/20E·20F',
        booking: { ref: '', platform: 'Swiss Air shop (Lufthansa 운항)' },
      },
      {
        label: '🧑 둘째 LHR → ZRH (Swiss 직항)',
        day: 'Day 12', date: '6/23 (화)', target: '🧑 둘째', count: '1명', route: 'LHR → ZRH', code: 'LX333', time: '13:50 → 16:35', price: '', status: 'completed',
        note: '직항 1h 45m · Airbaltic BT 공동운항 · 개인물품 1개만 · 하루 앞당겨 스위스 1일 단독 관광 · ⚠️ cabin baggage LHR 카운터에서 당일 추가',
        booking: { ref: '', platform: 'Trip.com' },
      },
      {
        label: '👫 부부 SCQ → BCN → ZRH (Vueling)',
        day: 'Day 13', date: '6/24 (수)', target: '👫 부부', count: '2명', route: 'SCQ → BCN → ZRH', code: 'VY1673+VY6248', time: '15:10 → 20:25', price: '', status: 'completed',
        note: '✅ 아빠 이름 정정 완료 (6/10) · BCN 환승 1h 40m, 수하물 직통 · 위탁 25kg/인',
        booking: { platform: 'Trip.com' },
      },
      {
        label: '🇰🇷 큰아들 ICN → ZRH (KE 직항)',
        day: 'Day 14', date: '6/25 (목)', target: '🇰🇷 큰아들', count: '1명', route: 'ICN → ZRH', code: 'KE917', time: '11:05 → 17:25', price: '', status: 'completed',
        note: 'B787-10 직항 13h 20m · Economy Standard',
        booking: { platform: '네이버 항공권 (Korean Air 운항)' },
      },
      {
        label: '👨‍👩‍👦‍👦 가족 ZRH → LHR (Swiss 직항)',
        day: 'Day 19', date: '6/30 (화)', target: '👨‍👩‍👦‍👦 가족', count: '4명', route: 'ZRH → LHR T2', code: 'LX332', time: '12:05 → 13:00', price: '', status: 'completed',
        note: '직항 1h 55m · 위탁 23kg+휴대 8kg/인',
        booking: { ref: '', platform: 'Trip.com' },
      },
      {
        label: '🧑 둘째 LGW → 칭다오 → ICN',
        day: 'Day 20', date: '7/1 (수)', target: '🧑 둘째', count: '1명', route: 'LGW → TAO → ICN', code: 'JD484+QW901', time: '21:10 → 7/2 21:35', price: '', status: 'completed',
        note: '칭다오 4h 10m 환승 · ⚠️ 수하물 직통연결 불가 (재수속 필요)',
        booking: { ref: '', platform: 'Trip.com' },
      },
      {
        label: '👨‍👩‍👦 3명 CDG → MUC → ICN (LH 귀국)',
        day: 'Day 27', date: '7/8 (수)', target: '👨‍👩‍👦 가족', count: '3명', route: 'CDG → MUC → ICN', code: 'LH2229+LH718', time: '12:00 → 7/9 09:55', price: '', status: 'completed',
        note: 'MUC 환승 2h 25m · Economy Green · 위탁 23kg+휴대 8kg',
        booking: { platform: 'Lufthansa 공식' },
      },
    ],
  },
  {
    title: '🚂 기차·페리·육상 교통',
    items: [
      { label: '🚖 Uber/Bolt 앱 설치 + 카드 등록 (OPO 도착 대비)', day: 'Day 1', date: '6/12 (금)', target: '👫 부부', count: '2명', route: 'OPO → Vila Nova de Gaia', price: '', status: 'pending', note: '⚠️ 출국 전 한국에서 미리 설치 + 결제수단 등록 (해외에서 SMS 인증 문제 회피). 22:55 도착이라 직행 Uber 필수. Bolt가 보통 저렴' },
      {
        label: '🇨🇭 둘째 Swiss Travel Pass Youth 8일 (Continuous)',
        day: 'Day 12-19', date: '6/23-30', target: '🧑 둘째', count: '1명', code: '', price: '', status: 'completed',
        note: '✅ 2026-06-14 SBB 공식 구매 · Youth 16-24.99 · 2등석 · 유효 23.06.2026 → 01.07.2026 05:00 · 융프라우요호 25% 할인 + Pilatus·Gornergrat 50% 할인 + Lake Lucerne 보트·박물관·시내교통 무료',
        link: { url: 'https://www.sbb.ch/en/travelcards-and-tickets/tickets-for-switzerland/swiss-travel-pass.html', label: 'SBB Swiss Travel Pass' },
        booking: {
          contactName: '예약자 명의 (둘째)',
          platform: 'SBB.ch (공식)',
          accessNote: '📎 e-pass PDF 첨부 → 둘째 폰 SBB Mobile 앱에 reference로 등록 또는 PDF QR 직접 사용. 검표 시 QR 보여주기.',
        },
      },
      {
        label: '🇨🇭 부부+큰아들 Swiss Travel Pass Saver 6일',
        day: 'Day 14-19', date: '6/25-30', target: '👫🇰🇷 부부+큰아들', count: '3명 (Saver 묶음)', price: '', status: 'pending',
        note: '🎫 Saver 15% 할인 · 3명 한 주문에 동시 결제 필수 · 첫 활성화 6/25 동일 · 부부 첫 사용 6/25 Pilatus + 큰아들 6/25 ZRH→Lucerne · 융프라우 25% + Gornergrat 50% 할인',
        link: { url: 'https://www.sbb.ch/en/travelcards-and-tickets/tickets-for-switzerland/swiss-travel-pass.html', label: 'SBB Swiss Travel Pass' },
      },
      {
        label: '🚂 부부 6/24 ZRH 공항 → Luzern (Swiss Pass 시작 전, 점-점 티켓)',
        day: 'Day 13', date: '6/24 (수)', target: '👫 부부', count: '2명', route: 'ZRH 공항 → Luzern', time: '21시경 출발, ~1h10m', price: '', status: 'pending',
        note: '⚠️ Saver 6일 패스 시작이 6/25라 6/24 저녁 1시간 이동만 점-점 결제. 현지 도착 후 SBB Mobile 앱에서 SuperSaver 잡기',
      },
      { label: '🚤 Caminha → A Guarda 페리 (Río Miño)', day: 'Day 6', date: '6/17 (수)', target: '👫 부부', count: '2명', route: 'Caminha → A Guarda', price: '', status: 'pending', note: '오후 16-18시편 추천 (전날 횡단으로 결정) · 시간표 사전 확인 필수' },
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
        day: 'Day 20', date: '7/1 (수)', target: '👨‍👩‍👦 3명', count: '3명', route: 'St Pancras → Gare du Nord', code: 'Eurostar Standard', time: '19:01 → 22:19 (2h 18m)', price: '', status: 'completed',
        note: 'Coach 5',
        booking: { platform: 'Eurostar 공식' },
      },
    ],
  },
  {
    title: '🏨 호텔·숙소 예약 (9건, 총 26박)',
    items: [
      {
        label: '🇵🇹 포르토 SANTA RITA Guesthouse B&B',
        day: 'Day 1-2', date: '6/12-13', target: '👫 부부', count: '2명 · 더블룸', price: '', status: 'completed',
        note: '✅ 부킹닷컴 예매 · Vila Nova de Gaia (강 건너편, 포트와인 셀러 옆) · 더블룸 전용 외부욕실 · 조식포함 · 발코니+정원 · ⚠️ 환불불가',
        booking: {
          address: 'R. Santa Rita 58, 4430-219 Vila Nova de Gaia, Portugal',
          contactName: '예약자 명의',
          platform: 'Booking.com',
          accessNote: '⚠️ Eurostar 22:55 OPO 도착 → Uber로 ~00:15 도착 예정. Booking.com에서 도착시간 "23:00 이후"로 사전 업데이트 필수',
        },
      },
      { label: '🌊 해안길 알베르게/펜션 4박', day: 'Day 3-6', date: '6/14-17', target: '👫 부부', count: '2명 · 더블룸', note: 'Vila do Conde · Esposende · Viana do Castelo · Caminha · 사립 펜션 권장', status: 'pending' },
      { label: '🌳 중앙길 알베르게/펜션 5박', day: 'Day 7-11', date: '6/18-22', target: '👫 부부', count: '2명 · 더블룸', note: 'Tui · Redondela · Pontevedra · Caldas de Reis · Padrón · 사립 펜션 권장', status: 'pending' },
      {
        label: '⭐ 산티아고 Libredón Rooms (자축)',
        day: 'Day 12', date: '6/23', target: '👫 부부', count: '2명', price: '', status: 'completed',
        note: '✅ 부킹닷컴 예매 · Plaza de Fonseca 5 (대성당 광장!) · 수페리어 트윈룸 정원 전망 · 짐 보관 OK (포르토에서 캐리어 직송 가능)',
        booking: {
          address: 'Plaza de Fonseca, 5, 15705 Santiago de Compostela, Spain',
          checkInTime: '14:00-23:00',
          checkOutTime: '12:00까지',
          contactName: '예약자 명의',
          platform: 'Booking.com',
          accessNote: '카미노 완주일 정오 미사 → 14시 이후 체크인. 큰 짐 보관 요청 사전 이메일 (Porto → Santiago 캐리어 직송)',
        },
      },
      {
        label: '🇨🇭 루체른 Visionary Hospitality Rothenburg (Premium Apartment)',
        day: 'Day 13-14', date: '6/24-25', target: '👨‍👩‍👦 → 👨‍👩‍👦‍👦', count: '3명 → 4명 (D14 저녁부터) · 단독 아파트 (정원 6인)', price: '', status: 'completed',
        note: '✅ 예매완료 · 단독 사용 아파트 · 발코니·산 전망·주방·세탁기·전용 입구 · 무료 주차 · ⚠️ 루체른역 8.6km (PostBus 60번 시내 ~15분, Swiss Travel Pass 무료)',
        booking: {
          contactName: '예약자 명의',
          checkInTime: '15:00~',
          checkOutTime: '~10:00',
          address: '38 Bertiswilstrasse, 6023 Rothenburg, Switzerland',
          platform: 'Booking.com',
          accessNote: '⚠️ 6/24 부부 22시 도착 → ZRH 짐 + 기차 1h → Lucerne 22시 → PostBus 60번 막차 23시 전에 잡기 (지연 시 Uber)',
        },
      },
      {
        label: '🧑 둘째 단독 6/23 1박 — Capsule Hotel Lucerne Old Town',
        day: 'Day 12', date: '6/23', target: '🧑 둘째', count: '1명 · 캡슐룸', price: '', status: 'completed',
        note: '✅ 예매완료 · 캡슐룸 고층 · 시내 위치 (카펠교 도보권) · 고속 Wi-Fi · 공용 욕실',
        booking: {
          contactName: '예약자 명의 (둘째)',
          checkInTime: '14:00~24:00',
          checkOutTime: '01:00~10:30',
          address: '33 Zürichstrasse, 6004 Lucerne, Switzerland',
          platform: 'Booking.com',
          accessNote: 'LX333 ZRH 16:35 도착 → 기차 1h → 18시경 도착 → 캡슐 체크인 후 카펠교 야경/비어가든 단독 산책. 다음날 PostBus로 Visionary (Rothenburg) 합류',
        },
      },
      {
        label: '⛰️ 체르마트 졸리몬트 아파트먼트 (Alpine Apartment)',
        day: 'Day 15-16', date: '6/26-27', target: '👨‍👩‍👦‍👦 가족', count: '4명 · 단독 아파트', price: '', status: 'completed',
        note: '✅ 예매완료 · ★★★★ · 4인 단독 아파트 · 전용 욕실+발코니+산 전망 · 주방·세탁·DVD 풀옵션',
        booking: {
          ref: '',
          pin: '9112',
          phone: '',
          contactName: '예약자 명의',
          checkInTime: '14:00-18:30',
          checkOutTime: '07:00-09:00',
          address: 'Flecksteinweg 9, 3920 체르마트, 스위스',
          platform: 'Booking.com',
          accessNote: '체크인 18:30 마감 — 산티아고 출발 일정 지연 시 호스트 사전 연락 필수. 체르마트 차량 통제, 역에서 e-taxi 또는 도보 이동',
        },
      },
      {
        label: '🇨🇭 인터라켄 SWEET HOLIDAY HOME NO.1 (단독 아파트 + 테라스)',
        day: 'Day 17-18', date: '6/28-29', target: '👨‍👩‍👦‍👦 가족', count: '4명 · 단독 아파트 정원 5', price: '', status: 'completed',
        note: '✅ 예매완료 · 중심부 (위치 점수 9.4) · 단독 아파트 + 테라스 + 전용 욕실 + 풀 주방',
        booking: {
          contactName: '예약자 명의',
          checkInTime: '17:00~21:30 ⚠️',
          checkOutTime: '07:00~10:00',
          address: '18 Rosenstrasse 1 floor, 3800 Interlaken, Switzerland',
          platform: 'Booking.com',
          accessNote: '⚠️ 체크인 21:30 마감 — Harder Kulm은 17시 이후 도착 후 빠르게 다녀와도 시간 빠듯. 또는 다음날 (Day 18 융프라우 후) 저녁 일정으로 조정 검토',
        },
      },
      {
        label: '🎓 캠브리지 Hyatt Centric — 디럭스 패밀리룸',
        day: 'Day 19', date: '6/30', target: '👨‍👩‍👦 부부+큰아들', count: '3명 (둘째 본인 학생 숙소)', price: '', status: 'completed',
        note: '✅ 예매완료 · 31㎡ · 초대형 더블+소파베드 · 정원 전망 · 무료 자전거·주차·피트니스 · 4성 · 평점 8.5 (2,817리뷰)',
        booking: {
          contactName: '예약자 명의',
          checkInTime: '15:00~',
          checkOutTime: '~12:00',
          address: '37 Eddington Avenue, Cambridge, CB3 1SE, 영국',
          platform: 'Booking.com',
          accessNote: '⚠️ Eddington 북서 신개발지구 (시내 5.6km) · 시내까지 자전거 15분 / 우버. 호텔 무료 자전거 활용 가능. 18세 이상만 투숙 가능.',
        },
      },
      {
        label: '🇫🇷 파리 Hôtel Sanso by HappyCulture (7/1 arrival 1박)',
        day: 'Day 20', date: '7/1 (수)', target: '👨‍👩‍👦 가족', count: '3명', price: '', status: 'completed',
        note: '✅ 예매완료 · Grande Bibliothèque 지역 (파리 13구) · Eurostar 22:19 도착 → 1박 후 다음날 오전 Hampton by Hilton으로 이동',
        booking: {
          platform: 'Booking.com',
          accessNote: '⚠️ Eurostar 22:19 도착 → Uber 또는 Métro로 이동 · 체크인 시간 예약 확인 필요',
        },
      },
      {
        label: '🇫🇷 파리 Hampton By Hilton Paris Saint Ouen (7/2-7/8, 6박)',
        day: 'Day 21-26', date: '7/2-7/8', target: '👨‍👩‍👦 가족', count: '3명', price: '', status: 'completed',
        note: '✅ 예매완료 · Saint-Ouen-sur-Seine (파리 北 인접, 93구) · Hilton 체인 · Marché aux Puces 벼룩시장 인근 · 몽마르뜨·사크레쾨르 20분 · ⚠️ 원래 Clichy 아파트에서 변경 (2026-07-02) · 아들친구용 추가 방 2박 (7/2-7/4) 별도',
        booking: {
          platform: 'Booking.com',
          address: 'Saint-Ouen-sur-Seine, France',
          accessNote: '⭐ Saint-Ouen 역 (Métro 14 + RER C) 도보 1분 · 조식 별도 옵션 확인 · 체크인 15:00 예상 (Hilton 표준)',
        },
      },
    ],
  },
  {
    title: '🛂 비자·서류·ETA·금융',
    items: [
      {
        label: '🇬🇧 UK ETA 신청 ✅ 완료',
        date: '6/11 (목)', target: '👫부부+큰아들', count: '3명', price: '', status: 'completed',
        note: '✅ 3명 모두 신청 완료 · 승인 메일 폰 캡처 보관 (6/30 LHR 입국 시 보여줄 수 있음) · 둘째는 영국 거주라 불필요 · 유효 2년',
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
          '💳 ⑥ 결제 (2026-04-08 인상). 3명이면 **3건 별도 신청+결제**. 결제는 Google Pay/Apple Pay/카드',
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
          '🆕 ⑤ (참고) 시행 후 신청 시: 만 18-70세, 온라인 10분, 유효 3년',
        ],
      },
      { label: '📕 여권 유효기간 6개월 이상 확인', target: '👨‍👩‍👦‍👦 가족', count: '4명', status: 'pending' },
      { label: '🛡️ 여행자 보험 가입', target: '👨‍👩‍👦‍👦 가족', count: '4명', note: '하이킹·산악·의료 커버 포함', status: 'pending' },
      { label: '🐚 순례자 크리덴셜 (Credencial del Peregrino)', date: '6/14 첫날', target: '👫 부부', count: '2명', note: '포르토 대성당에서 수령', status: 'pending' },
      { label: '🏢 회사 휴가 신청 (6/12 ~ 7/9)', date: '6/12 ~ 7/9', target: '👫 부부', note: '7/10 금 또는 7/13 월 출근 권장', status: 'pending' },
      { label: '💳 신용카드 해외 사용 가능 확인', target: '👨‍👩‍👦‍👦 가족', count: '2장 이상', note: '카드사 출국 알림 + 한도 확인', status: 'pending' },
      { label: '💵 환전·현금 준비', target: '👨‍👩‍👦‍👦 가족', price: '', note: '또는 현지 ATM 인출 계획', status: 'pending' },
      { label: '📄 예약 확인서 출력/PDF 저장', note: '항공·호텔·기차·입장권 · 이메일 폴더 정리', status: 'pending' },
      { label: '📋 여권 사본 별도 보관 (클라우드 백업)', target: '👨‍👩‍👦‍👦 가족', count: '4명', note: '분실 대비', status: 'pending' },
    ],
  },
  {
    title: '🎫 관광 입장권·체험 사전 예매',
    items: [
      { label: '🍷 포르토 포트와인 셀러 투어', day: 'Day 2', date: '6/13', target: '👫 부부', count: '2인', note: 'Taylor\'s 또는 Graham\'s', status: 'pending' },
      { label: '🏔️ Mt. Pilatus Golden Round Trip', day: 'Day 14', date: '6/25', target: '👨‍👩‍👦‍👦 가족', count: '4인', price: '', note: 'Swiss Pass 50% 할인 · 큰아들 합류 다음 날', status: 'pending' },
      { label: '⛰️ Gornergrat 톱니바퀴열차', day: 'Day 16', date: '6/27', target: '👨‍👩‍👦‍👦 가족', count: '4인', price: '', note: '마테호른 클래식 뷰', status: 'pending' },
      {
        label: '⛰️ 융프라우요호 Top of Europe ✅ 예매완료',
        day: 'Day 18', date: '6/29 (월)', target: '👨‍👩‍👦‍👦 가족', count: '4인', code: '', price: '', status: 'completed',
        note: '✅ 예매완료 · 08:04 Interlaken Ost 출발 → 09:13 Eigergletscher → 융프라우요호 (좌석예약) → 약 09:45 도착 · 13:45 융프라우 출발 → 14:51 Interlaken Ost 복귀 · 체류 약 4시간',
        link: { url: 'https://www.jungfrau.ch/en-gb/jungfraujoch-top-of-europe/', label: '융프라우 공식' },
        booking: { ref: '', platform: 'jungfrau.ch', accessNote: '⚠️ 출발 10분 전 도착 필수 · "with seat reservation" 파란 표지판 따라가기 · QR 4명 분 e-ticket 체크리스트 첨부 PDF' },
      },
      { label: '🚣 캠브리지 펀팅 보트', day: 'Day 19-20', date: '6/30 or 7/1', target: '👨‍👩‍👦‍👦 가족', count: '4인', status: 'pending' },
      {
        label: '🎨 오르세 미술관 ✅ 예매완료 (도슨트 13:30 + 입장)',
        day: 'Day 21', date: '7/2 (목)', target: '👨‍👩‍👦 가족', count: '3인', status: 'completed',
        note: '✅ 예매완료 · 한국어 도슨트 13:30 · 인상파 핵심 동선 (모네·고흐·세잔·드가) · 약 3시간 · 휴관: 월요일 (7/2 목 OK)',
        link: { url: 'https://www.musee-orsay.fr/en', label: '오르세 공식' },
      },
      { label: '🍽️ Vendredi gourmand 김어준 레스토랑 ✅ 저녁 예매완료', day: 'Day 21', date: '7/2 (목) 18:00-19:30', target: '👨‍👩‍👦 가족', count: '3인', status: 'completed', note: '✅ 예매완료 · 18:00-19:30 · 도슨트 직후 저녁 · 에펠탑 정상 슬롯은 20:00-20:30 권장' },
      { label: '🗼 에펠탑 외부 야경 (입장 X) — 트로카데로 + Champ de Mars', day: 'Day 21', date: '7/2 (목) 20:00-22:30', target: '👨‍👩‍👦 가족', count: '3인', status: 'completed', note: '✅ 외부 관람만 결정 (정상 입장 패스) · 20:00 트로카데로 사진 → 21:00 Pont d\'Iéna 다리 → 21:30 Champ de Mars 잔디밭 → 21:55 일몰 + 반짝이 조명 (22:00 정각 5분)' },
      {
        label: '👑 베르사유 궁전 + 트리아농 + 분수쇼 ✅ 예매완료',
        day: 'Day 22', date: '7/3 (금)', target: '👨‍👩‍👦 가족', count: '3인', price: '', status: 'completed',
        note: '✅ 예매완료 · Billet Passeport (Full rate) · 10:30 시간 슬롯 · Entrance A · 예약자 명의 · ⚠️ 11:00 전 궁전 입장 필수 · 트리아농 12:00 오픈 · 금요일 = Musical Fountains Show 운영일 (17:30 그랜드 피날레)',
        link: { url: 'https://billetterie.chateauversailles.fr/', label: '베르사유 공식' },
        booking: { ref: 'Billet Passeport · 10:30 · Entrance A', platform: 'chateauversailles.fr', accessNote: '⚠️ 10:30 슬롯 → 11:00 전 궁전 입장 · 트리아농 영지 12:00 오픈 · QR 3매 폰 저장 + 캡처 백업' },
      },
      {
        label: '🖼️ 루브르 박물관 ✅ 예매완료 (11:30 + 🎧 한국어 오디오 가이드)',
        day: 'Day 23', date: '7/4 (토)', target: '👨‍👩‍👦 가족', count: '3인', price: '', status: 'completed',
        note: '✅ 예매완료 · 11:30 시간 슬롯 · 예약자 명의 · Entrée Plein tarif hors EEE (Non-EEA 성인) · 🎧 한국어 오디오 가이드 대여 · ⚠️ 도슨트 X = 개인 티켓 사용 가능 · 동선: 모나리자(Denon) → 비너스·니케 → 다비드 → 이집트관 · ⭐ Carrousel 지하 입구 (Rue de Rivoli 99) 줄 짧음 · 15-20분 전 도착',
        link: { url: 'https://www.louvre.fr/en', label: '루브르 공식' },
      },
      {
        label: '🏰 메르시파리 패키지 ✅ — 몽생미셀+지베르니+옹플뢰르 (한국어 가이드 16h)',
        day: 'Day 25', date: '7/6 (월)', target: '👨‍👩‍👦 가족', count: '3인', price: '', status: 'completed',
        note: '✅ 예매완료 · ⭐ Hampton by Hilton Saint Ouen 호텔 픽업 확정 (2존 추가) · 한국어 가이드 + 차량 · ⚠️ 입장료 (MSM + 지베르니) 별도 · ⚠️ 새벽 1-2시 호텔 샌딩',
        link: { url: 'https://experiences.myrealtrip.com/products/3888225', label: '메르시파리 상품' },
        booking: { ref: '메르시파리 패키지', platform: 'myrealtrip.com', accessNote: '⚠️ 07:20 트로카데로 집합 정시 도착 필수 (Uber 06:30 호출 권장) · 데이팩에 카메라·우산·자켓·간식·물·SPF·선글라스·현금(입장료)' },
      },
      { label: '⛪ 노트르담 내부 슬롯 (무료) + 사크레쾨르·생트샤펠', day: 'Day 26', date: '7/7 (화)', target: '👨‍👩‍👦 가족', count: '3인', note: '노트르담: notredamedeparis.fr/앱 슬롯 예약 (무료) · 사크레쾨르 무료 · 생트샤펠 현장', status: 'pending', link: { url: 'https://www.notredamedeparis.fr/', label: '노트르담 공식' } },
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
      { label: '📦 캐리어 픽업 — TopSantiago', target: '👫 부부', count: '캐리어 × 2', price: '', note: '✅ 예약 완료 · 카미노 구간별 캐리어 운반 (Porto → Santiago).', status: 'completed',
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
      { label: '👖 긴 바지', target: '👨‍👩‍👦‍👦 가족', count: '인당 1벌', note: '저녁·도시 외출용', status: 'pending' },
      { label: '🧥 경량 방풍 자켓', target: '👨‍👩‍👦‍👦 가족', count: '인당 1벌', note: 'UNIQLO/노스페이스', status: 'pending' },
      { label: '🩲 속옷 + 등산 양말', target: '인당', count: '속옷 3벌 + 양말 3켤레', status: 'pending' },
      { label: '🩴 슬리퍼·샌들', target: '인당', count: '1켤레', note: '저녁·샤워·휴식용', status: 'pending' },
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
