import React, { useState } from 'react';
import { Button, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import YouTrackEmbed from './youtrack';

const UserTicketingSystem = () => {
  const [showYouTrack, setShowYouTrack] = useState(false);

  // Datos de ejemplo para la tabla
  const tickets = [
    { id: 1, title: 'Server Problems', status: 'Open' },
    { id: 2, title: 'Request for a new function', status: 'In progress' },
    { id: 3, title: 'Error in the Dashboard', status: 'Done' }
  ];

  const handleOpenTicket = () => {
    setShowYouTrack(true);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
          Ticketing System
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={handleOpenTicket}
          sx={{ mb: 2 }}
        >
          Open Ticket
        </Button>
        
        {showYouTrack ? (
          <YouTrackEmbed />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.id}</TableCell>
                    <TableCell>{ticket.title}</TableCell>
                    <TableCell>{ticket.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default UserTicketingSystem;