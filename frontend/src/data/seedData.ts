import { FoodItem, HealthProfile, Meal, LabReport, MedicineReminder, InferenceLog } from '../types';

export const SEEDED_HEALTH_PROFILE: HealthProfile = {
  id: 1,
  name: "Anil Kumar",
  age: 42,
  sex: "Male",
  height_cm: 172,
  weight_kg: 76,
  has_diabetes: true,
  has_hypertension: false,
  has_thyroid: false,
  has_pcos: false,
  weight_goal: "Lose",
  activity_level: "Moderate"
};

export const SEEDED_FOODS: FoodItem[] = [
  {
    id: 1,
    name: "Masala Dosa",
    category: "South Indian",
    calories_per_100g: 165,
    carbs_per_100g: 26.0,
    protein_per_100g: 4.2,
    fat_per_100g: 5.5,
    fiber_per_100g: 2.1,
    sodium_level: "Medium",
    glycemic_load_tag: "High",
    default_portion: "Medium",
    image_url: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Dosa",
    category: "South Indian",
    calories_per_100g: 150,
    carbs_per_100g: 25.0,
    protein_per_100g: 3.8,
    fat_per_100g: 4.0,
    fiber_per_100g: 1.8,
    sodium_level: "Medium",
    glycemic_load_tag: "High",
    default_portion: "Medium",
    image_url: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Idli",
    category: "South Indian",
    calories_per_100g: 130,
    carbs_per_100g: 26.0,
    protein_per_100g: 4.5,
    fat_per_100g: 0.8,
    fiber_per_100g: 2.0,
    sodium_level: "Low",
    glycemic_load_tag: "Medium",
    default_portion: "Medium",
    image_url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Sambar",
    category: "South Indian",
    calories_per_100g: 65,
    carbs_per_100g: 9.0,
    protein_per_100g: 3.5,
    fat_per_100g: 1.8,
    fiber_per_100g: 2.5,
    sodium_level: "Medium",
    glycemic_load_tag: "Low",
    default_portion: "Medium",
    image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Rajma Rice",
    category: "North Indian",
    calories_per_100g: 145,
    carbs_per_100g: 24.0,
    protein_per_100g: 5.8,
    fat_per_100g: 3.0,
    fiber_per_100g: 4.2,
    sodium_level: "Medium",
    glycemic_load_tag: "Medium",
    default_portion: "Medium",
    image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Fruit Bowl",
    category: "Snack",
    calories_per_100g: 55,
    carbs_per_100g: 13.0,
    protein_per_100g: 0.8,
    fat_per_100g: 0.2,
    fiber_per_100g: 2.4,
    sodium_level: "Low",
    glycemic_load_tag: "Low",
    default_portion: "Small",
    image_url: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    name: "Biryani",
    category: "Main Course",
    calories_per_100g: 200,
    carbs_per_100g: 26.0,
    protein_per_100g: 8.0,
    fat_per_100g: 7.5,
    fiber_per_100g: 1.5,
    sodium_level: "High",
    glycemic_load_tag: "High",
    default_portion: "Medium",
    image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    name: "Chole Bhature",
    category: "North Indian",
    calories_per_100g: 280,
    carbs_per_100g: 36.0,
    protein_per_100g: 7.0,
    fat_per_100g: 12.0,
    fiber_per_100g: 3.8,
    sodium_level: "High",
    glycemic_load_tag: "High",
    default_portion: "Medium",
    image_url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 9,
    name: "Paneer Tikka",
    category: "Appetizer",
    calories_per_100g: 220,
    carbs_per_100g: 6.0,
    protein_per_100g: 16.0,
    fat_per_100g: 14.0,
    fiber_per_100g: 1.2,
    sodium_level: "Medium",
    glycemic_load_tag: "Low",
    default_portion: "Medium",
    image_url: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 10,
    name: "Poha",
    category: "Breakfast",
    calories_per_100g: 180,
    carbs_per_100g: 32.0,
    protein_per_100g: 3.2,
    fat_per_100g: 4.5,
    fiber_per_100g: 1.8,
    sodium_level: "Medium",
    glycemic_load_tag: "Medium",
    default_portion: "Medium",
    image_url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 11,
    name: "Multigrain Biscuits",
    category: "Packaged Food",
    calories_per_100g: 440,
    carbs_per_100g: 64.0,
    protein_per_100g: 8.0,
    fat_per_100g: 16.0,
    fiber_per_100g: 6.0,
    sodium_level: "Medium",
    glycemic_load_tag: "Medium",
    default_portion: "Small",
    barcode: "8901234567890",
    image_url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80"
  }
];

export const SEEDED_MEALS: Meal[] = [
  {
    id: 1,
    food_name: "Masala Dosa",
    portion_size: "Medium",
    calories_min: 320,
    calories_max: 380,
    carbs_g: 52.0,
    protein_g: 8.4,
    fat_g: 11.0,
    fiber_g: 4.2,
    risk_level: "MEDIUM",
    health_conditions: "Type 2 Diabetes",
    pairing_suggestion: "Sambar + vegetable side",
    activity_suggestion: "10–15 minute walk",
    ai_explanation: "Masala Dosa contains a relatively high carbohydrate load. A moderate portion paired with sambar helps make the meal balanced.",
    image_url: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80",
    timestamp: "8:30 AM (Breakfast)"
  },
  {
    id: 2,
    food_name: "Rajma Rice",
    portion_size: "Medium",
    calories_min: 420,
    calories_max: 480,
    carbs_g: 58.0,
    protein_g: 14.0,
    fat_g: 6.5,
    fiber_g: 9.0,
    risk_level: "LOW",
    health_conditions: "Type 2 Diabetes",
    pairing_suggestion: "Cucumber raita",
    activity_suggestion: "10 minute post-meal walk",
    ai_explanation: "Rajma is rich in soluble fiber and complex plant protein, stabilizing glucose absorption.",
    image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
    timestamp: "1:15 PM (Lunch)"
  },
  {
    id: 3,
    food_name: "Fruit Bowl",
    portion_size: "Small",
    calories_min: 110,
    calories_max: 130,
    carbs_g: 24.0,
    protein_g: 1.5,
    fat_g: 0.4,
    fiber_g: 4.5,
    risk_level: "LOW",
    health_conditions: "Type 2 Diabetes",
    pairing_suggestion: "Handful of soaked almonds",
    activity_suggestion: "Light evening stroll",
    ai_explanation: "Low glycemic impact fruit portion rich in vitamins.",
    image_url: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=600&q=80",
    timestamp: "5:00 PM (Snack)"
  }
];

export const SEEDED_LAB_REPORTS: LabReport[] = [
  {
    id: 1,
    report_title: "Metabolic & Glycemic Lab Report",
    file_name: "report_october.pdf",
    created_at: "2026-10-01",
    values: [
      { id: 101, parameter: "HbA1c", value: 7.2, unit: "%", reference_range: "< 5.7 %", flag: "Borderline", recorded_date: "2026-10-01" },
      { id: 102, parameter: "Fasting Glucose", value: 138.0, unit: "mg/dL", reference_range: "70–99 mg/dL", flag: "High", recorded_date: "2026-10-01" },
      { id: 103, parameter: "Post-meal Glucose", value: 186.0, unit: "mg/dL", reference_range: "< 140 mg/dL", flag: "High", recorded_date: "2026-10-01" }
    ]
  },
  {
    id: 2,
    report_title: "Previous Quarter Lab Test",
    file_name: "report_july.pdf",
    created_at: "2026-07-15",
    values: [
      { id: 201, parameter: "HbA1c", value: 7.6, unit: "%", reference_range: "< 5.7 %", flag: "High", recorded_date: "2026-07-15" },
      { id: 202, parameter: "Fasting Glucose", value: 148.0, unit: "mg/dL", reference_range: "70–99 mg/dL", flag: "High", recorded_date: "2026-07-15" },
      { id: 203, parameter: "Post-meal Glucose", value: 204.0, unit: "mg/dL", reference_range: "< 140 mg/dL", flag: "High", recorded_date: "2026-07-15" }
    ]
  }
];

export const SEEDED_REMINDERS: MedicineReminder[] = [
  { id: 1, medicine_name: "Metformin", dosage: "500 mg", time: "08:00 AM", frequency: "Daily", notes: "Take with breakfast", is_completed: true },
  { id: 2, medicine_name: "Teneligliptin", dosage: "20 mg", time: "01:30 PM", frequency: "Daily", notes: "Take before lunch", is_completed: false },
  { id: 3, medicine_name: "Metformin", dosage: "500 mg", time: "08:00 PM", frequency: "Daily", notes: "Take after dinner", is_completed: false }
];

export const SEEDED_INFERENCE_LOGS: InferenceLog[] = [
  {
    id: 1,
    timestamp: "Just now",
    model_name: "EfficientNet-Lite0",
    runtime: "LiteRT / TFLite",
    backend_device: "Snapdragon NPU",
    latency_ms: 42,
    confidence: 0.94,
    llm_status: "Ready (Gemma 2B)",
    offline_mode: true,
    privacy_status: "Device-Only",
    input_type: "Camera Scanner - Masala Dosa"
  },
  {
    id: 2,
    timestamp: "12 mins ago",
    model_name: "MobileNetV3-Custom",
    runtime: "LiteRT / TFLite",
    backend_device: "Snapdragon NPU",
    latency_ms: 38,
    confidence: 0.91,
    llm_status: "Ready (Gemma 2B)",
    offline_mode: true,
    privacy_status: "Device-Only",
    input_type: "Barcode Scan - Multigrain Biscuits"
  },
  {
    id: 3,
    timestamp: "45 mins ago",
    model_name: "ML Kit OCR Engine",
    runtime: "On-Device Android ML Kit",
    backend_device: "CPU / Hexagon DSP",
    latency_ms: 110,
    confidence: 0.98,
    llm_status: "Ready (Gemma 2B)",
    offline_mode: true,
    privacy_status: "Device-Only",
    input_type: "Lab Report OCR - HbA1c"
  }
];
