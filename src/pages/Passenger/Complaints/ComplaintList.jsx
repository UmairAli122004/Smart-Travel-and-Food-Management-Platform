import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import { usePassengerComplaints } from '../../../hooks/useComplaints';
import DataTable from '../../../components/common/DataTable';
import SectionLoader from '../../../components/dashboard/SectionLoader';
import ErrorAlert from '../../../components/dashboard/ErrorAlert';
import { format } from 'date-fns';

const ComplaintList = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  
  const { data: complaintsData, isLoading, isError, error, refetch } = usePassengerComplaints(page, size);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'error';
      case 'IN_PROGRESS': return 'warning';
      case 'RESOLVED': return 'success';
      case 'CLOSED': return 'default';
      default: return 'default';
    }
  };

  const columns = [
    { header: 'Complaint ID', accessorKey: 'id' },
    { header: 'Order ID', accessorKey: 'orderId' },
    { header: 'Restaurant', accessorKey: 'restaurantName' },
    { header: 'Type', accessorKey: 'complaintType' },
    { header: 'Title', accessorKey: 'title' },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ getValue }) => (
        <Chip label={getValue()} color={getStatusColor(getValue())} size="small" />
      )
    },
    {
      header: 'Date',
      accessorKey: 'createdAt',
      cell: ({ getValue }) => format(new Date(getValue()), 'MMM dd, yyyy')
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <Button 
          variant="outlined" 
          size="small"
          onClick={(e) => { e.currentTarget.blur(); setSelectedComplaint(row.original); }}
        >
          View Details
        </Button>
      )
    }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          My Complaints
        </Typography>
      </Box>

      {isLoading ? (
        <SectionLoader variant="table" />
      ) : isError ? (
        <ErrorAlert message={error?.response?.data?.message || 'Failed to load complaints'} onRetry={refetch} />
      ) : (
        <DataTable
          columns={columns}
          data={complaintsData?.content || []}
          totalPages={complaintsData?.totalPages || 0}
          page={page}
          onPageChange={setPage}
          title="Complaint History"
        />
      )}

      {/* Details Dialog */}
      <Dialog 
        open={Boolean(selectedComplaint)} 
        onClose={() => setSelectedComplaint(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedComplaint && (
          <>
            <DialogTitle>Complaint Details</DialogTitle>
            <DialogContent dividers>
              <Typography variant="subtitle2" color="text.secondary">Title</Typography>
              <Typography gutterBottom>{selectedComplaint.title}</Typography>
              
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Description</Typography>
              <Typography gutterBottom>{selectedComplaint.description}</Typography>
              
              {selectedComplaint.resolutionNotes && (
                <>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Resolution Notes</Typography>
                  <Typography gutterBottom>{selectedComplaint.resolutionNotes}</Typography>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedComplaint(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ComplaintList;
