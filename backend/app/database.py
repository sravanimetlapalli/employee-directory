# this file is responsible for making a connection to the db, and makesure each and every api request will get it's own session without overlapping with the other sessions.

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os


# load environment variables from .env file
load_dotenv()

# grab the database_url from .env file
DB_URL = os.getenv("DATABASE_URL")

#create the sqlalchemy engine, the actual connection to the database
# pool_pre_ping=True checks the db connection health before using it

engine = create_engine(
    DB_URL,
    pool_pre_ping=True
)

# Each request gets it's own database session, responsbile for providing an individual db session for every api request
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# this is the base class where all our models(db tables/classes) will inherit from
Base = declarative_base()

# dependency that is used in every API route to get a DB session, every api call that needs a db session will call this dependency, this function will automatically get a session per API request, use it and close it. This is a FASTAPI Dependency.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()