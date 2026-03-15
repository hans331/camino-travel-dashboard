export interface DayData {
  day: number;
  date: string;
  phase: 'portugal' | 'camino' | 'andalusia' | 'madrid' | 'barcelona';
  title: string;
  icon: string;
  desc: string;
  food: string;
  stay: string;
  lat: number;
  lng: number;
  dist?: string;
  restaurants?: string[];
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
  bg: 'pt' | 'cam' | 'es';
  day?: string;
}

export interface Food {
  title: string;
  desc: string;
  where: string;
  emoji: string;
  imageUrl: string;
  bg: 'pt' | 'cam' | 'es';
}

export interface Accommodation {
  phase: 'portugal' | 'camino' | 'spain';
  city: string;
  name: string;
  type: string;
  price: string;
  desc: string;
  emoji: string;
}

export interface BudgetItem {
  id: string;
  cat: string;
  amt: string;
  amtNum: number;
  detail: string;
  pct: number;
  color: string;
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

export interface ChecklistCategory {
  title: string;
  items: string[];
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
  checked: boolean;
  memo: string;
  is_custom: boolean;
  sort_order: number;
  created_at: string;
}
