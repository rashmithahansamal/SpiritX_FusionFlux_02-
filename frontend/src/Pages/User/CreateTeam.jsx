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
  CircularProgress
} from "@mui/material";

function CreateTeam() {
  const [players, setPlayers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [team, setTeam] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalBudget, setTotalBudget] = useState(9000000); // Total budget: Rs. 9,000,000
  const [remainingBudget, setRemainingBudget] = useState(9000000); // Remaining budget
  const [errorMessage, setErrorMessage] = useState(""); // Error message state

  useEffect(() => {
    // Fetch players from the API
    const fetchPlayers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:8000/players");
        const data = await response.json();
        setPlayers(data);

        // Extract unique categories
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

  const calculatePlayerPrice = (player) => {
    let battingStrikeRate = (player.Total_Runs / player.Balls_Faced) * 100;
    let battingAverage = player.Total_Runs / player.Innings_Played;
    let bowlingStrikeRate = player.Wickets ? player.Overs_Bowled / player.Wickets : 0;
    let economyRate = player.Overs_Bowled ? (player.Runs_Conceded / player.Overs_Bowled) / 6 : 0;

    if (isNaN(battingStrikeRate) || battingStrikeRate === Infinity) battingStrikeRate = 0;
    if (isNaN(battingAverage) || battingAverage === Infinity) battingAverage = 0;
    if (isNaN(bowlingStrikeRate) || bowlingStrikeRate === Infinity) bowlingStrikeRate = 0;
    if (isNaN(economyRate) || economyRate === Infinity) economyRate = 0;

    const playerPoints = (battingStrikeRate / 5 + battingAverage * 0.8) + (bowlingStrikeRate / 500 + 140 / (economyRate || 1));
    
    return (9 * playerPoints + 100) * 1000;
  };

  const handleAddPlayer = (player) => {
    if (team.length < 11) {
      const playerPrice = calculatePlayerPrice(player);
      if (remainingBudget >= playerPrice) {
        setTeam([...team, { ...player, price: playerPrice }]);
        setRemainingBudget(remainingBudget - playerPrice);
        setErrorMessage(""); // Clear error message
      } else {
        setErrorMessage("Not enough budget to add this player!");
      }
    } else {
      setErrorMessage("You can only select 11 players for your team.");
    }
  };

  const handleRemovePlayer = (playerName) => {
    const playerToRemove = team.find(player => player.Name === playerName);
    setTeam(team.filter((player) => player.Name !== playerName));
    setRemainingBudget(remainingBudget + playerToRemove.price); // Add the player's price back to the remaining budget
  };

  // Filter players by selected category
  const filteredPlayers = players.filter(player => player.Category === selectedCategory);

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", color: "#1976d2" }}>
        Create Team
      </Typography>

      {/* Category Selection */}
      <FormControl fullWidth sx={{ marginBottom: 3 }}>
        <InputLabel>Select Category</InputLabel>
        <Select
          label="Select Category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: 1,
            boxShadow: 1,
            "& .MuiSelect-icon": {
              color: "#1976d2",
            },
          }}
        >
          {categories.map((category, index) => (
            <MenuItem key={index} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid container spacing={3} sx={{ marginTop: 2 }}>
        {/* Left side - Player cards */}
        <Grid item xs={12} md={8} sx={{ backgroundColor: "#e0e0e0", padding: 2, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ marginBottom: 2, color: "#1976d2" }}>
            Players in {selectedCategory}
          </Typography>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {filteredPlayers.map((player) => {
                const playerPrice = calculatePlayerPrice(player); // Get price for the player
                return (
                  <Grid item xs={12} sm={6} md={4} key={player.Name}>
                    <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6">{player.Name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {player.University}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Price: Rs:{playerPrice.toLocaleString()}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: "center" }}>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={() => handleAddPlayer(player)}
                          disabled={team.length >= 11 || remainingBudget < playerPrice}
                          sx={{
                            backgroundColor: "#1976d2",
                            "&:hover": {
                              backgroundColor: "#115293",
                            },
                          }}
                        >
                          Add to Team
                        </Button>
                      </CardActions>
                    </Card>
                    {/* Display error message if any */}
                    {errorMessage && (
                      <Typography color="error" variant="body2" sx={{ textAlign: "center", marginTop: 1 }}>
                        {errorMessage}
                      </Typography>
                    )}
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Grid>

        {/* Right side - Selected Team */}
        <Grid item xs={12} md={4} sx={{ backgroundColor: "#f1f1f1", padding: 2, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ marginBottom: 2, color: "#1976d2" }}>
            Your Team
          </Typography>
          {team.length === 0 ? (
            <Typography>No players added to the team yet.</Typography>
          ) : (
            <Grid container spacing={2}>
              {team.map((player, index) => (
                <Grid item xs={12} key={index}>
                  <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
                    <CardContent>
                      <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item xs={8}>
                          <Typography variant="h6">{`${index + 1}. ${player.Name}`}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {player.University}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Price: Rs {player.price.toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={4} sx={{ display: "flex", justifyContent: "flex-end" }}>
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => handleRemovePlayer(player.Name)}
                            sx={{
                              borderColor: "#d32f2f",
                              "&:hover": {
                                borderColor: "#b71c1c",
                              },
                            }}
                          >
                            Remove
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            Remaining Budget: Rs:{remainingBudget.toLocaleString()}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CreateTeam;
