import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TablePagination, MenuItem, Select, InputLabel, FormControl, IconButton, Box, Paper } from '@mui/material';
import PlayerDetailsPopup from './PlayerCardPopup';

const PlayerTable = ({ players, filteredPlayers, handleChangePage, handleFilterChange, page, rowsPerPage }) => {
    const [openDetailsPopup, setOpenDetailsPopup] = useState(false);
    const [playerToView, setPlayerToView] = useState(null);

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
                                        color="info"
                                        onClick={() => handleDetailsPopupOpen(player)}
                                        size="small"
                                    >
                                        <span>👁️</span>
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

            {/* Player Details Popup */}
            <PlayerDetailsPopup open={openDetailsPopup} handleClose={handleDetailsPopupClose} player={playerToView} />
        </div>
    );
};

export default PlayerTable;
