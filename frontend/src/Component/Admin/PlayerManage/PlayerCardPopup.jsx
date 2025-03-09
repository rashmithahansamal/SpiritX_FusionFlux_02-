import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, Box, Grid } from '@mui/material';

const PlayerDetailItem = ({ label, value, fullWidth = false, highlight = false }) => (
  <Grid item xs={fullWidth ? 12 : 6}>
    <Typography 
      variant="h6" 
      sx={{ 
        fontWeight: 'bold', 
        marginBottom: '5px', 
        ...(highlight && { color: '#ff6347', fontSize: '1.2rem' })
      }}
    >
      {label}
    </Typography>
    <Typography variant="body1">{value}</Typography>
  </Grid>
);

const PlayerDetailsPopup = ({ open, handleClose, player }) => {
  if (!player) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth sx={{ backdropFilter: 'blur(5px)' }}>
        <DialogTitle sx={{ backgroundColor: '#000', color: '#fff', textAlign: 'center' }}>Player Details</DialogTitle>
        <DialogContent sx={{ padding: '20px' }}>
          <Typography variant="body1" color="textSecondary">No player selected.</Typography>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#f4f6f8', padding: '10px' }}>
          <Button onClick={handleClose} color="primary" variant="contained" sx={{ width: '100%' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  let battingStrikeRate = (player.Total_Runs / player.Balls_Faced) * 100;
  let battingAverage = player.Total_Runs / player.Innings_Played;
  let bowlingStrikeRate = player.Wickets ? player.Overs_Bowled / player.Wickets : 0;
  let economyRate = player.Overs_Bowled ? (player.Runs_Conceded / player.Overs_Bowled) / 6 : 0;

  if (isNaN(battingStrikeRate) || battingStrikeRate === Infinity) battingStrikeRate = 0;
  if (isNaN(battingAverage) || battingAverage === Infinity) battingAverage = 0;
  if (isNaN(bowlingStrikeRate) || bowlingStrikeRate === Infinity) bowlingStrikeRate = 0;
  if (isNaN(economyRate) || economyRate === Infinity) economyRate = 0;

  const playerPoints = (battingStrikeRate / 5 + battingAverage * 0.8) + (bowlingStrikeRate / 500 + 140 / (economyRate || 1));

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth sx={{ backdropFilter: 'blur(5px)' }}>
      <DialogTitle sx={{ backgroundColor: '#000', color: '#fff', textAlign: 'center' }}>Player Details</DialogTitle>
      <DialogContent sx={{ padding: '20px' }}>
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '5px' }}>Name</Typography>
              <Typography variant="body1">{player.Name}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '1.1rem' }}>Player Points</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: '5px', color: '#DC143C', fontSize: '1.3rem' }}>{playerPoints.toFixed(2)}</Typography>
            </Grid>
            
            {/* Group Details */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '5px' }}>Group Details</Typography>
            </Grid>
            <PlayerDetailItem label="Category" value={player.Category} />
            <PlayerDetailItem label="Total Runs" value={player.Total_Runs} />
            <PlayerDetailItem label="Balls Faced" value={player.Balls_Faced} />
            <PlayerDetailItem label="Innings Played" value={player.Innings_Played} />
            <PlayerDetailItem label="Wickets" value={player.Wickets} />
            <PlayerDetailItem label="Overs Bowled" value={player.Overs_Bowled} />
            <PlayerDetailItem label="Runs Conceded" value={player.Runs_Conceded} />
            
            {/* Statistics */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '5px' }}>Statistics</Typography>
            </Grid>
            <PlayerDetailItem label="Batting Strike Rate" value={battingStrikeRate.toFixed(2)} />
            <PlayerDetailItem label="Batting Average" value={battingAverage.toFixed(2)} />
            <PlayerDetailItem label="Bowling Strike Rate" value={bowlingStrikeRate.toFixed(2)} />
            <PlayerDetailItem label="Economy Rate" value={economyRate.toFixed(2)} />
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: '#f4f6f8', padding: '10px' }}>
        <Button onClick={handleClose} color="primary" variant="contained" sx={{ width: '100%' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlayerDetailsPopup;
