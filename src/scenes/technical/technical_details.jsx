import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import GaugeComponent from "react-gauge-component";
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const TechnicalDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { databaseName } = useParams();
  const { organization } = useLocation().state || {};
  const navigate = useNavigate();
  const { source } = useParams(); // Retrieve source from the URL parameters
  const [detailsData, setDetailsData] = useState(null);
  const [availabilityData, setAvailabilityData] = useState({ response: 0, memory: 0, space: 0 });//This Line is just added
  useEffect(() => {
    const fetchDetailsData = async () => {
      try {
        const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/dashboards/${organization}/management/sources/${source}`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`, // Add token to Authorization header
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

    fetchDetailsData();
  }, [databaseName,organization,source]);

  //if (!detailsData) return <Typography>Loading...</Typography>;
//This is going to conetent the new lines
  //The line bellow are just been commented
  const handleBoxClick = (route) => {
    navigate(`/technical/details/${databaseName}/${route}`);
  };
  if (!detailsData) return <Typography>Loading...</Typography>;

  // Sumar los valores de availability
  const totalAvailability = availabilityData.response + availabilityData.memory + availabilityData.space;

  const GaugeBox = ({ title, value, route }) => (
    <Box
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

  return (
    <Box m="20px">
      <Header title={`Details for ${databaseName}`} subtitle="Details" />
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
        <GaugeBox title="Availability" value={detailsData.availability} route="availability" />
        <GaugeBox title="Efficiency" value={detailsData.efficiency} route="efficiency" />
        <GaugeBox title="Security" value={detailsData.security} route="security" />
        <GaugeBox title="Organization" value={detailsData.organization} route="organization" />
      </Box>
    </Box>
  );
};

export default TechnicalDetails;