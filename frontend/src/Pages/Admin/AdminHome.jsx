import React from 'react';
import { Container, Grid, Typography, Card, CardContent, Box } from '@mui/material';
import { AccessTime, SportsCricket, Insights, Info } from '@mui/icons-material';

function AdminHome() {
    return (
        <div>
            <Container maxWidth="lg">
                <Box my={4}>
                    <Typography
                        variant="h3"
                        align="center"
                        gutterBottom
                    >
                        Welcome, Admin!
                    </Typography>
                    <Typography variant="h6" color="textSecondary" paragraph align="center">
                        Here’s where you can manage and oversee all aspects of the Spirit11 platform with ease.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Active Tournaments
                                </Typography>
                                <Typography variant="h5" color="primary">
                                    5
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Total Players
                                </Typography>
                                <Typography variant="h5" color="primary">
                                    120
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Current Users
                                </Typography>
                                <Typography variant="h5" color="primary">
                                    200
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Live Matches
                                </Typography>
                                <Typography variant="h5" color="primary">
                                    2
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Box my={4}>
                    <Typography variant="h5" gutterBottom align="center">
                        What’s New
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                                        <SportsCricket fontSize="large" color="primary" />
                                    </Box>
                                    <Typography variant="h6" gutterBottom align="center">
                                        AI-powered Team Suggestions
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary" align="center">
                                        Spirit11 now integrates AI-powered team suggestions that analyze players' current performance, form, and match conditions. These suggestions aim to optimize team selections, providing admins and users with better chances of winning tournaments. The AI evaluates various factors like player stats, historical data, and weather conditions, allowing users to build stronger fantasy cricket teams.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                                        <AccessTime fontSize="large" color="primary" />
                                    </Box>
                                    <Typography variant="h6" gutterBottom align="center">
                                        Live Tournament Tracking
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary" align="center">
                                        Real-time tournament tracking is now available! Admins can track live match statistics, including runs, wickets, overs, and more. The feature automatically updates match data to ensure that users are always informed about ongoing events. This allows admins to provide seamless updates to the platform, keeping users engaged and competitive in real time.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                                        <Insights fontSize="large" color="primary" />
                                    </Box>
                                    <Typography variant="h6" gutterBottom align="center">
                                        Player Insights
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary" align="center">
                                        Admins can now generate detailed player insights to help users make informed decisions. These insights include player performance analysis, recent form, injury updates, and match predictions. By leveraging historical data and current performance metrics, admins can provide valuable suggestions to users for optimal team building and strategy.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>

                <Box my={4}>
                    <Typography variant="h5" gutterBottom align="center">
                        Upcoming Features
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                                        <Info fontSize="large" color="primary" />
                                    </Box>
                                    <Typography variant="h6" gutterBottom align="center">
                                        Next-Gen AI Insights (Coming Soon)
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary" align="center">
                                        Soon, we’ll be introducing advanced AI insights that will predict player performance based on factors like weather, opposition strength, and current form. These predictive insights will give admins and users an edge when selecting fantasy teams and making strategic decisions.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                                        <Info fontSize="large" color="primary" />
                                    </Box>
                                    <Typography variant="h6" gutterBottom align="center">
                                        Interactive Reports (Coming Soon)
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary" align="center">
                                        We are working on interactive reports that will allow admins to generate detailed analytics about user engagement, tournament participation, and fantasy team performance. These reports will enable admins to optimize user experience and improve platform engagement by identifying key trends and insights.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </div>
    );
}

export default AdminHome;
