from pydantic import BaseModel

# recipes
class RecipeCreate(BaseModel):
    title : str
    suitable_for : str
    allergens :str
    category :str
    cuisine :str
    ingredients : str
    nutrition : str
    cooking_time : str
    cooking_method: str
    difficulty :str
    origin : str
    tips : str
    substitution : str
    serves :int
    image : str

class RecipeRead(RecipeCreate):
    id: int

    class Config:
        orm_mode = True


# Users
class UsersCreate(BaseModel):
    username : str
    email : str
    password : str

class UserRead(UsersCreate):
    id : int
    email : str
    class Config:
        orm_mode = True

