import { Box, Typography, Alert } from "@mui/material"; // jp: Agregar Alert
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import GaugeComponent from "react-gauge-component";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useParams, useNavigate, useLocation, Outlet } from "react-router-dom";
import Recoverability from "./recoverability";

const DataMonitor = () => {
  const { databaseName } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { organization } = useLocation().state || {};
  const { source } = useParams(); // Retrieve source from the URL parameters
  const location = useLocation();
  
  const [responsiveData, setResponsiveData] = useState({
    performance: 50,
    recoverability: 25,
    organization: 25
  });
  const [gaugeOrder, setGaugeOrder] = useState(["performance", "recoverability", /*"space",*/ "organization"/*, "readiness"*/]); // jp: Estado para el orden de los gauges
  const [alertVisible, setAlertVisible] = useState(false); // jp: Estado para mostrar alertas

  useEffect(() => {
    const fetchResponsivenessData = async () => {
      try {
        const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/dashboards/${organization}/management/sources/${source}/responsivness`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`, // Add token to Authorization header
              'Content-Type': 'application/json',
            },
          }
        );        
        const data = await response.json();
        setResponsiveData({
          cpu: 50,
          memory: 50,
          space: data.space,
          speed: data.speed,
          readiness: data.readinessData
        });
        console.log(data);
      } catch (error) {
        console.error("Error fetching responsiveness data:", error);
      }
    };

    fetchResponsivenessData();
    const interval = setInterval(fetchResponsivenessData, 5000);

    return () => clearInterval(interval);
  }, [databaseName, organization, source]);

  // jp: Funciones para drag and drop
  const handleDragStart = (index) => (event) => {
    event.dataTransfer.setData("text/plain", index); // Guarda el índice del elemento arrastrado
  };

  const handleDrop = (index) => (event) => {
    event.preventDefault();
    const fromIndex = event.dataTransfer.getData("text/plain"); // Obtiene el índice del elemento arrastrado
    const newOrder = [...gaugeOrder]; // Copia el orden actual
    const [movedItem] = newOrder.splice(fromIndex, 1); // Remueve el elemento de su posición original
    newOrder.splice(index, 0, movedItem); // Inserta el elemento en la nueva posición
    setGaugeOrder(newOrder); // Actualiza el estado con el nuevo orden

    // Muestra una alerta temporal
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 3000);
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Permite que el elemento se pueda soltar
  };

  const ResponsivenessBox = ({ title, value, route, index }) => (
    <Box
      key={index}
      draggable // jp: Hace que el elemento sea arrastrable
      onDragStart={handleDragStart(index)} // jp: Se ejecuta cuando comienza el arrastre
      onDrop={handleDrop(index)} // jp: Se ejecuta cuando se suelta el elemento
      onDragOver={handleDragOver} // jp: Permite que el elemento se pueda soltar
      onClick={() =>
        navigate(`/monitoring/details/${databaseName}${route}`, {
          state: { organization }
        })
      }
      style={{
        cursor: "pointer",
        backgroundColor: colors.primary[400],
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px"
      }}
    >
      <Typography variant="h6" color={colors.grey[100]}>
        {title}
      </Typography>
      <GaugeComponent
        value={value}
        type="radial"
        arc={{
          colorArray: ['#EA4228', '#5BE12C'],
          subArcs: [{ limit: 33 }, { limit: 66 }, {}],
          padding: 0.02,
          width: 0.3
        }}
      />
    </Box>
  );
  const isNestedRoute = location.pathname.includes(`/monitoring/details/${databaseName}/${databaseName}`);
  return (
    <Box m="20px">
      {!isNestedRoute && (
        <Header title={`Monitoring of ${databaseName.toUpperCase()}`} subtitle="" />
      )}
      {/* jp: Alert para cambios en el orden */}
      {alertVisible && (
        <Alert variant="outlined" severity="success" sx={{ mt: 2 }}>
          Gauge chart order changed!
        </Alert>
      )}
      {!isNestedRoute && (
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
        {gaugeOrder.map((gaugeName, index) => {
          let gaugeValue;
          let gaugeTitle;
          let gaugeRoute;

          switch (gaugeName) {
            case "performance":
              gaugeValue = responsiveData.performance;
              gaugeTitle = "Performance";
              gaugeRoute = "/performance";
              break;
            case "recoverability":
              gaugeValue = responsiveData.recoverability;
              gaugeTitle = "Recoverality";
              gaugeRoute = "/recoverability";
              break;
            /*case "space":
              gaugeValue = responsiveData.space;
              gaugeTitle = "Space Usage";
              gaugeRoute = "space";
              break;*/
            case "organization":
              gaugeValue = responsiveData.organization;
              gaugeTitle = "Organization";
              gaugeRoute = "/organization";
              break;
            /*case "readiness":
              gaugeValue = responsiveData.readinessData;
              gaugeTitle = "Readiness";
              gaugeRoute = "readiness";
              break;*/
            default:
              gaugeValue = 0;
              gaugeTitle = "Unknown";
              gaugeRoute = "";
          }

          return (
            <ResponsivenessBox
              key={index}
              title={gaugeTitle}
              value={gaugeValue}
              route={gaugeRoute}
              index={index}
            />
          );
        })}
        </Box>
        )}{isNestedRoute && <Outlet />}
      
    </Box>
  );
};

export default DataMonitor;