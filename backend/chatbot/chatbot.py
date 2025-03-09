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

file_path = "/Users/rashmithahansamal/Documents/ChatBot/sample_data.csv" 
df = pd.read_csv(file_path)

# Function to calculate player points
def calculate_player_points(row):
    # Batting Strike Rate
    batting_strike_rate = (row['Total Runs'] / row['Balls Faced']) * 100 if row['Balls Faced'] > 0 else 0
    # Batting Average
    batting_average = row['Total Runs'] / row['Innings Played'] if row['Innings Played'] > 0 else 0
    # Bowling Strike Rate
    bowling_strike_rate = (row['Overs Bowled']*6) / row['Wickets'] if row['Wickets'] > 0 else 0
    # Economy Rate
    economy_rate = (row['Runs Conceded'] / (row['Overs Bowled'])*6) * 6 if (row['Overs Bowled'])*6 > 0 else 0

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
        - `attribute` (str): what attribute of the player to retrieve (eg. University,Category,Total Runs,Balls Faced,Innings Played,Wickets,Overs Bowled,Runs Conceded, etc.)
       
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

SYSTEM_PROMPT = """You are a cricket assistant. Use available tools in sequence when needed. when user asks unrelated questions ignore answering. try to be limited to the capabilities of the given tools. but do greetings and be nice to the user. if user asks information about a player that cannot be answered by given tool say "I don’t have enough knowledge to answer that question."
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