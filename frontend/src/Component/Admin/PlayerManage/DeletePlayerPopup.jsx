import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import axios from 'axios';

const DeletePlayerPopup = ({ open, handleClose, player }) => {
    const handleSubmit = async () => {
        try {
            await axios.delete(`http://localhost:8000/players/${player.Name}`);
            handleClose();  // Close popup after deleting player
        } catch (error) {
            console.error('Error deleting player:', error);
        }
        window.location.reload();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Delete Player</DialogTitle>
            <DialogContent>
                Are you sure you want to delete the player {player?.Name}?
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">Cancel</Button>
                <Button onClick={handleSubmit} color="error">Delete</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeletePlayerPopup;
