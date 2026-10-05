from typing import Dict, Any, List, Tuple
from .schemas import HealthProfileSchema

PORTION_MULTIPLIERS = {
    "Small": 0.7,
    "Medium": 1.0,
    "Large": 1.45
}

FOOD_PAIRINGS = {
    "Masala Dosa": "Sambar + vegetable side (avial or thuvaiyal)",
    "Dosa": "High-protein Sambar + coconut-chutney in moderation",
    "Idli": "Lentil Sambar + flaxseed chutney",
    "Sambar": "Steamed brown rice or millets + cucumber raita",
    "Poha": "Sprouted moong beans + lemon juice + boiled egg / paneer",
    "Upma": "Sautéed vegetables + roasted peanuts",
    "Paratha": "Plain curd / hung curd + mint chutney",
    "Roti": "Dal tadka + spinach sabzi + salad",
    "Naan": "Grilled paneer / chicken + vinegar onion salad",
    "Rice": "Dal / Rajma + fiber salad",
    "Rajma Rice": "Cucumber tomato raita + roasted papad (low sodium)",
    "Dal Rice": "Sautéed bhindi / beans + lemon wedge",
    "Biryani": "Cucumber raita + onion salad",
    "Chole Bhature": "Spiced buttermilk + raw salad (consume half bhatura)",
    "Chole": "Whole wheat kulcha or bajra roti + onion salad",
    "Paneer Tikka": "Mint chutney + green salad",
    "Aloo Sabzi": "Multi-grain roti + curd",
    "Mixed Vegetable": "Roti / Millets + dal",
    "Pav Bhaji": "Salad (cucumber/onion) + extra raw butter-free pav",
    "Samosa": "Green mint-coriander chutney (avoid sweet tamarind sauce)",
    "Dhokla": "Mint chutney + coconut water",
    "Vada Pav": "Buttermilk (chass) + cucumber slices",
    "Fruit Bowl": "Handful of soaked almonds / walnuts",
    "Salad": "Grilled paneer / tofu topping"
}

POST_MEAL_ACTIVITIES = {
    "HIGH": "15–20 minute moderate post-meal walk within 30 minutes",
    "MEDIUM": "10–15 minute brisk walk or light stretching",
    "LOW": "10 minute post-meal light walk or leisurely stroll"
}

def evaluate_meal_risk(
    food: Dict[str, Any],
    portion_size: str,
    profile: HealthProfileSchema
) -> Dict[str, Any]:
    mult = PORTION_MULTIPLIERS.get(portion_size, 1.0)

    # Deterministic macro calculation
    cal_base = food["calories_per_100g"] * mult * 2.2 # avg portion ~220g for medium
    carbs = round(food["carbs_per_100g"] * mult * 2.2, 1)
    protein = round(food["protein_per_100g"] * mult * 2.2, 1)
    fat = round(food["fat_per_100g"] * mult * 2.2, 1)
    fiber = round(food["fiber_per_100g"] * mult * 2.2, 1)

    cal_min = int(cal_base * 0.9)
    cal_max = int(cal_base * 1.1)

    risk_score = 20 # Base low risk
    reason_codes = []
    structured_facts = []

    # 1. Diabetes Logic
    if profile.has_diabetes:
        structured_facts.append("Evaluated against Type 2 Diabetes Glycemic rules.")
        if food["glycemic_load_tag"] == "High":
            risk_score += 35
            reason_codes.append("HIGH_GLYCEMIC_LOAD")
        elif food["glycemic_load_tag"] == "Medium":
            risk_score += 20
            reason_codes.append("MODERATE_GLYCEMIC_LOAD")

        if carbs > 45:
            risk_score += 25
            reason_codes.append("HIGH_CARB_LOAD")
        elif carbs > 30:
            risk_score += 15
            reason_codes.append("MODERATE_CARB_LOAD")

        if portion_size == "Large":
            risk_score += 15
            reason_codes.append("LARGE_PORTION_SPIKE_RISK")

    # 2. Hypertension Logic
    if profile.has_hypertension:
        structured_facts.append("Evaluated against Hypertension Sodium rules.")
        if food["sodium_level"] == "High":
            risk_score += 30
            reason_codes.append("HIGH_SODIUM_CONTENT")
        elif food["sodium_level"] == "Medium":
            risk_score += 10

    # 3. PCOS Logic
    if profile.has_pcos:
        structured_facts.append("Evaluated against PCOS Insulin Sensitivity rules.")
        if food["glycemic_load_tag"] in ["High", "Medium"] and carbs > 35:
            risk_score += 20
            reason_codes.append("REFINED_CARB_INSULIN_SPIKE")

    # 4. Thyroid Logic
    if profile.has_thyroid:
        structured_facts.append("Evaluated against Thyroid Dietary guidelines.")
        # General guidelines, low impact on acute spike risk unless goitrogenic raw
        if "cabbage" in food["name"].lower() or "cauliflower" in food["name"].lower():
            risk_score += 10
            reason_codes.append("RAW_GOITROGEN_CAUTION")

    # Final Risk Tag
    if risk_score >= 60:
        risk_level = "HIGH"
    elif risk_score >= 40:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    # Portion Recommendation
    if portion_size == "Large" or risk_level == "HIGH":
        recommended_portion = f"½–1 small portion (or 1/2 of current {portion_size.lower()} portion)"
    elif risk_level == "MEDIUM":
        recommended_portion = f"1 medium portion with added protein/fiber side"
    else:
        recommended_portion = f"1 {portion_size.lower()} portion (Balanced)"

    pairing = FOOD_PAIRINGS.get(food["name"], "Add a fresh green salad or plain curd")
    activity = POST_MEAL_ACTIVITIES.get(risk_level, "10-15 minute walk")

    # Synthetic rule-based natural language explanation template (fallback / deterministic generator)
    explanation_parts = []
    if risk_level == "HIGH":
        explanation_parts.append(
            f"Your selected {portion_size.lower()} portion of {food['name']} contains a high carbohydrate/glycemic load (~{carbs}g carbs). "
            f"For managing your profile ({get_conditions_summary(profile)}), this meal poses a high risk of post-prandial glucose spike."
        )
    elif risk_level == "MEDIUM":
        explanation_parts.append(
            f"Your {portion_size.lower()} portion of {food['name']} contains ~{carbs}g of carbohydrates and ~{cal_min}–{cal_max} kcal. "
            f"With your profile ({get_conditions_summary(profile)}), a moderate portion with protein or fiber pairing will help stabilize your glucose and blood pressure."
        )
    else:
        explanation_parts.append(
            f"This {portion_size.lower()} portion of {food['name']} is well-balanced for your profile ({get_conditions_summary(profile)}). "
            f"It provides ~{protein}g protein and ~{fiber}g fiber with manageable carbs (~{carbs}g)."
        )

    explanation_parts.append(f"Recommended pairing: {pairing}. Post-meal action: {activity}.")
    ai_explanation = " ".join(explanation_parts)

    return {
        "food_name": food["name"],
        "portion_size": portion_size,
        "calories_range": f"{cal_min}–{cal_max} kcal",
        "calories_min": cal_min,
        "calories_max": cal_max,
        "carbs_g": carbs,
        "protein_g": protein,
        "fat_g": fat,
        "fiber_g": fiber,
        "risk_level": risk_level,
        "risk_score": min(risk_score, 99),
        "reason_codes": reason_codes,
        "structured_facts": structured_facts,
        "recommended_portion": recommended_portion,
        "pairing": pairing,
        "activity": activity,
        "ai_explanation": ai_explanation
    }

def get_conditions_summary(profile: HealthProfileSchema) -> str:
    conds = []
    if profile.has_diabetes:
        conds.append("Type 2 Diabetes")
    if profile.has_hypertension:
        conds.append("Hypertension")
    if profile.has_pcos:
        conds.append("PCOS")
    if profile.has_thyroid:
        conds.append("Thyroid")
    if not conds:
        return "General Health"
    return ", ".join(conds)
