import { Box, useTheme, Typography, CircularProgress, Alert } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import GaugeComponent from 'react-gauge-component';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Performance = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { databaseName } = useParams(); // Obtiene el nombre del source de la URL
  const navigate = useNavigate();
  const [alertVisible, setAlertVisible] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch performance data when component mounts or source changes
  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        const organisation = localStorage.getItem('organization');
        
        if (!organisation) {
          throw new Error('Organization not found in localStorage');
        }
  
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/monitoring/source/performance`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'organisation': organisation,
              'source': databaseName
            }
          }
        );
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("Datos recibidos de la API:", data); // <-- Este es el console.log importante
        setMetrics(data);
      } catch (err) {
        console.error("Error fetching performance data:", err);
        setError(err.message || 'Failed to load performance data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchPerformanceData();
  }, [databaseName]);

  // Define the metrics to display and their configuration
  const metricConfigs = [
    { key: 'cpu', label: 'CPU', unit: '%', min: 0, max: 100 },
    { key: 'memory', label: 'Memory', unit: '%', min: 0, max: 100 },
    { key: 'speed', label: 'Speed', unit: '%', min: 0, max: 1000 },
    { key: 'workload', label: 'Workload', unit: '%', min: 0, max: 100 },
    { key: 'readiness', label: 'Readiness', unit: '%', min: 0, max: 100 },
    { key: 'connections', label: 'Connections', unit: '', min: 0, max: 1000 }
  ];
  const [gaugeOrder, setGaugeOrder] = useState(metricConfigs.map(config => config.key));

  const handleDragStart = (index) => (event) => {
    event.dataTransfer.setData("text/plain", index);
  };
  
  const handleDrop = (index) => (event) => {
    event.preventDefault();
    const fromIndex = Number(event.dataTransfer.getData("text/plain")); // Asegura que sea número
    const newOrder = [...gaugeOrder];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(index, 0, movedItem);
    setGaugeOrder(newOrder);
  
    // Opcional: Guardar en localStorage (como en tu otro componente)
    localStorage.setItem(`gauge_order_${databaseName}`, JSON.stringify(newOrder));
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 3000);
  };
  
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m="20px">
        <Header title="Performance Metrics" subtitle={`Source: ${databaseName}`} />
        <Alert severity="error" sx={{ mt: 2 }}>
          {error} - <Typography component="span" sx={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate(-1)}>Go back</Typography>
        </Alert>
      </Box>
    );
  }
  
  return (
    <Box m="20px">
     <Header 
      title={`Performance of ${databaseName}`} 
    />
    {alertVisible && <Alert variant="outlined" severity="success">Gauge chart order changed and saved</Alert>}
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
        {gaugeOrder.map((metricKey, index) => {
        const config = metricConfigs.find(c => c.key === metricKey);
          return (
          <Box
            key={config.key}
            draggable
            onDragStart={handleDragStart(index)}
            onDrop={handleDrop(index)}
            onDragOver={handleDragOver}
            onClick={() => navigate(`/monitoring/details/${databaseName}/performance/${config.key}`, )}
            sx={{
              backgroundColor: colors.primary[400],
              borderRadius: "8px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: 'move' 
            }}
          >
            <Typography variant="h6" color={colors.grey[100]} mb={2}>
              {config.label}
            </Typography>
            <GaugeComponent
              value={metrics?.[config.key] || 0}
              minValue={config.min}
              maxValue={config.max}
              type="radial"
              labels={{
                valueLabel: { 
                  formatTextValue: value => `${value}${config.unit}`,
                  style: { fill: colors.grey[100], cursor: "pointer",
                    "&:hover": {
                    cursor: "grab" // Opcional: cursor de agarre al hover
                  } }
                },
                tickLabels: {
                  type: "inner",
                  ticks: [
                    { value: config.min },
                    { value: config.max * 0.25 },
                    { value: config.max * 0.5 },
                    { value: config.max * 0.75 },
                    { value: config.max }
                  ],
                  style: { fill: colors.grey[100],
                    cursor: "pointer","&:hover": {
                    cursor: "grab" // Opcional: cursor de agarre al hover
                  }
                }
              }}}
              arc={{
                colorArray: ['#EA4228', '#F5CD19', '#5BE12C'],
                subArcs: [
                  { limit: config.max * 0.33 }, 
                  { limit: config.max * 0.66 }, 
                  {}
                ],
                padding: 0.02,
                width: 0.3
              }}
              pointer={{
                elastic: true,
                animationDelay: 200,
                color: colors.grey[100]
              }}
            />
            <Typography variant="body2" color={colors.grey[100]} mt={1}>
              Current: {metrics?.[config.key] || 0}{config.unit}
            </Typography>
          </Box>
          );})}
        
      </Box>
    </Box>
  );
  
};

export default Performance;