from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import text
import os
from dotenv import load_dotenv

load_dotenv()  #To load the .env file, call:

url = os.getenv("DATABASE_URL") #Python's built-in way to access environment variables:
engine = create_engine(url)
SessionLocal = sessionmaker (bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


def accessEnvVariables():
    print("DB URL :", url)

accessEnvVariables()


if __name__ == "__main__":
    try:
        # Try to connect and print available tables
        with engine.connect() as conn:
            result = conn.execute(text("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public';"))
            for row in result:
                print("-", row[0])
    except Exception as e:
        print("Failed to connect:", e)
