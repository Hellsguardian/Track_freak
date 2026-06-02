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

export interface ProductivityNode {
  id: string;
  created_at: string;
  log_date: string;
  coding_seconds: number;
  coding_started_at?: string | null;
  is_coding: boolean;
  book_reading: boolean;
  ukulele_practice: boolean;
  workout: boolean;
}

export interface VibeNode {
  id: string;
  created_at: string;
  log_date: string;
  mood: number | null;
  stress_level: number | null;
}

export interface DigitalNode {
  id: string;
  created_at: string;
  log_date: string;
  scree_time: number; // DB has a typo: scree_time instead of screen_time
  insta_time: number;
}
