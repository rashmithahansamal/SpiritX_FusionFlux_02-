import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import axios from 'axios';

const EditPlayerPopup = ({ open, handleClose, player }) => {
    const [name, setName] = useState('');
    const [university, setUniversity] = useState('');
    const [category, setCategory] = useState('');
    const [totalRuns, setTotalRuns] = useState(0);
    const [ballsFaced, setBallsFaced] = useState(0);
    const [inningsPlayed, setInningsPlayed] = useState(0);
    const [wickets, setWickets] = useState(0);
    const [oversBowled, setOversBowled] = useState(0);
    const [runsConceded, setRunsConceded] = useState(0);

    useEffect(() => {
        if (player) {
            setName(player.Name);
            setUniversity(player.University);
            setCategory(player.Category);
            setTotalRuns(player.Total_Runs);
            setBallsFaced(player.Balls_Faced);
            setInningsPlayed(player.Innings_Played);
            setWickets(player.Wickets);
            setOversBowled(player.Overs_Bowled);
            setRunsConceded(player.Runs_Conceded);
        }
    }, [player]);

    const handleSubmit = async () => {
        const updatedPlayer = {
            Name: name,
            University: university,
            Category: category,
            Total_Runs: totalRuns,
            Balls_Faced: ballsFaced,
            Innings_Played: inningsPlayed,
            Wickets: wickets,
            Overs_Bowled: oversBowled,
            Runs_Conceded: runsConceded
        };

        try {
            await axios.put(`http://localhost:8000/players/${name}`, updatedPlayer);
            handleClose(); // Close popup after updating player
        } catch (error) {
            console.error('Error updating player:', error);
        }
        window.location.reload();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit Player</DialogTitle>
            <DialogContent>
                <TextField
                    label="Name"
                    fullWidth
                    margin="dense"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    label="University"
                    fullWidth
                    margin="dense"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                />
                <TextField
                    label="Category"
                    fullWidth
                    margin="dense"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                <TextField
                    label="Total Runs"
                    fullWidth
                    margin="dense"
                    type="number"
                    value={totalRuns}
                    onChange={(e) => setTotalRuns(e.target.value)}
                />
                <TextField
                    label="Balls Faced"
                    fullWidth
                    margin="dense"
                    type="number"
                    value={ballsFaced}
                    onChange={(e) => setBallsFaced(e.target.value)}
                />
                <TextField
                    label="Innings Played"
                    fullWidth
                    margin="dense"
                    type="number"
                    value={inningsPlayed}
                    onChange={(e) => setInningsPlayed(e.target.value)}
                />
                <TextField
                    label="Wickets"
                    fullWidth
                    margin="dense"
                    type="number"
                    value={wickets}
                    onChange={(e) => setWickets(e.target.value)}
                />
                <TextField
                    label="Overs Bowled"
                    fullWidth
                    margin="dense"
                    type="number"
                    value={oversBowled}
                    onChange={(e) => setOversBowled(e.target.value)}
                />
                <TextField
                    label="Runs Conceded"
                    fullWidth
                    margin="dense"
                    type="number"
                    value={runsConceded}
                    onChange={(e) => setRunsConceded(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">Cancel</Button>
                <Button onClick={handleSubmit} color="primary">Save Changes</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditPlayerPopup;
