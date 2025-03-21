import { Box, Typography, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import GaugeComponent from "react-gauge-component";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useParams, useLocation } from "react-router-dom";
import LineChart from '../../components/LineChart';
//import Enviroment from ".";

const Chanhist = ({onDataUpdate}) => { //Ths is just added by Jose
  const { databaseName } = useParams(); // Get database name from the URL
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [responseData, setResponseData] = useState(52);
  const [memoryData, setMemoryData] = useState(33);
  const [spaceData, setSpaceData] = useState(98);
  const { source } = useParams(); // Retrieve source from the URL parameters
  const { organization } = useLocation().state || {};
  const [gaugeOrder, setGaugeOrder] = useState(["table", "index", "view"]); // State for the gauges order
  const [alertVisible, setAlertVisible] = useState(false); // State to show the alert
 
  const texts = ["TABLE", "INDEX", "VIEW"];
  const workloadData = [
    {
      id: "Target only", // Identificador único para la primera línea
      color: "hsl(0, 0%, 0%)", // Negro
      data: Array.from({ length: 30 }, (_, i) => ({
        x: i % 5 === 0 ? i : null, // Solo asigna valor a x cada 5 iteraciones
        y: Math.floor(Math.random() * 100), // Número aleatorio entre 0 y 99
      })).filter((item) => item.x !== null), // Filtra los elementos donde x no sea null,,
    },
    {
      id: "Difference", // Identificador único para la segunda línea
      color: "hsl(0, 100%, 50%)", // Rojo
      data: Array.from({ length: 30 }, (_, i) => ({
        x: i % 5 === 0 ? i : null, // Solo asigna valor a x cada 5 iteraciones
        y: Math.floor(Math.random() * 100), // Número aleatorio entre 0 y 99
      })).filter((item) => item.x !== null), // Filtra los elementos donde x no sea null,,
    },
    {
      id: "Source only", // Identificador único para la tercera línea
      color: "hsl(60, 100%, 50%)", // Amarillo
      data: Array.from({ length: 30 }, (_, i) => ({
        x: i % 5 === 0 ? i : null, // Solo asigna valor a x cada 5 iteraciones
        y: Math.floor(Math.random() * 100), // Número aleatorio entre 0 y 99
      })).filter((item) => item.x !== null), // Filtra los elementos donde x no sea null,,
    },
  ];
  
      // Función para generar etiquetas personalizadas para el eje x
const generateXAxisLabels = () => {
  const labels = [];
  for (let i = 0; i <= 30; i += 5) {
    const hour = i % 24; // Hora (0-23)
    const day = Math.floor(Math.random() * 30) + 1; // Día aleatorio (1-30)
    const month = Math.floor(Math.random() * 12) + 1; // Mes aleatorio (1-12)
    labels.push(`${hour} hr\n${day} DD\n${month} MM`);
  }
  return labels;
};
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
        // Push back the results to the tachnical_details.jsx page
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
      //Finish of the pushing

     //   console.log(data); // Check the fetched data
     // } catch (error) {
     //   console.error("Error fetching recovery data:", error);
     // }
   // };

    fetchAvailibilityData();
  }, [databaseName, organization,source, onDataUpdate]); //onDataUpdate is just added Jose 
  // Funtions for the drag and drop
  const handleDragStart = (index) => (event) => {
    event.dataTransfer.setData("text/plain", index); // Save the index for the drag element 
  };

  const handleDrop = (index) => (event) => {
    event.preventDefault();
    const fromIndex = event.dataTransfer.getData("text/plain"); // Obtiene el índice del elemento arrastrado
    const newOrder = [...gaugeOrder]; // Copy the currently copy
    const [movedItem] = newOrder.splice(fromIndex, 1); // Remove the element of the original position
    newOrder.splice(index, 0, movedItem); // Insert the element in the new position
    setGaugeOrder(newOrder); // Uodate the state with the new order

    // SHows a temporally alert
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 3000);
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Allow you to drop the element
  };
  return (

    <Box m="20px">
      
      <Header title={`Change of history` } subtitle=""    />
      
    {/* Alert for the change in the order */}
    {alertVisible && (
        <Alert variant="outlined" severity="success" sx={{ mt: 2 }}>
          Gauge chart order changed!
        </Alert>
      )}
       {/* Contenedor de gráficos */}
       <Box m="2px 2px" display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="10px">
         {["TABLE", "INDEX", "VIEW"].map((text, index) => (
          <Box m="50px 2px" key={index} height="200px">
            <Typography variant="h4" gutterBottom>
              {text}
            </Typography>
            <LineChart data={workloadData}  xAxisLabels={["0 hr\n19 DD\n03 MM", "5 hr\n20 DD\n04 MM", "10 hr\n21 DD\n05 MM", "15 hr\n22 DD\n06 MM", "20 hr\n23 DD\n07 MM", "25 hr\n24 DD\n08 MM", "30 hr\n25 DD\n09 MM"]}yAxisLegend="" xAxisLegend="" />
            </Box>
          ))}
          
        </Box>
    </Box>
    
  );
 
  
  
};

export default Chanhist;
