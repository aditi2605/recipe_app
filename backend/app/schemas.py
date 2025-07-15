from pydantic import BaseModel
from typing import Optional


# recipes
class RecipeCreate(BaseModel):
    title : str
    suitable_for : str
    allergens :str
    category :str
    cuisine :str
    ingredients : str
    instructions: str
    calories: int
    fat: int
    sugar: int
    protine: int
    carbs: int
    cooking_time : int
    cooking_method: str
    difficulty :str
    origin : str
    tips : str
    substitution : str
    serves : int
    image : str
    tag: str
    likes: int
    dislikes: int

class RecipeRead(RecipeCreate):
    id: int
    title: str
    suitable_for: str
    allergens: str
    category: str
    cuisine: str
    ingredients: str
    instructions: Optional[str] = None
    calories: int
    sugar: int
    fat: int
    protine: int
    carbs: int
    cooking_time: int
    cooking_method: str
    difficulty: str
    origin: str
    tips: str
    substitution: str
    serves: int
    image: str
    tag: str
    likes: Optional[int] = 0
    dislikes: Optional[int] = 0
    class Config:
        from_attributes = True


# Users
class UsersCreate(BaseModel):
    username : str
    email : str
    password : str

class UserRead(UsersCreate):
    id : int
    email : str
    class Config:
        from_attributes = True


class FavoriteCreate(BaseModel):
    recipe_id: int


class FavoriteRead(FavoriteCreate):
    id: int
    user_id: int
    recipe_id: int

    class Config:
        from_attributes = True


