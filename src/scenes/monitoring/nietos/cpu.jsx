import { Box, Typography, Alert, Button, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { useParams } from "react-router-dom";
import NewLineChart from '../../../components/LineChartNew';
import LineChart from '../../../components/LineChart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const DEFAULT_COLORS = {
  idle: '#4CAF50',
  user: '#2196F3',
  system: '#F44336',
  iowait: '#FFEB3B'
};

const CPU = () => {
  const { databaseName } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [cpuData, setCpuData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Función para obtener colores del tema o usar defaults
  const getChartColors = () => ({
    idle: colors?.greenAccent?.[500] || DEFAULT_COLORS.idle,
    user: colors?.blueAccent?.[500] || DEFAULT_COLORS.user,
    system: colors?.redAccent?.[500] || DEFAULT_COLORS.system,
    iowait: colors?.yellowAccent?.[500] || DEFAULT_COLORS.iowait
  });

  // Función para obtener datos de la API
  const fetchCpuData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const organisation = localStorage.getItem('organisation');
      const token = localStorage.getItem('accessToken');
      
      // Calcular rango de 30 horas
      const now = new Date();
      const startTime = new Date(now.getTime() - (30 * 60 * 60 * 1000)).toISOString();
      const endTime = now.toISOString();

      const params = new URLSearchParams({
        start_time: startTime,
        end_time: endTime,
        rows: '30', // 6 puntos por hora × 30 horas
        grouping: 'sec'
      });

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/metrics/performance/cpu?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'organisation': organisation,
            'source': databaseName
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      transformDataForCharts(data);
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error("Error fetching CPU data:", error);
      setError("Failed to load CPU data. Please check if the table 'AGG_PRD_LST_CPU_USAGE' exists in your database.");
    } finally {
      setLoading(false);
    }
  };

  // Transformar los datos para el gráfico
  const transformDataForCharts = (apiData) => {
    try {
      const safeData = {
        timestamps: Array.isArray(apiData?.time) ? apiData.time : [],
        idle: Array.isArray(apiData?.cpu_idle) ? apiData.cpu_idle : [],
        user: Array.isArray(apiData?.cpu_user) ? apiData.cpu_user : [],
        system: Array.isArray(apiData?.cpu_system) ? apiData.cpu_system : [],
        iowait: Array.isArray(apiData?.cpu_iowait) ? apiData.cpu_iowait : []
      };

      // Validar que tenemos datos suficientes
      if (safeData.timestamps.length === 0) {
        throw new Error("No timestamp data available");
      }

      const chartColors = getChartColors();

      // Crear series de datos
      const chartData = [
        {
          id: 'CPU Idle',
          color: chartColors.idle,
          data: safeData.timestamps.map((timestamp, index) => ({
            x: new Date(timestamp).toISOString(),
            y: safeData.idle[index] || 0
          }))
        },
        {
          id: 'CPU User',
          color: chartColors.user,
          data: safeData.timestamps.map((timestamp, index) => ({
            x: new Date(timestamp).toISOString(),
            y: safeData.user[index] || 0
          }))
        },
        {
          id: 'CPU System',
          color: chartColors.system,
          data: safeData.timestamps.map((timestamp, index) => ({
            x: new Date(timestamp).toISOString(),
            y: safeData.system[index] || 0
          }))
        },
        {
          id: 'CPU IOWait',
          color: chartColors.iowait,
          data: safeData.timestamps.map((timestamp, index) => ({
            x: new Date(timestamp).toISOString(),
            y: safeData.iowait[index] || 0
          }))
        }
      ];

      setCpuData(chartData);
    } catch (error) {
      console.error("Error transforming data:", error);
      setError("Error processing CPU data: " + error.message);
    }
  };

  // Configurar auto-refresh cada 15 segundos
  useEffect(() => {
    fetchCpuData(); // Carga inicial
    
    const intervalId = setInterval(fetchCpuData, 15000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [databaseName]);

  // Verificar si los datos son válidos
  const isValidData = cpuData.length > 0 && cpuData[0].data.length > 0;

  return (
    <Box m="20px">
      <Header title={`CPU Performance - ${databaseName}`} />
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1">
          {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : "Loading initial data..."}
        </Typography>
      </Box>

      {loading && <Alert severity="info">Loading CPU data...</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Box height="400px">
        {isValidData ? (
          <NewLineChart
          data={cpuData}
          isTimeScale={true}
          yAxisLegend="Usage (%)"
          xAxisLegend="Last 30 Hours"
          margin={{ top: 50, right: 30, bottom: 80, left: 60 }}
          showPoints={true}
          />
        ) : (
          <Alert severity="warning">Waiting for valid data...</Alert>
        )}
      </Box>
    </Box>
  );
};

export default CPU;