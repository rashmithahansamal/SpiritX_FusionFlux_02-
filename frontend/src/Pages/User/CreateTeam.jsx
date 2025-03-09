import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  TextField, // Import TextField for the team name input
} from "@mui/material";

function CreateTeam() {
  const [players, setPlayers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [team, setTeam] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [remainingBudget, setRemainingBudget] = useState(9000000);
  const [errorMessage, setErrorMessage] = useState("");
  const [teamName, setTeamName] = useState(""); // State for team name

  useEffect(() => {
    const fetchPlayers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:8000/players");
        const data = await response.json();
        setPlayers(data);
        const categories = [...new Set(data.map(player => player.Category))];
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching players:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const calculatePlayerPoints = (player) => {
    // Batting Strike Rate
    let battingStrikeRate = player.Balls_Faced > 0 ? (player.Total_Runs / player.Balls_Faced) * 100 : 0;
    // Batting Average
    let battingAverage = player.Innings_Played > 0 ? player.Total_Runs / player.Innings_Played : 0;
    // Bowling Strike Rate
    let bowlingStrikeRate = player.Wickets > 0 ? (player.Overs_Bowled * 6) / player.Wickets : 0;
    // Economy Rate
    let economyRate = (player.Overs_Bowled * 6) > 0 ? (player.Runs_Conceded / player.Overs_Bowled) * 6 : 0;

    // Handle division by zero
    let bowlingContribution = bowlingStrikeRate > 0 ? 500 / bowlingStrikeRate : 0;
    let economyContribution = economyRate > 0 ? 140 / economyRate : 0;

    // Player Points Calculation
    let playerPoints = (battingStrikeRate / 5 + battingAverage * 0.8) + (bowlingContribution + economyContribution);
    return parseFloat(playerPoints.toFixed(2));
  };

  const calculatePlayerValue = (playerPoints) => {
    return (9 * playerPoints + 100) * 1000;
  };

  const handleAddPlayer = (player) => {
    const playerPoints = calculatePlayerPoints(player);
    const playerValue = calculatePlayerValue(playerPoints);

    // Check if the player is already in the team
    if (team.some((p) => p.Name === player.Name)) {
      setErrorMessage("Player is already in the team.");
      return;
    }

    if (team.length < 11) {
      if (remainingBudget >= playerValue) {
        setTeam([...team, { ...player, points: playerPoints, value: playerValue }]);
        setRemainingBudget(remainingBudget - playerValue);
        setErrorMessage("");
      } else {
        setErrorMessage("Not enough budget to add this player.");
      }
    } else {
      setErrorMessage("You can only select 11 players for your team.");
    }
  };

  const handleRemovePlayer = (playerName) => {
    const player = team.find(player => player.Name === playerName);
    if (player) {
      setTeam(team.filter(player => player.Name !== playerName));
      setRemainingBudget(remainingBudget + player.value);
    }
  };

  const filteredPlayers = players.filter(player => player.Category === selectedCategory);
  const totalSpent = team.reduce((total, player) => total + player.value, 0);
  const teamCompleteness = `${team.length}/11 players selected`;

  // Calculate total points only when the team is completed
  const totalPoints = team.length === 11 ? team.reduce((total, player) => total + player.points, 0) : null;

  const handleSubmitTeam = async () => {
    const username = localStorage.getItem('username');
    if (!username) {
      setErrorMessage("Username is required.");
      return;
    }

    // Prepare data to send, including the team name
    const teamData = {
      username,
      team: team.map(player => player.Name),
      totalPoints,
      teamName, // Send the team name too
    };

    try {
      const response = await fetch("http://localhost:8000/team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teamData),
      });

      if (response.ok) {
        alert("Team submitted successfully!");
      } else {
        setErrorMessage("Failed to submit the team.");
      }
    } catch (error) {
      console.error("Error submitting team:", error);
      setErrorMessage("Error submitting the team.");
    }
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", color: "#1976d2" }}>
        Create Team
      </Typography>

      {/* Team Name Input */}
      <Typography variant="h6">Your Team</Typography>
      <TextField
        label="Team Name"
        variant="outlined"
        fullWidth
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        sx={{ marginBottom: 3 }}
      />

      <Typography variant="h6" sx={{ textAlign: "center", marginBottom: 2 }}>
        Team Completeness: {teamCompleteness}
      </Typography>

      <Typography variant="h6" sx={{ textAlign: "center", marginBottom: 2 }}>
        Remaining Budget: Rs. {remainingBudget.toLocaleString()}
      </Typography>

      <Typography variant="h6" sx={{ textAlign: "center", marginBottom: 2 }}>
        Total Spent: Rs. {totalSpent.toLocaleString()}
      </Typography>

      {/* Display total points only if the team is complete */}
      {totalPoints !== null && (
        <Typography variant="h6" sx={{ textAlign: "center", marginBottom: 2 }}>
          Total Points: {totalPoints}
        </Typography>
      )}

      {/* Display error message if any */}
      {errorMessage && (
        <Typography variant="body2" color="error" sx={{ textAlign: "center", marginBottom: 2 }}>
          {errorMessage}
        </Typography>
      )}

      <FormControl fullWidth sx={{ marginBottom: 3 }}>
        <InputLabel>Select Category</InputLabel>
        <Select value={selectedCategory} onChange={handleCategoryChange}>
          {categories.map((category, index) => (
            <MenuItem key={index} value={category}>{category}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Typography variant="h6">Players in {selectedCategory}</Typography>
          {isLoading ? <CircularProgress /> : (
            <Grid container spacing={2}>
              {filteredPlayers.map((player) => {
                const playerPoints = calculatePlayerPoints(player);
                const playerValue = calculatePlayerValue(playerPoints);
                return (
                  <Grid item xs={12} sm={6} md={4} key={player.Name}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">{player.Name}</Typography>
                        <Typography variant="body2">{player.University}</Typography>
                        <Typography variant="body2">Points: {playerPoints}</Typography> {/* Show points instead of value */}
                      </CardContent>
                      <CardActions>
                        <Button variant="contained" color="primary" fullWidth onClick={() => handleAddPlayer(player)}
                          disabled={team.length >= 11 || remainingBudget < playerValue}>
                          Add to Team
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Grid>

        <Grid item xs={12} md={4} sx={{ backgroundColor: "#f0f0f0", padding: 2 }}>
          <Typography variant="h6">Your Team</Typography>
          {team.length === 0 ? <Typography>No players added yet.</Typography> : (
            <Grid container spacing={2}>
              {team.map((player, index) => (
                <Grid item xs={12} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{index + 1}. {player.Name}</Typography>
                      <Typography variant="body2">{player.University}</Typography>
                      <Typography variant="body2">Points: {player.points}</Typography>
                    </CardContent>
                    <CardActions>
                      <Button variant="outlined" color="secondary" onClick={() => handleRemovePlayer(player.Name)}>
                        Remove
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Submit Team Button */}
          <Box sx={{ marginTop: 2, textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitTeam}
              disabled={team.length !== 11 || !teamName} // Disable if team name is not provided
            >
              Submit Team
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CreateTeam;
