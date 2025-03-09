import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';

const PlayerCardPopup = ({ open, player, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Player Details</DialogTitle>
            <DialogContent>
                <Typography variant="h6">{player.Name}</Typography>
                <Typography>University: {player.University}</Typography>
                <Typography>Category: {player.Category}</Typography>
                <Typography>Total Runs: {player.Total_Runs}</Typography>
                <Typography>Innings Played: {player.Innings_Played}</Typography>
                <Typography>Wickets: {player.Wickets}</Typography>
                <Typography>Overs Bowled: {player.Overs_Bowled}</Typography>
                <Typography>Runs Conceded: {player.Runs_Conceded}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PlayerCardPopup;
