export interface HealthProfile {
  id?: number;
  name: string;
  age: number;
  sex: string;
  height_cm: number;
  weight_kg: number;
  has_diabetes: boolean;
  has_hypertension: boolean;
  has_thyroid: boolean;
  has_pcos: boolean;
  weight_goal: string;
  activity_level: string;
}

export interface FoodItem {
  id: number;
  name: string;
  category: string;
  calories_per_100g: number;
  carbs_per_100g: number;
  protein_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g: number;
  sodium_level: string;
  glycemic_load_tag: string;
  default_portion: string;
  portion_unit?: string;
  image_url: string;
  barcode?: string;
}

export interface RiskEvaluationResult {
  food_name: string;
  portion_size: string;
  calories_range: string;
  calories_min: number;
  calories_max: number;
  carbs_g: number;
  protein_g: number;
  fat_g: number;
  fiber_g: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  risk_score: number;
  reason_codes: string[];
  structured_facts: string[];
  recommended_portion: string;
  pairing: string;
  activity: string;
  ai_explanation: string;
}

export interface Meal {
  id: number;
  food_name: string;
  portion_size: string;
  calories_min: number;
  calories_max: number;
  carbs_g: number;
  protein_g: number;
  fat_g: number;
  fiber_g: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  health_conditions: string;
  pairing_suggestion: string;
  activity_suggestion: string;
  ai_explanation: string;
  image_url?: string;
  timestamp: string;
}

export interface LabValue {
  id?: number;
  parameter: string;
  value: number;
  unit: string;
  reference_range: string;
  flag: 'Normal' | 'High' | 'Borderline';
  recorded_date?: string;
}

export interface LabReport {
  id: number;
  report_title: string;
  file_name: string;
  created_at: string;
  values: LabValue[];
}

export interface MedicineReminder {
  id?: number;
  medicine_name: string;
  dosage: string;
  time: string;
  frequency: string;
  notes: string;
  is_completed: boolean;
}

export interface InferenceLog {
  id: number;
  timestamp: string;
  model_name: string;
  runtime: string;
  backend_device: string;
  latency_ms: number;
  confidence: number;
  llm_status: string;
  offline_mode: boolean;
  privacy_status: string;
  input_type: string;
}

export type ActiveTab = 
  | 'landing'
  | 'dashboard'
  | 'scan-food'
  | 'voice-assistant'
  | 'health-profile'
  | 'meal-history'
  | 'lab-reports'
  | 'packaged-food'
  | 'medicine-reminders'
  | 'office-dashboard'
  | 'settings';
