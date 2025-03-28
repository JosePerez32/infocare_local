import { Box, useTheme, Typography, CircularProgress } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import GaugeComponent from 'react-gauge-component';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Performance = ( source ) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  //const { sourceName } = useParams(source); // Obtenemos el nombre del source de la URL
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch performance data when component mounts or source changes
  useEffect((  ) => {
    const fetchPerformanceData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        const organisation = localStorage.getItem('organization');
        
        if (!organisation || !source) {
          throw new Error('Missing required parameters');
        }

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/monitoring/source`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'organisation': organisation,
              'source': source
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
        setError(err.message);
        // Optional: redirect back if error
        // navigate('/monitoring');
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [source, navigate]);

  // Metric configuration
  const metricConfigs = [
    { key: 'availability', label: 'Availability', min: 0, max: 100 },
    { key: 'recoverability', label: 'Recoverability', min: 0, max: 100 },
    { key: 'efficiency', label: 'Efficiency', min: 0, max: 100 },
    { key: 'organization', label: 'Organization', min: 0, max: 100 },
    { key: 'security', label: 'Security', min: 0, max: 100 }
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
        <Header title="Error" subtitle={`No se pudieron cargar las métricas para ${source}`} />
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Header 
        title={`Rendiment metrics`} 
        subtitle={`Source: ${source}`}
      />
      
      <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap="20px">
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
              value={metrics ? metrics[config.key] : 0}
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
                animationDelay: 0
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Performance;