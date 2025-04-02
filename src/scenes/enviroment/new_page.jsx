import { Box, Typography, Alert, Button, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useParams } from "react-router-dom";
import LineChart from '../../components/LineChart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Workload = () => {
  const { databaseName } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [workloadData, setWorkloadData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  // Prueba estos 3 formatos alternativos:
  const formatosParaProbar = [
    new Date().toISOString(),                     // "2025-03-27T16:47:35.790Z"
    new Date().toISOString().split('.')[0] + "Z", // "2025-03-27T16:47:35Z" (sin ms)
    new Date().toLocaleDateString('en-CA')        // "2025-03-27" (solo fecha)
  ];
  // Generar opciones de fecha (últimos 30 días en formato ISO)
  const dateOptions = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString(); // Formato completo ISO
  });
  const organization = localStorage.getItem('organisation');
  // Manejadores para el menú de fechas
  const handleDateClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDateClose = (date) => {
    setSelectedDate(date);
    setAnchorEl(null);
  };

  const fetchWorkloadData = async () => {
    if (!selectedDate) return;
  
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('accessToken');

      
      // Formatear fecha sin milisegundos
      const formatAPIDate = (date) => {
        return new Date(date).toISOString().split('.')[0] + "Z";
      };
  
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/environment/workload`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'organisation': organization,
            'source': databaseName, // <-- Ahora en headers
            'start_time': formatAPIDate(selectedDate) // <-- También en headers
          }
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
  
      const data = await response.json();
      transformDataForCharts(data);
      
    } catch (error) {
      console.error("Fetch error:", {
        message: error.message,
        config: {
          url: `${process.env.REACT_APP_API_URL}/environment/workload`,
          headers: {
            source: databaseName,
            start_time: selectedDate
          }
        }
      });
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Transformar los datos de la API para los gráficos
  const transformDataForCharts = (apiData) => {
    const metrics = [
      { key: 'select_stmts', label: 'SELECT Statements' },
      { key: 'insert_stmts', label: 'INSERT Statements' },
      { key: 'update_stmts', label: 'UPDATE Statements' },
      { key: 'delete_stmts', label: 'DELETE Statements' },
      { key: 'locks', label: 'Locks' },
      { key: 'deadlocks', label: 'Deadlocks' },
      { key: 'wait_times', label: 'Wait Times' }
    ];

    const transformedData = metrics.map(metric => ({
      id: metric.label,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      data: apiData.timestamps.map((timestamp, index) => ({
        x: new Date(timestamp).toLocaleTimeString(),
        y: apiData[metric.key][index] || 0
      }))
    }));

    setWorkloadData(transformedData);
  };

  // Efecto para cargar datos cuando se selecciona fecha
  useEffect(() => {
    if (selectedDate) {
      fetchWorkloadData();
    }
  }, [selectedDate]);

  return (
    <Box m="20px">
      <Header title={`Workload for ${databaseName}`} subtitle="" />

      {/* Selector de fecha */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          variant="contained"
          endIcon={<ExpandMoreIcon />}
          onClick={handleDateClick}
          sx={{ width: '200px' }}
        >
          {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'Select Date'}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
        >
          {dateOptions.map((date, index) => (
            <MenuItem 
              key={index} 
              onClick={() => handleDateClose(date)}
            >
              {new Date(date).toLocaleDateString()} - {new Date(date).toLocaleTimeString()}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Mensajes de estado */}
      {loading && <Alert severity="info" sx={{ mb: 2 }}>Loading data...</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Gráficos */}
      <Box m="2px" display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="10px">
        {workloadData.map((chartData, index) => (
          <Box key={index} height="200px" position="relative">
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
              {chartData.id}
            </Typography>
            <LineChart
              data={[chartData]}
              enableLegends={false}
              enableTooltip={true}
              yAxisLegend=""
              xAxisLegend="Time"
              axisBottom={{
                tickValues: workloadData[0]?.data.length > 10 ? "every 2 hours" : ""
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Workload;