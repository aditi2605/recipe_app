from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Recipe

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
#get all recipes
@router.get("/recipes")
def get_recipes(db: Session = Depends(get_db)):
    return db.query(Recipe).all()

#get recipes by suitable_for (veg, vegan, etc.) category:
@router.get("recipes/suitablefor")
def get_recipes_suitablefor(db: Session = Depends(get_db)):
    return db.query(Recipe).all()
