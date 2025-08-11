import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  Checkbox,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Box,
  Typography,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Edit,
  Delete,
  Visibility,
  Search,
} from '@mui/icons-material';

export interface Column<T> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  _format?: (value: any) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  selectable?: boolean;
  searchable?: boolean;
  pagination?: boolean;
  rowsPerPageOptions?: number[];
  actions?: {
    view?: (row: T) => void;
    edit?: (row: T) => void;
    delete?: (row: T) => void;
    custom?: (row: T) => React.ReactNode;
  };
  onSelectionChange?: (selectedRows: T[]) => void;
  loading?: boolean;
  emptyMessage?: string;
}

type Order = 'asc' | 'desc';

export function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  title,
  selectable = false,
  searchable = false,
  pagination = true,
  rowsPerPageOptions = [5, 10, 25],
  actions,
  onSelectionChange,
  loading = false,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof T | null>(null);
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const handleRequestSort = (property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id?.toString() || '');
      setSelected(newSelected);
      onSelectionChange?.(data);
      return;
    }
    setSelected([]);
    onSelectionChange?.([]);
  };

  const handleClick = (id: string | number) => {
    const selectedIndex = selected.indexOf(id.toString());
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id.toString());
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
    const selectedRows = data.filter(row => newSelected.includes(row.id?.toString() || ''));
    onSelectionChange?.(selectedRows);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: string | number) => selected.indexOf(id.toString()) !== -1;

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(row =>
      columns.some(column => {
        const value = row[column.id];
        if (value === null || value === undefined) return false;
        return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!orderBy) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      
      if (aValue < bValue) {
        return order === 'desc' ? 1 : -1;
      }
      if (aValue > bValue) {
        return order === 'desc' ? -1 : 1;
      }
      return 0;
    });
  }, [filteredData, orderBy, order]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedData, page, rowsPerPage, pagination]);

  const renderCell = (row: T, column: Column<T>) => {
    const value = row[column.id];
    
    if (column._format) {
      return column._format(value);
    }
    
    // Default formatting for common data types
    if (typeof value === 'boolean') {
      return (
        <Chip
          label={value ? 'Yes' : 'No'}
          color={value ? 'success' : 'default'}
          size="small"
        />
      );
    }
    
    if (typeof value === 'string' && value.startsWith('http')) {
      return (
        <Avatar
          src={value}
          alt="Avatar"
          sx={{ width: 32, height: 32 }}
        />
      );
    }
    
    return value?.toString() || '';
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Header */}
      {(title || searchable) && (
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {title && (
              <Typography variant="h6" component="div">
                {title}
              </Typography>
            )}
            {searchable && (
              <TextField
                size="small"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 200 }}
              />
            )}
          </Box>
        </Box>
      )}

      {/* Table */}
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < data.length}
                    checked={data.length > 0 && selected.length === data.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.id.toString()}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth }}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              {actions && (
                <TableCell align="right" sx={{ minWidth: 100 }}>
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)} align="center">
                  <Typography>Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)} align="center">
                  <Typography color="text.secondary">{emptyMessage}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => {
                const isItemSelected = isSelected(row.id || '');
                const rowId = row.id?.toString() || '';

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={rowId}
                    selected={isItemSelected}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          onClick={() => handleClick(row.id || '')}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.id.toString()} align={column.align || 'left'}>
                        {renderCell(row, column)}
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {actions.view && (
                            <Tooltip title="View">
                              <IconButton
                                size="small"
                                onClick={() => actions.view!(row)}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                          )}
                          {actions.edit && (
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => actions.edit!(row)}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                          )}
                          {actions.delete && (
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => actions.delete!(row)}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          )}
                          {actions.custom && actions.custom(row)}
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={sortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
} 