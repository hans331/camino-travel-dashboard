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
} from './types';

export const PHASES = {
  portugal: { label: '포르투갈', color: '#006847', emoji: '🇵🇹' },
  camino: { label: '카미노', color: '#2D5016', emoji: '🐚' },
  andalusia: { label: '안달루시아', color: '#FF6F00', emoji: '🇪🇸' },
  madrid: { label: '마드리드', color: '#5C6BC0', emoji: '🏛️' },
  barcelona: { label: '바르셀로나', color: '#00897B', emoji: '🎨' },
} as const;

export const NAV_ITEMS = [
  { id: 'map', label: '지도', icon: '🗺️' },
  { id: 'schedule', label: '일정', icon: '📅' },
  { id: 'camino', label: '카미노', icon: '🐚' },
  { id: 'taste', label: '맛집·체험', icon: '🍷' },
  { id: 'accommodation', label: '숙소', icon: '🏠' },
  { id: 'budget', label: '예산', icon: '💰' },
  { id: 'transport', label: '교통', icon: '✈️' },
  { id: 'checklist', label: '준비물', icon: '✅' },
] as const;

export const SCHEDULE: DayData[] = [
  {
    day: 1, date: '7/5 (토)', phase: 'portugal', title: '리스본 도착',
    icon: '🇵🇹', desc: '인천 → 리스본 도착. 알파마 지구 산책, 트램 28번 탑승',
    food: '파스텔 드 나타, 바칼랴우', stay: '리스본 호스텔',
    lat: 38.7223, lng: -9.1393,
    restaurants: ['Pasteis de Belem', 'Time Out Market', 'Cervejaria Ramiro'],
  },
  {
    day: 2, date: '7/6 (일)', phase: 'portugal', title: '리스본 → 신트라 → 포르투',
    icon: '🏰', desc: '신트라 궁전 방문 후 포르투로 이동',
    food: '프란세지냐 (포르투 명물 샌드위치)', stay: '포르투 게스트하우스',
    lat: 41.1579, lng: -8.6291,
    restaurants: ['Cafe Santiago', 'Cafe Majestic'],
  },
  {
    day: 3, date: '7/7 (월)', phase: 'portugal', title: '포르투 관광',
    icon: '🍷', desc: '동 루이스 1세 다리, 리베이라 지구, 포트와인 셀러 투어',
    food: '포트와인, 비파나 샌드위치', stay: '포르투 게스트하우스',
    lat: 41.1409, lng: -8.6132,
    restaurants: ['Gazela Cachorrinhos', 'Casa Guedes'],
  },
  {
    day: 4, date: '7/8 (화)', phase: 'camino', title: '포르투 → 라브라도르',
    icon: '🐚', desc: '카미노 포르투게스 출발! 첫 구간 걷기',
    food: '순례자 메뉴', stay: '알베르게', lat: 41.2300, lng: -8.5500,
  },
  {
    day: 5, date: '7/9 (수)', phase: 'camino', title: '라브라도르 → 바르셀로스',
    icon: '🐚', desc: '바르셀로스 도착, 수탉 전설의 도시',
    food: '바칼랴우 아 브라스', stay: '알베르게', lat: 41.5314, lng: -8.6150,
  },
  {
    day: 6, date: '7/10 (목)', phase: 'camino', title: '바르셀로스 → 폰테 데 리마',
    icon: '🐚', desc: '리마 강변의 아름다운 중세 마을',
    food: '아로스 드 사라불류', stay: '알베르게', lat: 41.7674, lng: -8.5840,
  },
  {
    day: 7, date: '7/11 (금)', phase: 'camino', title: '폰테 데 리마 → 루비아엔스',
    icon: '🐚', desc: '포르투갈 시골길 트레킹',
    food: '콘요쇼 구이', stay: '알베르게', lat: 41.8700, lng: -8.5600,
  },
  {
    day: 8, date: '7/12 (토)', phase: 'camino', title: '루비아엔스 → 투이',
    icon: '🐚', desc: '포르투갈-스페인 국경 통과! 투이 대성당 방문',
    food: '풀포 아 페이라', stay: '알베르게', lat: 42.0466, lng: -8.6448,
  },
  {
    day: 9, date: '7/13 (일)', phase: 'camino', title: '투이 → 오포리뇨',
    icon: '🐚', desc: '스페인 갈리시아 지방 진입',
    food: '엠파나다 갈레가', stay: '알베르게', lat: 42.1500, lng: -8.6200,
  },
  {
    day: 10, date: '7/14 (월)', phase: 'camino', title: '오포리뇨 → 폰테베드라',
    icon: '🐚', desc: '폰테베드라 구시가지 산책',
    food: '메히요네스', stay: '알베르게', lat: 42.4310, lng: -8.6440,
  },
  {
    day: 11, date: '7/15 (화)', phase: 'camino', title: '폰테베드라 → 칼다스',
    icon: '🐚', desc: '온천 마을 칼다스 데 레이스',
    food: '라콘 콘 그렐로스', stay: '알베르게', lat: 42.6050, lng: -8.6420,
  },
  {
    day: 12, date: '7/16 (수)', phase: 'camino', title: '칼다스 → 파드론',
    icon: '🐚', desc: '파드론 도착, 피미엔토스 데 파드론의 고향',
    food: '피미엔토스 데 파드론', stay: '알베르게', lat: 42.7400, lng: -8.6600,
  },
  {
    day: 13, date: '7/17 (목)', phase: 'camino', title: '파드론 → 산티아고',
    icon: '⭐', desc: '산티아고 데 콤포스텔라 도착! 대성당 미사 참석',
    food: '타르타 데 산티아고', stay: '호텔',
    lat: 42.8805, lng: -8.5457,
    restaurants: ['Casa Manolo', 'O Curro da Parra', 'Abastos 2.0'],
  },
  {
    day: 14, date: '7/18 (금)', phase: 'andalusia', title: '산티아고 → 세비야',
    icon: '💃', desc: '세비야 도착! 플라멩코 공연 관람',
    food: '타파스, 살모레호', stay: '세비야 호텔',
    lat: 37.3891, lng: -5.9845,
    restaurants: ['El Rinconcillo', 'La Brunilda'],
  },
  {
    day: 15, date: '7/19 (토)', phase: 'andalusia', title: '세비야 관광',
    icon: '🏰', desc: '알카사르, 세비야 대성당, 히랄다 탑',
    food: '가스파초, 이베리코 하몬', stay: '세비야 호텔',
    lat: 37.3862, lng: -5.9928,
    restaurants: ['Bodega Santa Cruz', 'Eslava'],
  },
  {
    day: 16, date: '7/20 (일)', phase: 'andalusia', title: '세비야 → 코르도바',
    icon: '🕌', desc: '메스키타 방문, 유대인 거리 산책',
    food: '살모레호, 라보 데 토로', stay: '코르도바 호텔',
    lat: 37.8796, lng: -4.7796,
    restaurants: ['Casa Pepe de la Juderia', 'Bodegas Mezquita'],
  },
  {
    day: 17, date: '7/21 (월)', phase: 'andalusia', title: '코르도바 → 그라나다',
    icon: '🏔️', desc: '그라나다 도착, 알바이신 지구 산책',
    food: '무료 타파스!', stay: '그라나다 호텔',
    lat: 37.1773, lng: -3.5986,
    restaurants: ['Los Diamantes', 'Bodegas Castaneda'],
  },
  {
    day: 18, date: '7/22 (화)', phase: 'andalusia', title: '알람브라 궁전',
    icon: '🏰', desc: '알람브라 궁전 종일 관광 (사전 예약 필수)',
    food: '피오노노, 민트티', stay: '그라나다 호텔',
    lat: 37.1760, lng: -3.5881,
  },
  {
    day: 19, date: '7/23 (수)', phase: 'andalusia', title: '그라나다 → 론다 (당일치기)',
    icon: '🌉', desc: '론다 누에보 다리, 절벽 위 도시 관광',
    food: '론다 아몬드 수프', stay: '그라나다 호텔',
    lat: 36.7462, lng: -5.1613,
  },
  {
    day: 20, date: '7/24 (목)', phase: 'madrid', title: '그라나다 → 마드리드',
    icon: '🏛️', desc: '마드리드 도착, 프라도 미술관 방문',
    food: '코시도 마드릴레뇨', stay: '마드리드 호텔',
    lat: 40.4168, lng: -3.7038,
    restaurants: ['Sobrino de Botin', 'Mercado de San Miguel'],
  },
  {
    day: 21, date: '7/25 (금)', phase: 'madrid', title: '마드리드 관광',
    icon: '🎨', desc: '레이나 소피아, 레티로 공원, 솔 광장',
    food: '추로스 콘 초콜라테', stay: '마드리드 호텔',
    lat: 40.4138, lng: -3.6930,
    restaurants: ['Chocolateria San Gines', 'Casa Labra'],
  },
  {
    day: 22, date: '7/26 (토)', phase: 'madrid', title: '톨레도 당일치기',
    icon: '⚔️', desc: '톨레도 구시가지, 대성당, 엘 그레코',
    food: '마사판, 카르카무사', stay: '마드리드 호텔',
    lat: 39.8628, lng: -4.0273,
  },
  {
    day: 23, date: '7/27 (일)', phase: 'barcelona', title: '마드리드 → 바르셀로나',
    icon: '🎨', desc: 'AVE 고속열차로 이동. 사그라다 파밀리아 방문',
    food: '파에야', stay: '바르셀로나 호텔',
    lat: 41.3874, lng: 2.1686,
    restaurants: ['La Boqueria', 'Cal Pep'],
  },
  {
    day: 24, date: '7/28 (월)', phase: 'barcelona', title: '바르셀로나 가우디 투어',
    icon: '🏗️', desc: '구엘 공원, 카사 바트요, 카사 밀라',
    food: '봄바스, 피데우아', stay: '바르셀로나 호텔',
    lat: 41.4145, lng: 2.1527,
    restaurants: ['La Bombeta', 'Cerveceria Catalana'],
  },
  {
    day: 25, date: '7/29 (화)', phase: 'barcelona', title: '바르셀로나 → 귀국',
    icon: '✈️', desc: '바르셀로네타 해변 산책 후 공항으로',
    food: '크레마 카탈라나', stay: '기내',
    lat: 41.3851, lng: 2.1734,
  },
];

export const CAMINO_STAGES: CaminoStage[] = [
  { day: 4, from: '포르투', to: '라브라도르', km: 27, elev: '+350m / -280m', diff: 3, surface: '포장도로 60%, 흙길 40%', water: '3km마다', tip: '첫날이라 무리하지 말 것. 물집 방지 바셀린.', albergue: 'Albergue de Labruja' },
  { day: 5, from: '라브라도르', to: '바르셀로스', km: 25, elev: '+200m / -300m', diff: 2, surface: '흙길 55%, 포장 45%', water: '5km마다', tip: '바르셀로스 수탉 전설지 방문. 목요일 시장 유명.', albergue: 'Albergue Cidade de Barcelos' },
  { day: 6, from: '바르셀로스', to: '폰테 데 리마', km: 33, elev: '+450m / -400m', diff: 4, surface: '숲길 50%, 포장 50%', water: '4km마다', tip: '가장 긴 구간! 일찍 출발 필수. 리마 강변 아름다움.', albergue: 'Albergue de Ponte de Lima' },
  { day: 7, from: '폰테 데 리마', to: '루비아엔스', km: 19, elev: '+180m / -150m', diff: 2, surface: '시골길 70%, 포장 30%', water: '3km마다', tip: '짧은 구간. 여유롭게 시골 풍경 감상.', albergue: 'Albergue Sao Pedro de Rubiaes' },
  { day: 8, from: '루비아엔스', to: '투이', km: 22, elev: '+280m / -320m', diff: 3, surface: '포장 40%, 흙길 60%', water: '4km마다', tip: '국경 다리 통과! 여권 지참. 투이 대성당 꼭 방문.', albergue: 'Albergue de Tui' },
  { day: 9, from: '투이', to: '오포리뇨', km: 24, elev: '+300m / -250m', diff: 3, surface: '숲길 45%, 포장 55%', water: '5km마다', tip: '스페인 진입 후 첫 구간. 갈리시아 음식 시도!', albergue: 'Albergue de O Porrino' },
  { day: 10, from: '오포리뇨', to: '폰테베드라', km: 26, elev: '+350m / -380m', diff: 3, surface: '숲길 60%, 포장 40%', water: '3km마다', tip: '폰테베드라 구시가지 매우 아름다움. 저녁 타파스.', albergue: 'Albergue Virxe Peregrina' },
  { day: 11, from: '폰테베드라', to: '칼다스', km: 22, elev: '+200m / -180m', diff: 2, surface: '포장 50%, 흙길 50%', water: '4km마다', tip: '온천 마을! 피로 회복에 좋음. 발 관리.', albergue: 'Albergue de Caldas de Reis' },
  { day: 12, from: '칼다스', to: '파드론', km: 24, elev: '+280m / -300m', diff: 3, surface: '숲길 55%, 포장 45%', water: '3km마다', tip: '유칼립투스 숲길. 파드론 고추 꼭 먹을 것!', albergue: 'Albergue de Padron' },
  { day: 13, from: '파드론', to: '산티아고', km: 25, elev: '+320m / -200m', diff: 3, surface: '숲길 50%, 포장 50%', water: '4km마다', tip: '마지막 구간! 대성당 보이면 감동. 12시 순례자 미사.', albergue: '호텔 (자축!)' },
];

export const EXPERIENCES: Experience[] = [
  { title: '플라멩코 공연', desc: '세비야 정통 플라멩코 타블라오', where: '세비야', emoji: '💃', imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400', bg: 'es', day: 'Day 14' },
  { title: '포트와인 셀러 투어', desc: '빌라 노바 데 가이아 와인 셀러', where: '포르투', emoji: '🍷', imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400', bg: 'pt', day: 'Day 3' },
  { title: '알람브라 야경', desc: '알바이신에서 바라보는 알람브라', where: '그라나다', emoji: '🌙', imageUrl: 'https://images.unsplash.com/photo-1591122947157-26bad3a117d2?w=400', bg: 'es', day: 'Day 17' },
  { title: '트램 28번', desc: '리스본 구시가지를 누비는 노란 트램', where: '리스본', emoji: '🚃', imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400', bg: 'pt', day: 'Day 1' },
  { title: '카미노 순례', desc: '243km 포르투게스 루트 완주', where: '포르투 → 산티아고', emoji: '🐚', imageUrl: 'https://images.unsplash.com/photo-1533619239233-6280475a633a?w=400', bg: 'cam', day: 'Day 4-13' },
  { title: '사그라다 파밀리아', desc: '가우디의 미완성 걸작', where: '바르셀로나', emoji: '⛪', imageUrl: 'https://images.unsplash.com/photo-1583779457711-ab081de64105?w=400', bg: 'es', day: 'Day 23' },
];

export const FOODS: Food[] = [
  { title: '파스텔 드 나타', desc: '바삭한 커스터드 에그타르트', where: '리스본', emoji: '🥧', imageUrl: 'https://images.unsplash.com/photo-1626094309830-abbb0c99da4a?w=400', bg: 'pt' },
  { title: '프란세지냐', desc: '포르투 명물 고기 샌드위치', where: '포르투', emoji: '🥪', imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', bg: 'pt' },
  { title: '풀포 아 라 가예가', desc: '갈리시아식 문어 요리', where: '산티아고', emoji: '🐙', imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400', bg: 'cam' },
  { title: '하몬 이베리코', desc: '도토리 먹인 흑돼지 생햄', where: '스페인 전역', emoji: '🍖', imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400', bg: 'es' },
  { title: '파에야', desc: '바르셀로나 해산물 파에야', where: '바르셀로나', emoji: '🥘', imageUrl: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400', bg: 'es' },
  { title: '추로스 콘 초콜라테', desc: '진한 초콜릿에 찍어 먹는 추로스', where: '마드리드', emoji: '🍫', imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400', bg: 'es' },
  { title: '가스파초', desc: '차가운 토마토 수프', where: '안달루시아', emoji: '🍅', imageUrl: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400', bg: 'es' },
  { title: '타르타 데 산티아고', desc: '아몬드 케이크', where: '산티아고', emoji: '🍰', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', bg: 'cam' },
];

export const ACCOMMODATIONS: Accommodation[] = [
  { phase: 'portugal', city: '리스본', name: 'Lisbon Lounge Hostel', type: '호스텔', price: '€30/박', desc: '알파마 근처, 조식 포함', emoji: '🏨' },
  { phase: 'portugal', city: '포르투', name: 'Gallery Hostel Porto', type: '호스텔', price: '€28/박', desc: '리베이라 도보 5분, 와인 테이스팅', emoji: '🏨' },
  { phase: 'camino', city: '카미노 전체', name: '알베르게 (순례자 숙소)', type: '알베르게', price: '€6-12/박', desc: '순례자 크리덴셜 필수. 이른 도착 권장.', emoji: '🛏️' },
  { phase: 'camino', city: '산티아고', name: 'Hotel Costa Vella', type: '호텔', price: '€80/박', desc: '구시가지, 정원 뷰. 순례 완주 자축!', emoji: '🏨' },
  { phase: 'spain', city: '세비야', name: 'Hotel Amadeus', type: '호텔', price: '€75/박', desc: '산타크루스 지구, 음악 테마 호텔', emoji: '🏨' },
  { phase: 'spain', city: '코르도바', name: 'Hotel Mezquita', type: '호텔', price: '€65/박', desc: '메스키타 바로 앞, 최고의 위치', emoji: '🏨' },
  { phase: 'spain', city: '그라나다', name: 'Hotel Casa 1800', type: '호텔', price: '€90/박', desc: '알바이신, 알람브라 뷰 테라스', emoji: '🏨' },
  { phase: 'spain', city: '마드리드', name: 'Hostal Adriano', type: '호스탈', price: '€60/박', desc: '솔 광장 근처, 가성비 최고', emoji: '🏠' },
  { phase: 'spain', city: '바르셀로나', name: 'Hotel Brummell', type: '호텔', price: '€95/박', desc: '몽주익 근처, 루프탑 풀', emoji: '🏨' },
];

export const BUDGET: BudgetItem[] = [
  { id: 'flight', cat: '항공', amt: '₩1,400,000', amtNum: 1400000, detail: 'ICN → LIS, BCN → ICN', pct: 28, color: '#1976D2' },
  { id: 'accommodation', cat: '숙소', amt: '₩1,200,000', amtNum: 1200000, detail: '25박 평균 ₩48,000', pct: 24, color: '#E64A19' },
  { id: 'food', cat: '식비', amt: '₩750,000', amtNum: 750000, detail: '일 ₩30,000', pct: 15, color: '#388E3C' },
  { id: 'transport', cat: '교통', amt: '₩500,000', amtNum: 500000, detail: '도시간 이동, 현지 교통', pct: 10, color: '#7B1FA2' },
  { id: 'admission', cat: '입장료', amt: '₩300,000', amtNum: 300000, detail: '알람브라, 사그라다 파밀리아 등', pct: 6, color: '#F57C00' },
  { id: 'gear', cat: '장비', amt: '₩400,000', amtNum: 400000, detail: '등산화, 배낭, 침낭 등', pct: 8, color: '#0097A7' },
  { id: 'insurance', cat: '보험/비자', amt: '₩150,000', amtNum: 150000, detail: '여행자 보험', pct: 3, color: '#C2185B' },
  { id: 'misc', cat: '기타', amt: '₩300,000', amtNum: 300000, detail: '기념품, 예비비', pct: 6, color: '#455A64' },
];

export const FLIGHTS: FlightData[] = [
  { type: '출발', from: 'ICN 인천', to: 'LIS 리스본', date: '2026.07.05 (토)', note: '경유 1회 (이스탄불)' },
  { type: '귀국', from: 'BCN 바르셀로나', to: 'ICN 인천', date: '2026.07.29 (화)', note: '경유 1회 (이스탄불)' },
];

export const TRANSPORTS: Transport[] = [
  { route: '리스본 → 신트라', method: '🚂 기차', time: '40분', price: '€2.3', tip: 'Rossio역에서 출발' },
  { route: '신트라 → 포르투', method: '🚂 기차', time: '3시간', price: '€20', tip: 'AP(급행) 추천' },
  { route: '산티아고 → 세비야', method: '✈️ 비행기', time: '1시간 30분', price: '€50-80', tip: 'Ryanair / Vueling' },
  { route: '세비야 → 코르도바', method: '🚂 AVE', time: '45분', price: '€15-30', tip: 'Renfe 사전 예매' },
  { route: '코르도바 → 그라나다', method: '🚂 기차', time: '1시간 40분', price: '€20-35', tip: 'AVANT 열차' },
  { route: '그라나다 → 론다', method: '🚌 버스', time: '2시간 45분', price: '€12', tip: 'ALSA 버스' },
  { route: '그라나다 → 마드리드', method: '🚂 AVE', time: '3시간 30분', price: '€30-50', tip: 'Renfe 사전 예매 할인' },
  { route: '마드리드 → 톨레도', method: '🚂 AVANT', time: '33분', price: '€13', tip: 'Atocha역 출발' },
  { route: '마드리드 → 바르셀로나', method: '🚂 AVE', time: '2시간 30분', price: '€25-60', tip: '최소 2주 전 예매!' },
];

export const CHECKLIST: ChecklistCategory[] = [
  {
    title: '서류/필수',
    items: ['여권 (유효기간 6개월 이상)', '여행자 보험 가입증', '항공권 e-티켓 출력', '숙소 예약 확인서', '순례자 크리덴셜 (카미노)', '알람브라 예약 확인서', '신용카드 2장 + 현금 €200', '국제운전면허증'],
  },
  {
    title: '카미노 장비',
    items: ['등산화 (길들인 것)', '배낭 (35-40L)', '침낭 (여름용)', '스틱 (접이식)', '레인커버 / 판초', '헤드랜턴', '물통 (1L)', '발 관리 키트 (바셀린, 밴드)'],
  },
  {
    title: '의류',
    items: ['속건성 티셔츠 3장', '반바지 2벌', '긴바지 1벌', '방풍 자켓', '속옷 3벌', '등산 양말 3켤레', '슬리퍼/샌들', '수영복', '모자 / 선글라스'],
  },
  {
    title: '세면/건강',
    items: ['선크림 SPF50', '세면도구 (소형)', '수건 (속건성)', '상비약 (진통제, 소화제, 밴드)', '벌레 퇴치제', '귀마개 + 안대'],
  },
  {
    title: '전자기기',
    items: ['스마트폰 + 충전기', '보조 배터리 (20000mAh)', '유럽 어댑터 (C타입)', '카메라', 'eSIM / 포켓와이파이'],
  },
];
