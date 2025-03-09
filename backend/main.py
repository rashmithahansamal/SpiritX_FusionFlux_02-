from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import csv
import os
import mysql.connector
import uvicorn
from hashlib import sha256  # Use hashing for password security

# FastAPI app instance
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Chathumal@12",
        database="Project1"
    )

# CSV File Path
CSV_FILE = "./sample_data.csv"

def read_csv():
    players = []
    if os.path.exists(CSV_FILE):
        with open(CSV_FILE, mode="r", newline="", encoding="utf-8") as file:
            reader = csv.DictReader(file)
            for row in reader:
                row = {key.replace(" ", "_"): value for key, value in row.items()}
                players.append(row)
    return players

def write_csv(players):
    with open(CSV_FILE, mode="w", newline="", encoding="utf-8") as file:

        fieldnames = ["Name", "University", "Category", "Total_Runs", "Balls_Faced", "Innings_Played", "Wickets", "Overs_Bowled", "Runs_Conceded"]
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()


        for player in players:
            player = {key.replace(" ", "_"): value for key, value in player.items()}  # Replace spaces with underscores
            writer.writerow(player)

# Player model
class Player(BaseModel):
    Name: str
    University: str
    Category: str
    Total_Runs: int
    Balls_Faced: int
    Innings_Played: int
    Wickets: int
    Overs_Bowled: float
    Runs_Conceded: int

@app.get("/players")
def get_players():
    return read_csv()

@app.post("/players")
def add_player(player: Player):
    players = read_csv()
    players.append(player.dict())
    write_csv(players)
    return {"message": "Player added successfully"}

@app.put("/players/{name}")
def update_player(name: str, updated_player: Player):
    players = read_csv()
    for player in players:
        if player["Name"] == name:
            player.update(updated_player.dict())
            write_csv(players)
            return {"message": "Player updated successfully"}
    raise HTTPException(status_code=404, detail="Player not found")

@app.delete("/players/{name}")
def delete_player(name: str):
    players = read_csv()
    filtered_players = [p for p in players if p["Name"] != name]
    
    if len(filtered_players) == len(players):  # No player was deleted
        raise HTTPException(status_code=404, detail="Player not found")
    
   
    write_csv(filtered_players)
    
    return {"message": "Player deleted successfully"}


class LoginRequest(BaseModel):
    username: str
    password: str

# Request model for registration
class SignupRequest(BaseModel):
    username: str
    email: str
    password: str
    confirm_password: str

# Endpoint for login
@app.post("/login")
async def login(request: LoginRequest):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Fetch user from DB
    cursor.execute("SELECT username, password,role FROM users WHERE username = %s", (request.username,))
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    # Hash the entered password and compare it with the stored hash
    hashed_input_password = sha256(request.password.encode()).hexdigest()

    if not user :
        raise HTTPException(status_code=401, detail="Invalid username user not found")
    elif  user["password"] != hashed_input_password:
        raise HTTPException(status_code=401, detail="Invalid Password")
    return {"message": "Login successful","role":user["role"]}

# Endpoint for signup
@app.post("/signup")
async def signup(request: SignupRequest):
    # Check if passwords match
    if request.password != request.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    # Hash password before saving
    hashed_password = sha256(request.password.encode()).hexdigest()

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Check if username already exists
    cursor.execute("SELECT username FROM users WHERE username = %s", (request.username,))
    existing_user = cursor.fetchone()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    # Insert new user into database
    cursor.execute(
        "INSERT INTO users (username, password) VALUES (%s, %s)",
        (request.username, hashed_password)
    )
    conn.commit()

    cursor.close()
    conn.close()

    return {"message": "User registered successfully"}
    
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
