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
  porto: { label: '포르토', color: '#EA580C', emoji: '🇵🇹' },
  camino: { label: '카미노', color: '#16A34A', emoji: '🐚' },
  london: { label: '런던·캠브리지', color: '#2563EB', emoji: '🇬🇧' },
  paris: { label: '파리', color: '#DB2777', emoji: '🇫🇷' },
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
    day: 1, date: '6/16 (화)', phase: 'porto', title: '인천 → 프랑크푸르트 → 포르토',
    icon: '✈️', desc: '루프트한자 ICN 12:20 출발 (LH0713, 13h20m) → FRA 18:40 도착, 2h20m 환승 → FRA 21:00 출발 (LH1180, 2h50m) → 포르토 22:50 도착. 야간 도착이므로 공항 → 호텔 직행, 가볍게 정착 후 취침.',
    food: '기내식 (점심+저녁) · FRA 환승 시 가벼운 스낵', stay: '포르토 부티크 호텔',
    lat: 41.1579, lng: -8.6291,
    restaurants: ['(도착 다음날) Cervejaria Brasão'],
  },
  {
    day: 2, date: '6/17 (수)', phase: 'porto', title: '포르토 시내 관광 + 시차 적응',
    icon: '🍷', desc: '동 루이스 1세 다리, 리베이라 지구 산책, 도루강 크루즈, 포트와인 셀러 투어. 카미노 시작 전 마지막 휴식.',
    food: '프란세지냐, 비파나, 포트와인', stay: '포르토 부티크 호텔',
    lat: 41.1409, lng: -8.6132,
    restaurants: ['Cafe Santiago (프란세지냐 원조)', 'Cafe Majestic', 'Taylor\'s Port Cellar'],
  },
  {
    day: 3, date: '6/18 (목)', phase: 'camino', title: '카미노 Day 1: 포르토 → Vairão',
    icon: '🐚', desc: '카미노 포르투게스 중앙 루트 출발! 포르토 대성당에서 첫 도장 받기. 도시 외곽까지 27km, 첫날 무리하지 말 것.',
    food: '아침 페이스트리, 알베르게 순례자 메뉴', stay: '알베르게 (Vairão Monastery)',
    lat: 41.3411, lng: -8.6694, dist: '27km',
  },
  {
    day: 4, date: '6/19 (금)', phase: 'camino', title: '카미노 Day 2: Vairão → Barcelos',
    icon: '🐚', desc: 'Rates 시골길 통과. 바르셀로스 도착, 수탉 전설의 도시. 목요일이라면 바르셀로스 시장 구경(주중에 따라).',
    food: '바칼랴우 아 브라스, 콜드 그린 수프', stay: '알베르게 Cidade de Barcelos',
    lat: 41.5314, lng: -8.6150, dist: '29km',
  },
  {
    day: 5, date: '6/20 (토)', phase: 'camino', title: '카미노 Day 3: Barcelos → Ponte de Lima',
    icon: '🐚', desc: '리마 강변의 중세 마을. 포르투갈에서 가장 오래된 마을 중 하나. 가장 긴 구간이므로 일찍 출발.',
    food: '아로스 드 사라불류, 비뇨 베르드', stay: '알베르게 de Ponte de Lima',
    lat: 41.7674, lng: -8.5840, dist: '33km',
  },
  {
    day: 6, date: '6/21 (일)', phase: 'camino', title: '카미노 Day 4: Ponte de Lima → Rubiães',
    icon: '🐚', desc: '오르막길 시작 — 라브루자 언덕(Alto da Portela Grande). 짧은 구간이라 회복일에 가까움.',
    food: '콘예슈 구이, 알베르게 순례자 메뉴', stay: '알베르게 São Pedro de Rubiães',
    lat: 41.9089, lng: -8.5733, dist: '18km',
  },
  {
    day: 7, date: '6/22 (월)', phase: 'camino', title: '카미노 Day 5: Rubiães → Tui ⭐ 스페인 진입',
    icon: '🇪🇸', desc: 'Valença 요새 마을 거쳐 미뉴 강 다리 건너 스페인 갈리시아 진입! Tui 대성당 방문 + 두 번째 도장.',
    food: '풀포 아 페이라 (갈리시아식 문어)', stay: '알베르게 de Tui',
    lat: 42.0466, lng: -8.6448, dist: '20km',
  },
  {
    day: 8, date: '6/23 (화)', phase: 'camino', title: '카미노 Day 6: Tui → O Porriño',
    icon: '🐚', desc: '짧은 구간으로 여유. 갈리시아 음식 맛보기. 산업지대 + 숲길 혼합.',
    food: '엠파나다 갈레가, 알바리뇨 와인', stay: '알베르게 de O Porriño',
    lat: 42.1583, lng: -8.6189, dist: '16km',
  },
  {
    day: 9, date: '6/24 (수)', phase: 'camino', title: '카미노 Day 7: O Porriño → Redondela',
    icon: '🐚', desc: '소나무·유칼립투스 숲길 + 산티아고 가는 다른 루트(코스털)와 합류.',
    food: '메히요네스 (홍합)', stay: '알베르게 de Redondela',
    lat: 42.2839, lng: -8.6094, dist: '15km',
  },
  {
    day: 10, date: '6/25 (목)', phase: 'camino', title: '카미노 Day 8: Redondela → Pontevedra',
    icon: '🐚', desc: '폰테베드라 구시가지가 매우 아름다움. 광장에서 저녁 타파스 산책.',
    food: '폰테베드라 타파스 투어, 라콘', stay: '알베르게 Virxe Peregrina',
    lat: 42.4310, lng: -8.6440, dist: '19km',
  },
  {
    day: 11, date: '6/26 (금)', phase: 'camino', title: '카미노 Day 9: Pontevedra → Caldas de Reis',
    icon: '♨️', desc: '온천 마을 칼다스 데 레이스 도착. 발 피로 회복에 최적. 저녁에 온천욕 권장.',
    food: '엠파나다, 라콘 콘 그렐로스', stay: '알베르게 de Caldas de Reis',
    lat: 42.6050, lng: -8.6420, dist: '22km',
  },
  {
    day: 12, date: '6/27 (토)', phase: 'camino', title: '카미노 Day 10: Caldas → Padrón',
    icon: '🌶️', desc: '유칼립투스 숲길. 파드론 고추(피미엔토스)의 고향. 산티아고가 가까워지는 설렘.',
    food: '피미엔토스 데 파드론 (꼭 먹기!)', stay: '알베르게 de Padrón',
    lat: 42.7400, lng: -8.6600, dist: '19km',
  },
  {
    day: 13, date: '6/28 (일)', phase: 'camino', title: '⭐ Day 11: Padrón → Santiago de Compostela 도착!',
    icon: '⭐', desc: '대망의 마지막 구간! 산티아고 대성당이 보이는 순간 감동. 12시 순례자 미사 참석. Compostela 증명서 발급.',
    food: '타르타 데 산티아고, 풀포 아 페이라', stay: '산티아고 부티크 호텔 (자축 한 잔!)',
    lat: 42.8805, lng: -8.5457, dist: '24km',
    restaurants: ['O Curro da Parra', 'Abastos 2.0', 'Casa Marcelo'],
  },
  {
    day: 14, date: '6/29 (월)', phase: 'london', title: '산티아고 → 런던',
    icon: '✈️', desc: '오전 산티아고 대성당 마지막 방문 + 체크아웃. Vueling SCQ 16:50 → LHR 18:00 직항 (2h 10m). 19시경 히드로 도착, Elizabeth Line으로 런던 시내 이동. 펍에서 첫 영국 저녁.',
    food: 'Vueling 기내 스낵 · 런던 펍 저녁', stay: '런던 시내 호텔',
    lat: 51.5074, lng: -0.1278,
    restaurants: ['Dishoom Covent Garden', 'The Ivy'],
  },
  {
    day: 15, date: '6/30 (화)', phase: 'london', title: '런던 → 캠브리지 이동',
    icon: '🚂', desc: 'Kings Cross에서 캠브리지行 기차 (45-75분). 캠브리지 도착 후 콜리지 산책, 펀팅(보트). 졸업식 전야.',
    food: 'Fitzbillies 첼시번, Aromi 이탈리안', stay: '캠브리지 호텔',
    lat: 52.2053, lng: 0.1218,
    restaurants: ['The Eagle (역사적 펍)', 'Fitzbillies'],
  },
  {
    day: 16, date: '7/1 (수)', phase: 'london', title: '🎓 캠브리지 졸업식',
    icon: '🎓', desc: '아들 캠브리지 졸업식! Senate House에서 공식 학위 수여. 가족 사진, 콜리지 가든 파티.',
    food: '졸업 축하 만찬', stay: '캠브리지 호텔',
    lat: 52.2068, lng: 0.1181,
    restaurants: ['Midsummer House (미슐랭 2★)', 'Restaurant 22'],
  },
  {
    day: 17, date: '7/2 (목)', phase: 'paris', title: '캠브리지 → 런던 → 🚄 Eurostar → 파리',
    icon: '🚄', desc: '오전 캠브리지에서 런던 Kings Cross 기차 (45분). 도보 5분으로 St Pancras 이동. Eurostar 출발 (2h 20m) → 파리 Gare du Nord 도착. 호텔 체크인 + 마레지구 야경 산책 + 비스트로 첫 저녁.',
    food: 'Eurostar 스낵 · 파리 비스트로 (스테이크 프리트)', stay: '파리 부티크 호텔 (마레/오페라)',
    lat: 48.8566, lng: 2.3522,
    restaurants: ['Bistrot Paul Bert', 'Le Comptoir du Relais', 'Chez Janou'],
  },
  {
    day: 18, date: '7/3 (금)', phase: 'paris', title: '파리 클래식: 에펠탑·루브르·세느강',
    icon: '🗼', desc: '오전 에펠탑 + 트로카데로 전망, 점심 후 루브르 박물관 (모나리자·비너스). 늦은 오후 세느강 유람선 + 일몰. 라탱지구·생제르맹에서 저녁.',
    food: '크루아상·에스카르고·뵈프 부르기뇽', stay: '파리 부티크 호텔',
    lat: 48.8584, lng: 2.2945,
    restaurants: ['Café de Flore', 'L\'Ami Jean', 'Le Procope'],
  },
  {
    day: 19, date: '7/4 (토)', phase: 'paris', title: '👑 베르사유 궁전 당일치기',
    icon: '👑', desc: 'RER C로 베르사유 도착 (45분). 궁전 + 정원 + 트리아농 전체 관람 (사전 예매 필수). 저녁 파리 복귀 후 마레지구 비스트로.',
    food: '베르사유 정원 피크닉 + 마레지구 저녁', stay: '파리 부티크 호텔',
    lat: 48.8048, lng: 2.1203,
    restaurants: ['Breizh Café (크레프)', 'L\'As du Fallafel'],
  },
  {
    day: 20, date: '7/5 (일)', phase: 'paris', title: '오르세·마레·몽마르뜨',
    icon: '🎨', desc: '오전 오르세 미술관 (인상파의 성지). 점심 후 마레지구 + 피카소 미술관 + 보주 광장 산책. 늦은 오후 몽마르뜨·사크레쾨르 + 일몰. 노천 카페 저녁.',
    food: '오르세 카페 점심·팔라펠·뵈프 부르기뇽', stay: '파리 부티크 호텔',
    lat: 48.8867, lng: 2.3431,
    restaurants: ['Le Consulat', 'Pink Mamma', 'Bouillon Pigalle'],
  },
  {
    day: 21, date: '7/6 (월)', phase: 'paris', title: '🛫 마지막 파리 + CDG → 인천',
    icon: '🛬', desc: '오전 마지막 마카롱 (Pierre Hermé) + Galeries Lafayette 옥상 전망. 오후 호텔 체크아웃 → RER B로 CDG (1h). KE5904 CDG 19:10 출발 → ICN 7/7 (화) 14:10 도착. 7/7 회복, 7/8 (수)부터 출근.',
    food: '마지막 파리 점심 + 기내식', stay: '기내 / 7/7 화요일 14:10 인천 도착',
    lat: 49.0097, lng: 2.5479,
    restaurants: ['Pierre Hermé', 'Du Pain et des Idées'],
  },
];

export const CAMINO_STAGES: CaminoStage[] = [
  { day: 1, from: '포르토', to: 'Vairão', km: 27, elev: '+350m / -280m', diff: 3, surface: '포장도로 60%, 흙길 40%', water: '3km마다', tip: '첫날이라 무리하지 말 것. 출발 전 발에 바셀린. 포르토 대성당 도장 필수.', albergue: 'Albergue do Mosteiro de Vairão' },
  { day: 2, from: 'Vairão', to: 'Barcelos', km: 29, elev: '+200m / -300m', diff: 3, surface: '시골길 65%, 포장 35%', water: '5km마다', tip: '바르셀로스 수탉 전설지 방문. 시내 진입 전 길고 평탄한 구간.', albergue: 'Albergue Cidade de Barcelos' },
  { day: 3, from: 'Barcelos', to: 'Ponte de Lima', km: 33, elev: '+450m / -400m', diff: 4, surface: '숲길 55%, 포장 45%', water: '4km마다', tip: '⚠️ 가장 긴 구간! 6시 일찍 출발 권장. 리마 강변 도착 시 감동.', albergue: 'Albergue de Ponte de Lima' },
  { day: 4, from: 'Ponte de Lima', to: 'Rubiães', km: 18, elev: '+580m / -350m', diff: 4, surface: '돌길 60%, 포장 40%', water: '3km마다', tip: 'Alto da Portela Grande 오르막 — 짧지만 가파름. 정상에서 휴식.', albergue: 'Albergue São Pedro de Rubiães' },
  { day: 5, from: 'Rubiães', to: 'Tui', km: 20, elev: '+280m / -420m', diff: 3, surface: '포장 50%, 흙길 50%', water: '4km마다', tip: '🇪🇸 국경 다리 통과! 여권 지참. 시간 변경 주의 (포르투갈→스페인 +1h). 투이 대성당 꼭 방문.', albergue: 'Albergue de Tui (Convento)' },
  { day: 6, from: 'Tui', to: 'O Porriño', km: 16, elev: '+150m / -100m', diff: 2, surface: '숲길 55%, 산업지대 45%', water: '5km마다', tip: '짧은 구간으로 여유. 갈리시아 음식과 알바리뇨 와인 시도!', albergue: 'Albergue de O Porriño' },
  { day: 7, from: 'O Porriño', to: 'Redondela', km: 15, elev: '+300m / -250m', diff: 2, surface: '유칼립투스 숲 70%, 포장 30%', water: '4km마다', tip: '코스털 루트와 합류 — 갑자기 순례자 증가. 점심 전 도착 가능.', albergue: 'Albergue de Redondela' },
  { day: 8, from: 'Redondela', to: 'Pontevedra', km: 19, elev: '+350m / -380m', diff: 3, surface: '숲길 60%, 포장 40%', water: '3km마다', tip: '폰테베드라 구시가지 매우 아름다움. 저녁에 광장 타파스 투어 필수.', albergue: 'Albergue Virxe Peregrina' },
  { day: 9, from: 'Pontevedra', to: 'Caldas de Reis', km: 22, elev: '+200m / -180m', diff: 2, surface: '포장 50%, 흙길 50%', water: '4km마다', tip: '♨️ 온천 마을! 도착 후 온천욕으로 발 피로 풀기. 발 관리 키트 활용.', albergue: 'Albergue de Caldas de Reis' },
  { day: 10, from: 'Caldas de Reis', to: 'Padrón', km: 19, elev: '+280m / -300m', diff: 3, surface: '유칼립투스 숲 65%, 포장 35%', water: '3km마다', tip: '🌶️ 파드론 고추 꼭 먹을 것! 산티아고가 가까워진다는 설렘.', albergue: 'Albergue de Padrón' },
  { day: 11, from: 'Padrón', to: 'Santiago de Compostela', km: 24, elev: '+320m / -200m', diff: 3, surface: '숲길 50%, 포장 50%', water: '4km마다', tip: '⭐ 마지막 구간! 정오 순례자 미사 (Botafumeiro). Compostela 증명서 발급.', albergue: '호텔 (자축!)' },
];

export const EXPERIENCES: Experience[] = [
  { title: '포트와인 셀러 투어', desc: '빌라 노바 데 가이아에서 100년 셀러 시음', where: '포르토', emoji: '🍷', imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400', bg: 'pt', day: 'Day 2' },
  { title: '도루강 일몰 크루즈', desc: '동 루이스 다리 아래 6개 다리 투어', where: '포르토', emoji: '🌅', imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400', bg: 'pt', day: 'Day 2' },
  { title: '카미노 첫 도장', desc: '포르토 대성당에서 크리덴셜 시작', where: '포르토', emoji: '📜', imageUrl: 'https://images.unsplash.com/photo-1533619239233-6280475a633a?w=400', bg: 'cam', day: 'Day 3' },
  { title: '리마 강변 산책', desc: '포르투갈에서 가장 오래된 마을', where: 'Ponte de Lima', emoji: '🌉', imageUrl: 'https://images.unsplash.com/photo-1599037149928-e8d77fb1aa66?w=400', bg: 'cam', day: 'Day 5' },
  { title: '국경 다리 건너기', desc: '미뉴강 다리 — 포르투갈에서 스페인으로', where: 'Tui', emoji: '🇪🇸', imageUrl: 'https://images.unsplash.com/photo-1518889222693-89dc25f3edfc?w=400', bg: 'cam', day: 'Day 7' },
  { title: '갈리시아 타파스 투어', desc: '폰테베드라 광장에서 저녁 타파스', where: 'Pontevedra', emoji: '🍤', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', bg: 'cam', day: 'Day 10' },
  { title: '산티아고 대성당 미사', desc: '정오 순례자 미사 + Botafumeiro 향로', where: '산티아고', emoji: '⛪', imageUrl: 'https://images.unsplash.com/photo-1583779457711-ab081de64105?w=400', bg: 'cam', day: 'Day 13' },
  { title: '캠브리지 펀팅', desc: 'River Cam에서 콜리지 뒷마당 보트 투어', where: '캠브리지', emoji: '🚣', imageUrl: 'https://images.unsplash.com/photo-1583851126313-a8b9f80b8c4b?w=400', bg: 'uk', day: 'Day 15' },
  { title: '🎓 캠브리지 졸업식', desc: 'Senate House에서 학위 수여식', where: '캠브리지', emoji: '🎓', imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400', bg: 'uk', day: 'Day 16' },
  { title: '🚄 Eurostar 영불해협', desc: 'London St Pancras → Paris Gare du Nord 2h 20m', where: 'London ↔ Paris', emoji: '🚄', imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400', bg: 'fr', day: 'Day 17' },
  { title: '에펠탑 + 세느강', desc: '트로카데로 전망 + 일몰 유람선', where: '파리', emoji: '🗼', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400', bg: 'fr', day: 'Day 18' },
  { title: '루브르 박물관', desc: '모나리자·비너스·니케 — 핵심 작품 동선', where: '파리', emoji: '🖼️', imageUrl: 'https://images.unsplash.com/photo-1503917988258-f87a78e3c995?w=400', bg: 'fr', day: 'Day 18' },
  { title: '👑 베르사유 궁전', desc: '루이 14세의 절대왕정 — 거울의 방·정원·트리아농', where: '베르사유', emoji: '👑', imageUrl: 'https://images.unsplash.com/photo-1581420524920-50d76e5fcd2e?w=400', bg: 'fr', day: 'Day 19' },
  { title: '오르세 미술관', desc: '인상파의 성지 — 모네·고흐·세잔', where: '파리', emoji: '🎨', imageUrl: 'https://images.unsplash.com/photo-1605361329547-c01a9e3aa17a?w=400', bg: 'fr', day: 'Day 20' },
  { title: '몽마르뜨·사크레쾨르', desc: '예술가의 언덕 + 흰 대성당', where: '파리', emoji: '⛪', imageUrl: 'https://images.unsplash.com/photo-1551634979-2b11f8c946fe?w=400', bg: 'fr', day: 'Day 20' },
  { title: '마레지구 산책', desc: '피카소 미술관 + 보주 광장 + 부티크', where: '파리', emoji: '🏛️', imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400', bg: 'fr', day: 'Day 20' },
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
  { title: 'Fish & Chips', desc: '바삭한 영국 클래식', where: '런던', emoji: '🍟', imageUrl: 'https://images.unsplash.com/photo-1579208030886-b937da0925dc?w=400', bg: 'uk' },
  { title: 'Sunday Roast', desc: '캠브리지 펍에서 일요일 정찬', where: '캠브리지', emoji: '🍖', imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400', bg: 'uk' },
  { title: '크루아상·바게트', desc: '파리 동네 빵집의 아침', where: '파리', emoji: '🥐', imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', bg: 'fr' },
  { title: '에스카르고', desc: '갈릭버터에 구운 달팽이', where: '파리', emoji: '🐌', imageUrl: 'https://images.unsplash.com/photo-1610614819513-58e34989848b?w=400', bg: 'fr' },
  { title: '스테이크 프리트', desc: '비스트로 클래식 — 스테이크 + 감자튀김', where: '파리', emoji: '🥩', imageUrl: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=400', bg: 'fr' },
  { title: '마카롱', desc: 'Ladurée·Pierre Hermé의 마카롱 한 상자', where: '파리', emoji: '🍪', imageUrl: 'https://images.unsplash.com/photo-1558326567-98166e232c45?w=400', bg: 'fr' },
];

export const ACCOMMODATIONS: Accommodation[] = [
  { phase: 'porto', city: '포르토', name: 'The Editory Boulevard Aliados', type: '부티크 호텔', price: '€95/박', desc: '시내 중심, 조식 포함. 도착 후 휴식 + 시차 적응에 최적', emoji: '🏨' },
  { phase: 'camino', city: 'Vairão', name: 'Albergue do Mosteiro de Vairão', type: '알베르게', price: '€10/박', desc: '수도원 알베르게. 첫날 정통 순례자 경험.', emoji: '🛏️' },
  { phase: 'camino', city: 'Barcelos', name: 'Albergue Cidade de Barcelos', type: '알베르게', price: '€8/박', desc: '시내 중심, 시장 근처. 깨끗하고 가성비 좋음.', emoji: '🛏️' },
  { phase: 'camino', city: 'Ponte de Lima', name: 'Albergue de Peregrinos', type: '공립 알베르게', price: '€7/박', desc: '강변, 마을 외곽. 일찍 도착 권장 (선착순).', emoji: '🛏️' },
  { phase: 'camino', city: 'Rubiães', name: 'Albergue São Pedro de Rubiães', type: '공립 알베르게', price: '€6/박', desc: '작은 마을 — 미리 도착해 침대 확보.', emoji: '🛏️' },
  { phase: 'camino', city: 'Tui', name: 'Albergue de Tui (Convento)', type: '수도원 알베르게', price: '€8/박', desc: '13세기 수도원 — 분위기 압도적.', emoji: '🛏️' },
  { phase: 'camino', city: 'O Porriño', name: 'Albergue Municipal', type: '공립 알베르게', price: '€8/박', desc: '시설 신축, 주방 사용 가능.', emoji: '🛏️' },
  { phase: 'camino', city: 'Redondela', name: 'Casa da Torre', type: '알베르게', price: '€12/박', desc: '역사 건물, 정원 있음.', emoji: '🛏️' },
  { phase: 'camino', city: 'Pontevedra', name: 'Albergue Virxe Peregrina', type: '공립 알베르게', price: '€8/박', desc: '구시가지 중심. 저녁 타파스 동선 좋음.', emoji: '🛏️' },
  { phase: 'camino', city: 'Caldas de Reis', name: 'Albergue Municipal', type: '공립 알베르게', price: '€8/박', desc: '♨️ 온천 마을 — 도착 후 온천욕 가능.', emoji: '🛏️' },
  { phase: 'camino', city: 'Padrón', name: 'Albergue de Padrón', type: '공립 알베르게', price: '€8/박', desc: '강변, 시장 근처. 파드론 고추 꼭 먹기.', emoji: '🛏️' },
  { phase: 'camino', city: '산티아고', name: 'Hotel Costa Vella', type: '부티크 호텔', price: '€110/박', desc: '⭐ 순례 완주 자축! 구시가지, 정원 뷰.', emoji: '🏨' },
  { phase: 'london', city: '런던', name: 'The Hoxton, Holborn', type: '부티크 호텔', price: '£180/박 (1박)', desc: '6/29 1박 — 코벤트가든 도보권, 모던 디자인.', emoji: '🏨' },
  { phase: 'london', city: '캠브리지', name: 'University Arms', type: '럭셔리 호텔', price: '£260/박 (2박)', desc: '🎓 6/30-7/1 2박 — 캠브리지 클래식 호텔, Parker\'s Piece 앞.', emoji: '🏨' },
  { phase: 'paris', city: '파리', name: 'Hôtel des Grands Boulevards', type: '부티크 호텔', price: '€230/박 (4박)', desc: '7/2-7/5 4박 — 9구 중심, 마레·루브르·오페라 도보권. 옥상 칵테일 바.', emoji: '🏨' },
];

export const BUDGET: BudgetItem[] = [
  { id: 'flight', cat: '✈️ 항공권', amt: '₩10,400,000', amtNum: 10400000, detail: 'LH ICN→OPO×3명 (₩2.48M) + Vueling SCQ→LHR×3명 (₩0.58M) + KE5904 CDG→ICN×4명 (₩7.33M)', pct: 38, color: '#2563EB' },
  { id: 'accommodation', cat: '🏨 숙소', amt: '₩6,200,000', amtNum: 6200000, detail: '18박 · 포르토 2박 + 카미노 10박 + 산티아고 1박 + 런던 1박 + 캠브리지 2박 + 파리 4박 (3-4명, 패밀리룸/2룸)', pct: 22, color: '#EA580C' },
  { id: 'food', cat: '🍽️ 식비', amt: '₩4,900,000', amtNum: 4900000, detail: '카미노 14일 × 3명 × ₩50K + 런던·파리 7일 × 4명 × ₩90K', pct: 18, color: '#16A34A' },
  { id: 'gear', cat: '🥾 카미노 장비', amt: '₩1,500,000', amtNum: 1500000, detail: '3명 × ₩500K — 등산화·배낭·침낭·스틱·발 관리키트', pct: 5, color: '#0891B2' },
  { id: 'transport', cat: '🚄 교통', amt: '₩1,300,000', amtNum: 1300000, detail: 'Eurostar 4명 (~₩720K) + 캠브리지 기차 + Oyster + Paris Metro', pct: 5, color: '#7C3AED' },
  { id: 'admission', cat: '🎫 체험·입장료', amt: '₩1,000,000', amtNum: 1000000, detail: '베르사유·루브르·오르세·에펠탑 (각 4명) + 포트와인 셀러·펀팅', pct: 4, color: '#F59E0B' },
  { id: 'graduation', cat: '🎓 졸업식', amt: '₩800,000', amtNum: 800000, detail: '가족 사진·축하 만찬·선물·가운 대여', pct: 3, color: '#DB2777' },
  { id: 'insurance', cat: '🛡️ 보험·eSIM', amt: '₩500,000', amtNum: 500000, detail: '여행자 보험 3명 + eSIM 4명', pct: 2, color: '#C2185B' },
  { id: 'misc', cat: '💝 기타·예비', amt: '₩1,200,000', amtNum: 1200000, detail: '기념품·쇼핑·예비비 (변경 수수료 포함)', pct: 4, color: '#475569' },
];

export const FLIGHTS: FlightData[] = [
  { type: '출발', from: 'ICN 인천', to: 'OPO 포르토', date: '2026.06.16 (화) 12:20 → 22:50', note: '🇩🇪 루프트한자 LH0713+LH1180 (FRA 환승) · 18h 30m · ₩826,700 × 3명 = ₩2,480,100' },
  { type: '경유', from: 'SCQ 산티아고', to: 'LHR 런던', date: '2026.06.29 (월) 16:50 → 18:00', note: '🇪🇸 Vueling 직항 · 2h 10m · ₩191,956 × 3명 = ₩575,868' },
  { type: '경유', from: 'London 세인트팬크라스', to: 'Paris 가르 뒤 노르', date: '2026.07.02 (목) 오후', note: '🚄 Eurostar · 2h 20m · 약 £100 × 4명 = ~₩720,000 (둘째 합류)' },
  { type: '귀국', from: 'CDG 파리', to: 'ICN 인천', date: '2026.07.06 (월) 19:10 → 07.07 (화) 14:10', note: '🇰🇷 KE5904 (Asiana 공동운항) 직항 · 12h · ₩1,832,600 × 4명 = ₩7,330,400' },
];

export const TRANSPORTS: Transport[] = [
  { route: '포르토 공항 → 시내', method: '🚇 메트로 E선', time: '30분', price: '€2.6', tip: '24시간권 €7 권장' },
  { route: '포르토 → Vairão (선택)', method: '🚂 도시철도', time: '40분', price: '€2', tip: '카미노 시작 시 일부 구간 단축 옵션' },
  { route: '산티아고 → 런던 (LHR)', method: '✈️ Vueling 직항 (확정)', time: '2h 10m (16:50 → 18:00)', price: '₩191,956', tip: '✅ 예매 완료 — 16시까지 SCQ 공항 도착' },
  { route: 'LHR → 런던 시내', method: '🚇 Elizabeth Line / Heathrow Express', time: '32분 / 15분', price: '£12 / £25', tip: 'Elizabeth Line 가성비 ↑' },
  { route: '런던 (Kings Cross) → 캠브리지', method: '🚂 LNER / Great Northern', time: '45-75분', price: '£25-50', tip: 'Trainline 사전 예약 50% 할인' },
  { route: '캠브리지 → 런던 (7/2)', method: '🚂 Great Northern / LNER', time: '45-75분', price: '£25-50', tip: '오전 출발 — St Pancras Eurostar 환승 시간 확보' },
  { route: '런던 → 파리 (7/2)', method: '🚄 Eurostar (St Pancras → Gare du Nord)', time: '2h 20m', price: '£60-150', tip: '⚠️ 90분 전 도착 (보안검색·출입국심사). 사전 예매 필수' },
  { route: '파리 → 베르사유 왕복 (7/4)', method: '🚂 RER C', time: '45분', price: '€7.5 편도', tip: '베르사유 궁전 입장권은 별도 사전 예매 필수' },
  { route: '파리 시내 → CDG (7/6)', method: '🚇 RER B', time: '45-60분', price: '€11.4', tip: '✈️ KE5904 19:10 출발 — 17시까지 도착 목표' },
];

export const CHECKLIST: ChecklistCategory[] = [
  {
    title: '📋 서류·필수',
    items: ['여권 (유효기간 6개월 이상)', '여행자 보험 가입증', '항공권 e-티켓 3장 (LH ICN→OPO, Vueling SCQ→LHR, KE5904 CDG→ICN 7/6)', 'Eurostar 예약 확인서 (London → Paris)', '베르사유 궁전 입장권 (사전 예매!)', '숙소 예약 확인서 (포르토·산티아고·런던·캠브리지·파리)', '순례자 크리덴셜 (포르토 대성당에서 수령)', '캠브리지 졸업식 초청장', '회사 휴가 신청 (7/6, 7/7)', '신용카드 2장 + 현금 €500 + £100', '여권 사본 (별도 보관)'],
  },
  {
    title: '🥾 카미노 장비',
    items: ['등산화 (출국 2주 전부터 길들이기)', '배낭 35-40L (Osprey/Deuter)', '여름용 침낭 (실크 라이너 권장)', '접이식 트레킹 스틱 2개', '레인커버 + 가벼운 판초', '헤드랜턴 (이른 출발용)', '물통 1L + 정수 알약', '발 관리 키트 (바셀린, 콤피드, 압박붕대)'],
  },
  {
    title: '👕 의류',
    items: ['속건성 티셔츠 3장 (메리노 권장)', '트레킹 반바지 2벌', '긴 바지 1벌 (저녁/도시용)', '경량 방풍 자켓', '속옷 3벌 + 등산 양말 3켤레', '슬리퍼/샌들 (저녁/샤워용)', '🎓 졸업식용 정장/원피스 (캠브리지)', '런던용 가벼운 외투 (6월 평균 18도)'],
  },
  {
    title: '💊 세면·건강',
    items: ['선크림 SPF50 (스페인 자외선 강함)', '세면도구 (100ml 이하)', '속건성 수건 (마이크로파이버)', '상비약: 진통제·소화제·지사제·항히스타민', '벌레퇴치 스프레이', '귀마개 + 안대 (알베르게 필수)'],
  },
  {
    title: '📱 전자기기',
    items: ['스마트폰 + USB-C 충전기', '보조 배터리 20000mAh', '유럽 어댑터 C타입 (포·스·프), G타입 (영국)', '가벼운 카메라 또는 휴대폰만', 'eSIM 3종 (Airalo 유럽 + UK + 별도 프랑스 데이터)'],
  },
];
