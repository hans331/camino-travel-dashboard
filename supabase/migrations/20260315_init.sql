-- Budget actuals: one row per budget category
CREATE TABLE budget_actuals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL UNIQUE,
  actual_amount INTEGER DEFAULT 0,
  notes TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Checklist items
CREATE TABLE checklist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_index INTEGER NOT NULL,
  label TEXT NOT NULL,
  checked BOOLEAN DEFAULT false,
  memo TEXT DEFAULT '',
  is_custom BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Permissive RLS (personal app, no auth)
ALTER TABLE budget_actuals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on budget_actuals" ON budget_actuals FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on checklist_items" ON checklist_items FOR ALL USING (true) WITH CHECK (true);

-- Seed budget categories
INSERT INTO budget_actuals (category, actual_amount) VALUES
  ('flights', 0),
  ('city-hotel', 0),
  ('camino-stay', 0),
  ('food', 0),
  ('transport', 0),
  ('tickets', 0),
  ('misc', 0);

-- Seed checklist items
-- Category 0: 서류 & 예약
INSERT INTO checklist_items (category_index, label, sort_order) VALUES
  (0, '여권 유효기간 확인 (6개월 이상)', 0),
  (0, '항공권 예약 (다구간: 인천→리스본/바르셀로나→인천)', 1),
  (0, '알함브라 궁전 입장권 (alhambra-patronato.es)', 2),
  (0, '사그라다 파밀리아 입장권 (sagradafamilia.org)', 3),
  (0, '세비야 알카사르 사전 예매', 4),
  (0, '플라멩코 공연 예약', 5),
  (0, '해외여행자보험 (트레킹 보장!)', 6),
  (0, '도시 호텔 예약 (6개 도시)', 7),
  (0, '카미노 사설 알베르게 예약 (7월 성수기!)', 8),
  (0, '스페인 저가항공 예약 (Ryanair/Vueling)', 9),
  (0, 'Renfe AVE 기차표 예약', 10),
  (0, 'CP 기차표 예약 (리스본→포르투)', 11);

-- Category 1: 카미노 장비
INSERT INTO checklist_items (category_index, label, sort_order) VALUES
  (1, '트레킹화 (미리 길들이기! 50km+)', 0),
  (1, '배낭 35~40L', 1),
  (1, '침낭 라이너', 2),
  (1, '트레킹 스틱 (접이식)', 3),
  (1, '물통 1L + 500ml', 4),
  (1, '모자 + 선글라스', 5),
  (1, '선크림 SPF50+', 6),
  (1, '레인재킷', 7),
  (1, '속건성 티셔츠 2~3장', 8),
  (1, '속건성 바지/반바지 2장', 9),
  (1, '양말 3켤레 (울 추천)', 10),
  (1, '슬리퍼 (실내용)', 11),
  (1, '발 관리 키트 (바셀린, 컴피드, 테이핑)', 12),
  (1, '빨래 줄 + 세탁 비누', 13),
  (1, '헤드랜턴', 14),
  (1, '비닐 지퍼백', 15);

-- Category 2: 기기 & 앱
INSERT INTO checklist_items (category_index, label, sort_order) VALUES
  (2, '유럽 eSIM/유심', 0),
  (2, '보조배터리 20000mAh', 1),
  (2, '카메라 + 충전기', 2),
  (2, '유럽 어댑터 (C타입 둥근 2핀)', 3),
  (2, 'Buen Camino 앱', 4),
  (2, 'Gronze 앱', 5),
  (2, 'Google Maps 오프라인 지도', 6),
  (2, 'Booking.com 앱', 7),
  (2, 'Renfe / CP / ALSA 앱', 8);

-- Category 3: 건강 & 위생
INSERT INTO checklist_items (category_index, label, sort_order) VALUES
  (3, '상비약 (진통제, 소화제, 지사제)', 0),
  (3, '컴피드 물집패드 (넉넉히!!)', 1),
  (3, '선크림 SPF50+', 2),
  (3, '모기 기피제', 3),
  (3, '개인 세면도구', 4),
  (3, '속건성 수건', 5);

-- Category 4: 도시 관광용
INSERT INTO checklist_items (category_index, label, sort_order) VALUES
  (4, '캐리어 (숙소 보관)', 0),
  (4, '가벼운 린넨 옷', 1),
  (4, '편한 운동화', 2),
  (4, '얇은 카디건', 3),
  (4, '선글라스', 4);
