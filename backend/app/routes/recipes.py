import os, uuid, shutil
from azure.storage.blob import BlobServiceClient
from fastapi import APIRouter, Depends, Query, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session, joinedload
from app.database import SessionLocal
from app.models import Recipe, Users, Favorite
from app.routes.auth import get_current_user
from app.schemas import RecipeRead, RecipeCreate, RecipeUpdate
from sqlalchemy import func, or_
from typing import List


router = APIRouter()
UPLOAD_DIR = "uploads"

connect_str = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
container_name = os.getenv("AZURE_CONTAINER_NAME")

if not connect_str:
    raise Exception("Missing AZURE_STORAGE_CONNECTION_STRING")
if not container_name:
    raise Exception("Missing AZURE_CONTAINER_NAME")


blob_service_client = BlobServiceClient.from_connection_string(connect_str)
container_client = blob_service_client.get_container_client(container_name)

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
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    # upload to azure
    filename = f"{uuid.uuid4().hex}_{image.filename.lower()}"
    blob_client = container_client.get_blob_client(filename)
    blob_client.upload_blob(image.file, overwrite=True)
    # file_path = os.path.join(UPLOAD_DIR, filename)

    # with open(file_path, "wb") as buffer:
    #     shutil.copyfileobj(image.file, buffer)

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
    title: str = Form(None),
    suitable_for: str = Form(None),
    cooking_time: int = Form(None),
    instructions: str = Form(None),
    allergens: str = Form(None),
    category: str = Form(None),
    ingredients: str = Form(None),
    calories: int = Form(None),
    fat: int = Form(None),
    sugar: int = Form(None),
    protine: int = Form(None),
    carbs: int = Form(None),
    cooking_method: str = Form(None),
    difficulty: str = Form(None),
    origin: str = Form(None),
    tips: str = Form(None),
    substitution: str = Form(None),
    tag: str = Form(None),
    serves: int = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)  
):
    recipe = db.query(Recipe).filter_by(id=recipe_id, user_id=current_user.id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    # update_data = recipe_update.dict(exclude_unset=True)
    # for key, value in update_data.items():
    #     setattr(recipe, key, value)

    # Replace image if new one is uploaded
    if image:
        old_filename = recipe.image
        if old_filename:
            try:
                container_client.delete_blob(old_filename)
            except Exception:
                pass  # fail silently if not found

        new_filename = f"{uuid.uuid4().hex}_{image.filename.lower()}"
        blob_client = container_client.get_blob_client(new_filename)
        blob_client.upload_blob(image.file, overwrite=True)
        recipe.image = new_filename

    # Update other fields dynamically
    for field in [
        "title", "suitable_for", "cooking_time", "instructions", "allergens", "category",
        "ingredients", "calories", "fat", "sugar", "protine", "carbs", "cooking_method",
        "difficulty", "origin", "tips", "substitution", "tag", "serves"
    ]:
        value = locals().get(field)
        if value is not None:
            setattr(recipe, field, value)


    db.commit()
    db.refresh(recipe)
    return recipe


# delete mycreatedrecipes
@router.delete("/myrecipes/{recipe_id}", status_code=204)
def remove_myrecipe(
    recipe_id: int, 
    # recipe_update: RecipeUpdate,
    db: Session = Depends(get_db), 
    current_user: Users = Depends(get_current_user)
):
    myrecipe = db.query(Recipe).filter_by(user_id=current_user.id, id=recipe_id).first()
    print("Attempting to delete recipe:", recipe_id)
    print("Current user ID:", current_user.id)

    if not myrecipe:
        print("No matching recipe found for this user")
        raise HTTPException(status_code=404, detail="recipe not found")
    
    # delete all Fav. that reference this recipe
    db.query(Favorite).filter(Favorite.recipe.id == recipe_id).delete()
    
    # Delete image from Azure Blob
    if myrecipe.image:
        try:
            container_client.delete_blob(myrecipe.image)
            print(f"Deleted blob: {myrecipe.image}")
        except Exception as e:
            print(f"Blob delete failed: {e}")
            pass  # ignore if image not found
        
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


