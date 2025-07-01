from fastapi import FastAPI
from app.routes import recipes, auth
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from app.models import Base
from app.database import engine

Base.metadata.create_all(bind=engine)

app  = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.get("/")
# def read_root():
#     return {"message": "Welcome to the Recipe API!"}

#register routes
app.include_router(recipes.router)
app.include_router(auth.router)

# serve static files from uploads URL
BASE_DIR = Path(__file__).resolve().parent
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")





