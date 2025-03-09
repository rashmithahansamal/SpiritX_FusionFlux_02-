import React from 'react';
import { Box, Typography, Grid, Card, CardContent, LinearProgress, Divider, Button } from '@mui/material';

const UserHomeScreen = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '80%', margin: 'auto', mt: 4, bgcolor: '#f4f6f8', p: 3, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom color="primary" align="center" sx={{ fontWeight: 'bold' }}>
        Welcome to Your Dashboard
      </Typography>
      <Typography variant="body1" color="textSecondary" mb={4} align="center" sx={{ fontSize: '1.1rem' }}>
        Manage your team, track your budget, and stay updated with upcoming matches.
      </Typography>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 3 }} justifyContent="center">
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#ffeb3b', boxShadow: 5, '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.3s ease-in-out' } }}>
            <CardContent>
              <Typography variant="h6" color="textPrimary" align="center" sx={{ fontWeight: 'bold' }}>
                Total Budget
              </Typography>
              <Typography variant="h5" color="secondary" align="center" sx={{ fontWeight: 'bold' }}>
                RS 900,000
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
                Your total available budget for team building and operations.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#4caf50', color: 'white', boxShadow: 5, '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.3s ease-in-out' } }}>
            <CardContent>
              <Typography variant="h6" align="center" sx={{ fontWeight: 'bold' }}>
                Team Progress
              </Typography>
              <Typography variant="h5" align="center" sx={{ fontWeight: 'bold' }}>
                2 / 11
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
                Track the progress of your team composition and selection.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#2196f3', color: 'white', boxShadow: 5, '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.3s ease-in-out' } }}>
            <CardContent>
              <Typography variant="h6" align="center" sx={{ fontWeight: 'bold' }}>
                Upcoming Matches
              </Typography>
              <Typography variant="body1" align="center">
                Team Kelaniya vs Team Moratuwa - March 15
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
                Stay updated on when your team is playing next and plan accordingly.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* New Sections Below the Grid */}
      <Box mt={4}>
        {/* Team Strategy Section */}
        <Typography variant="h5" color="secondary" align="center" sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
          Team Strategy
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={2} align="center" sx={{ fontSize: '1.05rem', maxWidth: '600px', margin: 'auto' }}>
          Outline the key objectives and strategic goals for your team to ensure they stay focused on the right tasks.
        </Typography>
        <LinearProgress variant="determinate" value={50} sx={{ mb: 2, height: 10, borderRadius: 5, bgcolor: '#ddd' }} />
        <Typography variant="body2" color="textSecondary" align="center" sx={{ fontSize: '0.9rem' }}>50% of strategic goals achieved</Typography>
      </Box>

      <Box mt={4}>
        {/* Budget Utilization Section */}
        <Typography variant="h5" color="secondary" align="center" sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
          Budget Utilization
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={2} align="center" sx={{ fontSize: '1.05rem', maxWidth: '600px', margin: 'auto' }}>
          Track how much of your total budget has been allocated and to which areas.
        </Typography>
        <LinearProgress variant="determinate" value={75} sx={{ mb: 2, height: 10, borderRadius: 5, bgcolor: '#ddd' }} />
        <Typography variant="body2" color="textSecondary" align="center" sx={{ fontSize: '0.9rem' }}>75% of budget utilized</Typography>
      </Box>

      <Box mt={4}>
        {/* Upcoming Deadlines Section */}
        <Typography variant="h5" color="secondary" align="center" sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
          Upcoming Deadlines
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={2} align="center" sx={{ fontSize: '1.05rem', maxWidth: '600px', margin: 'auto' }}>
          Keep track of important deadlines to ensure timely progress.
        </Typography>
        <Divider sx={{ margin: 'auto', width: '60%', backgroundColor: '#2196f3' }} />
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2, fontSize: '0.9rem' }}>Team selection deadline: March 10</Typography>
        <Typography variant="body2" color="textSecondary" align="center" sx={{ fontSize: '0.9rem' }}>Budget finalization: March 12</Typography>
        <Typography variant="body2" color="textSecondary" align="center" sx={{ fontSize: '0.9rem' }}>Match preparation: March 14</Typography>
      </Box>

      <Box mt={4}>
        {/* General Tips Section */}
        <Typography variant="h5" color="secondary" align="center" sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
          General Tips
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={2} align="center" sx={{ fontSize: '1.05rem', maxWidth: '600px', margin: 'auto' }}>
          Some helpful tips to optimize your team management and budget allocation.
        </Typography>
        <Divider sx={{ margin: 'auto', width: '60%', backgroundColor: '#2196f3' }} />
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2, fontSize: '0.9rem' }}>Prioritize key positions in your team for optimal performance.</Typography>
        <Typography variant="body2" color="textSecondary" align="center" sx={{ fontSize: '0.9rem' }}>Track your spending to stay within budget while building a competitive team.</Typography>
        <Typography variant="body2" color="textSecondary" align="center" sx={{ fontSize: '0.9rem' }}>Review team performance regularly to ensure progress towards goals.</Typography>
      </Box>

      {/* Action Button */}
      <Box mt={4} textAlign="center">
        <Button variant="contained" color="primary" sx={{ padding: '10px 20px', borderRadius: 5, '&:hover': { bgcolor: '#1565c0' } }}>
          Take Action Now
        </Button>
      </Box>
    </Box>
  );
};

export default UserHomeScreen;
