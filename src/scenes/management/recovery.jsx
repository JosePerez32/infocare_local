import { Box, Typography, Alert } from "@mui/material"; // jp: Agregar Alert
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import GaugeComponent from "react-gauge-component";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const Recovery = () => {
  const { databaseName } = useParams(); // Get database name from the URL
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { organization } = useLocation().state || {};
  const { source } = useParams(); // Retrieve source from the URL parameters
  const [recoveryData, setRecoveryData] = useState({
    drp: 0,
    logging: 0,
    backups: 0,
  });
  const [gaugeOrder, setGaugeOrder] = useState(["drp", "logging", "backups"]); // jp: Estado para el orden de los gauges
  const [alertVisible, setAlertVisible] = useState(false); // jp: Estado para mostrar alertas

  useEffect(() => {
    const fetchRecoveryData = async () => {
      try {
        const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/dashboards/${organization}/management/sources/${source}/recovery`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`, // Add token to Authorization header
              'Content-Type': 'application/json',
            },
          }
        );  
        const data = await response.json();
        setRecoveryData({
          drp: data.drp,
          logging: data.logging,
          backups: data.backups,
        });

        console.log(data); // Check the fetched data
      } catch (error) {
        console.error("Error fetching recovery data:", error);
      }
    };

    fetchRecoveryData();
    const interval = setInterval(fetchRecoveryData, 5000);

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

  const RecoveryBox = ({ title, value, route, index }) => (
    <Box
      key={index}
      draggable // jp: Hace que el elemento sea arrastrable
      onDragStart={handleDragStart(index)} // jp: Se ejecuta cuando comienza el arrastre
      onDrop={handleDrop(index)} // jp: Se ejecuta cuando se suelta el elemento
      onDragOver={handleDragOver} // jp: Permite que el elemento se pueda soltar
      onClick={() => navigate(`/management/details/${databaseName}/recovery/${route}`)}
      style={{
        cursor: "pointer",
        backgroundColor: colors.primary[400],
        padding: "20px",
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
          colorArray: [ '#EA4228' ,'#5BE12C'],
          subArcs: [{ limit: 33 }, { limit: 66 }, /*{}, {}, */{}],
          padding: 0.02,
          width: 0.3
        }}
      />
    </Box>
  );

  return (
    <Box m="20px">
      <Header title={`Recovery Details for ${databaseName}`} subtitle="Overall Recovery" />

      {/* jp: Alert para cambios en el orden */}
      {alertVisible && (
        <Alert variant="outlined" severity="success" sx={{ mt: 2 }}>
          Gauge chart order changed!
        </Alert>
      )}

      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
        {gaugeOrder.map((gaugeName, index) => {
          let gaugeValue;
          let gaugeTitle;
          let gaugeRoute;

          switch (gaugeName) {
            case "drp":
              gaugeValue = recoveryData.drp;
              gaugeTitle = "DRP";
              gaugeRoute = "drp";
              break;
            case "logging":
              gaugeValue = recoveryData.logging;
              gaugeTitle = "Logging";
              gaugeRoute = "logging";
              break;
            case "backups":
              gaugeValue = recoveryData.backups;
              gaugeTitle = "Backups";
              gaugeRoute = "backups";
              break;
            default:
              gaugeValue = 0;
              gaugeTitle = "Unknown";
              gaugeRoute = "";
          }

          return (
            <RecoveryBox
              key={index}
              title={gaugeTitle}
              value={gaugeValue}
              route={gaugeRoute}
              index={index}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default Recovery;