import { Box, Typography, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useParams } from "react-router-dom";
import LineChart from '../../components/LineChart';

const Workload = () => {
  const { databaseName } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [workloadData, setWorkloadData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  // Fecha fija en el formato requerido por la API
  const fixedDate = "2025-04-09T13:22:27.050Z";
  const organisation = localStorage.getItem('organization');

  const fetchWorkloadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('accessToken');
      // const response = await fetch(
      //   `${process.env.REACT_APP_API_URL}/environment/workload`,
      //   {
      //     method: 'GET',
      //     headers: {
      //       'Authorization': `Bearer ${token}`,
      //       'source': databaseName,
      //       'organisation': organisation,
      //       'start_time': getCurrentDateTime() // Usamos la fecha fija aquí
      //     }
      //   }
      // );


      const response = await fetch(`${process.env.REACT_APP_API_URL}/environment/workload`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Si es requerido
          organisation: organisation,
          source: databaseName,
          start_time: getCurrentDateTime() // En el body, no en headers
        },
      });



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
            start_time: getCurrentDateTime()
          }
        }
      });
      setError(error.message);
    } finally {
      setLoading(false);
    }
   };
  const getCurrentDateTime = () => {
    const now = new Date();
    const isoString = now.toISOString(); // "2025-03-28T15:30:45.123Z"
    return isoString;
    
   return isoString.replace(/(\.\d{3})Z$/, '.00Z'); // Fuerza 2 dígitos: "2025-03-28T15:30:45.00Z"
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

  // Cargar datos al montar el componente

  useEffect(() => {
    console.log('Fecha enviada a API:', getCurrentDateTime());
    //console.log('Fecha enviada a API:');
    fetchWorkloadData();
  }, []);
  return (
    <Box m="20px">
      <Header 
        title={`Workload for ${databaseName}`} 
        subtitle={`Data for (${new Date().toLocaleString()})`} 
      />

      {/* Mensajes de estado */}
      {loading && <Alert severity="info" sx={{ mb: 2 }}>Loading data...</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Gráficos */}
      <Box m="2px" display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="10px">
        {workloadData.map((chartData, index) => (
          <Box key={index} height="200px" position="relative">
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
              
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