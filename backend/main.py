from fastapi import FastAPI, HTTPException, Depends, File, UploadFile, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database import users_collection, posts_collection, jobs_collection, applications_collection, connections_collection
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

# ---------------- LOAD ENV ----------------
load_dotenv()

# ---------------- CLOUDINARY ----------------
cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME"),
    api_key=os.getenv("API_KEY"),
    api_secret=os.getenv("API_SECRET")
)

app = FastAPI()

# ---------------- PASSWORD HASH ----------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

# ---------------- SKILLS ----------------
ALLOWED_SKILLS = [
    "Construction", "Plumbing", "Electrical", "Painting",
    "Carpentry", "Masonry", "Welding", "Cleaning"
]

# ---------------- JWT ----------------
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

def create_token(data):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=1)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ---------------- JWT PROTECTION ----------------
security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# ---------------- MODELS ----------------
class UserSignup(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str
    role: Literal["labour", "contractor"]

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# ---------------- HOME ----------------
@app.get("/")
def home():
    return {"message": "LabourLink Backend Running 🚀"}

# ---------------- SIGNUP ----------------
@app.post("/signup")
def signup(user: UserSignup):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="User already exists")

    if users_collection.find_one({"phone": user.phone}):
        raise HTTPException(status_code=400, detail="Phone already registered")

    user_data = user.dict()
    user_data["password"] = hash_password(user_data["password"])
    user_data["created_at"] = datetime.utcnow()

    users_collection.insert_one(user_data)
    return {"message": "Signup successful"}

# ---------------- LOGIN ----------------
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
            "phone": db_user["phone"],
            "role": db_user["role"]
        }
    }

# ---------------- PROFILE ----------------
@app.get("/profile")
def get_profile(user=Depends(verify_token)):
    return users_collection.find_one(
        {"email": user["email"]},
        {"_id": 0, "password": 0}
    )

# ---------------- CREATE POST ----------------
@app.post("/create-post")
def create_post(
    description: str = Form(...),
    skills: List[str] = Form(...),
    latitude: str = Form(...),
    longitude: str = Form(...),
    file: UploadFile = File(...),
    user=Depends(verify_token)
):
    for skill in skills:
        if skill not in ALLOWED_SKILLS:
            raise HTTPException(status_code=400, detail=f"Invalid skill: {skill}")

    upload_result = cloudinary.uploader.upload(file.file)
    image_url = upload_result["secure_url"]

    post_data = {
        "description": description,
        "skills": skills,
        "image": image_url,
        "location": {"lat": latitude, "lng": longitude},
        "user_email": user["email"],
        "created_at": datetime.utcnow(),
        "likes": [],
        "comments": [],
        "shares": 0
    }

    posts_collection.insert_one(post_data)
    return {"message": "Post created"}

# ---------------- GET POSTS ----------------
@app.get("/posts")
def get_posts():
    posts = []
    for post in posts_collection.find():
        post["_id"] = str(post["_id"])
        post["likes_count"] = len(post.get("likes", []))
        post["comments_count"] = len(post.get("comments", []))
        posts.append(post)
    return posts

# ---------------- LIKE POST ----------------
@app.post("/like-post/{post_id}")
def like_post(post_id: str, user=Depends(verify_token)):
    post = posts_collection.find_one({"_id": ObjectId(post_id)})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    email = user["email"]

    if email in post.get("likes", []):
        posts_collection.update_one({"_id": ObjectId(post_id)}, {"$pull": {"likes": email}})
        return {"message": "Unliked"}
    else:
        posts_collection.update_one({"_id": ObjectId(post_id)}, {"$push": {"likes": email}})
        return {"message": "Liked"}

# ---------------- COMMENT POST ----------------
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

# ---------------- SHARE POST ----------------
@app.post("/share-post/{post_id}")
def share_post(post_id: str, user=Depends(verify_token)):
    posts_collection.update_one(
        {"_id": ObjectId(post_id)},
        {"$inc": {"shares": 1}}
    )
    return {"message": "Post shared"}

# ---------------- CREATE JOB ----------------
@app.post("/create-job")
def create_job(job: dict, user=Depends(verify_token)):
    if user["role"] != "contractor":
        raise HTTPException(status_code=403, detail="Only contractors can create jobs")

    job["created_by"] = user["email"]
    job["created_at"] = datetime.utcnow()

    jobs_collection.insert_one(job)
    return {"message": "Job created"}

# ---------------- GET JOBS ----------------
@app.get("/jobs")
def get_jobs():
    jobs = []
    for job in jobs_collection.find():
        job["_id"] = str(job["_id"])
        jobs.append(job)
    return jobs

# ---------------- APPLY JOB ----------------
@app.post("/apply-job")
def apply_job(data: dict, user=Depends(verify_token)):
    if user["role"] != "labour":
        raise HTTPException(status_code=403, detail="Only labour can apply")

    data["user_email"] = user["email"]
    data["status"] = "pending"
    data["applied_at"] = datetime.utcnow()

    applications_collection.insert_one(data)
    return {"message": "Applied successfully"}

# ---------------- MY APPLICATIONS ----------------
@app.get("/my-applications")
def my_applications(user=Depends(verify_token)):
    return list(applications_collection.find(
        {"user_email": user["email"]},
        {"_id": 0}
    ))

# ---------------- SKILLS ----------------
@app.get("/skills")
def get_skills():
    return {"skills": ALLOWED_SKILLS}

# ---------------- CONNECTION SYSTEM ----------------
@app.post("/send-request/{receiver_email}")
def send_request(receiver_email: str, user=Depends(verify_token)):
    sender = user["email"]

    if sender == receiver_email:
        raise HTTPException(status_code=400, detail="Cannot send request to yourself")

    existing = connections_collection.find_one({
        "$or": [
            {"sender": sender, "receiver": receiver_email},
            {"sender": receiver_email, "receiver": sender}
        ]
    })

    if existing:
        raise HTTPException(status_code=400, detail="Request already exists")

    connections_collection.insert_one({
        "sender": sender,
        "receiver": receiver_email,
        "status": "pending",
        "created_at": datetime.utcnow()
    })

    return {"message": "Request sent"}

@app.post("/accept-request/{sender_email}")
def accept_request(sender_email: str, user=Depends(verify_token)):
    receiver = user["email"]

    result = connections_collection.update_one(
        {"sender": sender_email, "receiver": receiver, "status": "pending"},
        {"$set": {"status": "accepted"}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Request not found")

    return {"message": "Request accepted"}

@app.post("/reject-request/{sender_email}")
def reject_request(sender_email: str, user=Depends(verify_token)):
    receiver = user["email"]

    result = connections_collection.update_one(
        {"sender": sender_email, "receiver": receiver, "status": "pending"},
        {"$set": {"status": "rejected"}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Request not found")

    return {"message": "Request rejected"}

@app.get("/pending-requests")
def pending_requests(user=Depends(verify_token)):
    email = user["email"]

    return list(connections_collection.find(
        {"receiver": email, "status": "pending"},
        {"_id": 0}
    ))

@app.get("/connections")
def get_connections(user=Depends(verify_token)):
    email = user["email"]

    connections = list(connections_collection.find({
        "$or": [
            {"sender": email, "status": "accepted"},
            {"receiver": email, "status": "accepted"}
        ]
    }))

    result = []

    for conn in connections:
        if conn["sender"] == email:
            result.append(conn["receiver"])
        else:
            result.append(conn["sender"])

    return result