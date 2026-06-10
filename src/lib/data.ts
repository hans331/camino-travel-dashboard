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
    food: '해변 카페 점심, Vila do Conde 해산물 저녁', stay: 'Vila do Conde 펜션/알베르게',
    lat: 41.3528, lng: -8.7461, dist: '27km',
  },
  {
    day: 4, date: '6/15 (월)', phase: 'camino', title: '카미노 Day 2 (해안): Vila do Conde → Esposende',
    icon: '🌊', desc: '대서양 해안선 따라 보드워크 + 어촌 마을. Esposende 도착, 강변 도시.',
    food: '신선한 해산물, Vinho Verde', stay: 'Esposende 알베르게',
    lat: 41.5371, lng: -8.7838, dist: '24km',
  },
  {
    day: 5, date: '6/16 (화)', phase: 'camino', title: '카미노 Day 3 (해안): Esposende → Viana do Castelo',
    icon: '🌊', desc: 'Lima 강 하구의 역사적 도시. Santa Luzia 언덕 + 분홍빛 대성당.',
    food: 'Bacalhau, Viana 정통 식당', stay: 'Viana do Castelo 알베르게',
    lat: 41.6946, lng: -8.8298, dist: '26km',
  },
  {
    day: 6, date: '6/17 (수)', phase: 'camino', title: '카미노 Day 4 (해안): Viana do Castelo → Caminha',
    icon: '🌊', desc: '대서양 해안 마지막 날. Caminha 도착 — 다음날 페리로 스페인 진입 예정.',
    food: '문어, 정어리, 가벼운 해변 만찬', stay: 'Caminha 알베르게',
    lat: 41.8714, lng: -8.8398, dist: '26km',
  },
  {
    day: 7, date: '6/18 (목)', phase: 'camino', title: '🛥️ 전환일: Caminha 페리 → A Guarda → 🚌 Tui ⭐ 스페인',
    icon: '🛥️', desc: '⭐ 페리로 미뉴 강 건너 스페인 A Guarda 진입! A Guarda 마을 산책 (Santa Trega 켈트 유적 옵션) → 버스로 Tui 이동. Tui 대성당 방문 + 두 번째 도장. 짧은 도보 + 이동.',
    food: '갈리시아 풀포 아 페이라', stay: '알베르게 de Tui (수도원)',
    lat: 42.0466, lng: -8.6448, dist: '10km',
  },
  {
    day: 8, date: '6/19 (금)', phase: 'camino', title: '카미노 Day 5 (중앙): Tui → Redondela ⚠️ 31km',
    icon: '💪', desc: '⚠️ 중앙길 합류 — 31km 통합일 (O Porriño 통과). 새벽 6시 출발 권장. 점심 O Porriño 중간 휴식. 갈리시아 시골길.',
    food: '엠파나다 갈레가, 알바리뇨', stay: '알베르게 de Redondela',
    lat: 42.2839, lng: -8.6094, dist: '31km',
  },
  {
    day: 9, date: '6/20 (토)', phase: 'camino', title: '카미노 Day 6 (중앙): Redondela → Pontevedra',
    icon: '🐚', desc: '폰테베드라 구시가지 매우 아름다움. 광장에서 저녁 타파스 산책.',
    food: '폰테베드라 타파스 투어, 라콘', stay: '알베르게 Virxe Peregrina',
    lat: 42.4310, lng: -8.6440, dist: '19km',
  },
  {
    day: 10, date: '6/21 (일)', phase: 'camino', title: '카미노 Day 7 (중앙): Pontevedra → Caldas de Reis',
    icon: '♨️', desc: '온천 마을 칼다스 데 레이스 도착. 발 피로 회복에 최적.',
    food: '엠파나다, 라콘 콘 그렐로스', stay: '알베르게 de Caldas de Reis',
    lat: 42.6050, lng: -8.6420, dist: '22km',
  },
  {
    day: 11, date: '6/22 (월)', phase: 'camino', title: '카미노 Day 8 (중앙): Caldas → Padrón',
    icon: '🌶️', desc: '유칼립투스 숲길. 파드론 고추(피미엔토스)의 고향.',
    food: '피미엔토스 데 파드론 (꼭 먹기!)', stay: '알베르게 de Padrón',
    lat: 42.7400, lng: -8.6600, dist: '19km',
  },
  {
    day: 12, date: '6/23 (화)', phase: 'camino', title: '⭐ Day 9: Padrón → Santiago + 둘째 스위스 도착',
    icon: '⭐', desc: '🥾 부부: 대망의 마지막 구간! 산티아고 대성당이 보이는 순간 감동. 12시 순례자 미사 참석. Compostela 증명서 발급. 저녁 자축 만찬. | 🛬 둘째: Cambridge 8:30 출발 → LHR T2 → Swiss LX333 13:50 → ZRH 16:35 도착 → 기차 ZRH→Lucerne 1h → 18시경 Lucerne 호텔 단독 체크인 (1박 추가) → 카펠교·구시가 야경 산책 + 저녁.',
    food: '🥾 부부: 타르타 데 산티아고, 풀포 아 페이라 · 🇨🇭 둘째: Lucerne 비어 가든', stay: '🥾 부부: ✅ Libredón Rooms (Praza da Fonseca 5, 대성당 광장!) 수페리어 트윈룸 정원 전망 ₩241,113 / 🇨🇭 둘째: Lucerne 호텔 1박 (추가 예약 필요)',
    lat: 42.8805, lng: -8.5457, dist: '24km',
    transit: '🥾 부부 Camino 24km · 🛬 둘째 Cambridge→LHR→ZRH→Lucerne',
    restaurants: ['O Curro da Parra', 'Abastos 2.0', 'Casa Marcelo'],
    timeline: [
      { time: '06:00', emoji: '🥾', label: '🥾 부부 Padrón → Santiago 출발 (24km 마지막 구간)', status: 'pending' },
      { time: '08:30', emoji: '🚂', label: '🧑 둘째 Cambridge 출발 → LHR T2 이동', status: 'pending' },
      { time: '12:00', emoji: '⛪', label: '🥾 부부 산티아고 도착 + 정오 순례자 미사 (Botafumeiro)', status: 'pending' },
      { time: '13:50', emoji: '🛫', label: '🧑 LX333 LHR T2 → ZRH 출발 (1h 45m)', status: 'confirmed', detail: 'Swiss · PNR XW2NMU · 개인물품만' },
      { time: '16:35', emoji: '🛬', label: '🧑 ZRH 도착', status: 'confirmed' },
      { time: '18:00', emoji: '🏨', label: '🧑 Lucerne 호텔 단독 체크인 (1박 추가)', status: 'pending', detail: '⚠️ 호텔 추가 예약 필요' },
      { time: '저녁', emoji: '🍽️', label: '🥾 부부 산티아고 자축 만찬 · 🇨🇭 둘째 Lucerne 야경 + 비어 가든', status: 'pending' },
    ],
  },
  // ===== SWITZERLAND (Day 13-18) — 6일 (Lucerne + Matterhorn + Interlaken 통합) =====
  {
    day: 13, date: '6/24 (수)', phase: 'swiss', title: '🇨🇭 부부 SCQ→ZRH 합류 → 루체른 (3명, 둘째는 이미 스위스)',
    icon: '✈️', desc: '🥾 부부: 산티아고 시내 마지막 오전 + 점심 후 → Vueling SCQ 15:10 → BCN 16:50 → ZRH 20:25 (BCN 환승 1h 40m, 수하물 직통, 어머니 OK / 아빠 이름 정정 진행). | 🇨🇭 둘째: 종일 Lucerne 또는 근교 단독 관광 (Mt. Pilatus 또는 Lake Lucerne 보트 등). | 저녁 ZRH→Lucerne 기차 1h → 21시경 호텔에서 ⭐ 3명 합류 환영 만찬!',
    food: '기내식 + 루체른 정통 스위스 만찬 (Wirtshaus Galliker)', stay: '루체른 호텔 (3명, family room)',
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
    food: 'Pilatus 산정 점심 · 큰아들 환영 만찬 (스위스 정통 라클렛/퐁듀)', stay: '루체른 호텔 (Day 14 저녁부터 4명)',
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
    food: '기차 도시락 + 체르마트 정통 퐁듀', stay: '체르마트 호텔 (4명)',
    lat: 46.0207, lng: 7.7491,
    transit: '🚂 Lucerne → Zermatt (3h 30m, Visp 환승) · 가족 4명 함께',
    restaurants: ['Whymper-Stube (퐁듀)', 'Restaurant Schäferstube', 'Stefanie\'s Crêperie'],
  },
  {
    day: 16, date: '6/27 (토)', phase: 'swiss', title: '⛰️ 마테호른 — Gornergrat + Sunnegga (Stellisee)',
    icon: '⛰️', desc: '⭐ 새벽 출발 (구름 없는 마테호른 뷰). Gornergrat 톱니바퀴 열차 → 3,089m 정상 (마테호른 클래식 뷰 + 29개 4,000m 봉우리 + Gorner 빙하). 오후 Sunnegga 케이블카 → Stellisee 호수 (마테호른 반영 ⭐ 인스타 명소).',
    food: 'Gornergrat 산정 레스토랑 점심 · Stellisee 피크닉 · 체르마트 저녁', stay: '체르마트 호텔',
    lat: 45.9836, lng: 7.7855,
    restaurants: ['Restaurant 3100 (Gornergrat 산정)', 'Schäferstube', 'Findlerhof'],
  },
  {
    day: 17, date: '6/28 (일)', phase: 'swiss', title: '🚂 체르마트 → 인터라켄 (~3h) + Harder Kulm',
    icon: '🚂', desc: '오전 체르마트 → Visp → Spiez → Interlaken (3h, 풍경 노선). 오후 도착 후 호텔 체크인. 늦은 오후 Harder Kulm 케이블카 → 전망대 (인터라켄 + 융프라우·아이거·묀히 삼봉 + Brienz·Thun 두 호수 조망).',
    food: '기차 도시락 · Harder Kulm 산정 만찬', stay: '인터라켄 호텔 (3명)',
    lat: 46.6863, lng: 7.8632,
    transit: '🚂 Zermatt → Interlaken (3h)',
    restaurants: ['Harder Kulm Restaurant', 'Hotel Restaurant Bären'],
  },
  {
    day: 18, date: '6/29 (월)', phase: 'swiss', title: '⛰️ 융프라우요호 — Top of Europe (3,454m)',
    icon: '⛰️', desc: '⭐ 인터라켄 → 라우터브룬넨 → 클라이네 샤이덱 → 융프라우요호. 유럽 最高 기차역, Aletsch 빙하 + Sphinx 전망대. 하산 후 라우터브룬넨 폭포 골짜기 (72개 폭포, 톨킨 영감지).',
    food: '융프라우 산정 레스토랑 · 라우터브룬넨 마을 저녁', stay: '인터라켄 호텔',
    lat: 46.5470, lng: 7.9854,
    restaurants: ['Bollywood (Top of Europe 카레)', 'Restaurant Airtime'],
  },

  // ===== UK CAMBRIDGE (Day 19-20) =====
  {
    day: 19, date: '6/30 (화)', phase: 'london', title: '🛫 스위스 → 영국 → 캠브리지 (가족 4명 함께)',
    icon: '🛫', desc: '가족 4명 함께 이동 — 오전 인터라켄 → 취리히 기차 (2h). ZRH → LHR 비행 (Swiss/BA, 1h 45m). LHR → 캠브리지 (Elizabeth Line + LNER, ~2.5h). 캠브리지 저녁 도착. 졸업식 전야 가족 만찬.',
    food: '취리히 공항 점심 + 캠브리지 졸업 전야 가족 만찬', stay: '캠브리지 호텔 (University Arms, 4명, 2 rooms)',
    lat: 52.2053, lng: 0.1218,
    transit: '🚂 →ZRH 2h · ✈️ ZRH→LHR 1h45 · 🚂 →Cambridge 2.5h',
    restaurants: ['Midsummer House (미슐랭 2★)', 'Restaurant 22', 'The Eagle (역사적 펍)'],
    timeline: [
      { time: '08:00', emoji: '🏨', label: 'Interlaken 호텔 체크아웃', status: 'pending' },
      { time: '08:30', emoji: '🚂', label: 'Interlaken → ZRH 공항 기차 (~2h)', status: 'pending' },
      { time: '12:05', emoji: '🛫', label: '✈️ LX332 ZRH → LHR 출발 (1h 55m)', status: 'confirmed', detail: 'Swiss · 4명 · 위탁 23kg+휴대 8kg/인 · PNR XTVN7K' },
      { time: '13:00', emoji: '🛬', label: 'LHR T2 도착', status: 'confirmed' },
      { time: '14:30', emoji: '🚂', label: 'LHR → Cambridge (Elizabeth Line + LNER, ~2.5h)', status: 'pending' },
      { time: '17:00', emoji: '🏨', label: 'Cambridge University Arms 체크인 (2 rooms)', status: 'pending' },
      { time: '19:00', emoji: '🍽️', label: '졸업식 전야 가족 만찬', status: 'pending' },
    ],
  },
  {
    day: 20, date: '7/1 (수)', phase: 'london', title: '🎓 졸업식 + 가족 분리 (둘째 귀국 / 3명 → 파리)',
    icon: '🎓', desc: '오전 ⭐ Senate House에서 캠브리지 졸업식 + 가족 사진. 점심 콜리지 가든 파티 + 펀팅. 오후 4명 함께 캠브리지→London King\'s Cross 도착 (~17시). 거기서 갈림길 — 둘째: 옆 St Pancras에서 🚂 Thameslink 직행 → LGW 18시 도착 → JD484 21:10 → 칭다오 → 7/2 ICN 21:35 (QW901, ₩964,900). 3명: 같은 St Pancras (도보 5분)에서 🚄 Eurostar 저녁편 → 파리 Gare du Nord 도착 + 첫 비스트로 만찬. ⭐ King\'s Cross↔St Pancras 도보 5분 옆 건물 — 환승 간단.',
    food: '졸업 축하 점심 · Eurostar 스낵 · 파리 비스트로 저녁', stay: '파리 부티크 호텔 (3명, 2 rooms)',
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
      { time: '22:19', emoji: '🛬', label: '👨‍👩‍👦 3명 Paris Gare du Nord 도착 → 호텔 23시', status: 'confirmed' },
    ],
  },

  // ===== PARIS (Day 21-28) — 8일 (7박), Mont-Saint-Michel 포함 =====
  {
    day: 21, date: '7/2 (목)', phase: 'paris', title: '🎨 오르세 · 에펠탑 · 세느강',
    icon: '🎨', desc: '오전 ⭐ 오르세 미술관 (인상파의 성지: 모네·고흐·세잔). 점심 후 에펠탑 + 트로카데로 전망. 늦은 오후 세느강 유람선 + 일몰. 라탱지구·생제르맹 저녁.',
    food: '오르세 카페 점심 · 크루아상 · 에스카르고 · 뵈프 부르기뇽', stay: '파리 부티크 호텔',
    lat: 48.8600, lng: 2.3266,
    restaurants: ['Café de Flore', "L'Ami Jean", 'Le Procope'],
  },
  {
    day: 22, date: '7/3 (금)', phase: 'paris', title: '👑 베르사유 궁전 당일치기',
    icon: '👑', desc: 'RER C로 베르사유 도착 (45분). 궁전 + 정원 + 트리아농 전체 관람 (사전 예매 필수). 평일이라 토요일보다 한산. 저녁 파리 복귀 후 마레지구 비스트로.',
    food: '베르사유 정원 피크닉 + 마레지구 저녁', stay: '파리 부티크 호텔',
    lat: 48.8048, lng: 2.1203,
    restaurants: ['Breizh Café', "L'As du Fallafel"],
  },
  {
    day: 23, date: '7/4 (토)', phase: 'paris', title: '🖼️ 루브르 + 마레 + 노트르담',
    icon: '🖼️', desc: '오전 루브르 박물관 (모나리자·비너스·니케). 점심 후 마레지구 산책 + 보주 광장 + 피카소 미술관. 늦은 오후 노트르담 + 생트샤펠 + 라탱지구.',
    food: '루브르 카페 점심 · 마레 팔라펠 · 라탱지구 저녁', stay: '파리 부티크 호텔',
    lat: 48.8606, lng: 2.3376,
    restaurants: ['Bouillon Chartier', 'Le Marais Lounge'],
  },
  {
    day: 24, date: '7/5 (일)', phase: 'paris', title: '🌻 지베르니 당일치기 (모네의 정원)',
    icon: '🌻', desc: '⭐ 파리 → 지베르니 (1h 기차 + 셔틀). 모네의 집과 수련 연못 — 인상파의 발상지. 노르망디 시골 풍경. 저녁 파리 복귀, 노천 카페.',
    food: '지베르니 인근 비스트로 점심 · 파리 노천 카페 저녁', stay: '파리 부티크 호텔',
    lat: 49.0758, lng: 1.5331,
    restaurants: ['Hôtel Baudy (지베르니, 모네 단골)', 'Le Café Marly'],
  },
  {
    day: 25, date: '7/6 (월)', phase: 'paris', title: '🏰 Mont-Saint-Michel 당일치기',
    icon: '🏰', desc: '⭐ 파리 → Mont-Saint-Michel (TGV 2h + 셔틀 1h 15m). 노르망디 바다 위 수도원 — 프랑스 최고 명소. 새벽 출발 → 저녁 귀환 (왕복 ~12h). 입장권·셔틀·TGV 사전 예매 필수.',
    food: 'TGV 도시락 · La Mère Poulard 오믈렛 (현지 명물) · 늦은 파리 저녁', stay: '파리 부티크 호텔',
    lat: 48.6361, lng: -1.5114,
    restaurants: ['La Mère Poulard (Mont-Saint-Michel)', 'Le Pré Salé'],
  },
  {
    day: 26, date: '7/7 (화)', phase: 'paris', title: '🎭 몽마르뜨 + l\'Orangerie + 쇼핑',
    icon: '🎭', desc: '오전 몽마르뜨·사크레쾨르 + 예술가 광장 + 마지막 마카롱(Pierre Hermé). 점심 후 l\'Orangerie (모네 수련 대벽화) + Tuileries 정원. 저녁 Galeries Lafayette 옥상 + 쇼핑.',
    food: 'Pink Mamma 점심 · 마카롱 · 마지막 비스트로 만찬', stay: '파리 부티크 호텔',
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
  { phase: 'porto', city: '포르토', name: 'The Editory Boulevard Aliados', type: '부티크 호텔', price: '€95/박 (2박, 부부)', desc: '6/12-13 2박 · 부부 더블룸 · Day 1 야간 도착, Day 2 포르토 종일 관광.', emoji: '🏨' },
  { phase: 'camino', city: 'Vairão', name: 'Albergue do Mosteiro de Vairão', type: '알베르게', price: '€10/박', desc: '수도원 알베르게. 첫날 정통 순례자 경험.', emoji: '🛏️' },
  { phase: 'camino', city: 'Barcelos', name: 'Albergue Cidade de Barcelos', type: '알베르게', price: '€8/박', desc: '시내 중심, 시장 근처. 깨끗하고 가성비 좋음.', emoji: '🛏️' },
  { phase: 'camino', city: 'Ponte de Lima', name: 'Albergue de Peregrinos', type: '공립 알베르게', price: '€7/박', desc: '강변, 마을 외곽. 일찍 도착 권장.', emoji: '🛏️' },
  { phase: 'camino', city: 'Rubiães', name: 'Albergue São Pedro de Rubiães', type: '공립 알베르게', price: '€6/박', desc: '작은 마을 — 미리 도착해 침대 확보.', emoji: '🛏️' },
  { phase: 'camino', city: 'Tui', name: 'Albergue de Tui (Convento)', type: '수도원 알베르게', price: '€8/박', desc: '13세기 수도원 — 분위기 압도적.', emoji: '🛏️' },
  { phase: 'camino', city: 'O Porriño', name: 'Albergue Municipal', type: '공립 알베르게', price: '€8/박', desc: '시설 신축, 주방 사용 가능.', emoji: '🛏️' },
  { phase: 'camino', city: 'Redondela', name: 'Casa da Torre', type: '알베르게', price: '€12/박', desc: '역사 건물, 정원 있음.', emoji: '🛏️' },
  { phase: 'camino', city: 'Pontevedra', name: 'Albergue Virxe Peregrina', type: '공립 알베르게', price: '€8/박', desc: '구시가지 중심. 저녁 타파스 동선 좋음.', emoji: '🛏️' },
  { phase: 'camino', city: 'Caldas de Reis', name: 'Albergue Municipal', type: '공립 알베르게', price: '€8/박', desc: '♨️ 온천 마을 — 도착 후 온천욕 가능.', emoji: '🛏️' },
  { phase: 'camino', city: 'Padrón', name: 'Albergue de Padrón', type: '공립 알베르게', price: '€8/박', desc: '강변, 시장 근처. 파드론 고추 꼭 먹기.', emoji: '🛏️' },
  { phase: 'camino', city: '산티아고', name: 'Libredón Rooms', type: '부티크 B&B', price: '₩241,113 (부부 1박)', desc: '✅ 예매완료 · ⭐ 6/23 — 카미노 완주 자축! Plaza de Fonseca 5 (대성당 광장 중 하나, 도보 30초) · 수페리어 트윈룸 정원 전망 · 전용 욕실·발코니 · 짐 보관 가능 (Camino 시작 전 캐리어 직송).', emoji: '🏨' },
  { phase: 'swiss', city: '루체른', name: 'Hotel des Balances 또는 Schweizerhof', type: '부티크 호텔', price: 'CHF 280/박 × 2박 (3명, family room)', desc: '6/24-25 2박 · 3명 · 카펠교 도보권, 호수 뷰.', emoji: '🏨' },
  { phase: 'swiss', city: '체르마트', name: 'Hotel Schweizerhof Zermatt 또는 Cervo Mountain Resort', type: '부티크 호텔', price: 'CHF 400/박 × 2박 (3명, family room) ⭐ NEW', desc: '6/26-27 2박 · 마테호른 뷰 객실 · 차량 없는 청정 마을.', emoji: '🏨' },
  { phase: 'swiss', city: '인터라켄', name: 'Hotel Interlaken 또는 Royal St Georges', type: '부티크 호텔', price: 'CHF 250/박 × 2박 (3명, family room)', desc: '6/28-29 2박 · 융프라우 조망, 두 호수 사이.', emoji: '🏨' },
  { phase: 'london', city: '캠브리지', name: 'University Arms', type: '럭셔리 호텔', price: '£260/박 × 2 rooms × 1박 (4명)', desc: '🎓 6/30 1박 · 가족 4명 2 rooms · Parker\'s Piece 앞 클래식 호텔.', emoji: '🏨' },
  { phase: 'paris', city: '파리', name: 'Hôtel des Grands Boulevards', type: '부티크 호텔', price: '€230/박 × 2 rooms × 7박 (3명)', desc: '7/1-7 7박 · 3명 (부부 + 큰아들) · 9구 중심. ⭐ 파리 8일 연장 (Mont-Saint-Michel + 지베르니 포함).', emoji: '🏨' },
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
    id: 'accommodation', cat: '🏨 숙소', amt: '₩10,345,384', amtNum: 10345384,
    detail: '21박 중 포르토 2박 + 산티아고 1박 예매완료 ✅ · 나머지 18박 미예매',
    pct: 23, color: '#EA580C',
    breakdown: [
      { label: '🇵🇹 포르토 SANTA RITA Guesthouse B&B (Vila Nova de Gaia) 2박', amt: 354271, status: 'confirmed', note: '✅ 부킹닷컴 예매 · 더블룸 전용 외부욕실 · 조식포함 · 발코니+정원 전망 · ⚠️ 환불불가 · R. Santa Rita 58, Vila Nova de Gaia (강 건너편, 포트와인 셀러 옆)' },
      { label: '🐚 카미노 알베르게 9박 (부부)', amt: 145000, status: 'pending', note: '평균 €8/박×9 (사립 펜션 가능)' },
      { label: '⭐ 산티아고 Libredón Rooms 1박 (자축)', amt: 241113, status: 'confirmed', note: '✅ 부킹닷컴 예매 · Plaza de Fonseca 5 (대성당 광장 중 하나, 도보 30초!) · 수페리어 트윈룸 정원 전망 · 전용 욕실+발코니 · 짐 보관 OK (포르토에서 캐리어 직송 가능)' },
      { label: '🇨🇭 루체른 2박 (3→4명)', amt: 1010000, status: 'pending', note: 'family room · CHF 280×2박' },
      { label: '⛰️ 체르마트 2박 (4명, 마테호른 뷰)', amt: 1440000, status: 'pending', note: 'CHF 400×2박 (성수기 비쌈)' },
      { label: '🇨🇭 인터라켄 2박 (4명)', amt: 900000, status: 'pending', note: 'CHF 250×2박' },
      { label: '🇬🇧 캠브리지 1박 (4명, 2 rooms)', amt: 700000, status: 'pending', note: 'University Arms · £260×2 rooms×1박' },
      { label: '🇫🇷 파리 7박 (3명, 2 rooms)', amt: 5555000, status: 'pending', note: 'Hôtel des Grands Boulevards · €230×7박' },
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
    id: 'gear', cat: '🥾 카미노 장비', amt: '₩1,000,000', amtNum: 1000000,
    detail: '부부 2명 × ₩500K — 등산화·배낭·침낭·스틱·발 관리키트',
    pct: 3, color: '#0891B2',
    breakdown: [
      { label: '🥾 등산화 × 2', amt: 400000, status: 'pending', note: '⚠️ D-14부터 길들이기 필수' },
      { label: '🎒 배낭 35-40L × 2 + 트레킹 스틱 4', amt: 400000, status: 'pending' },
      { label: '💤 침낭·라이너·헤드랜턴·발관리 키트', amt: 200000, status: 'pending' },
    ],
  },
  {
    id: 'transport', cat: '🚄 교통', amt: '₩2,445,000', amtNum: 2445000,
    detail: 'Swiss Travel Pass + OPO Uber + 시내 이동 + 카미노 짐 운반 (전부 미예매)',
    pct: 5, color: '#7C3AED',
    breakdown: [
      { label: '🇨🇭 Swiss Travel Pass 6일 × 4명', amt: 2280000, status: 'pending', note: 'CHF 379/인 · 산악열차 25-50% 할인 포함' },
      { label: '🚖 Uber OPO→Vila Nova de Gaia (6/12 야간)', amt: 45000, status: 'pending', note: '€25-30 · 22:55 도착 직행' },
      { label: '🐚 카미노 짐 운반 (Tuitrans/Correos)', amt: 100000, status: 'pending', note: '€6-8/일 × 10일' },
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
    id: 'graduation', cat: '🎓 졸업식', amt: '₩850,000', amtNum: 850000,
    detail: '가족 사진·둘째 학사가운 대여·축하 만찬·선물 + 정장 드라이클리닝 (정장 본체는 한국에서 챙겨가 렌탈비 ₩500K+ 절감)',
    pct: 2, color: '#DB2777',
    breakdown: [
      { label: '📸 가족 졸업 사진 (프로 촬영)', amt: 300000, status: 'pending' },
      { label: '🎓 둘째 학사 가운 대여 (Ede & Ravenscroft)', amt: 100000, status: 'pending', note: '~£40, 캠브리지 현지 사전 예약 필수' },
      { label: '👔 가족 정장 드라이클리닝 (한국)', amt: 50000, status: 'pending', note: '✅ 한국에서 챙겨가기로 결정 — 영국 렌탈 대비 ₩500K+ 절감' },
      { label: '🥂 졸업 축하 만찬 + 선물', amt: 400000, status: 'pending' },
    ],
  },
  {
    id: 'insurance', cat: '🛡️ 보험·eSIM·ETA', amt: '₩500,000', amtNum: 500000,
    detail: '여행자 보험·eSIM·UK ETA (일부 확정)',
    pct: 2, color: '#C2185B',
    breakdown: [
      { label: '🇬🇧 UK ETA × 4명', amt: 72000, status: 'confirmed', note: '£10×4 = £40' },
      { label: '🛡️ 여행자 보험 (하이킹 커버, 부부)', amt: 200000, status: 'pending', note: '카미노 산악 커버 필수' },
      { label: '📡 eSIM × 4명 (유럽+UK+스위스)', amt: 228000, status: 'pending', note: 'Airalo/Holafly' },
    ],
  },
  {
    id: 'misc', cat: '💝 기타·예비', amt: '₩2,000,000', amtNum: 2000000,
    detail: '기념품·쇼핑·예비비 (전부 미정)',
    pct: 6, color: '#475569',
    breakdown: [
      { label: '🎁 기념품·선물 (가족·지인)', amt: 800000, status: 'pending' },
      { label: '🛍️ 쇼핑 (파리·런던)', amt: 600000, status: 'pending' },
      { label: '⚠️ 예비비 (응급·환율 변동)', amt: 600000, status: 'pending', note: '스위스 물가 높음 고려' },
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
  { route: '루체른 → 인터라켄 (6/28)', method: '🚂 GoldenPass Line', time: '~2h (파노라마)', price: 'CHF 35-60 × 3', tip: '⭐ 사전 좌석 예약 권장 (창가/파노라마칸)' },
  { route: 'Mt. Pilatus 왕복 (6/27)', method: '🚠 톱니바퀴 + 케이블카', time: '~5h (Golden Round)', price: 'CHF 78/인 × 3', tip: 'Swiss Travel Pass 50% 할인 적용' },
  { route: '인터라켄 → 융프라우요호 왕복 (6/29)', method: '🚂 산악열차 (Eiger Express)', time: '~7h (왕복)', price: 'CHF 232/인 × 3', tip: '⭐ Swiss Travel Pass 25% 할인 + 사전 예매 필수' },
  { route: '인터라켄 → 취리히 (6/30)', method: '🚂 IC 직행', time: '2h', price: 'CHF 60 × 3', tip: '오전 출발 권장' },
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
      { label: '👫 부부 ICN → FRA → OPO', day: 'Day 1', date: '6/12 (금)', target: '👫 부부', count: '2명', route: 'ICN → FRA → OPO', code: 'LH713+LH1180', time: '12:20 → 22:55', price: '₩2,311,000', status: 'completed', note: 'FRA 환승 2h 25m · A350-900+A321NEO · Economy Basic Plus · 좌석 30J·30K/20E·20F · PNR Y6RCMU' },
      { label: '🧑 둘째 LHR → ZRH (Swiss 직항)', day: 'Day 12', date: '6/23 (화)', target: '🧑 둘째', count: '1명', route: 'LHR → ZRH', code: 'LX333', time: '13:50 → 16:35', price: '₩292,900', status: 'completed', note: '직항 1h 45m · Airbaltic BT 공동운항 · 개인물품 1개만 · PNR XW2NMU (하루 앞당겨 스위스 1일 단독 관광)' },
      { label: '👫 부부 SCQ → BCN → ZRH (Vueling)', day: 'Day 13', date: '6/24 (수)', target: '👫 부부', count: '2명', route: 'SCQ → BCN → ZRH', code: 'VY1673+VY6248', time: '15:10 → 20:25', price: '₩1,002,454', status: 'completed', note: '✅ 아빠 이름 정정 완료 (6/10, 수수료 ₩111,854 별도 결제) · ₩890,600 + ₩111,854 = ₩1,002,454 · BCN 환승 1h 40m, 수하물 직통 · 위탁 25kg/인 · TRIP 1658113176342997' },
      { label: '🇰🇷 큰아들 ICN → ZRH (KE 직항)', day: 'Day 14', date: '6/25 (목)', target: '🇰🇷 큰아들', count: '1명', route: 'ICN → ZRH', code: 'KE917', time: '11:05 → 17:25', price: '₩1,273,500', status: 'completed', note: 'B787-10 직항 13h 20m · Economy Standard' },
      { label: '👨‍👩‍👦‍👦 가족 ZRH → LHR (Swiss 직항)', day: 'Day 19', date: '6/30 (화)', target: '👨‍👩‍👦‍👦 가족', count: '4명', route: 'ZRH → LHR T2', code: 'LX332', time: '12:05 → 13:00', price: '₩1,575,600', status: 'completed', note: '직항 1h 55m · 위탁 23kg+휴대 8kg/인 · ₩393,900/인 · PNR XTVN7K' },
      { label: '🧑 둘째 LGW → 칭다오 → ICN', day: 'Day 20', date: '7/1 (수)', target: '🧑 둘째', count: '1명', route: 'LGW → TAO → ICN', code: 'JD484+QW901', time: '21:10 → 7/2 21:35', price: '₩964,900', status: 'completed', note: '칭다오 4h 10m 환승 · 수하물 재수속 필요 · PNR NXSQX0' },
      { label: '👨‍👩‍👦 3명 CDG → MUC → ICN (LH 귀국)', day: 'Day 27', date: '7/8 (수)', target: '👨‍👩‍👦 가족', count: '3명', route: 'CDG → MUC → ICN', code: 'LH2229+LH718', time: '12:00 → 7/9 09:55', price: '₩3,958,146', status: 'completed', note: 'MUC 환승 2h 25m · Economy Green (위탁 23kg/휴대 8kg) · €2,198.97 @ ₩1,800/EUR' },
    ],
  },
  {
    title: '🚂 기차·페리·육상 교통',
    items: [
      { label: '🚖 Uber/Bolt 앱 설치 + 카드 등록 (OPO 도착 대비)', day: 'Day 1', date: '6/12 (금)', target: '👫 부부', count: '2명', route: 'OPO → Vila Nova de Gaia', price: '€25-30 (~₩45K)', status: 'pending', note: '⚠️ 출국 전 한국에서 미리 설치 + 결제수단 등록 (해외에서 SMS 인증 문제 회피). 22:55 도착이라 직행 Uber 필수. Bolt가 보통 €2-5 저렴' },
      { label: 'Swiss Travel Pass 6일권 신청', target: '👨‍👩‍👦‍👦 가족', count: '3-4명', price: 'CHF 379/인', status: 'pending', note: '🎫 스위스 全 기차+버스+산악열차 50% 할인 · 출국 전 온라인 구매' },
      { label: '🚤 Caminha → A Guarda 페리 (Río Miño)', day: 'Day 6', date: '6/17 (수)', target: '👫 부부', count: '2명', route: 'Caminha → A Guarda', price: '~€2', status: 'pending', note: '시간표 확인 필수 (계절·날씨 영향)' },
      { label: '🚌 A Guarda → Tui 버스 (Monbus)', day: 'Day 6', date: '6/17 (수)', target: '👫 부부', count: '2명', route: 'A Guarda → Tui', time: '~1h', status: 'pending', note: '중앙길 전환' },
      { label: '🚂 둘째 Cambridge → LHR T2', day: 'Day 12', date: '6/23 (화)', target: '🧑 둘째', count: '1명', route: 'Cambridge → LHR T2', time: '08:30 출발, ~2h', status: 'pending', note: 'LX333 13:50 출발 3h 전 도착 목표 (10:50 LHR) · King\'s Cross 50min + Piccadilly Line 60min' },
      { label: '🚂 ZRH → Lucerne (저녁)', day: 'Day 13', date: '6/24 (수)', target: '👫👨‍👩‍👦 3명', count: '3명', route: 'ZRH → Lucerne', time: '~1h', status: 'pending', note: 'Swiss Pass 포함' },
      { label: '🚂 ZRH → Lucerne (큰아들)', day: 'Day 14', date: '6/25 (목)', target: '🇰🇷 큰아들', count: '1명', route: 'ZRH → Lucerne', time: '17:25 도착 후 ~1h', status: 'pending' },
      { label: '🚂 Lucerne → Zermatt (산악 풍경 구간)', day: 'Day 15', date: '6/26 (금)', target: '👨‍👩‍👦‍👦 가족', count: '4명', route: 'Lucerne → Zermatt', time: '~3.5h', status: 'pending', note: 'Bern/Visp 환승' },
      { label: '🚂 Zermatt → Interlaken', day: 'Day 17', date: '6/28 (일)', target: '👨‍👩‍👦‍👦 가족', count: '4명', route: 'Zermatt → Interlaken', time: '~2h 20m', status: 'pending', note: 'Visp 환승' },
      { label: '🚂 Interlaken → ZRH 공항', day: 'Day 19', date: '6/30 (화)', target: '👨‍👩‍👦‍👦 가족', count: '4명', route: 'Interlaken → ZRH', time: '~2h (8:00 출발)', status: 'pending', note: '공항 직결 · LX332 12:05 출발 위해 9:30 ZRH 도착 → 체크인 2h 여유' },
      { label: '🚂 LHR → Cambridge', day: 'Day 19', date: '6/30 (화)', target: '👨‍👩‍👦‍👦 가족', count: '4명', route: 'LHR → Cambridge', time: '~2h', status: 'pending', note: 'King\'s Cross 경유 또는 National Express 직행 버스' },
      { label: '🚂 둘째 Cambridge → LGW 개트윅', day: 'Day 20', date: '7/1 (수)', target: '🧑 둘째', count: '1명', route: 'Cambridge → LGW', time: '~2.5h (오후 15-16시)', status: 'pending', note: 'JD484 21:10 탑승 3h 여유 · King\'s Cross + Thameslink 직행' },
      { label: '🚄 Eurostar London → Paris', day: 'Day 20', date: '7/1 (수)', target: '👨‍👩‍👦 3명', count: '3명', route: 'St Pancras → Gare du Nord', code: 'Eurostar Standard', time: '19:01 → 22:19 (2h 18m)', price: '₩626,439', status: 'completed', note: 'Coach 5 · €351 (€117×3)' },
    ],
  },
  {
    title: '🏨 호텔·숙소 예약 (9건, 총 26박)',
    items: [
      { label: '🇵🇹 포르토 SANTA RITA Guesthouse B&B', day: 'Day 1-2', date: '6/12-13', target: '👫 부부', count: '2명 · 더블룸', price: '₩354,271 (€199)', status: 'completed', note: '✅ 부킹닷컴 예매 · Vila Nova de Gaia (강 건너편, 포트와인 셀러 옆) · 더블룸 전용 외부욕실 · 조식포함 · 발코니+정원 · ⚠️ 환불불가 · 게스트명 CHOI CHULLYOUNG · 주소: R. Santa Rita 58, 4430-219 Vila Nova de Gaia' },
      { label: '🌊 해안길 알베르게/펜션 4박', day: 'Day 3-6', date: '6/14-17', target: '👫 부부', count: '2명 · 더블룸', note: 'Vila do Conde · Esposende · Viana do Castelo · Caminha · 사립 펜션 권장', status: 'pending' },
      { label: '🌳 중앙길 알베르게/펜션 5박', day: 'Day 7-11', date: '6/18-22', target: '👫 부부', count: '2명 · 더블룸', note: 'Tui · Redondela · Pontevedra · Caldas de Reis · Padrón · 사립 펜션 권장', status: 'pending' },
      { label: '⭐ 산티아고 Libredón Rooms (자축)', day: 'Day 12', date: '6/23', target: '👫 부부', count: '2명', price: '₩241,113', status: 'completed', note: '✅ 부킹닷컴 예매 · Plaza de Fonseca 5 (대성당 광장!) · 수페리어 트윈룸 정원 전망 · 짐 보관 OK · 게스트명 CHOI CHULLYOUNG · 체크인 14:00-23:00 / 체크아웃 12:00' },
      { label: '🇨🇭 루체른 호텔 2박 (family room)', day: 'Day 13-14', date: '6/24-25', target: '👨‍👩‍👦 → 👨‍👩‍👦‍👦', count: '3명 → 4명 (D14 저녁부터)', note: 'Hotel des Balances 또는 Schweizerhof', status: 'pending' },
      { label: '⛰️ 체르마트 호텔 2박 (마테호른 뷰)', day: 'Day 15-16', date: '6/26-27', target: '👨‍👩‍👦‍👦 가족', count: '4명', note: '⭐ Schweizerhof Zermatt 또는 Cervo Mountain', status: 'pending' },
      { label: '🇨🇭 인터라켄 호텔 2박 (family room)', day: 'Day 17-18', date: '6/28-29', target: '👨‍👩‍👦‍👦 가족', count: '4명', note: 'Hotel Interlaken 또는 Royal St Georges', status: 'pending' },
      { label: '🇬🇧 캠브리지 University Arms', day: 'Day 19', date: '6/30', target: '👨‍👩‍👦‍👦 가족', count: '4명 · 2 rooms', note: 'Parker\'s Piece 앞 럭셔리 호텔', status: 'pending' },
      { label: '🇫🇷 파리 Hôtel des Grands Boulevards 7박', day: 'Day 20-27', date: '7/1-7', target: '👨‍👩‍👦 가족', count: '3명 · 2 rooms', note: '9구 마레/오페라 도보권', status: 'pending' },
    ],
  },
  {
    title: '🛂 비자·서류·ETA·금융',
    items: [
      {
        label: '🇬🇧 UK ETA 신청 (gov.uk/apply-uk-eta)',
        target: '👨‍👩‍👦‍👦 가족', count: '4명', price: '£40 (£10×4)', status: 'completed',
        note: '48-72h 승인 · 출발 최소 1주 전 권장',
        link: { url: 'https://www.gov.uk/apply-uk-eta', label: 'UK ETA 공식 신청 페이지 열기' },
        instructions: [
          '📱 ① UK ETA 앱 설치 권장 (Google Play / App Store에서 "UK ETA" 검색). 웹보다 빠르고 사진 촬영 편리.',
          '👤 ② 신청자 정보 입력: 영문 이름·생년월일·국적·여권번호·여권 만료일 (여권과 정확히 일치해야 함, 한 글자라도 다르면 거부)',
          '📸 ③ 여권 스캔 (앱에서 NFC 자동 인식) + 본인 셀카 사진 (밝은 곳, 정면, 안경·모자 X)',
          '✉️ ④ 이메일 주소 입력 (승인 통지받을 곳) + 전화번호',
          '❓ ⑤ 질문 답변: 영국에서의 형사 처벌 여부, 테러·정치단체 가입 여부 등 (전부 No)',
          '💳 ⑥ 결제: £10/인 (신용/체크카드, 4명이면 별도 4건 신청 필요)',
          '⏰ ⑦ 승인 대기: 보통 24-72h, 이메일로 결과 통지. 거부 시 visa 신청 안내',
          '✅ ⑧ ETA는 여권에 전자 연동 — 별도 출력 불필요 · 유효기간 2년 (출국 6/12 기준 28년 6월까지 유효)',
        ],
      },
      {
        label: '🇪🇺 EU Schengen 90일 무비자 (체크만)',
        target: '👨‍👩‍👦‍👦 가족', count: '4명', status: 'pending',
        note: '한국 여권 기준 별도 비자 불필요 · ETIAS 시행 전이면 무서류 입국 가능 · 출발 전 ETIAS 시행 여부만 재확인',
        link: { url: 'https://travel-europe.europa.eu/etias_en', label: 'EU ETIAS 공식 페이지 (시행 시점 확인)' },
        instructions: [
          '📅 ① 현재(2026-06 기준) ETIAS 시행 일정 최종 확인 — 위 링크에서 "When does ETIAS apply?" 체크',
          '✅ ② 시행 전이면 한국 여권으로 별도 신청 불필요. 90일 무비자 입국. 여권 + 왕복 항공권만 준비',
          '🆕 ③ 시행 후라면 ETIAS 신청 필요: €7/인 (만 18-70세) · 온라인 신청 · 보통 몇 분 이내 자동 승인 · 유효기간 3년 또는 여권 만료일',
          '📋 ④ ETIAS 신청 시: 여권·이메일·결제카드·기본 인적사항만. 사진 불요',
          '⚠️ ⑤ 입국 시 준비: 왕복 항공권 인쇄본, 호텔 예약 확인서, 여행자 보험 증명, 충분한 자금 증명 (현금 또는 카드 명세서)',
          '🛂 ⑥ 첫 Schengen 입국지: 6/12 OPO (포르토, 포르투갈) — 여기서 입국 도장. 이후 카미노·스위스·프랑스 자유 이동',
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
      { label: '📦 짐 운반 서비스 신청', target: '👫 부부', count: '10일', price: '€6-8/일', note: 'Tuitrans 또는 Correos El Camino', status: 'pending' },
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
