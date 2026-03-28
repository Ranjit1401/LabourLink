from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URL"))
db = client["labourlink"]

# Collections
users_collection = db["users"]
posts_collection = db["posts"]
jobs_collection = db["jobs"]
applications_collection = db["applications"]
connections_collection = db["connections"]