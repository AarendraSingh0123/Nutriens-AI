from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class HealthProfile(Base):
    __tablename__ = "health_profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="User")
    age = Column(Integer, default=38)
    sex = Column(String, default="Female")
    height_cm = Column(Float, default=162.0)
    weight_kg = Column(Float, default=68.0)
    has_diabetes = Column(Boolean, default=True)
    has_hypertension = Column(Boolean, default=False)
    has_thyroid = Column(Boolean, default=False)
    has_pcos = Column(Boolean, default=False)
    weight_goal = Column(String, default="Lose")  # Lose, Maintain, Gain
    activity_level = Column(String, default="Moderate")  # Low, Moderate, High
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Food(Base):
    __tablename__ = "foods"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    category = Column(String, default="Indian Dish")
    image_url = Column(String, default="")
    calories_per_100g = Column(Float, default=150.0)
    carbs_per_100g = Column(Float, default=20.0)
    protein_per_100g = Column(Float, default=4.0)
    fat_per_100g = Column(Float, default=6.0)
    fiber_per_100g = Column(Float, default=2.0)
    sodium_level = Column(String, default="Medium") # Low, Medium, High
    glycemic_load_tag = Column(String, default="Medium") # Low, Medium, High
    default_portion = Column(String, default="Medium")
    portion_unit = Column(String, default="serving")
    barcode = Column(String, nullable=True)

class Meal(Base):
    __tablename__ = "meals"

    id = Column(Integer, primary_key=True, index=True)
    food_name = Column(String)
    portion_size = Column(String) # Small, Medium, Large
    portion_multiplier = Column(Float, default=1.0)
    calories_min = Column(Integer)
    calories_max = Column(Integer)
    carbs_g = Column(Float)
    protein_g = Column(Float)
    fat_g = Column(Float)
    fiber_g = Column(Float)
    risk_level = Column(String) # LOW, MEDIUM, HIGH
    health_conditions = Column(String) # JSON or comma separated string
    pairing_suggestion = Column(Text)
    activity_suggestion = Column(Text)
    ai_explanation = Column(Text)
    image_url = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

class LabReport(Base):
    __tablename__ = "lab_reports"

    id = Column(Integer, primary_key=True, index=True)
    report_title = Column(String, default="Routine Blood Work")
    file_name = Column(String, default="lab_report.pdf")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    values = relationship("LabValue", back_populates="report", cascade="all, delete-orphan")

class LabValue(Base):
    __tablename__ = "lab_values"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("lab_reports.id"))
    parameter = Column(String) # HbA1c, Fasting Glucose, Post-meal Glucose
    value = Column(Float)
    unit = Column(String) # %, mg/dL
    reference_range = Column(String)
    flag = Column(String, default="Normal") # Normal, High, Borderline
    recorded_date = Column(DateTime, default=datetime.utcnow)

    report = relationship("LabReport", back_populates="values")

class MedicineReminder(Base):
    __tablename__ = "medicine_reminders"

    id = Column(Integer, primary_key=True, index=True)
    medicine_name = Column(String)
    dosage = Column(String, default="1 Tablet")
    time = Column(String) # e.g. "08:00 AM"
    frequency = Column(String, default="Daily")
    notes = Column(String, default="Take after meal")
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class InferenceLog(Base):
    __tablename__ = "inference_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    model_name = Column(String, default="EfficientNet-Lite0")
    runtime = Column(String, default="LiteRT / TFLite")
    backend_device = Column(String, default="Snapdragon NPU")
    latency_ms = Column(Integer, default=42)
    confidence = Column(Float, default=0.92)
    llm_status = Column(String, default="Ready (Gemma 2B)")
    offline_mode = Column(Boolean, default=True)
    privacy_status = Column(String, default="Device-Only")
    input_type = Column(String, default="Food Image Camera")
