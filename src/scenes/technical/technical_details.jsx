import { Box, useTheme, Typography, TextField } from "@mui/material"; // Importar TextField
import { tokens } from "../../theme";
import Header from "../../components/Header";
import GaugeComponent from "react-gauge-component";
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
//import 
const TechnicalDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { databaseName } = useParams();
  const { organization } = useLocation().state || {};
  const navigate = useNavigate();
  const { source } = useParams();
  const [detailsData, setDetailsData] = useState(null);
  const [availabilityData, setAvailabilityData] = useState(null);

  useEffect(() => {
    const fetchDetailsData = async () => {
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

    fetchDetailsData();
  }, [databaseName, organization, source]);

  const handleBoxClick = (route) => {
    navigate(`/technical/details/${databaseName}/${route}`);
  };

  const handleAvailabilityDataUpdate = (data) => {
    setAvailabilityData(data);
  };

  if (!detailsData) return <Typography>Loading...</Typography>;

  // Sumar los valores de availability
  //const totalAvailability = availabilityData.response + availabilityData.memory + availabilityData.space;
  const totalAvailability = availabilityData
  /*? availabilityData.response + availabilityData.memory + availabilityData.space
  : 0;
*/
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
      <Typography variant="body1" color={colors.greenAccent[500]}>
       {value} {/* Aquí se muestra el valor de totalAvailability */}
      </Typography>
      <GaugeComponent
        value={value}
        type="radial"
        arc={{
          colorArray: ['#EA4228','#5BE12C'],
          subArcs: [{ limit: 33 }, { limit: 66 }, {}],
          padding: 0.02,
          width: 0.3
        }}
      />
    </Box>
  );
  
  return (
    <Box m="20px">
      {/* Header con el título y el cuadro de texto */}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Header title={`Details for ${databaseName}`} subtitle="Technical" />
        <TextField
          label="Total Availability"
          variant="outlined"
          value={totalAvailability} //Changed for totalAvailability - Jose
          InputProps={{
            readOnly: true, // Hacer el campo de solo lectura
          }}
          sx={{
            backgroundColor: colors.primary[400], // Fondo del cuadro de texto
            borderRadius: "4px",
            width: "200px", // Ancho del cuadro de texto
          }}
        />
      </Box>

      {/* Gauges */}
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
        <GaugeBox title="Jens" /*value={totalAvailability}*/ route="availability" /> 
        <GaugeBox title="Elias" /*value={detailsData.efficiency}*/ route="efficiency" />
        <GaugeBox title="Sina" /*value={detailsData.security}*/ route="security" />
        <GaugeBox title="Jean-Marie" /*value={detailsData.organization}*/ route="organization" />
      </Box>
    </Box>
  );
};

export default TechnicalDetails;