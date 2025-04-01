import { Box, Typography, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import GaugeComponent from "react-gauge-component";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useParams, useLocation } from "react-router-dom";
import  BarChart from '../../components/BarChart';
import ChangeButtons from "./his-det-back";
import  LineChart from '../line';
import { Bar } from "react-chartjs-2";
import { Menu, MenuItem, Button } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
//import Enviroment from ".";

const Change = ({onDataUpdate}) => { //Ths is just added by Jose
  const { databaseName } = useParams(); // Get database name from the URL
  const theme = useTheme();

  const colors = tokens(theme.palette.mode);
  const [responseData, setResponseData] = useState(52);
  const [memoryData, setMemoryData] = useState(33);
  const [spaceData, setSpaceData] = useState(98);
  //const { organisation } = useLocation().state || {};
  const [gaugeOrder, setGaugeOrder] = useState(["workload", "change", "objects"]); // State for the gauges order
  const [alertVisible, setAlertVisible] = useState(false); // State to show the alert
  const [anchorEl, setAnchorEl] = useState(null);
  const [compareData, setCompareData] = useState(null);
  //const organisation = localStorage.getItem('organisation');
  //const { source } = useParams(); // Asegúrate de que esto viene de la URL
  const { organization } = useLocation().state || {}; // Esto podría ser undefined
  const location = useLocation();
  const open = Boolean(anchorEl);
  const [sourceNames, setSourceNames] = useState([]); // Nuevo estado para los nombres
  //jp: API integration
  const { organisation = "cloud_be_you", source = databaseName } = location.state || {}; 
  // Debuggeo (verifica en consola)
  console.log("Datos obtenidos:", { databaseName, organisation, source });
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    fetchCompareData();
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const fetchCompareData = async () => {
    const token = localStorage.getItem('accessToken');
    const org = localStorage.getItem('organization') || "cloud_be_you"; // Fallback
    if (!organization || !source) {
      console.error("Faltan parámetros:", { organization, source });
      return;
    }
    try {
      console.log('Fetching compare data with:', {
        organisation,
        source
      });
      const compareResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/environment/compare`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'organisation': org,
            'source': databaseName
          }
        }
      );
      const compareData = await compareResponse.json();
      // Llamada 2: /info/sources (en paralelo o secuencial)
      const sourcesResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/info/${databaseName}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'organisation': org
          }
        }
      );
      const { sources } = await sourcesResponse.json(); // Destructuración directa
     
      const sourcesData = await sourcesResponse.json();
      const names = sourcesData.sources.map(source => source.name); // Extrae solo los nombres
      // Verifica que sources existe y tiene datos
      if (sources && sources.length > 0) {
        setSourceNames(sources.map(item => item.name)); // Mapeo correcto
      } else {
        setSourceNames([]); // Lista vacía si no hay datos
      }
    } catch (error) {
      console.error("Error fetching compare data:", error);
      setSourceNames([]); // Lista vacía en caso de error
    }
    //jp: To fill the menu
    

  };
  //Tot hier
  const changeData = [
    {
      id: "",
      color: "hsl(240, 70%, 50%)",
      data: [
        { x: "Source", y: Math.floor(Math.random() * 100) }, // Dato para "Production(Only)"
        { x: "Diff", y: Math.floor(Math.random() * 100) }, // Dato para "Difference"
        { x: "Target", y: Math.floor(Math.random() * 100) }, // Dato para "Acceptation(Only)"
      ],
    },
  ];

  
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
  console.log("Valores actuales:", {
    databaseName, // ¿Es prd_lst?
    organisation, // ¿Tiene valor?
    source,       // ¿Tiene valor?
    apiUrl: process.env.REACT_APP_API_URL
  });
  return (
    
    <Box m="20px">
      
      
    {/* Alert for the change in the order */}
      <Header title={`Change of ${databaseName}` } subtitle=""    />
    {alertVisible && (
        <Alert variant="outlined" severity="success" sx={{ mt: 2 }}>
          Gauge chart order changed!
        </Alert>
      )}
       {/* Contenedor de gráficos */}
       <Box m="10px" display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="10px">
       <ChangeButtons databaseName={databaseName}/>
                 {/* jp: Deployder button */}
                 <Button
                    variant="contained"
                    endIcon={<ExpandMoreIcon />}
                    onClick={handleClick}
                    sx={{ width: '150px' }}
                  >
                    Compare
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                  >
                     {sourceNames.length > 0 ? (
                      sourceNames.map((name, index) => (
                        <MenuItem key={index} onClick={handleClose}>
                          {name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem onClick={handleClose}>No sources available</MenuItem>
                    )}
                  </Menu>
                  {/* jp: End of the section */}

       </Box>
       <Box m="2px" display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="5px">
        <Box  height="200px">
        </Box>
      </Box>
       <Box m="2px" display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="5px">
       {["TABLE", "INDEX", "VIEW"].map((text, index) => (
          <Box key={index} height="200px">
            <Typography variant="h4" gutterBottom>
              {text}
            </Typography>
            
            <BarChart data={changeData} yAxisLegend="" xAxisLegend="" />

            </Box>
          ))}
        </Box>

    </Box>
  );
};
export default Change;
