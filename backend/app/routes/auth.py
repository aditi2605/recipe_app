from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Users
from app.schemas import UserRead, UsersCreate
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.token import create_access_token, verify_token

router = APIRouter()

pwd_context = CryptContext(schemes = ["bcrypt"], deprecated = "auto")
oauth_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_password_hash(password: str):
    return pwd_context.hash(password)


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
    user = db.query(Users).filter(Users.username == form_data.username).first()
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    if not pwd_context.verify(form_data.password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_tyoe": "bearer"}

# Get Current User from Token
def get_current_user(token: str = Depends(oauth_scheme), db: Session = Depends(get_db)):
    username = verify_token(token)
    if not username:
        raise HTTPException(status_code=400, detail="Invalid ot expire token")
    
    user = db.query(Users).filter(Users.username == username).first()
    if user is None:
        raise HTTPException(status_code=400, detail="user not found")
    return user

# create protected route
@router.get("/verified")
def verified_route(curre_user: Users = Depends(get_current_user)):
    return {"message": f"Welcome {curre_user.username}"}