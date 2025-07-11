import shutil
import os
import uuid
from fastapi import APIRouter, Depends, Query, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Recipe
from app.schemas import RecipeRead, RecipeCreate
from sqlalchemy import func
from typing import List


router = APIRouter()
UPLOAD_DIR = "uploads"

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
@router.get("/recipes/recipebytitle/{title}", response_model=list[RecipeRead])
def get_recipes_by_title(
    title: str ,
    db: Session = Depends(get_db)
):
    
    # Exact match
    # recipeByTitle = db.query(Recipe).filter(
    #     func.trim(func.lower(Recipe.title)) == title.lower().strip()
    # ).all()

    # Or partial match:
    recipeByTitle = db.query(Recipe).filter(
        func.lower(Recipe.title).contains(title.lower())
    ).all()

    if not recipeByTitle:
        raise HTTPException(status_code=404, detail="Searched recipe not found")

    return recipeByTitle
  



#get recipes by suitable_for (veg, vegan, etc.) category:
@router.get("/recipes/suitablefor", response_model=list[RecipeRead])
def get_recipes_by_suitable_for(suitable_for: List[str] = Query(...), db: Session = Depends(get_db)):
    recipes = db.query(Recipe).filter(Recipe.suitable_for.in_(suitable_for)).all()
    if not recipes:
        raise HTTPException(status_code=404, detail="suitable recipe not found")
    return [RecipeRead.model_validate(recipe).model_dump() for recipe in recipes]

#get recipes search by cuisine (indian, greek, asian, italian)
@router.get("/recipes/searchbycuisine/{cuisine}", response_model=list[RecipeRead])
def get_recipes_by_cusine(cuisine:str, db: Session = Depends(get_db)):
    cuisine_recipes = db.query(Recipe).filter(func.lower(Recipe.cuisine) == cuisine.lower()).all()
    if not cuisine_recipes:
        raise HTTPException(status_code=404, detail='cusine recipe not found')
    return [RecipeRead.model_validate(cuisines).model_dump() for cuisines in cuisine_recipes]


#get recipes by allergens
@router.get("/recipes/allergens")
def get_recipes_by_allergens(
        allergens: list = Query(...),
        db: Session = Depends(get_db)
    ):
    return db.query(Recipe).filter(Recipe.allergens.ilike(f"%{allergens}%")).all()


#post a new recipes
@router.post("/recipes", response_model=RecipeRead)
async def create_recipe(
    title: str = Form(...),
    suitable_for: str = Form(...),
    cooking_time: str = Form(...),
    allergens: str = Form(...),
    category: str = Form(...),
    cuisine: str = Form(...),
    ingredients: str = Form(...),
    instructions: str = Form(...),
    nutrition: str = Form(...),
    cooking_method: str = Form(...),
    difficulty: str = Form(...),
    origin: str = Form(...),
    tips: str = Form(...),
    substitution: str = Form(...),
    serves: str = Form(...),
    image: UploadFile = Form(...),
    db: Session = Depends(get_db)
):
    # save uploaded images to disk
    filename = f"{uuid.uuid4().hex}_{image.filename}"  
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    new_recipe = Recipe (
        title = title,
        suitable_for = suitable_for,
        cooking_time = cooking_time,
        instructions = instructions,
        allergens = allergens,
        category = category,
        cuisine = cuisine,
        ingredients = ingredients,
        nutrition = nutrition,
        cooking_method = cooking_method,
        difficulty = difficulty,
        origin = origin,
        tips = tips,
        substitution = substitution,
        serves = serves,
        image = filename
    )
    
    db.add(new_recipe)
    db.commit()
    db.refresh(new_recipe)
    return new_recipe
# def create_recipe(recipe: RecipeCreate, db: Session= Depends(get_db)):
#     new_recipe = Recipe(**recipe.model_dump())
#     db.add(new_recipe)
#     db.commit()
#     db.refresh(new_recipe)
#     return new_recipe


# get recipes by id
@router.get("/recipes/{id}", response_model=RecipeRead)
def get_recipe_by_id(id: int, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.id == id).first() 
    if not recipe:
        print("Recipe not found")
        raise HTTPException(status_code=404, detail="Recipe not found")
    print(f"found recipe: {recipe.title}")
    print(f"found recipe: {recipe.instructions}")
    return recipe

# patch like/dislike recipes
@router.patch("/recipes/{id}/like", response_model=RecipeRead)
def like_recipe(id: int, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.id == id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    recipe.likes += 1
    db.commit()
    db.refresh(recipe)
    return recipe

@router.patch("/recipes/{id}/dislike", response_model=RecipeRead)
def dislike_recipe(id: int, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.id ==id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    recipe.dislikes += 1
    db.commit()
    db.refresh(recipe)
    return recipe


