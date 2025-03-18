import { Box, useTheme, Typography, TextField, Alert } from "@mui/material"; // Importar TextField
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
  const [gaugeOrder, setGaugeOrder] = useState(["availability", "efficiency","organization"]); // State for the gauges order
  const [alertVisible, setAlertVisible] = useState(false); // State to show alerts

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
// Funtions to drag and drop
const handleDragStart = (index) => (event) => {
  event.dataTransfer.setData("text/plain", index); // Save the index of the dragged element
};

const handleDrop = (index) => (event) => {
  event.preventDefault();
  const fromIndex = event.dataTransfer.getData("text/plain"); // Get the index of the dragged element
  const newOrder = [...gaugeOrder]; // Copy the currently state
  const [movedItem] = newOrder.splice(fromIndex, 1); // Remove the element of the original state
  newOrder.splice(index, 0, movedItem); // Insert the element in the new position
  setGaugeOrder(newOrder); // Up date the state with the new order
// Shows a temporal alert
setAlertVisible(true);
setTimeout(() => setAlertVisible(false), 3000);
};
  const handleDragOver = (event) => {
    event.preventDefault(); // Allow you to drop the element
  };
  if (!detailsData) return <Typography>Loading...</Typography>;

  // Sumar los valores de availability
  //const totalAvailability = availabilityData.response + availabilityData.memory + availabilityData.space;
  const totalAvailability = availabilityData
  /*? availabilityData.response + availabilityData.memory + availabilityData.space
  : 0;
*/
  const GaugeBox = ({ title, value, route, index }) => ( //index was addes for the draganddrop property
    <Box
    key={index}
      draggable // Make the element be draggable
      onDragStart={handleDragStart(index)} // This execute when the dragging starts
      onDrop={handleDrop(index)} // This execute when the element is dropped
      onDragOver={handleDragOver} // Allow to the element to be dropped
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
        labels={{
          tickLabels: {
            type: "inner",
            ticks: [
              { value: 20 },
              { value: 40 },
              { value: 60 },
              { value: 80 },
              { value: 100 }
            ]
          }
        }}
      />
    </Box>
  );
  
  return (
    <Box m="20px">
      {/* Header con el título y el cuadro de texto */}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Header title={`Details for ${databaseName}`} subtitle="Monitoring" />
       
      </Box>
      {/* Alert for the changes in the order */}
      {alertVisible && (
        <Alert variant="outlined" severity="success" sx={{ mt: 2 }}>
          Gauge chart order changed!
        </Alert>
      )}
      {}
      {/* Gauges */}
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
        {gaugeOrder.map((route, index) => {
          const titleMap = {
            availability: "Performance ",
            efficiency: "Recoverability ",
            //security: "Organization",
            organization: "Organization",
          };
          const title = titleMap[route];
          const value = detailsData[route] ; // Obtener el valor de detailsData o usar 0 como valor predeterminado

          return (
            <GaugeBox
              key={route}
              title={title}
              value={value}
              route={route}
              index={index}
            />
          );
          
        })}
      </Box>
    </Box>
    
  );
};

export default TechnicalDetails;