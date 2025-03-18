import { Box, Typography, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import GaugeComponent from "react-gauge-component";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useParams, useLocation } from "react-router-dom";
import LineChart from '../../components/LineChart';
import BarChart from "../../components/BarChart";
//import Enviroment from ".";

const ObjHistory = ({onDataUpdate}) => { //Ths is just added by Jose
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
  /*const workloadData = [
    {
      id: "table", // Identificador único para la primera línea
      color: "hsl(0, 0%, 0%)", // Negro
      data: Array.from({ length: 3 }, (_, i) => ({
        x: i,
        y: Math.floor(Math.random() * 100), // Número aleatorio entre 0 y 99
      })),
    },
    {
      id: "index", // Identificador único para la segunda línea
      color: "hsl(0, 100%, 50%)", // Rojo
      data: Array.from({ length: 3 }, (_, i) => ({
        x: i,
        y: Math.floor(Math.random() * 100), // Número aleatorio entre 0 y 99
      })),
    },
    {
      id: "view", // Identificador único para la tercera línea
      color: "hsl(60, 100%, 50%)", // Amarillo
      data: Array.from({ length: 3 }, (_, i) => ({
        x: i,
        y: Math.floor(Math.random() * 100), // Número aleatorio entre 0 y 99
      })),
    },
  ];*/
  // Definir primero las barras amarilla y azul
const tableData = Array.from({ length: 3 }, (_, i) => ({
  x: i,
  y: Math.floor(Math.random() * 100), // Número aleatorio entre 0 y 99
}));

const viewData = Array.from({ length: 3 }, (_, i) => ({
  x: i,
  y: Math.floor(Math.random() * 100), // Número aleatorio entre 0 y 99
}));

// Calcular la barra verde como la suma de las barras amarilla y azul
const indexData = tableData.map((item, i) => ({
  x: item.x,
  y: item.y + viewData[i].y, // Suma de las barras amarilla y azul
}));

// Definir workloadData después de que todas las barras estén listas
const workloadData = [
  {
    id: "table", // Identificador único para la primera barra
    color: "hsl(60, 100%, 50%)", // Amarillo
    data: tableData,
  },
  {
    id: "index", // Identificador único para la segunda barra
    color: "hsl(120, 100%, 50%)", // Verde
    data: indexData,
  },
  {
    id: "view", // Identificador único para la tercera barra
    color: "hsl(240, 100%, 50%)", // Azul
    data: viewData,
  },
];

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
      
      <Header title={`Objects of history` } subtitle=""    />
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'white', textAlign: 'left' }}>
      DATABASE:     PRD_FRST<br /><br /> {/* Aquí puedes agregar el valor de Target si es dinámico */}
    </Typography>
    {/* Alert for the change in the order */}
    {alertVisible && (
        <Alert variant="outlined" severity="success" sx={{ mt: 2 }}>
          Gauge chart order changed!
        </Alert>
      )}
       {/* Contenedor de gráficos */}
       <Box m="2px" display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="10px">
         {["TABLE", "INDEX", "VIEW"].map((text, index) => (
          <Box key={index} height="200px">
            <Typography variant="h4" gutterBottom>
              {text}
            </Typography>
            <BarChart data={workloadData} yAxisLegend="Workload" xAxisLegend="Hours" />
            </Box>
          ))}
          
        </Box>
    </Box>
    
  );
 
  
  
};

export default ObjHistory;
