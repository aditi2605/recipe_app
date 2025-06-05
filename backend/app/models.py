from sqlalchemy import Column, Integer, String
from app.database import Base

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    suitable_for = Column(String)
    allergens = Column(String)
    category = Column(String)
    cuisine = Column(String)
    ingredients = Column(String)
    nutrition = Column(String)
    cooking_time = Column(String)
    cooking_method = Column(String)
    difficulty = Column(String)
    origin = Column(String)
    tips = Column(String)
    substitution = Column(String)
    likes = Column(Integer)
    dislikes = Column(Integer)
    serves = Column(Integer)
    image = Column(String)
