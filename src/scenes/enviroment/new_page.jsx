import { Box, Typography, Alert } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useParams } from "react-router-dom";
import LineChart from '../../components/LineChart';
import LineChartWork from '../../components/LineChartWork';

const Workload = () => {
  const { databaseName } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [workloadData, setWorkloadData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const organisation = localStorage.getItem('organization');

  // Función para obtener la fecha actual en formato ISO
  const getCurrentDateTime = useCallback(() => {
    const now = new Date();
    return now.toISOString();
  }, []);

  // Función para obtener la fecha de hace 30 horas
  const getThirtyHoursAgoDateTime = useCallback(() => {
    const now = new Date();
    now.setHours(now.getHours() - 30);
    return now.toISOString();
  }, []);

  const fetchWorkloadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/environment/workload`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          organisation: organisation,
          source: databaseName,
          start_time: getThirtyHoursAgoDateTime() // Y la fecha actual como fin       
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      transformDataForCharts(data);
      
    } catch (error) {
      console.error("Fetch error:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [databaseName, organisation, getCurrentDateTime, getThirtyHoursAgoDateTime]);

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

    // Ordenar los timestamps de más antiguo a más reciente
    const sortedTimestamps = [...apiData.timestamps].sort((a, b) => new Date(a) - new Date(b));

    const transformedData = metrics.map(metric => ({
      id: metric.label,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      data: sortedTimestamps.map((timestamp, index) => {
        const date = new Date(timestamp);
        console.log(date.getHours());
        
        return {
          x: date.toLocaleTimeString([], {
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          y: apiData[metric.key][index] || 0
        };
      })
    }));

    setWorkloadData(transformedData);
  };

  // Cargar datos al montar el componente y cada 15 segundos
  useEffect(() => {
    fetchWorkloadData(); // Carga inicial
    
    const intervalId = setInterval(() => {
      fetchWorkloadData();
    }, 15000); // 15 segundos

    return () => clearInterval(intervalId); // Limpieza al desmontar
  }, [fetchWorkloadData]);

  return (
    <Box m="20px">
      <Header 
        title={`Workload for ${databaseName}`} 
        subtitle={`Data from last 30 hours (as of ${new Date().toLocaleString()})`} 
      />

      {/* Mensajes de estado */}
      {/* {loading && <Alert severity="info" sx={{ mb: 2 }}>Loading data...</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>} */}

      {/* Gráficos */}
      <Box m="2px" display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="10px">
        {workloadData.map((chartData, index) => (
          <Box key={index} height="230px" position="relative">
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
              {chartData.id}
            </Typography>
            <LineChartWork
              data={[chartData]}
              enableLegends={false}
              enableTooltip={true}
              yAxisLegend=""
             // xAxisLegend="Time"
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Workload;