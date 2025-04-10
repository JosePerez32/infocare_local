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

  const [cpuData, setCpuData] = useState([{
    id: 'Loading...',
    color: '#ccc',
    data: [{ x: '00:00', y: 0 }]
  }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [grouping, setGrouping] = useState('sec');

  // Estados para los nuevos selectores
  const [year, setYear] = useState('2024');
  const [month, setMonth] = useState('11');
  const [day, setDay] = useState('22');
  const [hour, setHour] = useState('11');
  const [minute, setMinute] = useState('34');
  const [second, setSecond] = useState('29');

  // Estados para los menús
  const [anchorElYear, setAnchorElYear] = useState(null);
  const [anchorElMonth, setAnchorElMonth] = useState(null);
  const [anchorElDay, setAnchorElDay] = useState(null);
  const [anchorElHour, setAnchorElHour] = useState(null);
  const [anchorElMinute, setAnchorElMinute] = useState(null);
  const [anchorElSecond, setAnchorElSecond] = useState(null);
  const [anchorElGroup, setAnchorElGroup] = useState(null);

  // Opciones para los selectores
  const years = ['2023', '2024', '2025'];
  const months = Array.from({length: 12}, (_, i) => (i + 1).toString().padStart(2, '0'));
  const days = Array.from({length: 31}, (_, i) => (i + 1).toString().padStart(2, '0'));
  const hours = Array.from({length: 24}, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0'));
  const seconds = Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0'));
  const groupings = ['sec'];

  // 1. Añade un nuevo estado para controlar el intervalo
  //const [refreshInterval, setRefreshInterval] = useState(null);
  // Función segura para obtener colores
  const getChartColors = () => {
    return {
      idle: colors?.greenAccent?.[500] || DEFAULT_COLORS.idle,
      user: colors?.blueAccent?.[500] || DEFAULT_COLORS.user,
      system: colors?.redAccent?.[500] || DEFAULT_COLORS.system,
      iowait: colors?.yellowAccent?.[500] || DEFAULT_COLORS.iowait
    };
  };

  // Construir la fecha seleccionada en formato ISO
  const buildSelectedDate = () => {
    // Crear fecha completa
    const dateStr = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    const date = new Date(dateStr);
    
    // Manejar casos donde new Date pueda fallar
    if (isNaN(date.getTime())) {
      console.error('Invalid date constructed:', dateStr);
      return new Date().toISOString().replace(/(\.\d{3})Z$/, '.00Z');
    }
    
    // Formatear con exactamente 2 dígitos en milisegundos
    return date.toISOString().replace(/(\.\d{3})Z$/, '.00Z');
  };
  
  // Luego en fetchCpuData(), asegúrate de usar la fecha formateada:
  const fetchCpuData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const organisation = localStorage.getItem('organisation');
      const token = localStorage.getItem('accessToken');
      
      // Calcular fecha de inicio (30 horas atrás desde ahora)
      const now = new Date();
      const startTime = new Date(now.getTime() - (30 * 60 * 60 * 1000)).toISOString();//.replace(/(\.\d{3})Z$/, '.00Z');

      const params = new URLSearchParams({
        start_time: startTime,//new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
        //end_time: new Date().toISOString(),
        rows: '30', // 6 puntos por hora × 30 horas
        grouping: 'sec',
       // sort: 'asc' // Asegurar orden ascendente (más antiguo primero)
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
      console.log(`Estos son los parametros: ${params}`);
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
  const getCurrentDateTime = () => {
    const now = new Date();
    const isoString = now.toISOString(); // "2025-03-28T15:30:45.123Z"
    return isoString;
    
   //return isoString.replace(/(\.\d{3})Z$/, '.00Z'); // Fuerza 2 dígitos: "2025-03-28T15:30:45.00Z"
  };
    const transformDataForCharts = (apiData) => {
      try {
        const safeData = {
          timestamps: Array.isArray(apiData?.time) ? apiData.time : [],
          idle: Array.isArray(apiData?.cpu_idle) ? apiData.cpu_idle.map(v => v || 0) : [],
          user: Array.isArray(apiData?.cpu_user) ? apiData.cpu_user.map(v => v || 0) : [],
          system: Array.isArray(apiData?.cpu_system) ? apiData.cpu_system.map(v => v || 0) : [],
          iowait: Array.isArray(apiData?.cpu_iowait) ? apiData.cpu_iowait.map(v => v || 0) : []
        };
    
        // Ordenar los datos cronológicamente (más antiguo primero)
        const allData = safeData.timestamps
          .map((timestamp, index) => ({
            timestamp,
            idle: safeData.idle[index],
            user: safeData.user[index],
            system: safeData.system[index],
            iowait: safeData.iowait[index]
          })).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
        const chartColors = getChartColors();
    
          // Función para formatear el eje X (mostrar hora cada 6 horas)
          const formatXAxis = (timestamp) => {
            const date = new Date(timestamp);
            const hours = date.getHours();
            // Mostrar etiqueta completa cada 6 horas
            if (hours % 6 === 0) {
              return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
            return ''; // No mostrar etiqueta para otros puntos
          };
    
        const chartData = [
          {
            id: 'CPU Idle',
            color: chartColors.idle,
            data: allData.map(item => ({
              x: item.timestamp, // Usar el timestamp directamente
              y: item.idle || 0
            }))
          },
          // Repetir para las otras series (user, system, iowait)
          {
            id: 'CPU User',
            color: chartColors.user,
            data: allData.map(item => ({
              x: item.timestamp, // Usar el timestamp directamente
              y: item.user || 0
            }))
          },
          {
            id: 'CPU System',
            color: chartColors.system,
            data: allData.map(item => ({
              x: item.timestamp, // Usar el timestamp directamente
              y: item.system || 0
            }))
          },
          {
            id: 'CPU IOWait',
            color: chartColors.iowait,
            data: allData.map(item => ({
              x: item.timestamp, // Usar el timestamp directamente
              y: item.iowait || 0
            }))
          }
        ];
         // Verificación adicional antes de establecer el estado
        // if (chartData.some(series => !series.data || series.data.length === 0)) {
        //   throw new Error("Invalid data format");
        // }
        setCpuData(chartData);
      } catch (error){//transformError) {
        console.error("Error transforming data:", error);//transformError);
        setError("Error processing CPU data. Please try again.");
        //setCpuData([]); // Establecer array vacío para evitar errores
      }
    };
    
  const formatXAxisTicks = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    
    // Mostrar solo cada 5 horas (0, 5, 10, 15, 20, 25)
    if (hours % 5 === 0) {
      return `${hours.toString().padStart(2, '0')}:00`;
    }
    return '';
  };
  
  // Ejecutar la consulta cuando cambien los parámetros
    useEffect(() => {
      let intervalId;
      let isMounted = true;
      
      const fetchData = async () => {
        if (!isMounted) return;
        try {
          await fetchCpuData();
        } catch (error) {
          console.error("Error in data fetch:", error);
        }
      };
    
      fetchData();
      intervalId = setInterval(fetchData, 15000);
    
      return () => {
        isMounted = false;
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }, [databaseName, grouping]);
  return (
    <Box m="20px">
      <Header title={`Performance of ${databaseName}`} />
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {/* Selector de Año */}
        <Button
          variant="contained"
          onClick={(e) => setAnchorElYear(e.currentTarget)}
          endIcon={<ExpandMoreIcon />}
        >
          Year: {year}
        </Button>
        <Menu
          anchorEl={anchorElYear}
          open={Boolean(anchorElYear)}
          onClose={() => setAnchorElYear(null)}
        >
          {years.map((yr) => (
            <MenuItem 
              key={yr}
              onClick={() => {
                setYear(yr);
                setAnchorElYear(null);
              }}
            >
              {yr}
            </MenuItem>
          ))}
        </Menu>

        {/* Selector de Mes */}
        <Button
          variant="contained"
          onClick={(e) => setAnchorElMonth(e.currentTarget)}
          endIcon={<ExpandMoreIcon />}
        >
          Month: {month}
        </Button>
        <Menu
          anchorEl={anchorElMonth}
          open={Boolean(anchorElMonth)}
          onClose={() => setAnchorElMonth(null)}
        >
          {months.map((m) => (
            <MenuItem 
              key={m}
              onClick={() => {
                setMonth(m);
                setAnchorElMonth(null);
              }}
            >
              {m}
            </MenuItem>
          ))}
        </Menu>

        {/* Selector de Día */}
        <Button
          variant="contained"
          onClick={(e) => setAnchorElDay(e.currentTarget)}
          endIcon={<ExpandMoreIcon />}
        >
          Day: {day}
        </Button>
        <Menu
          anchorEl={anchorElDay}
          open={Boolean(anchorElDay)}
          onClose={() => setAnchorElDay(null)}
        >
          {days.map((d) => (
            <MenuItem 
              key={d}
              onClick={() => {
                setDay(d);
                setAnchorElDay(null);
              }}
            >
              {d}
            </MenuItem>
          ))}
        </Menu>

        {/* Selector de Hora */}
        <Button
          variant="contained"
          onClick={(e) => setAnchorElHour(e.currentTarget)}
          endIcon={<ExpandMoreIcon />}
        >
          Hour: {hour}
        </Button>
        <Menu
          anchorEl={anchorElHour}
          open={Boolean(anchorElHour)}
          onClose={() => setAnchorElHour(null)}
        >
          {hours.map((h) => (
            <MenuItem 
              key={h}
              onClick={() => {
                setHour(h);
                setAnchorElHour(null);
              }}
            >
              {h}
            </MenuItem>
          ))}
        </Menu>

        {/* Selector de Minuto */}
        <Button
          variant="contained"
          onClick={(e) => setAnchorElMinute(e.currentTarget)}
          endIcon={<ExpandMoreIcon />}
        >
          Minute: {minute}
        </Button>
        <Menu
          anchorEl={anchorElMinute}
          open={Boolean(anchorElMinute)}
          onClose={() => setAnchorElMinute(null)}
        >
          {minutes.map((m) => (
            <MenuItem 
              key={m}
              onClick={() => {
                setMinute(m);
                setAnchorElMinute(null);
              }}
            >
              {m}
            </MenuItem>
          ))}
        </Menu>

        {/* Selector de Segundo */}
        <Button
          variant="contained"
          onClick={(e) => setAnchorElSecond(e.currentTarget)}
          endIcon={<ExpandMoreIcon />}
        >
          Second: {second}
        </Button>
        <Menu
          anchorEl={anchorElSecond}
          open={Boolean(anchorElSecond)}
          onClose={() => setAnchorElSecond(null)}
        >
          {seconds.map((s) => (
            <MenuItem 
              key={s}
              onClick={() => {
                setSecond(s);
                setAnchorElSecond(null);
              }}
            >
              {s}
            </MenuItem>
          ))}
        </Menu>

        {/* Selector de Agrupación */}
        <Button
          variant="contained"
          onClick={(e) => setAnchorElGroup(e.currentTarget)}
          endIcon={<ExpandMoreIcon />}
        >
          Group: {grouping}
        </Button>
        <Menu
          anchorEl={anchorElGroup}
          open={Boolean(anchorElGroup)}
          onClose={() => setAnchorElGroup(null)}
        >
          {groupings.map((g) => (
            <MenuItem 
              key={g}
              onClick={() => {
                setGrouping(g);
                setAnchorElGroup(null);
              }}
            >
              {g}
            </MenuItem>
          ))}
        </Menu>

        {/* Botón de Ejecución */}
        <Button
          variant="contained"
          color="primary"
          onClick={fetchCpuData}
          sx={{ ml: 2 }}
        >
          Execute
        </Button>
      </Box>
   
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1">
          Selected date: {getCurrentDateTime()}
        </Typography>
      </Box>

      {loading && <Alert severity="info">Loading CPU data...</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Box height="400px" sx={{ minWidth: 0 }}>
        <LineChart
          animate={false}
          key={Date.now()}
          data={cpuData}
          enableLegends={true}
          enableTooltip={true}
          yAxisLegend="Usage (%)"
          xAxisLegend="Last 30 Hours"
          axisBottom={{
            tickValues: "every 6 hours",
            format: (value) => {
              const date = new Date(value);
              return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            },
            tickRotation: -45,
            legendPosition: 'middle',
            legendOffset: 40
          }}
          margin={{ top: 20, right: 30, bottom: 80, left: 60 }}
          xScale={{
            type: 'time',
            format: '%Y-%m-%dT%H:%M:%S.%LZ',
            precision: 'minute',
            useUTC: true
          }}
          axisLeft={{
            legendOffset: -50,
            legendPosition: 'middle'
          }}
          isStacked={true}
          curve="linear"
        />
      </Box>
    </Box>
  );
};

export default CPU;