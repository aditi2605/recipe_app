from pydantic import BaseModel
from typing import Optional


# recipes
class RecipeCreate(BaseModel):
    title : str
    suitable_for : str
    allergens :str
    category :str
    # cuisine :str
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

class RecipeUpdate(BaseModel):
    title: Optional[str] = None
    suitable_for: Optional[str] = None
    allergens: Optional[str] = None
    category: Optional[str] = None
    # cuisine: Optional[str] = None
    ingredients: Optional[str] = None
    instructions: Optional[str] = None
    calories: Optional[int] = None
    fat: Optional[int] = None
    sugar: Optional[int] = None
    protine: Optional[int] = None
    carbs: Optional[int] = None
    cooking_time: Optional[int] = None
    cooking_method: Optional[str] = None
    difficulty: Optional[str] = None
    origin: Optional[str] = None
    tips: Optional[str] = None
    substitution: Optional[str] = None
    serves: Optional[int] = None
    image: Optional[str] = None
    tag: Optional[str] = None
    likes: Optional[int] = None
    dislikes: Optional[int] = None

class RecipeRead(RecipeCreate):
    id: int
    title: str
    suitable_for: str
    allergens: str
    category: str
    # cuisine: str
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
    username: Optional[str] = None
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

class ProfileImageCreate(BaseModel):
    image: str

class ProfileImageRead(ProfileImageCreate):
    id: int
    image: str

    class Config:
        from_attributes = True


