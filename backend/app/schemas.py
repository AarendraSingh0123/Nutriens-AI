from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class HealthProfileSchema(BaseModel):
    id: Optional[int] = None
    name: str = "Demo User"
    age: int = 38
    sex: str = "Female"
    height_cm: float = 162.0
    weight_kg: float = 68.0
    has_diabetes: bool = True
    has_hypertension: bool = False
    has_thyroid: bool = False
    has_pcos: bool = False
    weight_goal: str = "Lose"
    activity_level: str = "Moderate"

class FoodSchema(BaseModel):
    id: Optional[int] = None
    name: str
    category: str
    image_url: str = ""
    calories_per_100g: float
    carbs_per_100g: float
    protein_per_100g: float
    fat_per_100g: float
    fiber_per_100g: float
    sodium_level: str
    glycemic_load_tag: str
    default_portion: str
    portion_unit: str = "serving"
    barcode: Optional[str] = None

class RiskEvaluationRequest(BaseModel):
    food_name: str
    portion_size: str = "Medium" # Small, Medium, Large
    health_profile: Optional[HealthProfileSchema] = None

class RiskEvaluationResponse(BaseModel):
    food_name: str
    portion_size: str
    calories_range: str
    calories_min: int
    calories_max: int
    carbs_g: float
    protein_g: float
    fat_g: float
    fiber_g: float
    risk_level: str # LOW, MEDIUM, HIGH
    risk_score: int # 1-100
    reason_codes: List[str]
    structured_facts: List[str]
    recommended_portion: str
    pairing: str
    activity: str
    ai_explanation: str

class MealCreateSchema(BaseModel):
    food_name: str
    portion_size: str
    calories_min: int
    calories_max: int
    carbs_g: float
    protein_g: float
    fat_g: float
    fiber_g: float
    risk_level: str
    health_conditions: str
    pairing_suggestion: str
    activity_suggestion: str
    ai_explanation: str
    image_url: Optional[str] = None

class MealResponseSchema(MealCreateSchema):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class LabValueSchema(BaseModel):
    id: Optional[int] = None
    parameter: str
    value: float
    unit: str
    reference_range: str
    flag: str = "Normal"
    recorded_date: Optional[datetime] = None

class LabReportCreateSchema(BaseModel):
    report_title: str = "Lab Report"
    file_name: str = "report.pdf"
    values: List[LabValueSchema]

class MedicineReminderSchema(BaseModel):
    id: Optional[int] = None
    medicine_name: str
    dosage: str = "1 Tablet"
    time: str
    frequency: str = "Daily"
    notes: str = ""
    is_completed: bool = False

class VoiceQueryRequest(BaseModel):
    query: str
    food_context: Optional[str] = None

class VoiceQueryResponse(BaseModel):
    query: str
    answer: str
    voice_processing: str = "Local/Edge LLM (Gemma 2B)"

class InferenceLogSchema(BaseModel):
    id: Optional[int] = None
    timestamp: datetime
    model_name: str
    runtime: str
    backend_device: str
    latency_ms: int
    confidence: float
    llm_status: str
    offline_mode: bool
    privacy_status: str
    input_type: str

    class Config:
        from_attributes = True
