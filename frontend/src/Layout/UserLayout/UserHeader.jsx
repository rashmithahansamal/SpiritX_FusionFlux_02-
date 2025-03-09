import React from 'react';
import { AppBar, Toolbar, Button, Menu, MenuItem, IconButton, TextField, InputAdornment, Typography } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';

const AdminHeader = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchText, setSearchText] = React.useState('');
  const userName = "John Doe"; // Example username, replace with actual user name dynamically

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login');
    window.location.reload();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'black', paddingLeft: '20px', paddingRight: '20px' }}>
      <div style={{ display: 'block', margin: 'auto', width: '60%', height: '80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', flex: 1, paddingTop: '15px' }}>
          {/* Logo */}
         <Link to={"/"}> <img
            src="https://cdn.pixabay.com/photo/2020/05/17/05/11/sports-5180019_960_720.png"
            alt="Logo"
            width="40"
            height="40"
            style={{ marginRight: '40px' }} // Increased margin for more space
          /></Link>
          
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
              marginRight: '40px', // Increased margin for more space
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* Navigation Links */}
          <div style={{ display: 'flex', gap: '30px' }}> {/* Increased gap between links */}
            <Button color="inherit" component={Link} to="/PlayerDetails">Players</Button>
            <Button color="inherit" component={Link} to="/createteam">Create Team</Button>
            <Button color="inherit" component={Link} to="/aboutus">About Us</Button>
          </div>

          {/* Profile Section */}
          <div style={{ display: 'flex', alignItems: 'center',cursor:'pointer' }} onClick={handleProfileMenuOpen}>
            <Typography variant="body1" color="white" sx={{ marginRight: '10px' }}>
              {localStorage.getItem('username') || userName}
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
            >
              <AccountCircle sx={{ width: '40px', height: '40px' }} />
            </IconButton>
          </div>

          {/* Profile Menu */}
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={handleProfileMenuClose}>Profile Settings</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </div>
    </AppBar>
  );
};

export default AdminHeader;
