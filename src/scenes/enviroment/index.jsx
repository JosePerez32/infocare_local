import { Box, useTheme, Typography, Alert } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import GaugeComponent from 'react-gauge-component';
import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, useParams } from 'react-router-dom';
import '../styles-jp/title.css';
import Botones from './wco.jsx';


  const Enviroment = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [gaugeData, setGaugeData] = useState([]);
  const [gaugeOrder, setGaugeOrder] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const organization = localStorage.getItem('organization');
  const { databaseName } = useParams(); //jp: Get the databaseName of the url 
  // Fetch data and retrieve order from localStorage
  useEffect(() => {
    const fetchSourceData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/dashboards/${organization}/technical/sources`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json',
          },
        });

        const data = await response.json();

        // Populate gauge data with the fetched sources
        const filledGaugeData = data.sources.map(source => ({
          name: source.name,
          health: source.health,
        }));

        setGaugeData(filledGaugeData);

        // Load saved order from localStorage, if exists
        const savedOrder = localStorage.getItem('order_monitoring');
        if (savedOrder) {
          setGaugeOrder(JSON.parse(savedOrder));
        } else {
          setGaugeOrder(filledGaugeData.map(source => source.name)); // Default order
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSourceData();
  }, [organization]);
  
 
  const handleSourceClick = (source) => {
    const session = localStorage.getItem('session'); // Assuming 'session' is stored in localStorage
    navigate(`details/${source.name}`, { state: { organization, session } });
  };

  // Drag and drop handlers
  const handleDragStart = (index) => {
    return (event) => {
      event.dataTransfer.setData("text/plain", index);
    };
  };

  const handleDrop = (index) => {
    return (event) => {
      event.preventDefault();
      const fromIndex = event.dataTransfer.getData("text/plain");
      const newOrder = [...gaugeOrder];
      const [movedItem] = newOrder.splice(fromIndex, 1);
      newOrder.splice(index, 0, movedItem);
      setGaugeOrder(newOrder);

      // Save the new order in localStorage
      localStorage.setItem('order_monitoring', JSON.stringify(newOrder));

      // Show alert on order change
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
    };
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Allow the drop
  };

  const isNestedRoute = location.pathname.includes('/monitoring/details');

  return (
    <Box m="20px">
      {!isNestedRoute && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>

        <Header
          
          title="Environment monitoring"
          subtitle={``}
          className="header-title"
          
        />
        </div>

      )}
      {alertVisible && <Alert variant="outlined" severity="success">Gauge chart order changed and saved</Alert>}
      {!isNestedRoute && (
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
          {gaugeOrder.map((gaugeName, index) => {
            const source = gaugeData.find(g => g.name === gaugeName); // Find source by name
            if (!source) return null; // If the source is not found, skip rendering

            return (
              <Box
                key={index}
                draggable
                onDragStart={handleDragStart(index)}
                onDrop={handleDrop(index)}
                onDragOver={handleDragOver}
                //onClick={() => handleSourceClick(source)}
                style={{
                  backgroundColor: colors.primary[400],
                  borderRadius: "8px",
                  padding: "20px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Typography variant="h6" color={colors.grey[100]} className="header-subtitle" >
                  {source.name}
                </Typography>
                  {/* Imagen */}
                  <img
                      src="./assets/database-management.png" 
                      alt="Database" // Texto alternativo
                      style={{
                      width: "30%", // La imagen ocupa el 100% del ancho del contenedor
                      height: "auto", // La altura se ajusta automáticamente
                      maxWidth: "250px", // Ancho máximo de la imagen (ajusta según tus necesidades)
                      borderRadius: "8px", // Bordes redondeados
                      marginTop: "10px", // Espacio entre el subtítulo y la imagen
                      }}
                      
                  />
                  <Botones databaseName={source.name}/>
                </Box>
            );
          })} 
        </Box>
      )}
      {isNestedRoute && <Outlet />}
    </Box>
  );
};
export default Enviroment;
