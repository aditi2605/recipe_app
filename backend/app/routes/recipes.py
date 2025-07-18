import shutil
import os
import uuid
from fastapi import APIRouter, Depends, Query, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session, joinedload
from app.database import SessionLocal
from app.models import Recipe, Users
from app.routes.auth import get_current_user
from app.schemas import RecipeRead, RecipeCreate, RecipeUpdate
from sqlalchemy import func, or_
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
def get_recipes_by_title( title: str, db: Session = Depends(get_db)):
    
    # Exact match
    # recipeByTitle = db.query(Recipe).filter(
    #     func.trim(func.lower(Recipe.title)) == title.lower().strip()
    # ).all()

    # Or partial match:
    recipeByTitle = db.query(Recipe).filter(func.lower(Recipe.title).contains(title.lower())).all()

    if not recipeByTitle:
        # return []
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
@router.get("/recipes/searchbycuisine/{origin}", response_model=list[RecipeRead])
def get_recipes_by_cuisine(origin: str, db: Session = Depends(get_db)):
    
    pattern = f"%{origin.strip().lower()}%"
    print("pattern:", pattern)
    origin_recipes = (
        db.query(Recipe)
        .filter(func.lower(Recipe.origin).ilike(pattern))
        .all()
    )
    if not origin_recipes:
        raise HTTPException(status_code=404, detail="cuisine recipe not found")
    return [RecipeRead.model_validate(r).model_dump() for r in origin_recipes]



#get recipes by allergens
# @router.get("/recipes/allergens")
# def get_recipes_by_allergens(
#         allergens: list = Query(...),
#         db: Session = Depends(get_db)
#     ):
#     return db.query(Recipe).filter(Recipe.allergens.ilike(f"%{allergens}%")).all()

@router.get("/recipes/allergens", response_model=list[RecipeRead])
def get_recipes_by_allergens( allergens: list[str] = Query(...), db: Session = Depends(get_db)):
    filters = [Recipe.allergens.ilike(f"%{a}%") for a in allergens]
    recipes = db.query(Recipe).filter(or_(*filters)).all()
    if not recipes:
        raise HTTPException(status_code=404, detail="No recipes math allergens")
    return [RecipeRead.model_validate(r).model_dump() for r in recipes]


#post a new recipes
@router.post("/recipes", response_model=RecipeRead)
async def create_recipe(
    title: str = Form(...),
    suitable_for: str = Form(...),
    cooking_time: int = Form(...),
    allergens: str = Form(...),
    category: str = Form(...),
    # cuisine: str = Form(...),
    ingredients: str = Form(...),
    instructions: str = Form(...),
    calories: int = Form(...),
    fat: int = Form(...),
    sugar: int = Form(...),
    protine: int = Form(...),
    carbs: int = Form(...),
    cooking_method: str = Form(...),
    difficulty: str = Form(...),
    origin: str = Form(...),
    tips: str = Form(...),
    substitution: str = Form(...),
    serves: int = Form(...),
    tag: str = Form(...),
    image: UploadFile = Form(...),
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    filename = f"{uuid.uuid4().hex}_{image.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    new_recipe = Recipe(
        title=title,
        suitable_for=suitable_for,
        cooking_time=cooking_time,
        instructions=instructions,
        allergens=allergens,
        category=category,
        # cuisine=cuisine,
        ingredients=ingredients,
        calories=calories,
        fat=fat,
        sugar=sugar,
        protine=protine,
        carbs=carbs,
        cooking_method=cooking_method,
        difficulty=difficulty,
        origin=origin,
        tips=tips,
        substitution=substitution,
        tag=tag,
        serves=serves,
        image=filename,
        user_id=current_user.id,
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


# users created recipes
@router.post("/myrecipes", response_model=list[RecipeRead])
def user_create_recipes(db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    recipes = db.query(Recipe).filter(Recipe.user_id == current_user.id).all()
    print(recipes)
    if not recipes:
        raise HTTPException(status_code=404, detail="No created recipes found")
    print(recipes)
    return recipes

# get user created recipes
@router.get("/myrecipes", response_model=list[RecipeRead])
def get_user_created_recipes(db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    recipes = db.query(Recipe).options(joinedload(Recipe.creator)).filter(Recipe.user_id == current_user.id).all()
    print(recipes)
    if not recipes :
        raise HTTPException(status_code=404, detail="No recipes created yet")
    return recipes

# update mycreatedrecipe
@router.put("/myrecipes/{recipe_id}")
def update_myrecipe(
    recipe_id: int,
    recipe_update: RecipeUpdate,  
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    recipe = db.query(Recipe).filter_by(id=recipe_id, user_id=current_user.id).first()

    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    update_data = recipe_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(recipe, key, value)

    db.commit()
    db.refresh(recipe)
    return recipe


# delete mycreatedrecipes
@router.delete("/myrecipes/{recipe_id}", status_code=204)
def remove_myrecipe(
    recipe_id: int, 
    recipe_update: RecipeUpdate,
    db: Session = Depends(get_db), 
    current_user: Users = Depends(get_current_user)
):
    myrecipe = db.query(Recipe).filter_by(user_id=current_user.id, id=recipe_id).first()
    if not myrecipe:
        raise HTTPException(status_code=404, detail="recipe not found")
    db.delete(myrecipe)
    db.commit()

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


