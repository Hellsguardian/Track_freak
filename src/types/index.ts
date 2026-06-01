export interface Project {
  id: string;
  name: string;
  desc: string;
  stack: string;
  category: string;
  history: Record<string, boolean>; // Date string "YYYY-MM-DD" -> worked
}

export interface SleepState {
  start: string;
  end: string;
  isSleeping: boolean;
}

export interface SleepBatch {
  id: string | number;
  start: string;
  end: string;
  duration: number;
}

export interface NutritionState {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}
