from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from .api.routes import router
from .services import seed_db

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NutriLens AI Backend",
    description="Personalized Indian food nutrition assistant powered by Edge AI & Deterministic Health Rules",
    version="1.0.0"
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed database on startup
@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        seed_db(db)
    finally:
        db.close()

# Include API router
app.include_router(router, prefix="/api")

@app.get("/")
@app.get("/api")
@app.get("/api/")
def root():
    return {
        "app": "NutriLens AI Backend",
        "status": "Online",
        "mode": "Offline-First Device Architecture",
        "docs_url": "/docs"
    }
