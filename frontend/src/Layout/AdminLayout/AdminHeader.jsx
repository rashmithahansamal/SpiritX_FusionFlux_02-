import React from 'react';
import { AppBar, Toolbar, Button, Menu, MenuItem, IconButton, TextField, InputAdornment } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';  // Correct import
import SearchIcon from '@mui/icons-material/Search';  // Correct import for SearchIcon
import { Link } from 'react-router-dom';

const AdminHeader = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchText, setSearchText] = React.useState('');

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'black' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo */}
        <img
          src="https://cdn.pixabay.com/photo/2020/05/17/05/11/sports-5180019_960_720.png"
          alt="Logo"
          width="40"
          height="40"
        />

        {/* Search Bar */}
        <TextField
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search Players..."
          sx={{
            width: '300px',
            height: '45px',
            backgroundColor: 'white',
            borderRadius: '4px',
            marginRight: '20px',
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <div style={{ display: 'flex', alignItems: 'space-evenly' }}>
          <Button color="inherit" component={Link} to="/players">Players</Button>
          <Button color="inherit" component={Link} to="/tournaments">Tournaments</Button>
          <Button color="inherit" component={Link} to="/aboutus">About Us</Button>
        </div>

        {/* Profile Dropdown */}
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleProfileMenuOpen}
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
        >
          <AccountCircle />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
        >
          <MenuItem onClick={handleProfileMenuClose}>Profile Settings</MenuItem>
          <MenuItem onClick={handleProfileMenuClose}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;
