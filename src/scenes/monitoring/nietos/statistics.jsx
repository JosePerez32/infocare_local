import { Box, Typography, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { useParams, useLocation } from "react-router-dom";
import LineChart from '../../../components/LineChart';

const Statistics = ({ onDataUpdate }) => {
  const { databaseName } = useParams(); // Get database name from the URL
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [responseData, setResponseData] = useState(52);
  const [memoryData, setMemoryData] = useState(33);
  const [spaceData, setSpaceData] = useState(98);
  const { source } = useParams(); // Retrieve source from the URL parameters
  const { organization } = useLocation().state || {};
  const [gaugeOrder, setGaugeOrder] = useState(["workload", "change", "objects"]); // State for the gauges order
  const [alertVisible, setAlertVisible] = useState(false); // State to show the alert
  const location = useLocation();


  const texts = ["No statistics","Age Statistics"];

  // Crear workloadData con el mismo id que el texto mapeado
  const workloadData = texts.map((text) => ({
    id: text, // Usar el texto como id
    color: "hsl(120, 70%, 50%)",
    data: Array.from({ length: 30 }, (_, i) => ({
      x: i % 5 === 0 ? i : null, // Solo asigna valor a x cada 5 iteraciones
      axisBottom: i,
      y: Math.floor(Math.random() * 100), // Número aleatorio entre 0 y 99
    })).filter((item) => item.x !== null), // Filtra los elementos donde x no sea null,
  }));

  useEffect(() => {
    const fetchAvailibilityData = async () => {
      try {
        const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/dashboards/${organization}/technical/sources/${source}/availability`,
          {
            headers: {
              'Authorization': `Bearer ${token}`, // Add token to Authorization header
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await response.json();
        setResponseData(data.response);
        setMemoryData(data.memory);
        setSpaceData(data.space);
        // Push back the results to the technical_details.jsx page
        if (onDataUpdate) {
          onDataUpdate({
            response: data.response,
            memory: data.memory,
            space: data.space,
          });
        }
      } catch (error) {
        console.error("Error fetching availability data:", error);
      }
    };

    fetchAvailibilityData();
  }, [databaseName, organization, source, onDataUpdate]);

  // Functions for the drag and drop
  const handleDragStart = (index) => (event) => {
    event.dataTransfer.setData("text/plain", index); // Save the index for the drag element
  };

  const handleDrop = (index) => (event) => {
    event.preventDefault();
    const fromIndex = event.dataTransfer.getData("text/plain"); // Obtiene el índice del elemento arrastrado
    const newOrder = [...gaugeOrder]; // Copy the currently copy
    const [movedItem] = newOrder.splice(fromIndex, 1); // Remove the element of the original position
    newOrder.splice(index, 0, movedItem); // Insert the element in the new position
    setGaugeOrder(newOrder); // Update the state with the new order

    // Shows a temporary alert
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 3000);
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Allow you to drop the element
  };
  const isNestedRoute = location.pathname.includes(`/monitoring/details/Monitoring of ${databaseName}/organization/`);

  return (
    <Box m="20px">
      <Header title={`Workload for ${databaseName}`} subtitle="" />

      {/* Alert for the change in the order */}
      {alertVisible && (
        <Alert variant="outlined" severity="success" sx={{ mt: 2 }}>
          Gauge chart order changed!
        </Alert>
      )}

      {/* Contenedor de gráficos */}
      <Box m="2px" display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="10px">
        {texts.map((text, index) => (
          <Box key={index} height="200px" position="relative">
            <Typography variant="h4" gutterBottom>
               {/* Mostrar el texto mapeado */}
            </Typography>
            <LineChart
              data={[workloadData[index]]}
              enableLegends={false} // Deshabilita la leyenda
              enableTooltip={false} // Deshabilita el tooltip
              yAxisLegend=""
              xAxisLegend="Hours"
              axisBottom={{
                tickValues: "" // Mostrar solo cada 5 cifras
              }}
            />
            {/* Líneas verticales solo para la primera y segunda gráfica */}
          
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Statistics;