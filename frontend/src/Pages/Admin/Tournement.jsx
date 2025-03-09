import React, { useState, useEffect } from 'react';
import './Tournement.css'; // Assuming you will style the cards in this CSS file

function Tournament() {
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch player data from the provided API endpoint
  const fetchPlayerData = async () => {
    try {
      const response = await fetch('http://localhost:8000/tournament_summary');
      const data = await response.json();
      setPlayerData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching player data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayerData();
  }, []);

  // Calculate the tournament stats
  const calculateStats = () => {
    if (!playerData) return {};

    let totalRuns = playerData.totalRuns;
    let totalWickets = playerData.totalWickets;
    let highestRunScorer = playerData.highestRunScorer;
    let highestWicketTaker = playerData.highestWicketTaker;

    return { totalRuns, totalWickets, highestRunScorer, highestWicketTaker };
  };

  const stats = calculateStats();

  return (
    <div className="tournament-container">
      {/* Tournament Card */}
      <div className="tournament-card">
        <h2>Tournament One</h2>
        <p>Select Tournament One to view the overall player statistics.</p>
      </div>

      {/* Display loading or stats */}
      {loading ? (
        <p>Loading player data...</p>
      ) : (
        <div className="tournament-summary">
          <h2>Tournament Summary</h2>

          {/* Professional Card for Stats */}
          <div className="stats-card">
            <h3>Total Runs Scored</h3>
            <p>{stats.totalRuns}</p>
          </div>
          
          <div className="stats-card">
            <h3>Total Wickets Taken</h3>
            <p>{stats.totalWickets}</p>
          </div>

          <div className="stats-card">
            <h3>Highest Run Scorer</h3>
            <p>{stats.highestRunScorer.name} with {stats.highestRunScorer.runs} runs</p>
          </div>

          <div className="stats-card">
            <h3>Highest Wicket Taker</h3>
            <p>{stats.highestWicketTaker.name} with {stats.highestWicketTaker.wickets} wickets</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tournament;
