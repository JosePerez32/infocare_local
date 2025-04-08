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
  TablePagination,
  Button,
  Card,
  CardContent,
  Stack,
  Chip,
  useTheme
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const UserTicketingSystem = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(1);//Este controla el numero de filas

  // Estructura de datos vacía (personaliza según necesites)
  const [tickets, setTickets] = useState([
    {
    }
  ]);
  const ticketStatuses = {
    STATUS_1: 'Users',
    STATUS_2: 'Administrators',
    STATUS_3: 'Eviroments'
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Ticketing system
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Open a ticket
        </Button>
      </Box>

      {/* Cards de Estadísticas */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 3, mb: 4 }}>
        {Object.entries(ticketStatuses).map(([key, status]) => (
          <Card key={status} elevation={2}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ bgcolor: 'action.hover', borderRadius: '50%', p: 1 }}>
                  {/* Icono personalizable */}
                </Box>
                <Box>
                  <Typography variant="h5">0</Typography>
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    {status.replace('_', ' ')}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Tabla */}
      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Function</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>E-mail</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Password</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: rowsPerPage }).map((_, index) => (
                <TableRow key={`fila-${index}`}>
                  <TableCell>Jose Perez</TableCell>
                  <TableCell>Administrator </TableCell>
                  <TableCell>
                    <Chip label="jose.perez@infocura.be" size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label="SuadaSoft" size="small" />
                  </TableCell>
                  </TableRow>
              ))}
                  <TableRow key="Extra">
                  <TableCell>Sina Kashani</TableCell>
                  <TableCell>User </TableCell>
                  <TableCell>
                    <Chip label="sina.kashani@infocura.be" size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label="Infocura" size="small" />
                  </TableCell>
                  
                </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default UserTicketingSystem;