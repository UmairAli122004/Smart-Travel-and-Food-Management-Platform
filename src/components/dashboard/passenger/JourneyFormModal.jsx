import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Typography
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

const TRAVEL_CLASSES = [
  { value: 'FIRST_AC', label: 'AC 1 Tier (1A)' },
  { value: 'SECOND_AC', label: 'AC 2 Tier (2A)' },
  { value: 'THIRD_AC', label: 'AC 3 Tier (3A)' },
  { value: 'SLEEPER', label: 'Sleeper (SL)' },
  { value: 'GENERAL', label: 'General (GN)' }
];

const JourneyFormModal = ({ open, onClose, onSubmit, initialData = null, isLoading = false, error = null, isAdmin = false }) => {
  const isEditing = !!initialData;
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      pnrNumber: '',
      trainNumber: '',
      trainName: '',
      boardingStation: '',
      destinationStation: '',
      boardingDate: '',
      boardingTime: '',
      coachNumber: '',
      seatNumber: '',
      travelClass: '',
      passengerId: ''
    }
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          ...initialData,
          boardingDate: initialData.boardingDate || '',
          boardingTime: initialData.boardingTime || ''
        });
      } else {
        reset({
          pnrNumber: '',
          trainNumber: '',
          trainName: '',
          boardingStation: '',
          destinationStation: '',
          boardingDate: '',
          boardingTime: '',
          coachNumber: '',
          seatNumber: '',
          travelClass: '',
          passengerId: ''
        });
      }
    }
  }, [open, initialData, reset]);

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <Dialog 
      disableEnforceFocus 
      disableRestoreFocus 
      open={open} 
      onClose={!isLoading ? onClose : undefined} 
      maxWidth="sm" 
      fullWidth
      sx={{ '& .MuiDialog-paper': { borderRadius: '16px' } }}
    >
      <DialogTitle sx={{ pb: 1, fontWeight: 'bold' }}>
        {isEditing ? 'Update Journey' : 'Create New Journey'}
      </DialogTitle>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.message || 'An error occurred'}
            </Alert>
          )}
          <Grid container spacing={2}>
            {isAdmin && (
              <Grid item xs={12}>
                <Controller
                  name="passengerId"
                  control={control}
                  rules={{ required: isAdmin ? 'Passenger ID is required for Admin' : false }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Passenger ID"
                      type="number"
                      fullWidth
                      size="small"
                      error={!!errors.passengerId}
                      helperText={errors.passengerId?.message}
                      disabled={isEditing || isLoading}
                    />
                  )}
                />
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, fontWeight: 'bold' }}>
                Train Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="pnrNumber"
                control={control}
                rules={{ 
                  required: 'PNR number is required',
                  minLength: { value: 6, message: 'PNR must be at least 6 characters' },
                  maxLength: { value: 20, message: 'PNR cannot exceed 20 characters' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="PNR Number"
                    fullWidth
                    size="small"
                    error={!!errors.pnrNumber}
                    helperText={errors.pnrNumber?.message}
                    disabled={isEditing || isLoading} 
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Controller
                name="trainNumber"
                control={control}
                rules={{ required: 'Train number is required', maxLength: 20 }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Train Number"
                    fullWidth
                    size="small"
                    error={!!errors.trainNumber}
                    helperText={errors.trainNumber?.message}
                    disabled={isLoading}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <Controller
                name="trainName"
                control={control}
                rules={{ required: 'Train name is required', maxLength: 100 }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Train Name"
                    fullWidth
                    size="small"
                    error={!!errors.trainName}
                    helperText={errors.trainName?.message}
                    disabled={isLoading}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, fontWeight: 'bold' }}>
                Journey Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="boardingStation"
                control={control}
                rules={{ required: 'Boarding station is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Boarding Station"
                    fullWidth
                    size="small"
                    error={!!errors.boardingStation}
                    helperText={errors.boardingStation?.message}
                    disabled={isLoading}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="destinationStation"
                control={control}
                rules={{ required: 'Destination station is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Destination Station"
                    fullWidth
                    size="small"
                    error={!!errors.destinationStation}
                    helperText={errors.destinationStation?.message}
                    disabled={isLoading}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="boardingDate"
                control={control}
                rules={{ required: 'Boarding date is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    label="Boarding Date"
                    fullWidth
                    size="small"
                    slotProps={{ inputLabel: { shrink: true } }}
                    inputProps={{ min: getTodayString() }}
                    error={!!errors.boardingDate}
                    helperText={errors.boardingDate?.message}
                    disabled={isLoading}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="boardingTime"
                control={control}
                rules={{ required: 'Boarding time is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="time"
                    label="Boarding Time"
                    fullWidth
                    size="small"
                    slotProps={{ inputLabel: { shrink: true } }}
                    error={!!errors.boardingTime}
                    helperText={errors.boardingTime?.message}
                    disabled={isLoading}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="travelClass"
                control={control}
                rules={{ required: 'Travel class is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Travel Class"
                    fullWidth
                    size="small"
                    error={!!errors.travelClass}
                    helperText={errors.travelClass?.message}
                    disabled={isLoading}
                  >
                    {TRAVEL_CLASSES.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, fontWeight: 'bold' }}>
                Seat Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="coachNumber"
                control={control}
                rules={{ maxLength: 10 }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Coach Number"
                    fullWidth
                    size="small"
                    error={!!errors.coachNumber}
                    helperText={errors.coachNumber?.message}
                    disabled={isLoading}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="seatNumber"
                control={control}
                rules={{ maxLength: 10 }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Seat Number"
                    fullWidth
                    size="small"
                    error={!!errors.seatNumber}
                    helperText={errors.seatNumber?.message}
                    disabled={isLoading}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading} color="inherit">
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isEditing ? 'Update Journey' : 'Create Journey'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default JourneyFormModal;
