import random
import time
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from .models import Food, HealthProfile, Meal, LabReport, LabValue, MedicineReminder, InferenceLog

INDIAN_FOODS_DATA = [
    {
        "name": "Masala Dosa",
        "category": "South Indian",
        "calories_per_100g": 165,
        "carbs_per_100g": 26.0,
        "protein_per_100g": 4.2,
        "fat_per_100g": 5.5,
        "fiber_per_100g": 2.1,
        "sodium_level": "Medium",
        "glycemic_load_tag": "High",
        "default_portion": "Medium",
        "image_url": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Dosa",
        "category": "South Indian",
        "calories_per_100g": 150,
        "carbs_per_100g": 25.0,
        "protein_per_100g": 3.8,
        "fat_per_100g": 4.0,
        "fiber_per_100g": 1.8,
        "sodium_level": "Medium",
        "glycemic_load_tag": "High",
        "default_portion": "Medium",
        "image_url": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Idli",
        "category": "South Indian",
        "calories_per_100g": 130,
        "carbs_per_100g": 26.0,
        "protein_per_100g": 4.5,
        "fat_per_100g": 0.8,
        "fiber_per_100g": 2.0,
        "sodium_level": "Low",
        "glycemic_load_tag": "Medium",
        "default_portion": "Medium",
        "image_url": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Sambar",
        "category": "South Indian",
        "calories_per_100g": 65,
        "carbs_per_100g": 9.0,
        "protein_per_100g": 3.5,
        "fat_per_100g": 1.8,
        "fiber_per_100g": 2.5,
        "sodium_level": "Medium",
        "glycemic_load_tag": "Low",
        "default_portion": "Medium",
        "image_url": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Vada",
        "category": "South Indian",
        "calories_per_100g": 270,
        "carbs_per_100g": 30.0,
        "protein_per_100g": 6.5,
        "fat_per_100g": 14.0,
        "fiber_per_100g": 3.0,
        "sodium_level": "Medium",
        "glycemic_load_tag": "High",
        "default_portion": "Small",
        "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Poha",
        "category": "Breakfast",
        "calories_per_100g": 180,
        "carbs_per_100g": 32.0,
        "protein_per_100g": 3.2,
        "fat_per_100g": 4.5,
        "fiber_per_100g": 1.8,
        "sodium_level": "Medium",
        "glycemic_load_tag": "Medium",
        "default_portion": "Medium",
        "image_url": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Upma",
        "category": "Breakfast",
        "calories_per_100g": 160,
        "carbs_per_100g": 28.0,
        "protein_per_100g": 3.8,
        "fat_per_100g": 4.0,
        "fiber_per_100g": 2.2,
        "sodium_level": "Medium",
        "glycemic_load_tag": "Medium",
        "default_portion": "Medium",
        "image_url": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Paratha",
        "category": "North Indian",
        "calories_per_100g": 260,
        "carbs_per_100g": 38.0,
        "protein_per_100g": 5.5,
        "fat_per_100g": 10.0,
        "fiber_per_100g": 3.5,
        "sodium_level": "Medium",
        "glycemic_load_tag": "High",
        "default_portion": "Medium",
        "image_url": "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Roti",
        "category": "Bread",
        "calories_per_100g": 240,
        "carbs_per_100g": 48.0,
        "protein_per_100g": 8.0,
        "fat_per_100g": 2.5,
        "fiber_per_100g": 6.5,
        "sodium_level": "Low",
        "glycemic_load_tag": "Medium",
        "default_portion": "Medium",
        "image_url": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Naan",
        "category": "Bread",
        "calories_per_100g": 290,
        "carbs_per_100g": 52.0,
        "protein_per_100g": 8.5,
        "fat_per_100g": 6.0,
        "fiber_per_100g": 2.2,
        "sodium_level": "Medium",
        "glycemic_load_tag": "High",
        "default_portion": "Medium",
        "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Rice",
        "category": "Grain",
        "calories_per_100g": 130,
        "carbs_per_100g": 28.0,
        "protein_per_100g": 2.7,
        "fat_per_100g": 0.3,
        "fiber_per_100g": 0.4,
        "sodium_level": "Low",
        "glycemic_load_tag": "High",
        "default_portion": "Medium",
        "image_url": "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Rajma Rice",
        "category": "Main Course",
        "calories_per_100g": 145,
        "carbs_per_100g": 24.0,
        "protein_per_100g": 5.8,
        "fat_per_100g": 3.0,
        "fiber_per_100g": 4.2,
        "sodium_level": "Medium",
        "glycemic_load_tag": "Medium",
        "default_portion": "Medium",
        "image_url": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Dal Rice",
        "category": "Main Course",
        "calories_per_100g": 135,
        "carbs_per_100g": 23.0,
        "protein_per_100g": 4.8,
        "fat_per_100g": 2.5,
        "fiber_per_100g": 3.0,
        "sodium_level": "Medium",
        "glycemic_load_tag": "Medium",
        "default_portion": "Medium",
        "image_url": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Biryani",
        "category": "Main Course",
        "calories_per_100g": 200,
        "carbs_per_100g": 26.0,
        "protein_per_100g": 8.0,
        "fat_per_100g": 7.5,
        "fiber_per_100g": 1.5,
        "sodium_level": "High",
        "glycemic_load_tag": "High",
        "default_portion": "Medium",
        "image_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Chole",
        "category": "Main Course",
        "calories_per_100g": 160,
        "carbs_per_100g": 20.0,
        "protein_per_100g": 7.5,
        "fat_per_100g": 5.5,
        "fiber_per_100g": 5.0,
        "sodium_level": "High",
        "glycemic_load_tag": "Medium",
        "default_portion": "Medium",
        "image_url": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Chole Bhature",
        "category": "North Indian",
        "calories_per_100g": 280,
        "carbs_per_100g": 36.0,
        "protein_per_100g": 7.0,
        "fat_per_100g": 12.0,
        "fiber_per_100g": 3.8,
        "sodium_level": "High",
        "glycemic_load_tag": "High",
        "default_portion": "Medium",
        "image_url": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Paneer",
        "category": "Dairy",
        "calories_per_100g": 265,
        "carbs_per_100g": 3.5,
        "protein_per_100g": 18.0,
        "fat_per_100g": 20.0,
        "fiber_per_100g": 0.0,
        "sodium_level": "Low",
        "glycemic_load_tag": "Low",
        "default_portion": "Medium",
        "image_url": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Paneer Tikka",
        "category": "Appetizer",
        "calories_per_100g": 220,
        "carbs_per_100g": 6.0,
        "protein_per_100g": 16.0,
        "fat_per_100g": 14.0,
        "fiber_per_100g": 1.2,
        "sodium_level": "Medium",
        "glycemic_load_tag": "Low",
        "default_portion": "Medium",
        "image_url": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Aloo Sabzi",
        "category": "Main Course",
        "calories_per_100g": 140,
        "carbs_per_100g": 22.0,
        "protein_per_100g": 2.5,
        "fat_per_100g": 5.0,
        "fiber_per_100g": 2.8,
        "sodium_level": "Medium",
        "glycemic_load_tag": "High",
        "default_portion": "Medium",
        "image_url": "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Mixed Vegetable",
        "category": "Main Course",
        "calories_per_100g": 90,
        "carbs_per_100g": 12.0,
        "protein_per_100g": 3.0,
        "fat_per_100g": 3.5,
        "fiber_per_100g": 4.0,
        "sodium_level": "Low",
        "glycemic_load_tag": "Low",
        "default_portion": "Medium",
        "image_url": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Pav Bhaji",
        "category": "Street Food",
        "calories_per_100g": 175,
        "carbs_per_100g": 24.0,
        "protein_per_100g": 4.5,
        "fat_per_100g": 7.0,
        "fiber_per_100g": 3.2,
        "sodium_level": "High",
        "glycemic_load_tag": "High",
        "default_portion": "Medium",
        "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Samosa",
        "category": "Snack",
        "calories_per_100g": 260,
        "carbs_per_100g": 32.0,
        "protein_per_100g": 4.0,
        "fat_per_100g": 13.0,
        "fiber_per_100g": 2.0,
        "sodium_level": "High",
        "glycemic_load_tag": "High",
        "default_portion": "Small",
        "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Dhokla",
        "category": "Snack",
        "calories_per_100g": 160,
        "carbs_per_100g": 26.0,
        "protein_per_100g": 6.8,
        "fat_per_100g": 3.2,
        "fiber_per_100g": 2.5,
        "sodium_level": "Medium",
        "glycemic_load_tag": "Medium",
        "default_portion": "Medium",
        "image_url": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Kachori",
        "category": "Snack",
        "calories_per_100g": 310,
        "carbs_per_100g": 38.0,
        "protein_per_100g": 5.5,
        "fat_per_100g": 16.0,
        "fiber_per_100g": 2.8,
        "sodium_level": "High",
        "glycemic_load_tag": "High",
        "default_portion": "Small",
        "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Pani Puri",
        "category": "Street Food",
        "calories_per_100g": 220,
        "carbs_per_100g": 34.0,
        "protein_per_100g": 4.0,
        "fat_per_100g": 8.0,
        "fiber_per_100g": 2.1,
        "sodium_level": "High",
        "glycemic_load_tag": "High",
        "default_portion": "Medium",
        "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Vada Pav",
        "category": "Street Food",
        "calories_per_100g": 250,
        "carbs_per_100g": 36.0,
        "protein_per_100g": 5.0,
        "fat_per_100g": 10.0,
        "fiber_per_100g": 2.5,
        "sodium_level": "High",
        "glycemic_load_tag": "High",
        "default_portion": "Small",
        "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Lassi",
        "category": "Beverage",
        "calories_per_100g": 95,
        "carbs_per_100g": 14.0,
        "protein_per_100g": 3.2,
        "fat_per_100g": 3.0,
        "fiber_per_100g": 0.0,
        "sodium_level": "Low",
        "glycemic_load_tag": "Medium",
        "default_portion": "Medium",
        "image_url": "https://images.unsplash.com/photo-1571006682885-b91c13d395a1?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Curd",
        "category": "Dairy",
        "calories_per_100g": 60,
        "carbs_per_100g": 4.5,
        "protein_per_100g": 3.5,
        "fat_per_100g": 3.2,
        "fiber_per_100g": 0.0,
        "sodium_level": "Low",
        "glycemic_load_tag": "Low",
        "default_portion": "Medium",
        "image_url": "https://images.unsplash.com/photo-1571006682885-b91c13d395a1?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Raita",
        "category": "Side Dish",
        "calories_per_100g": 50,
        "carbs_per_100g": 4.0,
        "protein_per_100g": 3.0,
        "fat_per_100g": 2.2,
        "fiber_per_100g": 0.8,
        "sodium_level": "Low",
        "glycemic_load_tag": "Low",
        "default_portion": "Medium",
        "image_url": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Fruit Bowl",
        "category": "Snack",
        "calories_per_100g": 55,
        "carbs_per_100g": 13.0,
        "protein_per_100g": 0.8,
        "fat_per_100g": 0.2,
        "fiber_per_100g": 2.4,
        "sodium_level": "Low",
        "glycemic_load_tag": "Low",
        "default_portion": "Small",
        "image_url": "https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Salad",
        "category": "Salad",
        "calories_per_100g": 25,
        "carbs_per_100g": 4.5,
        "protein_per_100g": 1.2,
        "fat_per_100g": 0.2,
        "fiber_per_100g": 2.1,
        "sodium_level": "Low",
        "glycemic_load_tag": "Low",
        "default_portion": "Medium",
        "image_url": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Multigrain Biscuits",
        "category": "Packaged Food",
        "calories_per_100g": 440,
        "carbs_per_100g": 64.0,
        "protein_per_100g": 8.0,
        "fat_per_100g": 16.0,
        "fiber_per_100g": 6.0,
        "sodium_level": "Medium",
        "glycemic_load_tag": "Medium",
        "default_portion": "Small",
        "barcode": "8901234567890",
        "image_url": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80"
    }
]

def seed_db(db: Session):
    # Seed Foods
    if db.query(Food).count() == 0:
        for f in INDIAN_FOODS_DATA:
            db_food = Food(**f)
            db.add(db_food)
        db.commit()

    # Seed Default Health Profile
    if db.query(HealthProfile).count() == 0:
        profile = HealthProfile(
            name="Anil Kumar",
            age=42,
            sex="Male",
            height_cm=172.0,
            weight_kg=76.0,
            has_diabetes=True,
            has_hypertension=False,
            has_thyroid=False,
            has_pcos=False,
            weight_goal="Lose",
            activity_level="Moderate"
        )
        db.add(profile)
        db.commit()

    # Seed Sample Today Meals
    if db.query(Meal).count() == 0:
        today = datetime.now()
        m1 = Meal(
            food_name="Masala Dosa",
            portion_size="Medium",
            portion_multiplier=1.0,
            calories_min=320,
            calories_max=380,
            carbs_g=52.0,
            protein_g=8.4,
            fat_g=11.0,
            fiber_g=4.2,
            risk_level="MEDIUM",
            health_conditions="Type 2 Diabetes",
            pairing_suggestion="Sambar + vegetable side",
            activity_suggestion="10–15 minute walk",
            ai_explanation="Masala Dosa contains a moderate carbohydrate load. Pairing with protein-rich sambar helps manage glucose spike.",
            timestamp=today - timedelta(hours=3),
            image_url="https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80"
        )
        m2 = Meal(
            food_name="Rajma Rice",
            portion_size="Medium",
            portion_multiplier=1.0,
            calories_min=420,
            calories_max=480,
            carbs_g=58.0,
            protein_g=14.0,
            fat_g=6.5,
            fiber_g=9.0,
            risk_level="LOW",
            health_conditions="Type 2 Diabetes",
            pairing_suggestion="Cucumber raita",
            activity_suggestion="10 minute post-meal walk",
            ai_explanation="Rajma beans provide ample soluble fiber and protein, keeping glycemic response stable despite rice.",
            timestamp=today - timedelta(hours=1),
            image_url="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80"
        )
        m3 = Meal(
            food_name="Fruit Bowl",
            portion_size="Small",
            portion_multiplier=0.7,
            calories_min=110,
            calories_max=130,
            carbs_g=24.0,
            protein_g=1.5,
            fat_g=0.4,
            fiber_g=4.5,
            risk_level="LOW",
            health_conditions="Type 2 Diabetes",
            pairing_suggestion="Handful of soaked almonds",
            activity_suggestion="Light activity",
            ai_explanation="Natural fruit sugars balanced by high dietary fiber.",
            timestamp=today - timedelta(minutes=30),
            image_url="https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=600&q=80"
        )
        db.add_all([m1, m2, m3])
        db.commit()

    # Seed Lab Reports & Values
    if db.query(LabReport).count() == 0:
        report1 = LabReport(
            report_title="Quarterly HbA1c & Fasting Panel",
            file_name="lab_report_q3.pdf",
            created_at=datetime.now() - timedelta(days=60)
        )
        db.add(report1)
        db.flush()

        v1 = LabValue(report_id=report1.id, parameter="HbA1c", value=7.6, unit="%", reference_range="< 5.7 %", flag="High", recorded_date=datetime.now() - timedelta(days=60))
        v2 = LabValue(report_id=report1.id, parameter="Fasting Glucose", value=145.0, unit="mg/dL", reference_range="70–99 mg/dL", flag="High", recorded_date=datetime.now() - timedelta(days=60))
        v3 = LabValue(report_id=report1.id, parameter="Post-meal Glucose", value=198.0, unit="mg/dL", reference_range="< 140 mg/dL", flag="High", recorded_date=datetime.now() - timedelta(days=60))
        db.add_all([v1, v2, v3])

        report2 = LabReport(
            report_title="Recent Comprehensive Blood Test",
            file_name="lab_report_october.pdf",
            created_at=datetime.now() - timedelta(days=5)
        )
        db.add(report2)
        db.flush()

        v4 = LabValue(report_id=report2.id, parameter="HbA1c", value=7.2, unit="%", reference_range="< 5.7 %", flag="Borderline", recorded_date=datetime.now() - timedelta(days=5))
        v5 = LabValue(report_id=report2.id, parameter="Fasting Glucose", value=138.0, unit="mg/dL", reference_range="70–99 mg/dL", flag="High", recorded_date=datetime.now() - timedelta(days=5))
        v6 = LabValue(report_id=report2.id, parameter="Post-meal Glucose", value=186.0, unit="mg/dL", reference_range="< 140 mg/dL", flag="High", recorded_date=datetime.now() - timedelta(days=5))
        db.add_all([v4, v5, v6])

        db.commit()

    # Seed Medicine Reminders
    if db.query(MedicineReminder).count() == 0:
        rem1 = MedicineReminder(medicine_name="Metformin", dosage="500 mg", time="08:00 AM", frequency="Daily", notes="Take with breakfast", is_completed=True)
        rem2 = MedicineReminder(medicine_name="Teneligliptin", dosage="20 mg", time="01:30 PM", frequency="Daily", notes="Take before lunch", is_completed=False)
        rem3 = MedicineReminder(medicine_name="Metformin", dosage="500 mg", time="08:00 PM", frequency="Daily", notes="Take after dinner", is_completed=False)
        db.add_all([rem1, rem2, rem3])
        db.commit()

    # Seed Inference Logs
    if db.query(InferenceLog).count() == 0:
        log1 = InferenceLog(
            timestamp=datetime.now() - timedelta(minutes=45),
            model_name="EfficientNet-Lite0",
            runtime="LiteRT / TFLite",
            backend_device="Snapdragon NPU",
            latency_ms=42,
            confidence=0.94,
            llm_status="Ready (Gemma 2B)",
            offline_mode=True,
            privacy_status="Device-Only",
            input_type="Camera Feed - Masala Dosa"
        )
        log2 = InferenceLog(
            timestamp=datetime.now() - timedelta(minutes=10),
            model_name="MobileNetV3-Custom",
            runtime="LiteRT / TFLite",
            backend_device="Snapdragon NPU",
            latency_ms=38,
            confidence=0.91,
            llm_status="Ready (Gemma 2B)",
            offline_mode=True,
            privacy_status="Device-Only",
            input_type="Barcode Scan - Multigrain Biscuits"
        )
        db.add_all([log1, log2])
        db.commit()


def voice_query_answer(query: str, food_context: str = None) -> str:
    q = query.lower()
    if "dosa" in q and "diabetes" in q:
        return "Yes, you can eat a dosa with diabetes! To minimize blood sugar spikes, choose a medium portion, opt for high-protein sambar, and avoid sweet chutneys or large quantities of pure rice dosa."
    elif "sambar" in q or "chutney" in q:
        return "Adding sambar provides valuable protein and dietary fiber which lowers the net glycemic impact of your meal. Keep chutney to a moderate portion if prepared with high coconut or oil."
    elif "biryani" in q:
        return "Biryani tends to be high in refined carbs and sodium. Enjoy a small to medium portion, pair it with cucumber raita, and take a 15-minute walk after the meal."
    elif "snack" in q or "tea" in q:
        return "For evening snacks, consider roasted chana, dhokla, or a small fruit bowl with almonds instead of fried samosas or packaged biscuits."
    elif "walk" in q or "activity" in q:
        return "A light 10–15 minute walk starting within 30 minutes of completing your meal helps your muscles utilize glucose directly, flattening post-meal sugar spikes."
    else:
        return f"Based on your profile, balance carbs with protein and fiber. For {food_context or 'this meal'}, keep portion sizes moderate and consider a short 10-15 minute walk post meal."
