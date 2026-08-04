import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Snackbar, 
  Alert, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../../context/AuthContext';
import { usePassengerJourneys, useCreateJourney, useUpdateJourney, useDeleteJourney } from '../../../hooks/useJourneys';
import JourneyList from '../../../components/dashboard/passenger/JourneyList';
import JourneyFormModal from '../../../components/dashboard/passenger/JourneyFormModal';
import SectionLoader from '../../../components/dashboard/SectionLoader';
import ErrorAlert from '../../../components/dashboard/ErrorAlert';

const MyJourneys = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const passengerId = user?.userId || user?.id; // In reality, not needed for backend, but we pass it just in case
  
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState(null);
  
  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [journeyToDelete, setJourneyToDelete] = useState(null);
  
  // Snackbar states
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Hooks
  const { data, isLoading, isError, error, refetch, isFetching } = usePassengerJourneys(passengerId, page, size);
  const createMutation = useCreateJourney();
  const updateMutation = useUpdateJourney();
  const deleteMutation = useDeleteJourney();

  const handleOpenForm = (journey = null) => {
    setSelectedJourney(journey);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedJourney(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedJourney) {
        await updateMutation.mutateAsync({ id: selectedJourney.id, data: formData });
        setSnackbar({ open: true, message: 'Journey updated successfully', severity: 'success' });
      } else {
        await createMutation.mutateAsync(formData);
        setSnackbar({ open: true, message: 'Journey created successfully', severity: 'success' });
        
        if (sessionStorage.getItem('pendingOrder')) {
           navigate('/passenger/order');
        }
      }
      handleCloseForm();
    } catch (err) {
      // Error is handled in the modal or globally
      console.error("Error submitting form", err);
    }
  };

  const confirmDelete = (journey) => {
    setJourneyToDelete(journey);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (journeyToDelete) {
      try {
        await deleteMutation.mutateAsync(journeyToDelete.id);
        setSnackbar({ open: true, message: 'Journey deleted successfully', severity: 'success' });
      } catch (err) {
        setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to delete journey', severity: 'error' });
      } finally {
        setIsDeleteDialogOpen(false);
        setJourneyToDelete(null);
      }
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          My Journeys
        </Typography>
        <Box>

          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />} 
            onClick={() => handleOpenForm()}
          >
            Create Journey
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <SectionLoader variant="list" />
      ) : isError ? (
        <ErrorAlert message={error?.response?.data?.message || error?.message || 'Failed to load journeys'} onRetry={refetch} />
      ) : (
        <JourneyList 
          journeys={data?.content || []} 
          totalPages={data?.totalPages || 0}
          page={page}
          onPageChange={setPage}
          onEdit={handleOpenForm}
          onDelete={confirmDelete}
        />
      )}

      {/* Form Modal */}
      <JourneyFormModal 
        open={isFormOpen} 
        onClose={handleCloseForm} 
        onSubmit={handleFormSubmit}
        initialData={selectedJourney}
        isLoading={createMutation.isPending || updateMutation.isPending}
        error={createMutation.error || updateMutation.error}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog disableEnforceFocus disableRestoreFocus open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Delete Journey</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the journey for train {journeyToDelete?.trainName}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)} color="inherit">Cancel</Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            disabled={deleteMutation.isPending}
            startIcon={deleteMutation.isPending ? <CircularProgress size={20} /> : null}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyJourneys;
