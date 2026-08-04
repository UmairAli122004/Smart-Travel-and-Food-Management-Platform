import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Chip, 
  IconButton,
  Tooltip,
  Divider,
  Pagination,
  Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsRailwayIcon from '@mui/icons-material/DirectionsRailway';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const JourneyList = ({ journeys, totalPages, page, onPageChange, onEdit, onDelete }) => {
  if (!journeys || journeys.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>🚆</Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          No Journeys Found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You haven't created any train journeys yet.
          <br />
          Create your first journey to start ordering food during your trip.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {journeys.map((journey) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={journey.id}>
            <Card elevation={2} sx={{ borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1, pr: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <DirectionsRailwayIcon color="primary" sx={{ mt: 0.3 }} />
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                        {journey.trainNumber} - {journey.trainName}
                      </Typography>
                    </Box>
                    <Chip size="small" label={`PNR: ${journey.pnrNumber}`} color="secondary" variant="outlined" sx={{ width: 'fit-content', fontWeight: 'bold', mt: 0.5 }} />
                  </Box>
                </Box>
                
                <Divider sx={{ mb: 1.5 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2, flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarMonthIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">Date</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="medium">
                      {journey.boardingDate}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTimeIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">Time</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="medium">
                      {journey.boardingTime}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AirlineSeatReclineNormalIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">Seat</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="medium" align="right">
                      {journey.travelClass.replace(/_/g, ' ')}
                      {(journey.coachNumber || journey.seatNumber) && <br />}
                      {journey.coachNumber && `${journey.coachNumber} `}
                      {journey.seatNumber && `(${journey.seatNumber})`}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      {journey.boardingStation}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">-</Typography>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      {journey.destinationStation}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Edit Journey">
                      <IconButton onClick={() => onEdit(journey)} size="small" color="primary" sx={{ p: 0.5 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Journey">
                      <IconButton onClick={() => onDelete(journey)} size="small" color="error" sx={{ p: 0.5 }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Stack sx={{ alignItems: "center" }} sx={{ mt: 4 }}>
          <Pagination 
            count={totalPages} 
            page={page + 1} 
            onChange={(e, value) => onPageChange(value - 1)} 
            color="primary" 
          />
        </Stack>
      )}
    </Box>
  );
};

export default JourneyList;
