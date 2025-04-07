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
  const [grouping, setGrouping] = useState('uur');

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
  const groupings = ['uur', 'min', 'sec'];

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
    return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
  };

  const fetchCpuData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const organisation = localStorage.getItem('organisation');
      const token = localStorage.getItem('accessToken');
      
      const startTime = new Date(buildSelectedDate());
      //const endTime = new Date(startTime);
      //endTime.setHours(startTime.getHours() + 24); // Rango de 24 horas desde la fecha seleccionada

      const params = new URLSearchParams({
        start_time: startTime.toISOString(),
        //end_time: endTime.toISOString(),
        rows: '500',
        grouping: grouping
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
      console.log(`${params}`);
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
        timestamps: Array.isArray(apiData?.time) ? apiData.time.map(t => t || new Date().toISOString()) : [],
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

      const dateFormatOptions = {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };

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
      console.error("Error transforming data:", transformError);
      setError("Error processing CPU data. Please try again.");
    }
  };

  // Ejecutar la consulta cuando cambien los parámetros
  useEffect(() => {
    fetchCpuData();
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
          Selected date: {buildSelectedDate()}
        </Typography>
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