import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  Typography,
  TableFooter
} from '@mui/material';
const DataTable = ({ data, columns, title }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row, index) => `${row.id ?? 'row'}-${index}`,
  });
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        {title && (
          <Typography variant="h6" id="tableTitle" component="div">
            {title}
          </Typography>
        )}
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
          onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
          labelRowsPerPage="Pages"
          labelDisplayedRows={() => ''}
          sx={{
            borderBottom: 'none',
            '.MuiTablePagination-toolbar': {
              minHeight: 'auto',
              padding: '0 8px',
              justifyContent: 'flex-start',
            },
            '.MuiTablePagination-spacer': {
              display: 'none',
            },
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              margin: 0,
              fontWeight: 'bold',
            },
            '.MuiTablePagination-actions': {
              display: 'none',
            }
          }}
        />
      </Box>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table" sx={{ minWidth: { xs: 500, sm: 650 } }}>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    sx={{ backgroundColor: 'background.default', fontWeight: 'bold' }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
export default DataTable;
