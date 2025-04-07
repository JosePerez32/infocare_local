import React, { useState} from 'react';
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
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Snackbar
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  PeopleOutline,
  Search,
  Download,
  Refresh,
  Add,
  Delete,
  ExpandMore,
  Person,
  AdminPanelSettings,
  SupervisedUserCircle
} from '@mui/icons-material';
import { tokens } from "../../theme";
import { mockDataInvoices } from "../../data/mockData";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';

const NewUsers = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const colors = tokens(theme.palette.mode);
 
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Estados para el dropdown de tipo de usuario
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);


  const userTypes = [
    { value: 'admin', label: 'Admin', icon: <AdminPanelSettings fontSize="small" /> },
    { value: 'user', label: 'Regular User', icon: <Person fontSize="small" /> },
    { value: 'manager', label: 'Manager', icon: <SupervisedUserCircle fontSize="small" /> }
  ];
  useEffect(() => {
    const loadUsers = () => {
      const savedUsers = localStorage.getItem('/settings/users');
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      }
    };
    
    // Escuchar eventos de almacenamiento
    window.addEventListener('storage', loadUsers);
    
    // Cargar al montar
    loadUsers();
    
    return () => {
      window.removeEventListener('storage', loadUsers);
    };
  }, []);
  const [users, setUsers] = useState(() => {
    try {
      // 1. Intentar cargar usuarios de localStorage
      const savedUsers = localStorage.getItem('/settings/users');
      
      // 2. Si no hay datos o es inválido, usar solo mockData
      if (!savedUsers) return mockDataInvoices;
      
      // 3. Parsear cuidadosamente
      const parsedUsers = JSON.parse(savedUsers);
      
      // 4. Verificar que sea un array válido
      if (!Array.isArray(parsedUsers)) return mockDataInvoices;
      
      // 5. Combinar evitando duplicados por ID
      const combinedUsers = [...mockDataInvoices];
      
      parsedUsers.forEach(user => {
        if (!mockDataInvoices.some(mockUser => mockUser.id === user.id)) {
          combinedUsers.push(user);
        }
      });
      
      return combinedUsers;
    } catch (error) {
      console.error('Error loading users:', error);
      return mockDataInvoices; // Fallback seguro
    }
  });

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
      field: "date",
      headerName: "Date",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" color="textSecondary">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "type",
      headerName: "Type User",
      flex: 1,
      renderCell: (params) => {
        const currentType = userTypes.find(type => type.value === params.value) || userTypes[1];
        return (
          <>
            <Button
              variant="outlined"
              size="small"
              endIcon={<ExpandMore />}
              onClick={(e) => {
                setAnchorEl(e.currentTarget);
                setCurrentUserId(params.id);
              }}
              sx={{
                textTransform: 'none',
                color: colors.grey[100],
                borderColor: colors.grey[700],
                '&:hover': {
                  borderColor: colors.greenAccent[400],
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {currentType.icon}
                {currentType.label}
              </Box>
            </Button>
          </>
        );
      },
    },
    {
      field: "actions",
      headerName: "Delete",
      width: 100,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => {
            setUserToDelete(params.row);
            setDeleteDialogOpen(true);
          }}
        >
          <Delete />
        </IconButton>
      ),
    },
  ];

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user permanently?')) {
      // 1. Filtrar el usuario a eliminar
      const updatedUsers = users.filter(user => user.id !== userId);
      
      // 2. Actualizar el estado local
      setUsers(updatedUsers);
      
      // 3. Actualizar localStorage
      try {
        // Separar usuarios mock de los creados
        const mockUserIds = mockDataInvoices.map(user => user.id);
        const usersToSave = updatedUsers.filter(user => !mockUserIds.includes(user.id));
        
        localStorage.setItem('/settings/users', JSON.stringify(usersToSave));
        
        // Opcional: Mostrar notificación
        setSnackbarMessage('User deleted successfully');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Failed to delete user from storage:', error);
        setSnackbarMessage('Error deleting user');
        setSnackbarOpen(true);
      }
    }
    setUsers(users.filter(user => user.id !== userToDelete.id));
    setDeleteDialogOpen(false);
    setSnackbarMessage('User deleted successfully');
    setSnackbarOpen(true);
  };
    const deleteUserPermanently = (userId) => {
      // 1. Confirmación
      if (!window.confirm('This will permanently delete the user. Continue?')) return;
    
      // 2. Verificar si es un usuario mock (no se pueden eliminar)
      const isMockUser = mockDataInvoices.some(user => user.id === userId);
      
      if (isMockUser) {
        setSnackbarMessage('Cannot delete demo users');
        setSnackbarOpen(true);
        return;
      }
    
      // 3. Actualizar estado y almacenamiento
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      
      // Guardar solo usuarios no-mock en localStorage
      const realUsers = updatedUsers.filter(user => 
        !mockDataInvoices.some(mock => mock.id === user.id)
      );
      
      localStorage.setItem('/settings/users', JSON.stringify(realUsers));
      
      // Feedback
      setSnackbarMessage('User deleted permanently');
      setSnackbarOpen(true);
    };

  const handleUserTypeChange = (type) => {
    setUsers(users.map(user => 
      user.id === currentUserId ? { ...user, type } : user
    ));

    setAnchorEl(null);
    setSnackbarMessage('User type updated');
    setSnackbarOpen(true);
  };

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

      {/* Action Buttons */}
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            backgroundColor: colors.greenAccent[600],
            '&:hover': {
              backgroundColor: colors.greenAccent[700],
            }
          }}
          onClick={() => navigate("/settings/users/createUser")} 
        >
          Create User
        </Button>

        <Stack direction="row" spacing={1}>
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
          rows={users}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      {/* User Type Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {userTypes.map((type) => (
          <MenuItem
            key={type.value}
            onClick={() => handleUserTypeChange(type.value)}
            sx={{ gap: 1 }}
          >
            {type.icon}
            {type.label}
          </MenuItem>
        ))}
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user {userToDelete?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              // 1. Verificar si es un usuario mock
              const isMockUser = mockDataInvoices.some(user => user.id === userToDelete.id);
              
              if (isMockUser) {
                setSnackbarMessage('Cannot delete demo users');
                setSnackbarOpen(true);
                setDeleteDialogOpen(false);
                return;
              }

              // 2. Eliminar de los usuarios mostrados
              const updatedUsers = users.filter(user => user.id !== userToDelete.id);
              setUsers(updatedUsers);

              // 3. Actualizar localStorage (excluyendo mockData)
              const usersToSave = updatedUsers.filter(user => 
                !mockDataInvoices.some(mock => mock.id === user.id)
              );
              localStorage.setItem('/settings/users', JSON.stringify(usersToSave));

              // 4. Cerrar diálogo y mostrar feedback
              setDeleteDialogOpen(false);
              setSnackbarMessage('User deleted successfully');
              setSnackbarOpen(true);
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NewUsers;