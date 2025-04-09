import { Box, useTheme, Typography, CircularProgress, Alert } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import GaugeComponent from 'react-gauge-component';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Performance = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { databaseName } = useParams();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gaugeOrder, setGaugeOrder] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);

  // Metric configuration - ahora con identificadores únicos
  const metricConfigs = [
    
    { id: 'recoverability', label: 'Recoverability', min: 0, max: 100 },
    { id: 'efficiency', label: 'Performance', min: 0, max: 100 },
    { id: 'organization', label: 'Organization', min: 0, max: 100 },
    
  ];

  // Fetch performance data
  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        const organisation = localStorage.getItem('organization');
        
        if (!organisation || !databaseName) {
          throw new Error('Missing required parameters');
        }

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/monitoring/source`,
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
console.log(`${databaseName}`);
        const data = await response.json();
        setMetrics(data);

        // Load saved order from localStorage
        const savedOrderKey = `order_performance_${databaseName}`;
        const savedOrder = localStorage.getItem(savedOrderKey);
        if (savedOrder) {
          setGaugeOrder(JSON.parse(savedOrder));
        } else {
          // Default order based on metricConfigs
          setGaugeOrder(metricConfigs.map(config => config.id));
        }
      } catch (err) {
        console.error("Error fetching performance data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [databaseName]);

  // Drag and drop handlers
  const handleDragStart = (index) => (event) => {
    event.dataTransfer.setData("text/plain", index);
  };

  const handleDrop = (index) => (event) => {
    event.preventDefault();
    const fromIndex = event.dataTransfer.getData("text/plain");
    const newOrder = [...gaugeOrder];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(index, 0, movedItem);
    setGaugeOrder(newOrder);

    // Save the new order in localStorage
    const savedOrderKey = `order_performance_${databaseName}`;
    localStorage.setItem(savedOrderKey, JSON.stringify(newOrder));

    // Show alert
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
        <Header title="Error" subtitle={`No se pudieron cargar las métricas para ${databaseName}`} />
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Header 
        title={`Monitoring of ${databaseName}`} 
      />
      
      {alertVisible && (
        <Alert severity="success" sx={{ mb: 2 }}>
          The order of the gauges has been saved.
        </Alert>
      )}

        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
        {gaugeOrder.map((metricId, index) => {
          const config = metricConfigs.find(m => m.id === metricId);
          if (!config || !metrics) return null;

          return (
            <Box
              key={config.id}
              draggable
              onDragStart={handleDragStart(index)}
              onDrop={handleDrop(index)}
              onDragOver={handleDragOver}
              onClick={() => navigate(`/monitoring/details/${databaseName}/${config?.label?.toLowerCase() || ''}`)}
              sx={{
                backgroundColor: colors.primary[400],
                borderRadius: "8px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: 'pointer',
                '&:active': {
                  cursor: 'grabbing'
                }
              }}
            >
              <Typography variant="h6" color={colors.grey[100]} mb={2}>
                {config.label}
              </Typography>
              <GaugeComponent
                value={metrics[config.id]}
                minValue={config.min}
                maxValue={config.max}
                type="radial"
                labels={{
                  tickLabels: {
                    type: "inner",
                    ticks: [
                      { value: config.min },
                      { value: config.min + (config.max - config.min) * 0.25 },
                      { value: config.min + (config.max - config.min) * 0.5 },
                      { value: config.min + (config.max - config.min) * 0.75 },
                      { value: config.max }
                    ]
                  }
                }}
                arc={{
                  colorArray: ['#EA4228', '#5BE12C'],
                  subArcs: [{ limit: 33 }, { limit: 66 }, {}],
                  padding: 0.02,
                  width: 0.3
                }}
                pointer={{
                  elastic: true,
                  animationDelay: 10
                }}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Performance;