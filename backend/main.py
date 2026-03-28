from fastapi import FastAPI, HTTPException, Depends, File, UploadFile, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from database import (
    users_collection,
    posts_collection,
    jobs_collection,
    applications_collection,
    connections_collection,
    notifications_collection
)
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from pydantic import BaseModel, EmailStr
from typing import Literal, List
import cloudinary
import cloudinary.uploader
from bson import ObjectId

# ================= ENV =================
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "secret123")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

# ================= CLOUDINARY =================
cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME"),
    api_key=os.getenv("API_KEY"),
    api_secret=os.getenv("API_SECRET")
)

# ================= APP =================
app = FastAPI()

# ================= CORS =================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= PASSWORD =================
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

# ================= JWT =================
security = HTTPBearer()

def create_token(data: dict):
    to_encode = data.copy()
    to_encode["exp"] = datetime.utcnow() + timedelta(days=1)
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ================= MODELS =================
class UserSignup(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str
    role: Literal["labour", "contractor"]

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class JobApply(BaseModel):
    job_id: str

class RatingModel(BaseModel):
    rating: int

# ================= HOME =================
@app.get("/")
def home():
    return {"message": "LabourLink Backend Running 🚀"}

# ================= SIGNUP =================
@app.post("/signup")
def signup(user: UserSignup):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already exists")

    if users_collection.find_one({"phone": user.phone}):
        raise HTTPException(status_code=400, detail="Phone already exists")

    data = user.dict()
    data["password"] = hash_password(user.password)
    data["created_at"] = datetime.utcnow()
    data["profile_views"] = 0
    data["ratings"] = []
    data["jobs_done"] = 0

    users_collection.insert_one(data)

    return {"message": "Signup successful"}

# ================= LOGIN =================
@app.post("/login")
def login(user: UserLogin):
    db_user = users_collection.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Wrong password")

    token = create_token({
        "email": db_user["email"],
        "role": db_user["role"]
    })

    return {
        "token": token,
        "user": {
            "name": db_user["name"],
            "email": db_user["email"],
            "role": db_user["role"]
        }
    }

# ================= PROFILE =================
@app.get("/profile/{email}")
def get_profile(email: str):

    users_collection.update_one(
        {"email": email},
        {"$inc": {"profile_views": 1}}
    )

    user = users_collection.find_one({"email": email}, {"_id": 0, "password": 0})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    ratings = user.get("ratings", [])
    user["average_rating"] = round(sum(ratings)/len(ratings), 2) if ratings else 0

    user["total_connections"] = connections_collection.count_documents({
        "$or": [
            {"sender": email, "status": "accepted"},
            {"receiver": email, "status": "accepted"}
        ]
    })

    user["jobs_done"] = user.get("jobs_done", 0)

    return user

# ================= CREATE POST =================
@app.post("/create-post")
def create_post(
    description: str = Form(...),
    skills: List[str] = Form(...),
    file: UploadFile = File(...),
    user=Depends(verify_token)
):
    upload = cloudinary.uploader.upload(file.file)

    post = {
        "description": description,
        "skills": skills,
        "image": upload["secure_url"],
        "user_email": user["email"],
        "created_at": datetime.utcnow(),
        "likes": [],
        "comments": [],
        "shares": 0
    }

    posts_collection.insert_one(post)

    # notify connections
    connections = connections_collection.find({
        "$or": [
            {"sender": user["email"], "status": "accepted"},
            {"receiver": user["email"], "status": "accepted"}
        ]
    })

    for c in connections:
        target = c["receiver"] if c["sender"] == user["email"] else c["sender"]

        notifications_collection.insert_one({
            "user_email": target,
            "message": f"{user['email']} posted new work",
            "type": "post",
            "created_at": datetime.utcnow(),
            "seen": False
        })

    return {"message": "Post created"}

# ================= GET POSTS =================
@app.get("/posts")
def get_posts():
    result = []

    for p in posts_collection.find():
        p["_id"] = str(p["_id"])
        p["likes_count"] = len(p.get("likes", []))
        p["comments_count"] = len(p.get("comments", []))
        result.append(p)

    return result

# ================= LIKE POST =================
@app.post("/like-post/{post_id}")
def like_post(post_id: str, user=Depends(verify_token)):
    try:
        obj_id = ObjectId(post_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID")

    post = posts_collection.find_one({"_id": obj_id})

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    email = user["email"]

    if email in post.get("likes", []):
        posts_collection.update_one({"_id": obj_id}, {"$pull": {"likes": email}})
        return {"message": "Unliked"}

    posts_collection.update_one({"_id": obj_id}, {"$push": {"likes": email}})
    return {"message": "Liked"}

# ================= COMMENT =================
@app.post("/comment-post/{post_id}")
def comment_post(post_id: str, text: str = Form(...), user=Depends(verify_token)):

    comment = {
        "user": user["email"],
        "text": text,
        "created_at": datetime.utcnow()
    }

    posts_collection.update_one(
        {"_id": ObjectId(post_id)},
        {"$push": {"comments": comment}}
    )

    return {"message": "Comment added"}

# ================= SHARE =================
@app.post("/share-post/{post_id}")
def share_post(post_id: str):
    posts_collection.update_one(
        {"_id": ObjectId(post_id)},
        {"$inc": {"shares": 1}}
    )

    return {"message": "Shared"}

# ================= CREATE JOB =================
@app.post("/create-job")
def create_job(job: dict, user=Depends(verify_token)):
    if user["role"] != "contractor":
        raise HTTPException(status_code=403, detail="Only contractor")

    job["created_by"] = user["email"]
    job["created_at"] = datetime.utcnow()

    jobs_collection.insert_one(job)

    # notify labours
    labours = users_collection.find({"role": "labour"})

    for l in labours:
        notifications_collection.insert_one({
            "user_email": l["email"],
            "message": f"New job by {user['email']}",
            "type": "job",
            "created_at": datetime.utcnow(),
            "seen": False
        })

    return {"message": "Job created"}

# ================= GET JOBS =================
@app.get("/jobs")
def get_jobs():
    jobs = []

    for j in jobs_collection.find():
        j["_id"] = str(j["_id"])
        jobs.append(j)

    return jobs

# ================= APPLY JOB =================
@app.post("/apply-job")
def apply_job(data: JobApply, user=Depends(verify_token)):
    if user["role"] != "labour":
        raise HTTPException(status_code=403, detail="Only labour")

    exists = applications_collection.find_one({
        "job_id": data.job_id,
        "user_email": user["email"]
    })

    if exists:
        raise HTTPException(status_code=400, detail="Already applied")

    applications_collection.insert_one({
        "job_id": data.job_id,
        "user_email": user["email"],
        "status": "pending",
        "applied_at": datetime.utcnow()
    })

    return {"message": "Applied"}

# ================= MY APPLICATIONS =================
@app.get("/my-applications")
def my_applications(user=Depends(verify_token)):
    return list(applications_collection.find(
        {"user_email": user["email"]},
        {"_id": 0}
    ))

# ================= CONNECTION =================
@app.post("/send-request/{receiver}")
def send_request(receiver: str, user=Depends(verify_token)):

    sender = user["email"]

    if sender == receiver:
        raise HTTPException(status_code=400, detail="Cannot send to self")

    connections_collection.insert_one({
        "sender": sender,
        "receiver": receiver,
        "status": "pending",
        "created_at": datetime.utcnow()
    })

    return {"message": "Request sent"}

@app.post("/accept-request/{sender}")
def accept(sender: str, user=Depends(verify_token)):
    connections_collection.update_one(
        {"sender": sender, "receiver": user["email"]},
        {"$set": {"status": "accepted"}}
    )
    return {"message": "Accepted"}

@app.get("/connections")
def get_connections(user=Depends(verify_token)):
    email = user["email"]

    cons = connections_collection.find({
        "$or": [
            {"sender": email, "status": "accepted"},
            {"receiver": email, "status": "accepted"}
        ]
    })

    result = []

    for c in cons:
        result.append(c["receiver"] if c["sender"] == email else c["sender"])

    return result

# ================= NOTIFICATIONS =================
@app.get("/notifications")
def get_notifications(user=Depends(verify_token)):
    return list(notifications_collection.find(
        {"user_email": user["email"]},
        {"_id": 0}
    ).sort("created_at", -1))

@app.post("/mark-read")
def mark_read(user=Depends(verify_token)):
    notifications_collection.update_many(
        {"user_email": user["email"]},
        {"$set": {"seen": True}}
    )
    return {"message": "Marked read"}

# ================= RATE =================
@app.post("/rate-user/{email}")
def rate_user(email: str, data: RatingModel):
    if data.rating < 1 or data.rating > 5:
        raise HTTPException(status_code=400, detail="1-5 only")

    users_collection.update_one(
        {"email": email},
        {"$push": {"ratings": data.rating}}
    )

    return {"message": "Rating added"}