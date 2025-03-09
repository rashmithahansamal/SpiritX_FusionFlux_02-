import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlayerTable from '../../Component/User/PlayerDetails/PlayerTable';

const PlayerDetails = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [universityFilter, setUniversityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Fetch players data from the FastAPI backend
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/players');
        setPlayers(response.data);
        setFilteredPlayers(response.data); // Initially show all players
      } catch (error) {
        console.error('Error fetching player data:', error);
      }
    };

    fetchPlayers();
  }, []);

  useEffect(() => {
    // Filter players based on search text, university, and category
    const filtered = players.filter(player => 
      (player.Name.toLowerCase().includes(searchText.toLowerCase()) ||
      player.University.toLowerCase().includes(searchText.toLowerCase()) ||
      player.Category.toLowerCase().includes(searchText.toLowerCase())) &&
      (universityFilter ? player.University === universityFilter : true) &&
      (categoryFilter ? player.Category === categoryFilter : true)
    );
    setFilteredPlayers(filtered);
  }, [searchText, universityFilter, categoryFilter, players]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleFilterChange = (filter) => {
    if (filter.university !== undefined) setUniversityFilter(filter.university);
    if (filter.category !== undefined) setCategoryFilter(filter.category);
    if (filter.rowsPerPage !== undefined) setRowsPerPage(filter.rowsPerPage);
  };

  // Clear search text
  const clearSearch = () => {
    setSearchText('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Player Details</h2>

      {/* Custom Search Section */}
      <div style={styles.searchWrapper}>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={styles.searchInput}
          placeholder="Search by Name, University, or Category"
        />
        {searchText && (
          <button onClick={clearSearch} style={styles.clearButton}>
            X
          </button>
        )}
      </div>

      {/* Player Table */}
      <PlayerTable
        players={players}
        filteredPlayers={filteredPlayers}
        handleChangePage={handleChangePage}
        handleFilterChange={handleFilterChange}
        page={page}
        rowsPerPage={rowsPerPage}
      />
    </div>
  );
};

const styles = {
  searchWrapper: {
    position: 'relative',
    marginBottom: '20px',
    width: '300px',
  },
  searchInput: {
    marginTop: '20px',
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  clearButton: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#888',
    cursor: 'pointer',
    fontSize: '18px',
  },
};

export default PlayerDetails;
