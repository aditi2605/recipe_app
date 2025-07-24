from fastapi import FastAPI
from app.routes import recipes, auth
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from app.models import Base
from app.database import engine

Base.metadata.create_all(bind=engine)

app  = FastAPI()

origins = [
    "https://bitecult.vercel.app",
    "http://localhost:3000",
    "https://bitecult-backend.onrender.com" ,
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=[origins], 
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

from fastapi import UploadFile, File, HTTPException
import os, uuid, shutil

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    try:
        filename = f"{uuid.uuid4().hex}_{file.filename}"
        file_path = os.path.join("uploads", filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return {"filename": filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

BASE_DIR = Path(__file__).resolve().parent
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")





