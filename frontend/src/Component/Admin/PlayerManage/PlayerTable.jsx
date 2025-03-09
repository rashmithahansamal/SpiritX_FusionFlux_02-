import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TablePagination, MenuItem, Select, InputLabel, FormControl, IconButton, Box, Button } from '@mui/material';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AddPlayerPopup from './AddPlayerPopup';
import EditPlayerPopup from './EditPlayerPopup';
import DeletePlayerPopup from './DeletePlayerPopup';
import PlayerDetailsPopup from './PlayerCardPopup';  // Import PlayerDetailsPopup

const PlayerTable = ({ players, filteredPlayers, handleChangePage, handleFilterChange, page, rowsPerPage, handleAddPlayer, handleEditPlayer, handleDeletePlayer }) => {
    const [openAddPopup, setOpenAddPopup] = useState(false);
    const [openEditPopup, setOpenEditPopup] = useState(false);
    const [openDeletePopup, setOpenDeletePopup] = useState(false);
    const [openDetailsPopup, setOpenDetailsPopup] = useState(false); // State for details popup
    const [playerToEdit, setPlayerToEdit] = useState(null);
    const [playerToDelete, setPlayerToDelete] = useState(null);
    const [playerToView, setPlayerToView] = useState(null);  // State for selected player

    // Handle Open/Close of each popup
    const handleAddPopupOpen = () => setOpenAddPopup(true);
    const handleAddPopupClose = () => setOpenAddPopup(false);

    const handleEditPopupOpen = (player) => {
        setPlayerToEdit(player);
        setOpenEditPopup(true);
    };
    const handleEditPopupClose = () => setOpenEditPopup(false);

    const handleDeletePopupOpen = (player) => {
        setPlayerToDelete(player);
        setOpenDeletePopup(true);
    };
    const handleDeletePopupClose = () => setOpenDeletePopup(false);

    const handleDetailsPopupOpen = (player) => {
        setPlayerToView(player);
        setOpenDetailsPopup(true);
    };
    const handleDetailsPopupClose = () => setOpenDetailsPopup(false);

    return (
        <div>
            {/* Filter Section */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <div>
                    <FormControl sx={{ marginRight: '20px', minWidth: 120 }}>
                        <InputLabel>University</InputLabel>
                        <Select
                            value={handleFilterChange.university}
                            onChange={(e) => handleFilterChange({ university: e.target.value })}
                            label="University"
                        >
                            <MenuItem value="">All</MenuItem>
                            {Array.from(new Set(players.map(player => player.University))).map((uni, idx) => (
                                <MenuItem key={idx} value={uni}>{uni}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ marginRight: '20px', minWidth: 120 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={handleFilterChange.category}
                            onChange={(e) => handleFilterChange({ category: e.target.value })}
                            label="Category"
                        >
                            <MenuItem value="">All</MenuItem>
                            {Array.from(new Set(players.map(player => player.Category))).map((cat, idx) => (
                                <MenuItem key={idx} value={cat}>{cat}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                {/* Add New Player Button */}
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddPopupOpen}
                >
                    Add New Player
                </Button>
            </Box>

            {/* Table Section */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel>Player Name</TableSortLabel>
                            </TableCell>
                            <TableCell>University</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Total Runs</TableCell>
                            <TableCell>Innings Played</TableCell>
                            <TableCell>Wickets</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredPlayers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((player, index) => (
                            <TableRow key={index}>
                                <TableCell>{player.Name}</TableCell>
                                <TableCell>{player.University}</TableCell>
                                <TableCell>{player.Category}</TableCell>
                                <TableCell>{player.Total_Runs}</TableCell>
                                <TableCell>{player.Innings_Played}</TableCell>
                                <TableCell>{player.Wickets}</TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleEditPopupOpen(player)}
                                        size="small"
                                        sx={{ marginRight: '8px' }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDeletePopupOpen(player)}
                                        size="small"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton
                                        color="info"
                                        onClick={() => handleDetailsPopupOpen(player)} // Open details popup
                                        size="small"
                                    >
                                        <span>👁️</span> {/* Eye icon or any symbol you prefer */}
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination Section */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredPlayers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={(e) => handleFilterChange({ rowsPerPage: e.target.value })}
            />

            {/* Popups */}
            <AddPlayerPopup open={openAddPopup} handleClose={handleAddPopupClose} handleAddPlayer={handleAddPlayer} />
            <EditPlayerPopup open={openEditPopup} handleClose={handleEditPopupClose} player={playerToEdit} handleEditPlayer={handleEditPlayer} />
            <DeletePlayerPopup open={openDeletePopup} handleClose={handleDeletePopupClose} player={playerToDelete} handleDeletePlayer={handleDeletePlayer} />
            <PlayerDetailsPopup open={openDetailsPopup} handleClose={handleDetailsPopupClose} player={playerToView} />
        </div>
    );
};

export default PlayerTable;
