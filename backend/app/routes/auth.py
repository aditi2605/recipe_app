from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Users, Favorite, Recipe
from app.schemas import UserRead, UsersCreate, FavoriteCreate, FavoriteRead, RecipeRead
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.token import create_access_token, verify_token

router = APIRouter()

pwd_context = CryptContext(schemes = ["bcrypt"], deprecated = "auto")

# Tells FastAPI to expect a Bearer token from the Authorization header
oauth_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_password_hash(password: str):
    return pwd_context.hash(password)

# Get Current User from Token
def get_current_user(token: str = Depends(oauth_scheme), db: Session = Depends(get_db)):
    email = verify_token(token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    
    user = db.query(Users).filter(Users.email == email).first()
    if user is None:
        raise HTTPException(status_code=400, detail="user not found")
    return user



#  create user
@router.post("/signin", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(users: UsersCreate, db: Session = Depends(get_db)):
    existing_user = db.query(Users).filter(Users.email == users.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    hashed_password = get_password_hash(users.password)
    new_user = Users(
        username = users.username,
        email = users.email,
        password = hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# Login
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(Users).filter(Users.email == form_data.username).first()
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    if not pwd_context.verify(form_data.password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


# create protected route
@router.get("/verified")
def verified_route(current_user: Users = Depends(get_current_user)):
    print(f"{current_user.username}!")
    return {"message": f"{current_user.username}!"}



# user greeting get api
@router.get("/username")
def getUserName(token: str = Depends(oauth_scheme)):
    user = verify_token(token)
    return {"username": user["username"]}


# Favorite API
@router.post("/favorites", response_model=FavoriteRead)
def add_favorite(fav: FavoriteCreate, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    existing = db.query(Favorite).filter_by(user_id=current_user.id, recipe_id=fav.recipe_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already favorited")
    favorite = Favorite(user_id=current_user.id, recipe_id=fav.recipe_id)
    db.add(favorite)
    db.commit()
    db.refresh(favorite)
    return favorite

@router.delete("/favorites/{recipe_id}", status_code=204)
def remove_favorite(
    recipe_id: int, 
    db: Session = Depends(get_db), 
    current_user: Users = Depends(get_current_user)
):
    fav = db.query(Favorite).filter_by(user_id=current_user.id, recipe_id=recipe_id).first()
    if not fav:
        raise HTTPException(status_code=404, detail="Favorite not found")
    db.delete(fav)
    db.commit()

@router.get("/favorites", response_model=list[RecipeRead])
def get_user_favorites(
    db: Session = Depends(get_db), 
    current_user: Users = Depends(get_current_user)
):
    favs = db.query(Favorite).filter(Favorite.user_id == current_user.id).all()
    recipe_ids = [f.recipe_id for f in favs]
    recipes = db.query(Recipe).filter(Recipe.id.in_(recipe_ids)).all()
    return recipes


    