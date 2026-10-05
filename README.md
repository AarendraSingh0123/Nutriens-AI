# NutriLens AI 🥗⚡

> **Tagline:** Personal nutrition guidance that works without internet.

NutriLens AI is a hackathon MVP web application and production architecture prototype for an Open Innovation problem. It provides personalized, condition-aware nutrition guidance for Indian meals running **100% on-device** with zero internet dependency.

---

## 🌟 Key Differentiator & Core Architecture

1. **Deterministic Safety:** Numerical nutrition values, calorie ranges, and clinical risk levels MUST come from a structured Indian food database and deterministic health rules engine.
2. **AI Explanation Layer:** The LLM (Gemma 2B class on-device) is strictly used to generate natural language explanations and tips. It **never** hallucinates calories, macros, or clinical risk scores.
3. **100% Offline Edge Intelligence:** Fast food classification (42 ms latency) running on Qualcomm Snapdragon NPU via LiteRT / TFLite, coupled with local SQLite database storage.

---

## 🚀 Features

- **Indian Food Scanner:** Detects staple Indian dishes (Masala Dosa, Rajma Rice, Biryani, Chole Bhature, Idli, Paneer Tikka, etc.) with calorie and macro ranges.
- **Dynamic Portion Selector:** Dynamically adjusts calories, carbs, protein, fat, and fiber based on portion size (Small, Medium, Large).
- **Condition-Aware Health Profile:** Evaluates meal impact for Type 2 Diabetes, Hypertension, PCOS, Thyroid, and general weight management.
- **Voice Assistant ("Ask NutriLens"):** Voice query interface using Web Speech API / local Gemma 2B fallback with text-to-speech.
- **Lab Report OCR Scanner:** Extracts HbA1c, Fasting Glucose, and Post-meal Glucose from lab reports with mandatory user verification and historical trends.
- **Packaged Food Scanner:** Barcode and nutrition label evaluation for packaged snacks.
- **Medicine Reminders:** Prescription reminder storage with completion status tracking.
- **Laptop / Office Kit Dashboard:** Connected laptop view featuring both a User View and a live **Inference Log** displaying NPU latency, LiteRT runtime, and model telemetry.
- **Airplane Mode Simulator:** Toggleable 100% offline mode for hackathon judging.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React + Vite + TypeScript
- **Styling:** Tailwind CSS + Vanilla CSS micro-animations
- **Icons:** Lucide React
- **Data Visualization:** Recharts (HbA1c & Glucose trend charts)

### Backend
- **Framework:** Python FastAPI
- **Database:** SQLite (SQLAlchemy ORM)
- **Rules Engine:** Custom Deterministic Health Rules Engine (`rules.py`)

### Production Reference Android Stack
- **UI / Core:** Kotlin + Jetpack Compose
- **Camera:** CameraX API
- **Vision Model:** EfficientNet-Lite0 / MobileNetV3
- **Inference Engine:** LiteRT / TFLite + Qualcomm QNN
- **NPU Hardware:** Snapdragon NPU / Hexagon DSP
- **Local Database:** Room / SQLite
- **On-Device LLM:** Gemma 2B-class
- **OCR:** ML Kit On-Device

---

## 💻 How to Run Locally

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. Run Backend Server
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
*The database (`nutrilens.db`) will automatically seed with 30+ Indian foods, default health profile, sample meals, lab reports, and inference logs.*

### 2. Run Frontend Dev Server
```bash
cd frontend
npm install
npm run dev
```
*Open `http://localhost:5173` in your browser.*

---

## 🔌 API Endpoints Summary

- `GET /api/profile` & `POST /api/profile` — Fetch / update health profile
- `POST /api/food/analyze` — Image food detection & classification
- `GET /api/foods` & `GET /api/foods/:id` — Indian nutrition database query
- `POST /api/risk/evaluate` — Deterministic health risk evaluation
- `POST /api/meals` & `GET /api/meals` — Log & fetch meal history
- `POST /api/reports/analyze` & `GET /api/reports` — OCR report extraction & history
- `GET /api/reminders` & `POST /api/reminders` — Medicine reminder storage
- `POST /api/voice/query` — Local voice assistant query handler
- `GET /api/dashboard` — Summary metrics for dashboard
- `GET /api/inference-log` — Edge AI inference telemetry

---

## ⚠️ Medical Disclaimer

*NutriLens AI provides general dietary guidance only — not medical advice. The application does not diagnose conditions, prescribe medication, change medication doses, or replace professional medical care.*
