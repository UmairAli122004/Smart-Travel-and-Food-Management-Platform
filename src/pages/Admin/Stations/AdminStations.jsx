import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TrainIcon from '@mui/icons-material/Train';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/axiosInstance';
import { STATION_API } from '../../../constants/apiEndpoints';
import useDebounce from '../../../hooks/useDebounce';
import SectionLoader from '../../../components/dashboard/SectionLoader';
import ErrorAlert from '../../../components/dashboard/ErrorAlert';

const fetchAllStations = async () => {
  const response = await api.get(STATION_API.ALL, {
    params: { size: 100 } // Fetch a large default size to display
  });
  return response.data.data;
};

const AdminStations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const queryClient = useQueryClient();

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    stationName: '',
    stationType: 'RAILWAY',
    address: ''
  });

  const { data: pageData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['adminStations'],
    queryFn: fetchAllStations
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newStation) => api.post(STATION_API.CREATE, newStation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminStations'] });
      refetch();
      showSnackbar('Station created successfully', 'success');
      handleCloseDialog();
    },
    onError: (err) => {
      showSnackbar(err.response?.data?.message || 'Failed to create station', 'error');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(STATION_API.UPDATE(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminStations'] });
      refetch();
      showSnackbar('Station updated successfully', 'success');
      handleCloseDialog();
    },
    onError: (err) => {
      showSnackbar(err.response?.data?.message || 'Failed to update station', 'error');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(STATION_API.DELETE(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminStations'] });
      refetch();
      showSnackbar('Station deleted successfully', 'success');
      handleCloseDeleteDialog();
    },
    onError: (err) => {
      showSnackbar(err.response?.data?.message || 'Failed to delete station', 'error');
    }
  });

  // Handlers
  const handleOpenDialog = (station = null) => {
    if (station) {
      setSelectedStation(station);
      setFormData({
        stationName: station.stationName,
        stationType: station.stationType,
        address: station.address || ''
      });
    } else {
      setSelectedStation(null);
      setFormData({
        stationName: '',
        stationType: 'RAILWAY',
        address: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStation(null);
  };

  const handleOpenDeleteDialog = (station) => {
    setSelectedStation(station);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedStation(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedStation) {
      updateMutation.mutate({ id: selectedStation.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = () => {
    if (selectedStation) {
      deleteMutation.mutate(selectedStation.id);
    }
  };

  if (isLoading) return <SectionLoader />;
  if (isError) return <ErrorAlert message={error?.message || 'Failed to fetch stations'} onRetry={refetch} />;

  let stations = pageData?.content || [];

  if (debouncedSearchTerm) {
    const lower = debouncedSearchTerm.toLowerCase();
    stations = stations.filter(s =>
      s.stationName?.toLowerCase().includes(lower) ||
      s.address?.toLowerCase().includes(lower)
    );
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          Station Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={(e) => { e.currentTarget.blur(); handleOpenDialog(); }}
        >
          Add New Station
        </Button>
      </Box>

      <Box sx={{ display: 'flex', mb: 4 }}>
        <TextField
          label="Search Stations"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="By name, address..."
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }
          }}
          sx={{ width: { xs: '100%', sm: 350 } }}
        />
      </Box>

      {stations.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          <TrainIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No stations found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your search criteria.
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Address</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stations.map((station) => (
                <TableRow key={station.id} hover>
                  <TableCell>{station.id}</TableCell>
                  <TableCell fontWeight="medium">{station.stationName}</TableCell>
                  <TableCell>{station.address || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={station.stationType}
                      color={station.stationType === 'RAILWAY' ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={(e) => { e.currentTarget.blur(); handleOpenDialog(station); }}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={(e) => { e.currentTarget.blur(); handleOpenDeleteDialog(station); }}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create / Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={isSubmitting ? undefined : handleCloseDialog}
        maxWidth="sm"
        fullWidth
        disableEnforceFocus
        disableRestoreFocus
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {selectedStation ? 'Edit Station' : 'Add New Station'}
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Station Name"
                name="stationName"
                value={formData.stationName}
                onChange={handleChange}
                required
                fullWidth
              />
              <FormControl fullWidth required>
                <InputLabel>Station Type</InputLabel>
                <Select
                  name="stationType"
                  value={formData.stationType}
                  label="Station Type"
                  onChange={handleChange}
                >
                  <MenuItem value="RAILWAY">RAILWAY</MenuItem>
                  <MenuItem value="BUS">BUS</MenuItem>
                  <MenuItem value="AIRPORT">AIRPORT</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                fullWidth
                multiline
                rows={3}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={isSubmitting}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : (selectedStation ? 'Update' : 'Create')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={isDeleting ? undefined : handleCloseDeleteDialog}
        disableEnforceFocus
        disableRestoreFocus
      >
        <DialogTitle>Delete Station</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the station "{selectedStation?.stationName}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={isDeleting}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <CircularProgress size={24} color="inherit" /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminStations;
