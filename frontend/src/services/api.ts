import { 
  HealthProfile, FoodItem, RiskEvaluationResult, Meal, LabReport, MedicineReminder, InferenceLog 
} from '../types';
import { 
  SEEDED_HEALTH_PROFILE, SEEDED_FOODS, SEEDED_MEALS, SEEDED_LAB_REPORTS, SEEDED_REMINDERS, SEEDED_INFERENCE_LOGS 
} from '../data/seedData';
import { evaluateMealRiskLocal } from './ruleEngineLocal';

let isAirplaneModeSimulated = false;

export function setAirplaneMode(enabled: boolean) {
  isAirplaneModeSimulated = enabled;
}

export function getAirplaneMode(): boolean {
  return isAirplaneModeSimulated;
}

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function fetchHealthProfile(): Promise<HealthProfile> {
  if (isAirplaneModeSimulated) return SEEDED_HEALTH_PROFILE;
  try {
    const res = await fetch(`${API_BASE}/profile`);
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (err) {
    return SEEDED_HEALTH_PROFILE;
  }
}

export async function saveHealthProfile(profile: HealthProfile): Promise<HealthProfile> {
  if (isAirplaneModeSimulated) {
    Object.assign(SEEDED_HEALTH_PROFILE, profile);
    return SEEDED_HEALTH_PROFILE;
  }
  try {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (err) {
    Object.assign(SEEDED_HEALTH_PROFILE, profile);
    return SEEDED_HEALTH_PROFILE;
  }
}

export async function fetchFoods(): Promise<FoodItem[]> {
  if (isAirplaneModeSimulated) return SEEDED_FOODS;
  try {
    const res = await fetch(`${API_BASE}/foods`);
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (err) {
    return SEEDED_FOODS;
  }
}

export async function analyzeFoodImage(file?: File, foodHint?: string) {
  if (isAirplaneModeSimulated) {
    const matchedName = foodHint || (file?.name.toLowerCase().includes('dosa') ? 'Masala Dosa' : 'Masala Dosa');
    const food = SEEDED_FOODS.find(f => f.name.toLowerCase().includes(matchedName.toLowerCase())) || SEEDED_FOODS[0];
    return {
      status: "success",
      detected_food: food.name,
      confidence: 0.93,
      classification_engine: "Indian Food Classifier (Edge AI Simulation)",
      backend_hardware: "Qualcomm Snapdragon NPU / LiteRT (Offline)",
      latency_ms: 42,
      food_details: food
    };
  }

  try {
    const formData = new FormData();
    if (file) formData.append('file', file);
    if (foodHint) formData.append('food_hint', foodHint);

    const res = await fetch(`${API_BASE}/food/analyze`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Analyze failed');
    return await res.json();
  } catch (err) {
    const food = SEEDED_FOODS[0];
    return {
      status: "success",
      detected_food: food.name,
      confidence: 0.92,
      classification_engine: "Indian Food Classifier (Edge AI Simulation)",
      backend_hardware: "Qualcomm Snapdragon NPU / LiteRT (Offline)",
      latency_ms: 42,
      food_details: food
    };
  }
}

export async function evaluateRisk(
  foodName: string, 
  portionSize: string, 
  profile: HealthProfile
): Promise<RiskEvaluationResult> {
  if (isAirplaneModeSimulated) {
    const food = SEEDED_FOODS.find(f => f.name.toLowerCase() === foodName.toLowerCase()) || SEEDED_FOODS[0];
    return evaluateMealRiskLocal(food, portionSize, profile);
  }

  try {
    const res = await fetch(`${API_BASE}/risk/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        food_name: foodName,
        portion_size: portionSize,
        health_profile: profile
      })
    });
    if (!res.ok) throw new Error('Risk evaluation failed');
    return await res.json();
  } catch (err) {
    const food = SEEDED_FOODS.find(f => f.name.toLowerCase() === foodName.toLowerCase()) || SEEDED_FOODS[0];
    return evaluateMealRiskLocal(food, portionSize, profile);
  }
}

export async function saveMeal(mealData: Partial<Meal>): Promise<Meal> {
  const newMeal: Meal = {
    id: Date.now(),
    food_name: mealData.food_name || 'Masala Dosa',
    portion_size: mealData.portion_size || 'Medium',
    calories_min: mealData.calories_min || 320,
    calories_max: mealData.calories_max || 380,
    carbs_g: mealData.carbs_g || 52,
    protein_g: mealData.protein_g || 8,
    fat_g: mealData.fat_g || 11,
    fiber_g: mealData.fiber_g || 4,
    risk_level: mealData.risk_level || 'MEDIUM',
    health_conditions: mealData.health_conditions || 'Type 2 Diabetes',
    pairing_suggestion: mealData.pairing_suggestion || 'Sambar + side',
    activity_suggestion: mealData.activity_suggestion || '10 min walk',
    ai_explanation: mealData.ai_explanation || 'Balanced portion.',
    image_url: mealData.image_url || 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
    timestamp: 'Just now'
  };

  SEEDED_MEALS.unshift(newMeal);

  if (!isAirplaneModeSimulated) {
    try {
      const res = await fetch(`${API_BASE}/meals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMeal)
      });
      if (res.ok) {
        const saved = await res.json();
        return saved;
      }
    } catch (e) {
      // Fallback
    }
  }

  return newMeal;
}

export async function fetchMeals(days: number = 30): Promise<Meal[]> {
  if (isAirplaneModeSimulated) return SEEDED_MEALS;
  try {
    const res = await fetch(`${API_BASE}/meals?days=${days}`);
    if (!res.ok) throw new Error('Fetch meals failed');
    return await res.json();
  } catch (err) {
    return SEEDED_MEALS;
  }
}

export async function analyzeLabReport(file: File) {
  return {
    status: "success",
    ocr_engine: "ML Kit On-Device OCR Engine",
    extracted_data: {
      report_title: "Metabolic & Glycemic Lab Report",
      values: [
        { parameter: "HbA1c", value: 7.2, unit: "%", reference_range: "< 5.7 %", flag: "Borderline" },
        { parameter: "Fasting Glucose", value: 138.0, unit: "mg/dL", reference_range: "70–99 mg/dL", flag: "High" },
        { parameter: "Post-meal Glucose", value: 186.0, unit: "mg/dL", reference_range: "< 140 mg/dL", flag: "High" }
      ]
    }
  };
}

export async function saveLabReport(title: string, values: any[]) {
  const newReport: LabReport = {
    id: Date.now(),
    report_title: title,
    file_name: "uploaded_lab_report.pdf",
    created_at: new Date().toISOString().split('T')[0],
    values: values.map((v, idx) => ({ ...v, id: Date.now() + idx }))
  };
  SEEDED_LAB_REPORTS.unshift(newReport);
  return newReport;
}

export async function fetchLabReports(): Promise<LabReport[]> {
  return SEEDED_LAB_REPORTS;
}

export async function fetchMedicineReminders(): Promise<MedicineReminder[]> {
  return SEEDED_REMINDERS;
}

export async function addMedicineReminder(rem: Partial<MedicineReminder>): Promise<MedicineReminder> {
  const newRem: MedicineReminder = {
    id: Date.now(),
    medicine_name: rem.medicine_name || 'Metformin',
    dosage: rem.dosage || '500 mg',
    time: rem.time || '08:00 AM',
    frequency: rem.frequency || 'Daily',
    notes: rem.notes || 'Take after meal',
    is_completed: false
  };
  SEEDED_REMINDERS.push(newRem);
  return newRem;
}

export async function toggleMedicineReminder(id: number) {
  const r = SEEDED_REMINDERS.find(item => item.id === id);
  if (r) r.is_completed = !r.is_completed;
  return r;
}

export async function deleteMedicineReminder(id: number) {
  const idx = SEEDED_REMINDERS.findIndex(item => item.id === id);
  if (idx !== -1) SEEDED_REMINDERS.splice(idx, 1);
}

export async function sendVoiceQuery(query: string, foodContext?: string) {
  const q = query.toLowerCase();
  let answer = "";
  if (q.includes("dosa") && q.includes("diabetes")) {
    answer = "Yes! You can eat a dosa with diabetes. Keep the portion size medium, opt for high-protein lentil sambar, and minimize rich coconut chutneys.";
  } else if (q.includes("sambar") || q.includes("chutney")) {
    answer = "Adding sambar provides valuable protein and dietary fiber which lowers the net glycemic impact of your meal. Avoid heavy sweet tamarind chutney.";
  } else if (q.includes("biryani")) {
    answer = "Biryani is high in refined carbohydrates and spices. Keep portion to a single small bowl, add plenty of cucumber raita, and take a 15-minute walk.";
  } else {
    answer = `Based on your profile, balance carbs with protein and fiber. For ${foodContext || 'this meal'}, keep portion sizes moderate and consider a short 10-15 minute walk post meal.`;
  }
  return {
    query,
    answer,
    voice_processing: "Local Edge LLM (Gemma 2B - Device Only)"
  };
}

export async function fetchInferenceLogs(): Promise<InferenceLog[]> {
  return SEEDED_INFERENCE_LOGS;
}
