import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  LinearProgress,
  Fade,
  alpha,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  BugReport as BugReportIcon,
  QuestionAnswer as QuestionAnswerIcon,
  NewReleases as NewReleasesIcon
} from '@mui/icons-material';

const UserTicketingSystem = () => {
  const theme = useTheme();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openCreateTicket, setOpenCreateTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'general'
  });

  // Current logged-in user (you would replace this with actual authentication)
  const currentUser = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com'
  };

  // Ticket status definitions (user can only see these, not change)
  /*const ticketStatuses = {
    OPEN: 'open',
    IN_PROGRESS: 'in_progress',
    RESOLVED: 'resolved'
  };*/
  const ticketStatuses = {
    USERS: 'users',
    ADMINISTRATORS: 'administrators',
    ENVIRONMENTS: 'environments'
  };

  // Matching the colors used in the component
  const priorityColors = {
    low: '#71D8BD',  // Custom green color for low priority
    medium: '#2F8ECD', // Custom blue color for medium priority
    high: '#F44336'  // Red for high priority
  };

  const categoryIcons = {
    bug: <BugReportIcon />,
    feature: <NewReleasesIcon />,
    general: <QuestionAnswerIcon />
  };

  // Mock data generation for the current user's tickets
  useEffect(() => {
    const generateMockTickets = () => {
      const categories = ['bug', 'feature', 'general'];
      const priorities = ['low', 'medium', 'high'];
      const statuses = Object.values(ticketStatuses);

      return Array.from({ length: 50 }, (_, index) => ({
        id: `TICKET${String(index + 1).padStart(4, '0')}`,
        title: `Ticket ${index + 1} Description`,
        description: `Detailed description for ticket ${index + 1}`,
        user: currentUser,
        category: categories[Math.floor(Math.random() * categories.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: new Date(Date.now() - index * 86400000).toISOString()
      }));
    };

    const mockTickets = generateMockTickets();
    setTickets(mockTickets);
    setLoading(false);
  }, []);

  const handleCreateTicket = () => {
    const ticket = {
      ...newTicket,
      id: `TICKET${String(tickets.length + 1).padStart(4, '0')}`,
      user: currentUser,
      status: ticketStatuses.OPEN,
      createdAt: new Date().toISOString()
    };

    setTickets(prev => [ticket, ...prev]);
    setOpenCreateTicket(false);
    setNewTicket({
      title: '',
      description: '',
      priority: 'medium',
      category: 'general'
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3, bgcolor: alpha(theme.palette.background.default, 0.98) }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: theme.palette.text.primary
          }}
        >
          My Support Tickets
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateTicket(true)}
          sx={{ 
            textTransform: 'none',
            boxShadow: theme.shadows[2],
            '&:hover': {
              boxShadow: theme.shadows[4]
            }
          }}
        >
          Create New Ticket
        </Button>
      </Box>

      {/* Ticket Stats */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 3,
          mb: 4
        }}
      >
        {Object.entries(ticketStatuses).map(([key, status]) => (
          <Card
            key={status}
            elevation={2}
            sx={{
              bgcolor: alpha(theme.palette.background.paper, 0.9),
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[8]
              }
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: '50%',
                    p: 1,
                    display: 'flex',
                    color: theme.palette.primary.main
                  }}
                >
                  <QuestionAnswerIcon />
                </Box>
                <Box>
                  <Typography variant="h5" color="text.primary">
                    {tickets.filter(ticket => ticket.status === status).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                    {status.replace('_', ' ')} Tickets
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Tickets Table */}
      <Paper elevation={3} sx={{ bgcolor: theme.palette.background.paper }}>
        {loading ? (
          <Box sx={{ width: '100%', p: 2 }}>
            <LinearProgress />
          </Box>
        ) : (
          <Fade in={!loading}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Ticket ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tickets
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((ticket) => (
                      <TableRow
                        key={ticket.id}
                        sx={{
                          '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.1) },
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <TableCell>{ticket.id}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ 
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {ticket.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={categoryIcons[ticket.category]}
                            label={ticket.category}
                            size="small"
                            sx={{
                              textTransform: 'capitalize',
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={ticket.priority}
                            size="small"
                            sx={{
                              textTransform: 'capitalize',
                              bgcolor: alpha(priorityColors[ticket.priority], 0.1),
                              color: priorityColors[ticket.priority]
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={ticket.status.replace('_', ' ')}
                            size="small"
                            sx={{
                              textTransform: 'capitalize',
                              bgcolor: alpha(theme.palette.secondary.main, 0.1),
                              color: theme.palette.secondary.main
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(ticket.createdAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Fade>
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={tickets.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Create Ticket Dialog */}
      <Dialog 
        open={openCreateTicket} 
        onClose={() => setOpenCreateTicket(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Support Ticket</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                variant="outlined"
                value={newTicket.title}
                onChange={(e) => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                variant="outlined"
                multiline
                rows={4}
                value={newTicket.description}
                onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value }))}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Category</InputLabel>
                <Select
                  value={newTicket.category}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, category: e.target.value }))}
                  label="Category"
                >
                  <MenuItem value="bug">Bug</MenuItem>
                  <MenuItem value="feature">Feature</MenuItem>
                  <MenuItem value="general">General</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateTicket(false)} color="secondary">
            Cancel
          </Button>
          <Button 
            onClick={handleCreateTicket} 
            variant="contained" 
            disabled={!newTicket.title || !newTicket.description}
          >
            Create Ticket
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserTicketingSystem;