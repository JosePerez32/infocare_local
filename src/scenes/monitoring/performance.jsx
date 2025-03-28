import { Box, useTheme, Typography, CircularProgress, Alert } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import GaugeComponent from 'react-gauge-component';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Performance = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { sourceName } = useParams(); // Obtiene el nombre del source de la URL
  const navigate = useNavigate();
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
              'source': sourceName
            }
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        console.error("Error fetching performance data:", err);
        setError(err.message || 'Failed to load performance data');
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [sourceName]);

  // Define the metrics to display and their configuration
  const metricConfigs = [
    { key: 'cpu', label: 'CPU Usage', unit: '%', min: 0, max: 100 },
    { key: 'memory', label: 'Memory Usage', unit: '%', min: 0, max: 100 },
    { key: 'speed', label: 'Speed', unit: 'Mbps', min: 0, max: 1000 },
    { key: 'workload', label: 'Workload', unit: '%', min: 0, max: 100 },
    { key: 'readiness', label: 'Readiness', unit: '%', min: 0, max: 100 },
    { key: 'connections', label: 'Connections', unit: '', min: 0, max: 1000 }
  ];

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
        <Header title="Performance Metrics" subtitle={`Source: ${sourceName}`} />
        <Alert severity="error" sx={{ mt: 2 }}>
          {error} - <Typography component="span" sx={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate(-1)}>Go back</Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Header 
        title="Performance Metrics" 
        subtitle={`Source: ${sourceName}`} 
      />
      
      <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap="20px" mt="20px">
        {metricConfigs.map((config) => (
          <Box
            key={config.key}
            sx={{
              backgroundColor: colors.primary[400],
              borderRadius: "8px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
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
                  style: { fill: colors.grey[100] }
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
                  style: { fill: colors.grey[100] }
                }
              }}
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
                animationDelay: 0,
                color: colors.grey[100]
              }}
            />
            <Typography variant="body2" color={colors.grey[100]} mt={1}>
              Current: {metrics?.[config.key] || 0}{config.unit}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Performance;