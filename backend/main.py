from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import csv
import os
import mysql.connector
import uvicorn
from hashlib import sha256

import asyncio
import pandas as pd
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.memory import ConversationBufferMemory
from langchain.tools import tool,Tool
import os
from dotenv import load_dotenv
from datetime import datetime
from langchain_core.tools import StructuredTool
from pydantic import BaseModel

# from chatbot.chatbot import get_chatbot_response  # Use hashing for password security

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

# Tournament summary endpoint
@app.get("/tournament_summary")
def get_tournament_summary():
    players = read_csv()

    total_runs = 0
    total_wickets = 0
    highest_run_scorer = {"name": "", "runs": 0}
    highest_wicket_taker = {"name": "", "wickets": 0}

    # Calculate tournament stats
    for player in players:
        total_runs += int(player["Total_Runs"])
        total_wickets += int(player["Wickets"])

        if int(player["Total_Runs"]) > highest_run_scorer["runs"]:
            highest_run_scorer = {"name": player["Name"], "runs": int(player["Total_Runs"])}

        if int(player["Wickets"]) > highest_wicket_taker["wickets"]:
            highest_wicket_taker = {"name": player["Name"], "wickets": int(player["Wickets"])}

    summary = {
        "totalRuns": total_runs,
        "totalWickets": total_wickets,
        "highestRunScorer": highest_run_scorer,
        "highestWicketTaker": highest_wicket_taker
    }

    return summary

# Chatbot Request Model
class ChatbotRequest(BaseModel):
    user_id: int
    query: str

# Chatbot Response Model
class ChatbotResponse(BaseModel):
    response: str

# Chatbot Endpoint
@app.post("/chatbot", response_model=ChatbotResponse)
async def chatbot_interaction(request: ChatbotRequest):
    try:
        response = await get_chatbot_response(request.user_id, request.query)
        print(response)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0.7,
    google_api_key="AIzaSyDGNbax6ek2f7G4U9phb_QxgjdSob9XnYw"
)

class Get_best_team(BaseModel):
    user_id: int
    batsman_count: int
    bowler_count: int
    allrounder_count: int

class Get_player_information(BaseModel):
    user_id: int
    player_name: str
    attribute: str


class Get_player_details(BaseModel):
    user_id: int
    player_name: str
    

# # Correct relative path to access the CSV file
# df = pd.read_csv(os.path.join(os.path.dirname(__file__), '..', 'sample_data.csv'))
# print(df.head())

# file_path = "/Users/rashmithahansamal/Documents/ChatBot/sample_data.csv" 
df = pd.read_csv(CSV_FILE)
print(df.head())

# Function to calculate player points
def calculate_player_points(row):
    # Batting Strike Rate
    batting_strike_rate = (row['Total_Runs'] / row['Balls_Faced']) * 100 if row['Balls_Faced'] > 0 else 0
    # Batting Average
    batting_average = row['Total_Runs'] / row['Innings_Played'] if row['Innings_Played'] > 0 else 0
    # Bowling Strike Rate
    bowling_strike_rate = (row['Overs_Bowled']*6) / row['Wickets'] if row['Wickets'] > 0 else 0
    # Economy Rate
    economy_rate = (row['Runs_Conceded'] / (row['Overs_Bowled'])*6) * 6 if (row['Overs_Bowled'])*6 > 0 else 0

    # Handle division by zero
    bowling_contribution = (500 / bowling_strike_rate) if bowling_strike_rate > 0 else 0
    economy_contribution = (140 / economy_rate) if economy_rate > 0 else 0

    
    # Player Points Calculation
    points = ((batting_strike_rate / 5) + (batting_average * 0.8)) + (bowling_contribution +  economy_contribution)
    return points

# Function to calculate player value
def calculate_player_value(points):
    value = (9 * points + 100) * 1000
    return round(value, -5)  # Round to nearest multiple of 50,000


    

async def get_best_11_players(user_id:int,batsman_count:int,bowler_count:int,allrounder_count:int):

    # Apply player points calculation
    df['Player Points'] = df.apply(calculate_player_points, axis=1)
    df['Player Value'] = df['Player Points'].apply(calculate_player_value)

     # Sort players by Player Points within each category
    batsmen = df[df['Category'] == 'Batsman'].sort_values(by='Player Points', ascending=False)
    bowlers = df[df['Category'] == 'Bowler'].sort_values(by='Player Points', ascending=False)
    all_rounders = df[df['Category'] == 'All-Rounder'].sort_values(by='Player Points', ascending=False)

     # Select the best players:
    selected_batsmen = batsmen.head(batsman_count)  # Choose top 5 batsmen
    selected_bowlers = bowlers.head(bowler_count)  # Choose top 4 bowlers
    selected_all_rounders = all_rounders.head(allrounder_count)  # Choose top 2 all-rounder (can adjust based on needs)

    # Combine selected players
    selected_players = pd.concat([selected_batsmen, selected_bowlers, selected_all_rounders])

     # Extract player names and join them into a comma-separated string
    player_names = selected_players['Name'].tolist()
    player_names_str = ', '.join(player_names)
    print(player_names_str)
    return f"Best 11 players are: {player_names_str}"


async def get_player_information(user_id,player_name, attribute):
    # Convert the player name to lowercase for case-insensitive matching
    player_name = player_name.lower()
    
    # Check if the player exists in the dataset
    player_data = df[df['Name'].str.lower() == player_name]
    
    if not player_data.empty:
        # Check if the attribute exists in the DataFrame
        if attribute in player_data.columns:
            value = player_data[attribute].values[0]
            return f"{player_data['Name'].values[0]}'s {attribute} is {value}."
        else:
            return f"Attribute '{attribute}' not found for {player_data['Name'].values[0]}."
    else:
        return f"Player '{player_name}' not found in the dataset."
    

async def get_player_details(user_id,player_name):
    player_name = player_name.lower()
    player_data = df[df['Name'].str.lower() == player_name]
    
    if not player_data.empty:
        player_details = player_data.iloc[0].to_dict()
        response = f"Details for {player_details['Name']}:\n"
        for key, value in player_details.items():
            response += f"{key}: {value}\n"
        
        return response.strip()  # Returns a clean string
    else:
        return f"Player '{player_name}' not found in the dataset."



tools = [
     StructuredTool(
        name="get_best_11_players",
        func=get_best_11_players,
        description="""Retrieves best 11 players.
        **Parameters:**
        - `user_id` (int): Unique identifier of the user.
        - `batsman_count` (int): number of batsman for the team. if not given give default as 5
        - `bowler_count` (int): number of bowlers for the team. if not given give default as 4
        - `allrounder_count` (int): number of allrounders for the team. if not given give default as 2
        **Usage Example:**
        If a user asks: *"what is the best possible team ? I want 1 batsman, 4 bowlers and 6 allrounders."*
        The function will be called as:
        ```python
        get_best_11_players(user_id=1, batsman_count=1, bowler_count=4, allrounder_count=6)
        ```
        If a user asks: *"what is the best possible team? "*
        The function will be called as:
        ```python
        get_best_11_players(user_id=1, batsman_count=5, bowler_count=4, allrounder_count=2)
        ```
        The function returns best 11 players.
        """,
        args_schema=Get_best_team,
        coroutine=get_best_11_players
    ),
    StructuredTool(
        name="get_player_information",
        func=get_player_information,
        description="""Retrieves information about a player.Specified attribute of the player is returned.
        **Parameters:**
        - `user_id` (int): Unique identifier of the user.
        - `player_name` (str): name of the player
        - `attribute` (str): what attribute of the player to retrieve (eg. University,Category,Total_Runs,Balls_Faced,Innings_Played,Wickets,Overs_Bowled,Runs_Conceded, etc.)
       
        **Usage Example:**
        If a user asks: *"what uiniversity chamika chandimal is in?"*
        The function will be called as:
        ```python
        get_information_of_players(user_id=1, player_name="chamika chandimal", attribute="University")
        ```
        If a user asks: *"give me the catagory of the player Avishka Mendis"*
        The function will be called as:
        ```python
        get_information_of_players(user_id=1, player_name="Avishka Mendis",attribute="Category" )
        The function returns information about players.
        """,
        args_schema=Get_player_information,
        coroutine=get_player_information
    ),
     StructuredTool(
        name="get_player_details",
        func=get_player_details,
        description="""Retrieves whole information about a player. all attributes of the player is returned.
        **Parameters:**
        - `user_id` (int): Unique identifier of the user.
        - `player_name` (str): name of the player
        
       
        **Usage Example:**
        If a user asks: *"Give me chamika chandimal Details?"*
        The function will be called as:
        ```python
        get_player_details(user_id=1, player_name="chamika chandimal")
        ```
        If a user asks: *"give me the Details of  Avishka Mendis?"*
        The function will be called as:
        ```python
       get_player_details(user_id=1, player_name="Avishka Mendis")
        The function returns complete Details about players.
        """,
        args_schema=Get_player_details,
        coroutine=get_player_details
    )

    
]

SYSTEM_PROMPT = """You are a cricket assistant. Use available tools in sequence when needed. when user asks unrelated questions ignore answering. try to be limited to the capabilities of the given tools. but do greetings and be nice to the user. if user asks information about a player that cannot be answered by given tool say "I don’t have enough knowledge to answer that question.".Ensure the chatbot does not reveal player’s points under any circumstances.
You can use multiple tools for complex requests. Follow this pattern:
1. Understand the query
2. Identify required tools
3. extract parameters if needed.
4. Use tools sequentially
5. Combine results for final answer"""

prompt = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_PROMPT),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad"),
])

memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

# create agent
agent = create_tool_calling_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, memory=memory, verbose=True,max_iterations=3,handle_parsing_errors=True,early_stopping_method="generate",return_intermediate_steps=False)









async def get_chatbot_response(user_id: int, query: str) -> str:
    
    
    
    enriched_query = f"Query: {query}"
    
    response = await agent_executor.ainvoke({
        "input": enriched_query
    })
    
    
    return response["output"]



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
    cursor.execute("SELECT username, password, role FROM users WHERE username = %s", (request.username,))
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    # Hash the entered password and compare it with the stored hash
    hashed_input_password = sha256(request.password.encode()).hexdigest()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid username, user not found")
    elif user["password"] != hashed_input_password:
        raise HTTPException(status_code=401, detail="Invalid Password")
    return {"message": "Login successful", "role": user["role"]}

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

class Team(BaseModel):
    username: str
    team: list[str]
    totalPoints: float
    teamName: str  # Added team name field

@app.post("/team")
async def submit_team(team_data: Team):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Insert team data into the 'teams' table including the team name
    try:
        cursor.execute("""
            INSERT INTO teams (username, team, totalPoints, teamName)
            VALUES (%s, %s, %s, %s)
        """, (team_data.username, ",".join(team_data.team), team_data.totalPoints, team_data.teamName))
        conn.commit()
        return {"message": "Team submitted successfully!"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error inserting team into database: {str(e)}")
    finally:
        cursor.close()
        conn.close()

# Example of getting teams (optional)
@app.get("/leaderboard")
async def get_teams():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Fetch all teams from the 'teams' table
    cursor.execute("SELECT * FROM teams")
    teams = cursor.fetchall()

    cursor.close()
    conn.close()

    return teams


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
