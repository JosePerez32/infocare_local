import { useState } from "react";
import {
  Box,
  useTheme,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  InputAdornment,
  TextField,
  Chip,
  Fade,
  Button,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BuildIcon from "@mui/icons-material/Build";

const Clients = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchTerm, setSearchTerm] = useState("");

  // Dummy client data - replace with your actual data
  const clients = [
    {
      id: 1,
      name: "PSA",
      image: "/assets/psa_antwerp_logo.jpg", 
      industry: "Logistic",
      location: "Antwerpen, Belgium",
      employees: "1000+",
      projects: ["Logistic"],
      description: "Leading logistic company",
      managementDetails: {
        contactPerson: "John Doe",
        email: "john.doe@psa.com",
        strategicFocus: "Global Logistics Optimization"
      },
      technicalDetails: {
        primaryTechnology: "Logistics Management Software",
        integrationCapabilities: "API-driven Platform",
        cloudInfrastructure: "Hybrid Cloud"
      }
    },
    {
      id: 2,
      name: "Belfius",
      image: "/assets/belfius.jpg", 
      industry: "Finance",
      location: "Brussels, Belgium",
      employees: "5000+",
      projects: ["Banking"],
      description: "Banking",
      managementDetails: {
        contactPerson: "Jane Smith",
        email: "jane.smith@belfius.be",
        strategicFocus: "Digital Banking Transformation"
      },
      technicalDetails: {
        primaryTechnology: "Fintech Platform",
        integrationCapabilities: "Microservices Architecture",
        cloudInfrastructure: "Public Cloud"
      }
    },
  ];

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Header title="CLIENTS" subtitle="List of clients" />
      </Box>

      {/* SEARCH BAR */}
      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            backgroundColor: colors.primary[400],
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: colors.grey[400],
              },
              "&:hover fieldset": {
                borderColor: colors.grey[300],
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: colors.grey[300] }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* CLIENTS GRID */}
      <Grid container spacing={3}>
        {filteredClients.map((client) => (
          <Grid item xs={12} sm={6} md={4} key={client.id}>
            <Fade in={true} timeout={500}>
              <Card
                sx={{
                  backgroundColor: colors.primary[400],
                  borderRadius: "10px",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: theme.shadows[10],
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={client.image}
                  alt={client.name}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent>
                  {/* NEW: Static Buttons */}
                  <Box display="flex" justifyContent="center" gap={2} mb={2}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: colors.greenAccent[500],
                        color: colors.primary[100],
                        '&:hover': {
                          backgroundColor: colors.greenAccent[600],
                        }
                      }}
                    >
                      Management
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: colors.blueAccent[500],
                        color: colors.primary[100],
                        '&:hover': {
                          backgroundColor: colors.blueAccent[600],
                        }
                      }}
                    >
                      Technical
                    </Button>
                  </Box>

                  <Typography
                    variant="h5"
                    component="div"
                    gutterBottom
                    sx={{ color: colors.grey[100], fontWeight: "bold", textAlign: 'center' }}
                  >
                    {client.name}
                  </Typography>

                  {/* Common Details */}
                  <Box display="flex" alignItems="center" mb={1}>
                    <BusinessIcon sx={{ color: colors.grey[300], mr: 1 }} />
                    <Typography variant="body2" color={colors.grey[300]}>
                      {client.industry}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" mb={1}>
                    <LocationOnIcon sx={{ color: colors.grey[300], mr: 1 }} />
                    <Typography variant="body2" color={colors.grey[300]}>
                      {client.location}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" mb={2}>
                    <PeopleAltIcon sx={{ color: colors.grey[300], mr: 1 }} />
                    <Typography variant="body2" color={colors.grey[300]}>
                      {client.employees} employees
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    color={colors.grey[300]}
                    mb={2}
                  >
                    {client.description}
                  </Typography>

                  <Box mb={2}>
                    <Typography variant="subtitle2" color={colors.greenAccent[400]} mb={1}>
                      Management Details
                    </Typography>
                    <Typography variant="body2" color={colors.grey[300]}>
                      Contact: {client.managementDetails.contactPerson}
                    </Typography>
                    <Typography variant="body2" color={colors.grey[300]}>
                      Email: {client.managementDetails.email}
                    </Typography>
                    <Typography variant="body2" color={colors.grey[300]}>
                      Strategic Focus: {client.managementDetails.strategicFocus}
                    </Typography>
                  </Box>

                  <Box display="flex" gap={1} flexWrap="wrap">
                    {client.projects.map((project, index) => (
                      <Chip
                        key={index}
                        label={project}
                        size="small"
                        sx={{
                          backgroundColor: colors.greenAccent[700],
                          color: colors.grey[100],
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Clients;