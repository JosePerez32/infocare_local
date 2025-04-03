import { Box, Typography, Alert, Button, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { useParams } from "react-router-dom";
import LineChart from '../../../components/LineChart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Colores por defecto como fallback
const DEFAULT_COLORS = {
  idle: '#4CAF50',
  user: '#2196F3',
  system: '#F44336',
  iowait: '#FFEB3B'
};

const CPU = () => {
  const { databaseName } = useParams();
  const theme = useTheme();
  
  // Usamos try-catch para manejar posibles errores al obtener los colores
  let colors;
  try {
    colors = tokens(theme.palette.mode);
  } catch (error) {
    console.warn("Error getting theme colors, using defaults:", error);
    colors = {};
  }

  const [cpuData, setCpuData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [grouping, setGrouping] = useState('hour');

  const [anchorElTime, setAnchorElTime] = useState(null);
  const [anchorElGroup, setAnchorElGroup] = useState(null);

  const dateFormatOptions = {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };

  // Función segura para obtener colores
  const getChartColors = () => {
    return {
      idle: colors?.greenAccent?.[500] || DEFAULT_COLORS.idle,
      user: colors?.blueAccent?.[500] || DEFAULT_COLORS.user,
      system: colors?.redAccent?.[500] || DEFAULT_COLORS.system,
      iowait: colors?.yellowAccent?.[500] || DEFAULT_COLORS.iowait
    };
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

      const getGroupingParam = () => {
        switch(grouping) {
          case 'sec': return 'sec';
          case 'min': return 'min'; 
          case 'hour': return 'uur';
          default: return 'uur';
        }
      };

      const params = new URLSearchParams({
        start_time: startTime.toISOString(),
        rows: '10',
        grouping: getGroupingParam()
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
      const safeData = {
        timestamps: Array.isArray(apiData?.time) ? apiData.time : [],
        idle: Array.isArray(apiData?.cpu_idle) ? apiData.cpu_idle : [],
        user: Array.isArray(apiData?.cpu_user) ? apiData.cpu_user : [],
        system: Array.isArray(apiData?.cpu_system) ? apiData.cpu_system : [],
        iowait: Array.isArray(apiData?.cpu_iowait) ? apiData.cpu_iowait : []
      };

      const minLength = Math.min(
        safeData.timestamps.length,
        safeData.idle.length,
        safeData.user.length,
        safeData.system.length,
        safeData.iowait.length
      );

      const chartColors = getChartColors();

      const chartData = [
        {
          id: 'CPU Idle',
          color: chartColors.idle,
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
          color: chartColors.user,
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
          color: chartColors.system,
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
          color: chartColors.iowait,
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
      console.error("Error transforming data:", {
        error: transformError.message,
        stack: transformError.stack,
        apiData: apiData // Para debug
      });
      setError("Error processing CPU data. Please try again.");
    }
  };

  useEffect(() => {
    fetchCpuData();
  }, [databaseName, timeRange, grouping]);

  return (
    <Box m="20px">
      <Header title={`CPU Usage for ${databaseName}`} subtitle="Breakdown by usage type" />
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
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

        <Button
          variant="contained"
          onClick={(e) => setAnchorElGroup(e.currentTarget)}
          endIcon={<ExpandMoreIcon />}
          sx={{ minWidth: 150 }}
        >
          {grouping === 'min' ? 'By minutes' : 'By hours'}
        </Button>

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
    </Box>
  );
};

export default CPU;