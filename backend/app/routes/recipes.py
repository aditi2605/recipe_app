from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Recipe

router = APIRouter()

print("📦 recipes.py loaded")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/ping")
def ping():
    return {"msg": "pong"}


@router.get("/recipes")
def get_recipes(db: Session = Depends(get_db)):
    return db.query(Recipe).all()
