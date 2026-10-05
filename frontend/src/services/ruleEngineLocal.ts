import { FoodItem, HealthProfile, RiskEvaluationResult } from '../types';

const PORTION_MULTIPLIERS: Record<string, number> = {
  Small: 0.7,
  Medium: 1.0,
  Large: 1.45
};

const PAIRINGS: Record<string, string> = {
  "Masala Dosa": "Sambar + vegetable side (avial or thuvaiyal)",
  "Dosa": "High-protein Sambar + coconut chutney in moderation",
  "Idli": "Lentil Sambar + flaxseed chutney",
  "Sambar": "Steamed brown rice or millets + cucumber raita",
  "Poha": "Sprouted moong beans + lemon juice",
  "Upma": "Sautéed vegetables + roasted peanuts",
  "Paratha": "Plain curd + mint chutney",
  "Roti": "Dal tadka + spinach sabzi + salad",
  "Naan": "Grilled paneer / chicken + onion salad",
  "Rice": "Dal / Rajma + fiber salad",
  "Rajma Rice": "Cucumber tomato raita + roasted papad",
  "Dal Rice": "Sautéed bhindi / beans + lemon wedge",
  "Biryani": "Cucumber raita + onion salad",
  "Chole Bhature": "Spiced buttermilk + raw salad",
  "Paneer Tikka": "Mint chutney + green salad",
  "Fruit Bowl": "Handful of soaked almonds / walnuts",
  "Multigrain Biscuits": "Green tea or herbal tea without sugar"
};

export function evaluateMealRiskLocal(
  food: FoodItem,
  portionSize: string,
  profile: HealthProfile
): RiskEvaluationResult {
  const mult = PORTION_MULTIPLIERS[portionSize] || 1.0;

  const calBase = food.calories_per_100g * mult * 2.2;
  const carbs = Math.round(food.carbs_per_100g * mult * 2.2 * 10) / 10;
  const protein = Math.round(food.protein_per_100g * mult * 2.2 * 10) / 10;
  const fat = Math.round(food.fat_per_100g * mult * 2.2 * 10) / 10;
  const fiber = Math.round(food.fiber_per_100g * mult * 2.2 * 10) / 10;

  const calMin = Math.round(calBase * 0.9);
  const calMax = Math.round(calBase * 1.1);

  let riskScore = 20;
  const reasonCodes: string[] = [];
  const structuredFacts: string[] = [];

  if (profile.has_diabetes) {
    structuredFacts.push("Evaluated against Type 2 Diabetes Glycemic rules.");
    if (food.glycemic_load_tag === 'High') {
      riskScore += 35;
      reasonCodes.push('HIGH_GLYCEMIC_LOAD');
    } else if (food.glycemic_load_tag === 'Medium') {
      riskScore += 20;
      reasonCodes.push('MODERATE_GLYCEMIC_LOAD');
    }

    if (carbs > 45) {
      riskScore += 25;
      reasonCodes.push('HIGH_CARB_LOAD');
    } else if (carbs > 30) {
      riskScore += 15;
    }

    if (portionSize === 'Large') {
      riskScore += 15;
      reasonCodes.push('LARGE_PORTION_SPIKE_RISK');
    }
  }

  if (profile.has_hypertension) {
    structuredFacts.push("Evaluated against Hypertension Sodium rules.");
    if (food.sodium_level === 'High') {
      riskScore += 30;
      reasonCodes.push('HIGH_SODIUM_CONTENT');
    }
  }

  if (profile.has_pcos) {
    structuredFacts.push("Evaluated against PCOS Insulin Sensitivity rules.");
    if (food.glycemic_load_tag !== 'Low' && carbs > 35) {
      riskScore += 20;
      reasonCodes.push('REFINED_CARB_INSULIN_SPIKE');
    }
  }

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (riskScore >= 60) riskLevel = 'HIGH';
  else if (riskScore >= 40) riskLevel = 'MEDIUM';

  let recommendedPortion = `1 ${portionSize.toLowerCase()} portion (Balanced)`;
  if (portionSize === 'Large' || riskLevel === 'HIGH') {
    recommendedPortion = `½–1 medium portion`;
  } else if (riskLevel === 'MEDIUM') {
    recommendedPortion = `1 medium portion with protein side`;
  }

  const pairing = PAIRINGS[food.name] || "Fresh cucumber salad or plain curd";
  const activity = riskLevel === 'HIGH' ? "15–20 minute post-meal walk" : "10–15 minute walk";

  const condSummary = [
    profile.has_diabetes && "Type 2 Diabetes",
    profile.has_hypertension && "Hypertension",
    profile.has_pcos && "PCOS",
    profile.has_thyroid && "Thyroid"
  ].filter(Boolean).join(", ") || "General Health";

  const aiExplanation = riskLevel === 'HIGH'
    ? `Your selected ${portionSize.toLowerCase()} portion of ${food.name} contains a high carbohydrate load (~${carbs}g). For your profile (${condSummary}), this meal poses a high risk of post-meal blood sugar spike.`
    : riskLevel === 'MEDIUM'
    ? `Your ${portionSize.toLowerCase()} portion of ${food.name} contains ~${carbs}g of carbohydrates (~${calMin}–${calMax} kcal). A moderate portion paired with fiber will keep your glucose response stable.`
    : `This ${portionSize.toLowerCase()} portion of ${food.name} is well-balanced for your profile (${condSummary}). It provides ~${protein}g protein and ~${fiber}g fiber with manageable carbs (~${carbs}g).`;

  return {
    food_name: food.name,
    portion_size: portionSize,
    calories_range: `${calMin}–${calMax} kcal`,
    calories_min: calMin,
    calories_max: calMax,
    carbs_g: carbs,
    protein_g: protein,
    fat_g: fat,
    fiber_g: fiber,
    risk_level: riskLevel,
    risk_score: Math.min(riskScore, 99),
    reason_codes: reasonCodes,
    structured_facts: structuredFacts,
    recommended_portion: recommendedPortion,
    pairing: pairing,
    activity: activity,
    ai_explanation: aiExplanation
  };
}
