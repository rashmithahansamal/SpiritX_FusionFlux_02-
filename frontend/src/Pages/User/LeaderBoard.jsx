import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Container,
  Snackbar,
  Alert
} from "@mui/material";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("http://localhost:8000/leaderboard");
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data);
      } else {
        throw new Error("Failed to fetch leaderboard");
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setErrorMessage("Error fetching leaderboard. Please try again later.");
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const handleRetry = () => {
    setIsLoading(true);
    setErrorMessage("");
    fetchLeaderboard();
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh", padding: 3 }}>
      <Container>
        <Typography variant="h4" sx={{ textAlign: "center", marginBottom: 3 }}>
          Leaderboard
        </Typography>

        {isLoading ? (
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress color="primary" />
          </Box>
        ) : errorMessage ? (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" color="error" sx={{ marginBottom: 2 }}>
              {errorMessage}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleRetry}
            >
              Retry
            </Button>
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="leaderboard table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Rank</TableCell>
                  <TableCell align="center">Username</TableCell>
                  <TableCell align="center">Team</TableCell>
                  <TableCell align="center">Total Points</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboard.map((team, index) => (
                  <TableRow key={team.id} hover>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{team.username}</TableCell>
                    <TableCell align="center">{team.teamName}</TableCell>
                    <TableCell align="center">{team.totalPoints}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>

      <Box sx={{ textAlign: "center", marginTop: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={fetchLeaderboard}
        >
          Refresh Leaderboard
        </Button>
      </Box>

      {/* Snackbar for error */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Leaderboard;
