import { Box, Typography, Alert, Button, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { useParams } from "react-router-dom";
import LineChart from '../../../components/LineChart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CPU = () => {
  const { databaseName } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [cpuData, setCpuData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [grouping, setGrouping] = useState('hour');

  const [anchorElTime, setAnchorElTime] = useState(null);
  const [anchorElGroup, setAnchorElGroup] = useState(null);

  // Opciones de formato de fecha
  const dateFormatOptions = {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };

  const fetchCpuData = async () => {
    try {
      setLoading(true);
      setError(null);
   
      const organisation = localStorage.getItem('organisation');
      const token = localStorage.getItem('accessToken');
      const now = new Date();
      const startTime = new Date();
      
      switch(timeRange) {
        case '1h': startTime.setHours(now.getHours() - 1); break;
        case '24h': startTime.setDate(now.getDate() - 1); break;
        case '7d': startTime.setDate(now.getDate() - 7); break;
        case '30d': startTime.setDate(now.getDate() - 30); break;
        default: startTime.setDate(now.getDate() - 1);
      }
      // Mapeo correcto de grouping a los valores que espera el endpoint
      const getGroupingParam = () => {
        switch(grouping) {
          case 'sec': return 'sec';
          case 'min': return 'min'; 
          case 'hour': return 'uur';
          default: return 'uur'; // Valor por defecto
        }
      };
      // Parámetros de la consulta
      const params = new URLSearchParams({
        start_time: startTime.toISOString(),
        rows: '10',
        grouping: getGroupingParam() // Usamos la función de mapeo
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
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }
      
      const data = await response.json();
      transformDataForCharts(data);
      
    } catch (error) {
      console.error("Error fetching CPU data:", error);
      setError("Failed to load CPU data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const transformDataForCharts = (apiData) => {
    try {
      // Validación y limpieza de datos
      const safeData = {
        timestamps: Array.isArray(apiData?.time) ? apiData.time : [],
        idle: Array.isArray(apiData?.cpu_idle) ? apiData.cpu_idle : [],
        user: Array.isArray(apiData?.cpu_user) ? apiData.cpu_user : [],
        system: Array.isArray(apiData?.cpu_system) ? apiData.cpu_system : [],
        iowait: Array.isArray(apiData?.cpu_iowait) ? apiData.cpu_iowait : []
      };

      // Asegurar misma longitud de arrays
      const minLength = Math.min(
        safeData.timestamps.length,
        safeData.idle.length,
        safeData.user.length,
        safeData.system.length,
        safeData.iowait.length
      );

      // Crear datasets para cada métrica
      const chartData = [
        {
          id: 'CPU Idle',
          color: colors.greenAccent[500],
          data: minLength > 0 ? 
               Array(minLength).fill().map((_, i) => ({
                 x: new Date(safeData.timestamps[i]).toLocaleString('en-US', dateFormatOptions),
                 y: safeData.idle[i]
               })) : 
               [{
                 x: new Date().toLocaleString('en-US', dateFormatOptions),
                 y: 0
               }]
        },
        {
          id: 'CPU User',
          color: colors.blueAccent[500],
          data: minLength > 0 ? 
               Array(minLength).fill().map((_, i) => ({
                 x: new Date(safeData.timestamps[i]).toLocaleString('en-US', dateFormatOptions),
                 y: safeData.user[i]
               })) : 
               [{
                 x: new Date().toLocaleString('en-US', dateFormatOptions),
                 y: 0
               }]
        },
        {
          id: 'CPU System',
          color: colors.redAccent[500],
          data: minLength > 0 ? 
               Array(minLength).fill().map((_, i) => ({
                 x: new Date(safeData.timestamps[i]).toLocaleString('en-US', dateFormatOptions),
                 y: safeData.system[i]
               })) : 
               [{
                 x: new Date().toLocaleString('en-US', dateFormatOptions),
                 y: 0
               }]
        },
        {
          id: 'CPU IOWait',
          color: colors.yellowAccent[500],
          data: minLength > 0 ? 
               Array(minLength).fill().map((_, i) => ({
                 x: new Date(safeData.timestamps[i]).toLocaleString('en-US', dateFormatOptions),
                 y: safeData.iowait[i]
               })) : 
               [{
                 x: new Date().toLocaleString('en-US', dateFormatOptions),
                 y: 0
               }]
        }
      ];

      setCpuData(chartData);
    } catch (transformError) {
      console.error("Error transforming data:", transformError);
      setError("Data format error");
    }
  };

  useEffect(() => {
    fetchCpuData();
  }, [databaseName, timeRange, grouping]);

  return (
    <Box m="20px">
      <Header title={`CPU Usage for ${databaseName}`} subtitle="Breakdown by usage type" />
      
      {/* Controles de tiempo y agrupación */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {/* Botón de rango de tiempo */}
        <Button
          variant="contained"
          onClick={(e) => setAnchorElTime(e.currentTarget)}
          endIcon={<ExpandMoreIcon />}
          sx={{ minWidth: 150 }}
        >
          {timeRange === '1h' ? 'Last hour' : 
           timeRange === '24h' ? 'Last 24h' :
           timeRange === '7d' ? 'Last 7 days' : 
           timeRange === '30d' ? 'Last 30 days' : 'Time Range'}
        </Button>

        {/* Botón de agrupación */}
        <Button
          variant="contained"
          onClick={(e) => setAnchorElGroup(e.currentTarget)}
          endIcon={<ExpandMoreIcon />}
          sx={{ minWidth: 150 }}
        >
          {grouping === 'min' ? 'By minutes' :
           grouping === 'hour' ? 'By hours' : 
           grouping === 'day' ? 'By days' : 'Group by'}
        </Button>

        {/* Menú para rango de tiempo */}
        <Menu
          anchorEl={anchorElTime}
          open={Boolean(anchorElTime)}
          onClose={() => setAnchorElTime(null)}
        >
          {['1h', '24h', '7d', '30d'].map((range) => (
            <MenuItem 
              key={range} 
              onClick={() => {
                setTimeRange(range);
                setAnchorElTime(null);
              }}
            >
              {range === '1h' ? 'Last hour' : 
               range === '24h' ? 'Last 24h' :
               range === '7d' ? 'Last 7 days' : 'Last 30 days'}
            </MenuItem>
          ))}
        </Menu>

        {/* Menú para agrupación */}
        <Menu
        anchorEl={anchorElGroup}
        open={Boolean(anchorElGroup)}
        onClose={() => setAnchorElGroup(null)}
      >
        {['min', 'hour'].map((group) => (
          <MenuItem 
            key={group}
            onClick={() => {
              setGrouping(group);
              setAnchorElGroup(null);
            }}
          >
            {group === 'min' ? 'By minutes' : 'By hours'}
          </MenuItem>
        ))}
      </Menu>
      </Box>

      {loading && <Alert severity="info">Loading CPU data...</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Gráfico principal */}
      <Box height="400px" sx={{ minWidth: 0 }}>
        <LineChart
          data={cpuData}
          enableLegends={true}
          enableTooltip={true}
          yAxisLegend="Usage (%)"
          xAxisLegend="Time"
          isStacked={true}
        />
      </Box>

      {/* Mini gráficos individuales (opcional) */}
      <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "repeat(2, 1fr)" }} gap="20px" mt={4}>
        {cpuData.map((metric, index) => (
          <Box key={index} height="250px" sx={{ minWidth: 0 }}>
            <Typography variant="h6" sx={{ textAlign: 'center', mb: 1 }}>
              {metric.id}
            </Typography>
            <LineChart
              data={[metric]}
              enableTooltip={true}
              yAxisLegend="%"
              xAxisLegend="Time"
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CPU;