import os, uuid, shutil
from fastapi import FastAPI, Request, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from azure.storage.blob import BlobServiceClient
from dotenv import load_dotenv

from app.routes import recipes, auth
from app.models import Base
from app.database import engine
from app.token import verify_token

load_dotenv()

Base.metadata.create_all(bind=engine)

app  = FastAPI()

origins = [
    "https://bitecult.vercel.app",
    "http://localhost:3000",
    "https://bitecult-backend.onrender.com" ,
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
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

# Azure Blob Setup
connect_str = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
container_name = os.getenv("AZURE_CONTAINER_NAME")
account_name = os.getenv("AZURE_STORAGE_ACCOUNT_NAME")

blob_service_client = BlobServiceClient.from_connection_string(connect_str)
container_client = blob_service_client.get_container_client(container_name)


# Rate limit key based on user token or IP

def user_or_ip_key(request: Request):
    auth = request.headers.get('Authorization')
    if auth and auth.startswith('Bearer '):
        token = auth.split(" ")[1]
        username = verify_token(token)
        if username:
            return username
    return get_remote_address(request)

# apply slowapi limiter
limiter = Limiter(key_func=user_or_ip_key)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# Upload image to Azure
@app.post("/upload-image")
@limiter.limit("1/hour") 
async def upload_image(request: Request, file: UploadFile = File(...)):
    try:

        filename = f"{uuid.uuid4().hex}_{file.filename}"
        blob_client = container_client.get_blob_client(filename)
        blob_client.upload_blob(file.file, overwrite=True)

        # Return full URL for frontend use
        blob_url = f"https://{account_name}.blobcore.windows.net/{container_name}/{filename}"
        return {"filename": filename, "url": blob_url}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    
    #     filename = f"{uuid.uuid4().hex}_{file.filename}"
    #     file_path = os.path.join("uploads", filename)

    #     with open(file_path, "wb") as buffer:
    #         shutil.copyfileobj(file.file, buffer)

    #     return {"filename": filename}
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=str(e))

# BASE_DIR = Path(__file__).resolve().parent
# app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")






