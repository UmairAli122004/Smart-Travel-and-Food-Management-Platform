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
  Pagination,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import { useVendorComplaints, useResolveVendorComplaint } from '../../../hooks/useComplaints';
import SectionLoader from '../../../components/dashboard/SectionLoader';

const ComplaintStatusOptions = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

const ComplaintManagement = () => {
  const [page, setPage] = useState(0);
  const size = 10;

  const { data: complaintsData, isLoading, isError, refetch } = useVendorComplaints(page, size);
  const resolveMutation = useResolveVendorComplaint();

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [resolveForm, setResolveForm] = useState({ status: 'RESOLVED', resolutionNotes: '' });

  const handlePageChange = (event, value) => {
    setPage(value - 1);
  };

  const handleOpenResolve = (complaint) => {
    setSelectedComplaint(complaint);
    setResolveForm({ status: 'RESOLVED', resolutionNotes: complaint.resolutionNotes || '' });
  };

  const handleCloseResolve = () => {
    setSelectedComplaint(null);
  };

  const handleResolveSubmit = async () => {
    try {
      await resolveMutation.mutateAsync({
        id: selectedComplaint.id,
        data: resolveForm
      });
      handleCloseResolve();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'error';
      case 'IN_PROGRESS': return 'warning';
      case 'RESOLVED': return 'success';
      case 'CLOSED': return 'default';
      default: return 'default';
    }
  };

  if (isLoading) {
    return <SectionLoader />;
  }

  const complaints = complaintsData?.content || [];
  const totalPages = complaintsData?.totalPages || 1;

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
        Customer Complaints
      </Typography>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>Failed to load complaints.</Alert>
      )}

      {resolveMutation.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>{resolveMutation.error?.response?.data?.message || 'Failed to update complaint'}</Alert>
      )}

      {complaints.length === 0 && !isError ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary">You have no complaints recorded.</Typography>
        </Paper>
      ) : (
        <Box>
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
            <Table sx={{ minWidth: { xs: 500, sm: 650 } }}>
              <TableHead sx={{ backgroundColor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Passenger</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Restaurant</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Subject</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {complaints.map((complaint) => (
                  <TableRow key={complaint.id} hover>
                    <TableCell>{complaint.id}</TableCell>
                    <TableCell>{complaint.complaintType}</TableCell>
                    <TableCell>{complaint.passengerName}</TableCell>
                    <TableCell>{complaint.restaurantName}</TableCell>
                    <TableCell>{complaint.title}</TableCell>
                    <TableCell>
                      <Chip
                        label={complaint.status?.replace('_', ' ')}
                        color={getStatusColor(complaint.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined" size="small" onClick={(e) => { e.currentTarget.blur(); handleOpenResolve(complaint); }}>
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination count={totalPages} page={page + 1} onChange={handlePageChange} color="primary" />
            </Box>
          )}
        </Box>
      )}

      {/* Resolve Dialog */}
      <Dialog open={Boolean(selectedComplaint)} onClose={handleCloseResolve} maxWidth="sm" fullWidth>
        {selectedComplaint && (
          <>
            <DialogTitle>Manage Complaint #{selectedComplaint.id}</DialogTitle>
            <DialogContent dividers>
              <Typography variant="subtitle2" color="text.secondary">Description</Typography>
              <Typography gutterBottom>{selectedComplaint.description}</Typography>

              {/* Vendor can only resolve FOOD_QUALITY and RESTAURANT type complaints */}
              {(selectedComplaint.complaintType === 'FOOD_QUALITY' || selectedComplaint.complaintType === 'RESTAURANT') ? (
                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    select
                    label="Status"
                    value={resolveForm.status}
                    onChange={(e) => setResolveForm({ ...resolveForm, status: e.target.value })}
                    fullWidth
                  >
                    {ComplaintStatusOptions.map(s => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    label="Resolution Notes"
                    value={resolveForm.resolutionNotes}
                    onChange={(e) => setResolveForm({ ...resolveForm, resolutionNotes: e.target.value })}
                    fullWidth
                    multiline
                    rows={4}
                  />
                </Box>
              ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Vendors can only resolve FOOD_QUALITY and RESTAURANT type complaints.
                  This is a {selectedComplaint.complaintType} complaint and must be resolved by an Admin.
                </Alert>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseResolve}>Cancel</Button>
              {(selectedComplaint.complaintType === 'FOOD_QUALITY' || selectedComplaint.complaintType === 'RESTAURANT') && (
                <Button
                  onClick={handleResolveSubmit}
                  variant="contained"
                  disabled={resolveMutation.isPending}
                >
                  Save
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ComplaintManagement;
