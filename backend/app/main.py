from fastapi import FastAPI
from app.routes import recipes

app  = FastAPI()

# @app.get("/")
# def read_root():
#     return {"message": "Welcome to the Recipe API!"}

#register routes
app.include_router(recipes.router)

