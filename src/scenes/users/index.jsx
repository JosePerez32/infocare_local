import React from 'react';
import {
  Box,
  Paper,
  Typography,
  useTheme,
  IconButton,
  Tooltip,
  Stack,
  TextField,
  InputAdornment,
  Button
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  PeopleOutline,
  Search,
  Download,
  Refresh
} from '@mui/icons-material';
import { tokens } from "../../theme";
import { mockDataInvoices } from "../../data/mockData";

const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      renderCell: (params) => (
        <Typography variant="body2" color="textSecondary">
          #{params.value}
        </Typography>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ 
            color: colors.greenAccent[300],
            fontWeight: 'medium'
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: colors.greenAccent[900],
            p: "4px 8px",
            borderRadius: "4px",
          }}
        >
          <Typography 
            variant="body2" 
            color={colors.greenAccent[400]}
            fontWeight="600"
          >
            ${params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" color="textSecondary">
          {params.value}
        </Typography>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ mb: 3 }}
      >
        <PeopleOutline 
          sx={{ 
            fontSize: '32px',
            color: colors.greenAccent[400]
          }} 
        />
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            USERS
          </Typography>
          <Typography variant="body2" color="textSecondary">
            List of Users
          </Typography>
        </Box>
      </Stack>

      {/* Search and Actions Bar */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <TextField
          size="small"
          placeholder="Search users..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ fontSize: 20, color: colors.grey[300] }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: '300px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: colors.grey[800],
              },
              '&:hover fieldset': {
                borderColor: colors.grey[700],
              },
            },
          }}
        />
        <Stack direction="row" spacing={1}>
          <Tooltip title="Refresh">
            <IconButton 
              size="small"
              sx={{ 
                color: colors.grey[300],
                '&:hover': { color: colors.greenAccent[400] }
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export">
            <IconButton 
              size="small"
              sx={{ 
                color: colors.grey[300],
                '&:hover': { color: colors.greenAccent[400] }
              }}
            >
              <Download />
            </IconButton>
          </Tooltip>
        </Stack>
        
      </Stack>
      <Tooltip 
        title="Importance" 
        arrow
        placement="top" // Puedes cambiar a "bottom", "left", "right"
      ><Button 
      sx={{ fontSize: "1.5rem", // Tamaño del texto más grande
      "&:hover": {
        backgroundColor: "#71D8BD",
        color: "white",
      },
    }}>Create user</Button></ Tooltip>
      {/* DataGrid */}
      <Paper 
        elevation={0}
        sx={{
          height: '72vh',
          backgroundColor: colors.primary[400],
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: `1px solid ${colors.grey[800]}`,
          },
          '& .name-column--cell': {
            color: colors.greenAccent[300],
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.blueAccent[700],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.primary[400],
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
            backgroundColor: colors.blueAccent[700],
          },
          '& .MuiCheckbox-root': {
            color: `${colors.greenAccent[200]} !important`,
          },
          '& .MuiDataGrid-row': {
            '&:hover': {
              backgroundColor: colors.primary[500],
            },
          },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={mockDataInvoices}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>
    </Box>
  );
};

export default Users;