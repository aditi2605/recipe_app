from sqlalchemy import Column, Integer, String, ForeignKey, LargeBinary
from sqlalchemy.orm import relationship
from app.database import Base

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    suitable_for = Column(String, index=True)
    allergens = Column(String, index=True)
    category = Column(String, index=True)
    cuisine = Column(String, index=True)
    ingredients = Column(String, index=True)
    instructions = Column(String, index=True)
    nutrition = Column(String, index=True)
    cooking_time = Column(String, index=True)
    cooking_method = Column(String, index=True)
    difficulty = Column(String, index=True)
    origin = Column(String, index=True)
    tips = Column(String, index=True)
    substitution = Column(String, index=True)
    likes = Column(Integer, default=0)
    dislikes = Column(Integer, default=0)
    serves = Column(Integer, index=True)
    image = Column(String, index=True) 


class Users(Base):
    __tablename__  = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    email = Column(String, unique=True, index=True)
    password  = Column(String)

    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")


class Favorite(Base):
    __tablename__ = 'favorites'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    recipe_id = Column(Integer, ForeignKey('recipes.id'), nullable=False)

    user = relationship("Users", back_populates="favorites")
    recipe = relationship("Recipe")

