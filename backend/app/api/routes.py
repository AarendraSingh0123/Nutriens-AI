from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import random

from ..database import get_db
from ..models import HealthProfile, Food, Meal, LabReport, LabValue, MedicineReminder, InferenceLog
from ..schemas import (
    HealthProfileSchema, FoodSchema, RiskEvaluationRequest, RiskEvaluationResponse,
    MealCreateSchema, MealResponseSchema, LabReportCreateSchema, MedicineReminderSchema,
    VoiceQueryRequest, VoiceQueryResponse, InferenceLogSchema
)
from ..rules import evaluate_meal_risk
from ..services import voice_query_answer

router = APIRouter()

# 1. Health Profile Endpoints
@router.get("/profile", response_model=HealthProfileSchema)
def get_profile(db: Session = Depends(get_db)):
    profile = db.query(HealthProfile).first()
    if not profile:
        profile = HealthProfile()
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.post("/profile", response_model=HealthProfileSchema)
def update_profile(profile_data: HealthProfileSchema, db: Session = Depends(get_db)):
    profile = db.query(HealthProfile).first()
    if not profile:
        profile = HealthProfile()
        db.add(profile)
    
    profile.name = profile_data.name
    profile.age = profile_data.age
    profile.sex = profile_data.sex
    profile.height_cm = profile_data.height_cm
    profile.weight_kg = profile_data.weight_kg
    profile.has_diabetes = profile_data.has_diabetes
    profile.has_hypertension = profile_data.has_hypertension
    profile.has_thyroid = profile_data.has_thyroid
    profile.has_pcos = profile_data.has_pcos
    profile.weight_goal = profile_data.weight_goal
    profile.activity_level = profile_data.activity_level

    db.commit()
    db.refresh(profile)
    return profile

# 2. Food Database & Scanner Endpoints
@router.get("/foods", response_model=List[FoodSchema])
def list_foods(db: Session = Depends(get_db)):
    return db.query(Food).all()

@router.get("/foods/{food_id}", response_model=FoodSchema)
def get_food(food_id: int, db: Session = Depends(get_db)):
    food = db.query(Food).filter(Food.id == food_id).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food not found")
    return food

@router.post("/food/analyze")
async def analyze_food_image(
    file: Optional[UploadFile] = File(None),
    food_hint: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    # Simulated Edge AI NPU Inference
    latency = random.randint(38, 48) # e.g. 42ms
    confidence = round(random.uniform(0.89, 0.96), 2)

    # Match food based on filename / hint or default to Masala Dosa
    target_name = "Masala Dosa"
    if food_hint and food_hint.strip():
        matched = db.query(Food).filter(Food.name.ilike(f"%{food_hint.strip()}%")).first()
        if matched:
            target_name = matched.name
    elif file and file.filename:
        fn = file.filename.lower()
        foods = db.query(Food).all()
        for f in foods:
            if f.name.lower() in fn or f.name.lower().replace(" ", "") in fn:
                target_name = f.name
                break

    food = db.query(Food).filter(Food.name == target_name).first()
    if not food:
        food = db.query(Food).first()

    # Log Edge AI Inference
    new_log = InferenceLog(
        timestamp=datetime.utcnow(),
        model_name="EfficientNet-Lite0",
        runtime="LiteRT / TFLite",
        backend_device="Snapdragon NPU",
        latency_ms=latency,
        confidence=confidence,
        llm_status="Ready (Gemma 2B)",
        offline_mode=True,
        privacy_status="Device-Only",
        input_type=f"Image Scanner - {food.name}"
    )
    db.add(new_log)
    db.commit()

    return {
        "status": "success",
        "detected_food": food.name,
        "confidence": confidence,
        "classification_engine": "Indian Food Classifier (Edge AI)",
        "backend_hardware": "Qualcomm Snapdragon NPU / LiteRT",
        "latency_ms": latency,
        "food_details": {
            "id": food.id,
            "name": food.name,
            "category": food.category,
            "calories_per_100g": food.calories_per_100g,
            "carbs_per_100g": food.carbs_per_100g,
            "protein_per_100g": food.protein_per_100g,
            "fat_per_100g": food.fat_per_100g,
            "fiber_per_100g": food.fiber_per_100g,
            "sodium_level": food.sodium_level,
            "glycemic_load_tag": food.glycemic_load_tag,
            "default_portion": food.default_portion,
            "image_url": food.image_url
        }
    }

# 3. Deterministic Health Rule Evaluation Endpoint
@router.post("/risk/evaluate", response_model=RiskEvaluationResponse)
def evaluate_risk(req: RiskEvaluationRequest, db: Session = Depends(get_db)):
    food = db.query(Food).filter(Food.name.ilike(f"%{req.food_name}%")).first()
    if not food:
        food = db.query(Food).first()

    profile = req.health_profile
    if not profile:
        db_profile = db.query(HealthProfile).first()
        profile = HealthProfileSchema(
            has_diabetes=db_profile.has_diabetes if db_profile else True,
            has_hypertension=db_profile.has_hypertension if db_profile else False,
            has_thyroid=db_profile.has_thyroid if db_profile else False,
            has_pcos=db_profile.has_pcos if db_profile else False,
            name=db_profile.name if db_profile else "User"
        )

    food_dict = {
        "name": food.name,
        "calories_per_100g": food.calories_per_100g,
        "carbs_per_100g": food.carbs_per_100g,
        "protein_per_100g": food.protein_per_100g,
        "fat_per_100g": food.fat_per_100g,
        "fiber_per_100g": food.fiber_per_100g,
        "sodium_level": food.sodium_level,
        "glycemic_load_tag": food.glycemic_load_tag
    }

    result = evaluate_meal_risk(food_dict, req.portion_size, profile)
    return result

# 4. Meals & History Endpoints
@router.post("/meals", response_model=MealResponseSchema)
def create_meal(meal_data: MealCreateSchema, db: Session = Depends(get_db)):
    new_meal = Meal(
        food_name=meal_data.food_name,
        portion_size=meal_data.portion_size,
        calories_min=meal_data.calories_min,
        calories_max=meal_data.calories_max,
        carbs_g=meal_data.carbs_g,
        protein_g=meal_data.protein_g,
        fat_g=meal_data.fat_g,
        fiber_g=meal_data.fiber_g,
        risk_level=meal_data.risk_level,
        health_conditions=meal_data.health_conditions,
        pairing_suggestion=meal_data.pairing_suggestion,
        activity_suggestion=meal_data.activity_suggestion,
        ai_explanation=meal_data.ai_explanation,
        image_url=meal_data.image_url,
        timestamp=datetime.utcnow()
    )
    db.add(new_meal)
    db.commit()
    db.refresh(new_meal)
    return new_meal

@router.get("/meals", response_model=List[MealResponseSchema])
def get_meals(days: int = 30, db: Session = Depends(get_db)):
    cutoff = datetime.utcnow() - timedelta(days=days)
    meals = db.query(Meal).filter(Meal.timestamp >= cutoff).order_by(Meal.timestamp.desc()).all()
    return meals

# 5. Lab Reports Endpoints (OCR extraction & history)
@router.post("/reports/analyze")
async def analyze_lab_report(file: UploadFile = File(...)):
    # Simulated ML Kit OCR processing
    return {
        "status": "success",
        "ocr_engine": "ML Kit On-Device OCR",
        "extracted_data": {
            "report_title": "Metabolic Panel Report",
            "values": [
                {
                    "parameter": "HbA1c",
                    "value": 7.2,
                    "unit": "%",
                    "reference_range": "< 5.7 %",
                    "flag": "Borderline"
                },
                {
                    "parameter": "Fasting Glucose",
                    "value": 138.0,
                    "unit": "mg/dL",
                    "reference_range": "70–99 mg/dL",
                    "flag": "High"
                },
                {
                    "parameter": "Post-meal Glucose",
                    "value": 186.0,
                    "unit": "mg/dL",
                    "reference_range": "< 140 mg/dL",
                    "flag": "High"
                }
            ]
        }
    }

@router.post("/reports")
def save_lab_report(report_data: LabReportCreateSchema, db: Session = Depends(get_db)):
    report = LabReport(
        report_title=report_data.report_title,
        file_name=report_data.file_name,
        created_at=datetime.utcnow()
    )
    db.add(report)
    db.flush()

    for val in report_data.values:
        lv = LabValue(
            report_id=report.id,
            parameter=val.parameter,
            value=val.value,
            unit=val.unit,
            reference_range=val.reference_range,
            flag=val.flag,
            recorded_date=datetime.utcnow()
        )
        db.add(lv)

    db.commit()
    return {"status": "success", "report_id": report.id}

@router.get("/reports")
def get_lab_reports(db: Session = Depends(get_db)):
    reports = db.query(LabReport).order_by(LabReport.created_at.desc()).all()
    result = []
    for r in reports:
        result.append({
            "id": r.id,
            "report_title": r.report_title,
            "file_name": r.file_name,
            "created_at": r.created_at,
            "values": [
                {
                    "id": v.id,
                    "parameter": v.parameter,
                    "value": v.value,
                    "unit": v.unit,
                    "reference_range": v.reference_range,
                    "flag": v.flag,
                    "recorded_date": v.recorded_date
                } for v in r.values
            ]
        })
    return result

# 6. Medicine Reminders Endpoints
@router.get("/reminders", response_model=List[MedicineReminderSchema])
def get_reminders(db: Session = Depends(get_db)):
    return db.query(MedicineReminder).order_by(MedicineReminder.time.asc()).all()

@router.post("/reminders", response_model=MedicineReminderSchema)
def create_reminder(reminder: MedicineReminderSchema, db: Session = Depends(get_db)):
    new_rem = MedicineReminder(
        medicine_name=reminder.medicine_name,
        dosage=reminder.dosage,
        time=reminder.time,
        frequency=reminder.frequency,
        notes=reminder.notes,
        is_completed=reminder.is_completed
    )
    db.add(new_rem)
    db.commit()
    db.refresh(new_rem)
    return new_rem

@router.put("/reminders/{reminder_id}/toggle")
def toggle_reminder(reminder_id: int, db: Session = Depends(get_db)):
    rem = db.query(MedicineReminder).filter(MedicineReminder.id == reminder_id).first()
    if not rem:
        raise HTTPException(status_code=404, detail="Reminder not found")
    rem.is_completed = not rem.is_completed
    db.commit()
    return {"status": "success", "is_completed": rem.is_completed}

@router.delete("/reminders/{reminder_id}")
def delete_reminder(reminder_id: int, db: Session = Depends(get_db)):
    rem = db.query(MedicineReminder).filter(MedicineReminder.id == reminder_id).first()
    if not rem:
        raise HTTPException(status_code=404, detail="Reminder not found")
    db.delete(rem)
    db.commit()
    return {"status": "deleted"}

# 7. Voice Assistant Endpoint
@router.post("/voice/query", response_model=VoiceQueryResponse)
def handle_voice_query(req: VoiceQueryRequest):
    ans = voice_query_answer(req.query, req.food_context)
    return VoiceQueryResponse(
        query=req.query,
        answer=ans,
        voice_processing="Local/Edge LLM (Gemma 2B)"
    )

# 8. Dashboard Endpoint
@router.get("/dashboard")
def get_dashboard_summary(db: Session = Depends(get_db)):
    profile = db.query(HealthProfile).first()
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    today_meals = db.query(Meal).filter(Meal.timestamp >= today_start).order_by(Meal.timestamp.desc()).all()

    total_calories = sum((m.calories_min + m.calories_max) // 2 for m in today_meals)
    meal_count = len(today_meals)

    # Health status calculation
    high_risks = [m for m in today_meals if m.risk_level == "HIGH"]
    if high_risks:
        health_status = "Needs Attention"
    elif meal_count > 0:
        health_status = "Mostly Balanced"
    else:
        health_status = "Optimal"

    return {
        "greeting": "Good morning 👋",
        "subtitle": "Let's make your next meal a healthier one.",
        "summary": {
            "meals_today_count": meal_count,
            "total_calories": total_calories,
            "health_status": health_status,
            "offline_status": "Device AI Active"
        },
        "today_meals": [
            {
                "id": m.id,
                "food_name": m.food_name,
                "portion_size": m.portion_size,
                "calories_range": f"{m.calories_min}–{m.calories_max} kcal",
                "carbs_g": m.carbs_g,
                "protein_g": m.protein_g,
                "fat_g": m.fat_g,
                "risk_level": m.risk_level,
                "image_url": m.image_url,
                "timestamp": m.timestamp.strftime("%I:%M %p")
            } for m in today_meals
        ],
        "profile": {
            "name": profile.name if profile else "User",
            "has_diabetes": profile.has_diabetes if profile else True,
            "has_hypertension": profile.has_hypertension if profile else False
        }
    }

# 9. Inference Log (Laptop / Office Kit Dashboard) Endpoint
@router.get("/inference-log", response_model=List[InferenceLogSchema])
def get_inference_logs(db: Session = Depends(get_db)):
    logs = db.query(InferenceLog).order_by(InferenceLog.timestamp.desc()).limit(20).all()
    return logs
