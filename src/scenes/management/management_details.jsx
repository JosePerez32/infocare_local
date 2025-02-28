import { Box, useTheme, Typography, Alert } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import GaugeComponent from "react-gauge-component";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const ManagementDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const navigate = useNavigate();
  const [detailsData, setDetailsData] = useState(null);
  const { source } = useParams();
  const [gaugeOrder, setGaugeOrder] = useState(["responsiveness", "security", "recovery"]);
  const [alertVisible, setAlertVisible] = useState(false);

  // Get organization from state or localStorage
  const getOrganization = () => {
    if (location.state?.organization) {
      // Save to localStorage when we have it from state
      localStorage.setItem('currentOrganization', location.state.organization);
      return location.state.organization;
    }
    // Fallback to localStorage if not in state
    return localStorage.getItem('currentOrganization');
  };

  const organization = getOrganization();

  useEffect(() => {
    const fetchDetailsData = async () => {
      if (!organization) {
        console.error("No organization found");
        return;
      }

      try {
        const token = localStorage.getItem('accessToken');

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/dashboards/${organization}/management/sources/${source}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        const data = await response.json();
        setDetailsData(data);
      } catch (error) {
        console.error("Error fetching details data:", error);
      }
    };

    const savedOrder = localStorage.getItem(`gaugeOrder_${source}`);
    if (savedOrder) {
      setGaugeOrder(JSON.parse(savedOrder));
    }

    fetchDetailsData();
  }, [organization, source]);

  const handleBoxClick = (route) => {
    navigate(`/management/details/${source}/${route}`, {
      state: { organization } // Pass organization in state for forward navigation
    });
  };

  const handleDragStart = (index) => {
    return (event) => {
      event.dataTransfer.setData("text/plain", index);
    };
  };

  const handleDrop = (index) => {
    return (event) => {
      event.preventDefault();
      const fromIndex = parseInt(event.dataTransfer.getData("text/plain"));
      const newOrder = [...gaugeOrder];
      const [movedItem] = newOrder.splice(fromIndex, 1);
      newOrder.splice(index, 0, movedItem);
      setGaugeOrder(newOrder);
      localStorage.setItem(`gaugeOrder_${source}`, JSON.stringify(newOrder));
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
    };
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const GaugeBox = ({ title, value, route, index }) => (
    <Box
      draggable
      onDragStart={handleDragStart(index)}
      onDrop={handleDrop(index)}
      onDragOver={handleDragOver}
      onClick={() => handleBoxClick(route)}
      style={{
        cursor: "pointer",
        backgroundColor: colors.primary[400],
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <Typography variant="h6" color={colors.grey[100]}>
        {title}
      </Typography>
      <GaugeComponent
        value={value}
        type="radial"
        arc={{
          colorArray: ['#5BE12C', '#EA4228'],
          subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
          padding: 0.02,
          width: 0.3
        }}
      />
    </Box>
  );

  if (!organization) return <Typography>No organization selected</Typography>;
  if (!detailsData) return <Typography>Loading...</Typography>;

  return (
    <Box m="20px">
      <Header title={`Details for XX${source}`} subtitle="Details" />
      {alertVisible && <Alert variant="outlined" severity="success">Gauge chart order changed and saved</Alert>}
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
        {gaugeOrder.map((gauge, index) => (
          <GaugeBox
            key={gauge}
            title={gauge.charAt(0).toUpperCase() + gauge.slice(1)}
            value={detailsData[gauge]}
            route={gauge}
            index={index}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ManagementDetails;