from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Recipe
from app.schemas import RecipeRead, RecipeCreate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

        
#get all recipes
@router.get("/recipes", response_model=list[RecipeRead])
def get_recipes(db: Session = Depends(get_db)):
    return db.query(Recipe).all()

#get recipes by title
@router.get("/recipes/searchbytitle")
def get_recipes_by_title(
    searchbytitle: str = Query(...),
    db: Session = Depends(get_db)
    ):
    return db.query(Recipe).filter(Recipe.title.ilike(f"%{searchbytitle}%")).all()

#get recipes by suitable_for (veg, vegan, etc.) category:
@router.get("/recipes/suitablefor")
def get_recipes_by_suitablefor(
    suitable_for: str = Query(...),
    db: Session = Depends(get_db)
    ):
    return db.query(Recipe).filter(Recipe.suitable_for.ilike(f"%{suitable_for}%")).all()

#get recipes by allergens
@router.get("/recipes/allergens")
def get_recipes_by_allergens(
        allergens: list = Query(...),
        db: Session = Depends(get_db)
    ):
    return db.query(Recipe).filter(Recipe.allergens.ilike(f"%{allergens}%")).all()


#post a new recipes
@router.post("/recipes", response_model=RecipeRead)
def create_recipe(recipe: RecipeCreate, db: Session= Depends(get_db)):
    new_recipe = Recipe(**recipe.model_dump())
    db.add(new_recipe)
    db.commit()
    db.refresh(new_recipe)
    return new_recipe

