import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Container,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DirectionsRailwayIcon from '@mui/icons-material/DirectionsRailway';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import TrainIcon from '@mui/icons-material/Train';
import axiosInstance from '../../../api/axiosInstance';
import { JOURNEY_API, PASSENGER_API } from '../../../constants/apiEndpoints';
import { format, isBefore } from 'date-fns';
import { useCart } from '../../../context/CartContext';
import JourneyFormModal from './../../../components/dashboard/passenger/JourneyFormModal';
import { useCreateJourney } from '../../../hooks/useJourneys';

const isJourneyExpired = (boardingDate, boardingTime) => {
  if (!boardingDate || !boardingTime) return false;
  try {
    const journeyDateTime = new Date(`${boardingDate}T${boardingTime}`);
    return isBefore(journeyDateTime, new Date());
  } catch (error) {
    return false;
  }
};

const JourneySelector = () => {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedJourneyId, setSelectedJourneyId] = useState(null);

  const navigate = useNavigate();
  const { cartItems, updateJourneyId } = useCart();
  const createMutation = useCreateJourney();

  useEffect(() => {
    fetchJourneys();
  }, []);

  const fetchJourneys = async () => {
    try {
      setLoading(true);

      const meResponse = await axiosInstance.get(PASSENGER_API.ME);
      const passengerId = meResponse.data.data.id;

      const response = await axiosInstance.get(
        JOURNEY_API.GET_PASSENGER_JOURNEYS(passengerId)
      );

      const activeJourneys =
        response.data?.data?.content || [];

      setJourneys(activeJourneys);
      setError('');
      
      // Phase 3 requirement: if missing, open form automatically
      if (activeJourneys.length === 0) {
        setIsFormOpen(true);
      }
    } catch (err) {
      console.error('Error fetching journeys:', err);
      setError('Failed to load your journeys. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const response = await createMutation.mutateAsync(formData);
      setIsFormOpen(false);
      
      // Auto continue
      const newJourney = response.data?.data;
      if (newJourney) {
        setJourneys([newJourney]); // Show the new journey
        handleSelectJourney(newJourney.id); // Auto continue
      } else {
        fetchJourneys(); // Fallback
      }
    } catch (err) {
      console.error("Error creating journey", err);
    }
  };

  const handleSelectJourney = journeyId => {
    const pendingOrder = sessionStorage.getItem('pendingOrder');
    if (pendingOrder && cartItems && cartItems.length > 0) {
      updateJourneyId(journeyId);
      navigate('/passenger/place-order');
    } else {
      navigate(`/passenger/order/${journeyId}/restaurants`);
    }
  };

  const handleContinue = () => {
    if (selectedJourneyId) {
      handleSelectJourney(selectedJourneyId);
    }
  };

  const formatJourneyDateTime = (boardingDate, boardingTime) => {
    if (!boardingDate || !boardingTime) {
      return '-';
    }

    try {
      return format(
        new Date(`${boardingDate}T${boardingTime}`),
        'MMM dd, yyyy hh:mm a'
      );
    } catch (error) {
      console.error('Date formatting error:', error);
      return `${boardingDate} ${boardingTime}`;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 4
        }}
      >
        <FastfoodIcon
          sx={{
            fontSize: 40,
            color: 'primary.main',
            mr: 2
          }}
        />

        <Box>
          <Typography variant="h4" fontWeight="bold">
            Order Food
          </Typography>

          <Typography color="text.secondary">
            Select your active journey to browse restaurants.
          </Typography>
        </Box>
      </Box>

      {journeys.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: 'center'
          }}
        >
          <DirectionsRailwayIcon
            sx={{
              fontSize: 70,
              color: 'text.disabled',
              mb: 2
            }}
          />

          <Typography variant="h5" gutterBottom>
            No Active Journey Found
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Please create a journey before placing a food order.
          </Typography>

          <Button
            variant="contained"
            onClick={(e) => { e.currentTarget.blur(); setIsFormOpen(true); }}
          >
            Create Journey
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {journeys.map(journey => {
            const isExpired = isJourneyExpired(journey.boardingDate, journey.boardingTime);
            const displayActive = !isExpired;
            
            return (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={journey.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: '0.25s',
                  border: selectedJourneyId === journey.id ? '2px solid' : '1px solid',
                  borderColor: selectedJourneyId === journey.id ? 'primary.main' : 'transparent',
                  cursor: displayActive ? 'pointer' : 'default',
                  opacity: displayActive ? 1 : 0.6,
                  '&:hover': {
                    transform: displayActive ? 'translateY(-5px)' : 'none',
                    boxShadow: displayActive ? 6 : 1
                  }
                }}
                onClick={() => displayActive && setSelectedJourneyId(journey.id)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      {journey.pnrNumber || '-'}
                    </Typography>

                    <Chip
                      label={displayActive ? 'UPCOMING' : 'EXPIRED'}
                      color={displayActive ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1
                    }}
                  >
                    <TrainIcon
                      sx={{
                        mr: 1,
                        fontSize: 20,
                        color: 'text.secondary'
                      }}
                    />

                    <Typography variant="body2">
                      <strong>{journey.trainNumber || '-'}</strong>
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {journey.trainName || '-'}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2
                    }}
                  >
                    <EventSeatIcon
                      sx={{
                        mr: 1,
                        fontSize: 20,
                        color: 'text.secondary'
                      }}
                    />

                    <Typography variant="body2">
                      Seat : {journey.seatNumber || '-'} (
                      {journey.travelClass
                        ?.replaceAll('_', ' ')
                        || '-'})
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2
                    }}
                  >
                    <EventSeatIcon
                      sx={{
                        mr: 1,
                        fontSize: 20,
                        color: 'text.secondary',
                        visibility: 'hidden' // To align with the seat icon above
                      }}
                    />

                    <Typography variant="body2">
                      Coach : {journey.coachNumber || '-'}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      mb: 3
                    }}
                  >
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography color="text.secondary">
                        From
                      </Typography>

                      <Typography fontWeight={600}>
                        {journey.boardingStation || '-'}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography color="text.secondary">
                        To
                      </Typography>

                      <Typography fontWeight={600}>
                        {journey.destinationStation || '-'}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography color="text.secondary">
                        Journey
                      </Typography>

                      <Typography
                        fontWeight={600}
                        sx={{ textAlign: "right" }}
                      >
                        {formatJourneyDateTime(
                          journey.boardingDate,
                          journey.boardingTime
                        )}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    fullWidth
                    variant={selectedJourneyId === journey.id ? "contained" : "outlined"}
                    color={selectedJourneyId === journey.id ? "primary" : "inherit"}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (displayActive) setSelectedJourneyId(journey.id);
                    }}
                    disabled={!displayActive}
                  >
                    {selectedJourneyId === journey.id ? 'Selected' : 'Select'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            );
          })}
        </Grid>
      )}

      {journeys.length > 0 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={!selectedJourneyId}
            onClick={handleContinue}
            sx={{ px: 6, py: 1.5, fontWeight: 'bold' }}
          >
            Continue
          </Button>
        </Box>
      )}

      {/* Form Modal */}
      <JourneyFormModal 
        open={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending}
        error={createMutation.error}
      />
    </Container>
  );
};

export default JourneySelector;