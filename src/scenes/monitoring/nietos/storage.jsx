import { Box, Typography, Alert, Button } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { useParams } from "react-router-dom";
import LineChart from '../../../components/LineChart';

const Storage = () => {
  const { databaseName } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [storageData, setStorageData] = useState([
    {
      id: 'TS Freespace',
      color: colors.greenAccent[500],
      data: [{ x: new Date().toISOString(), y: 0 }]
    },
    {
      id: 'Container Freespace',
      color: colors.blueAccent[500],
      data: [{ x: new Date().toISOString(), y: 0 }]
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [grouping, setGrouping] = useState('hour');

  const fetchStorageData = async () => {
    console.log(`Request data for José: ${timeRange} | Grouped by: ${grouping} | For the database: ${databaseName}`);
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('accessToken');
      const organisation = localStorage.getItem('organisation');
      const now = new Date();
      const startTime = new Date();
      
      switch(timeRange) {
        case '1h': startTime.setHours(now.getHours() - 1); break;
        case '24h': startTime.setDate(now.getDate() - 1); break;
        case '7d': startTime.setDate(now.getDate() - 7); break;
        case '30d': startTime.setDate(now.getDate() - 30); break;
        default: startTime.setDate(now.getDate() - 1);
      }

      const params = new URLSearchParams({
        start_time: startTime.toISOString(),
        rows: '100',
        grouping: grouping === 'hour' ? 'uur' : grouping
      });

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/metrics/recoverability/storage?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'organisation': organisation,
            'source': databaseName
          }
        }
      );
      // Reemplaza la llamada a fetch con esto temporalmente:
   
      // const mockData = {
      //   timestamps: [new Date(), new Date(Date.now() - 3600000)],
      //   ts_freespace: [80, 75],
      //   container_freespace: [60, 55]
      // };
      // transformDataForCharts(mockData);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }
      
      const data = await response.json();
      const apiData = await response.json(); // <-- Variable renombrada aquí

// Debug: Verifica estructura de datos
console.log("Answer from the API:", {
  tieneTimestamps: Array.isArray(apiData.timestamps),
  tieneTsFreespace: Array.isArray(apiData.ts_freespace),
  tieneContainerFreespace: Array.isArray(apiData.container_freespace),
  conteos: {
    timestamps: apiData.timestamps?.length || 0,
    ts_freespace: apiData.ts_freespace?.length || 0,
    container_freespace: apiData.container_freespace?.length || 0
  }
});

transformDataForCharts(apiData);
      transformDataForCharts(data);
      
    } catch (error) {
      //console.error("Error fetching storage data:", error);
      //setError("Failed to load data: " + error.message);
      // Mantener datos por defecto en caso de error
    } finally {
      setLoading(false);
    }
  };

  const transformDataForCharts = (apiData) => {
    try {
      // Validación profunda de los datos
      const safeData = {
        timestamps: Array.isArray(apiData?.timestamps) ? 
                   apiData.timestamps.filter(t => t !== null && t !== undefined) : 
                   [],
        ts_freespace: Array.isArray(apiData?.ts_freespace) ? 
                     apiData.ts_freespace.map(Number).filter(n => !isNaN(n)) : 
                     [],
        container_freespace: Array.isArray(apiData?.container_freespace) ? 
                           apiData.container_freespace.map(Number).filter(n => !isNaN(n)) : 
                           []
      };

      // Asegurar misma longitud de arrays
      const minLength = Math.min(
        safeData.timestamps.length,
        safeData.ts_freespace.length,
        safeData.container_freespace.length
      );

      const chartData = [
        {
          id: 'TS Freespace',
          color: colors.greenAccent[500],
          data: minLength > 0 ? 
               Array(minLength).fill().map((_, i) => ({
                 x: new Date(safeData.timestamps[i]).toISOString(),
                 y: safeData.ts_freespace[i]
               })) : 
               [{ x: new Date().toISOString(), y: 0 }]
        },
        {
          id: 'Container Freespace',
          color: colors.blueAccent[500],
          data: minLength > 0 ? 
               Array(minLength).fill().map((_, i) => ({
                 x: new Date(safeData.timestamps[i]).toISOString(),
                 y: safeData.container_freespace[i]
               })) : 
               [{ x: new Date().toISOString(), y: 0 }]
        }
      ];

      setStorageData(chartData);
    } catch (transformError) {
      console.error("Error transforming data:", transformError);
      setError("Data format error");
      // Mantener datos anteriores si la transformación falla
    }
  };

  useEffect(() => {
    fetchStorageData();
  }, [databaseName, timeRange, grouping]);

  return (
    <Box m="20px">
      <Header title={`Storage for ${databaseName}`} subtitle="" />
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {['1h', '24h', '7d', '30d'].map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? "contained" : "outlined"}
            onClick={() => setTimeRange(range)}
          >
            {range === '1h' ? 'Last hour' : 
             range === '24h' ? 'Last 24h' :
             range === '7d' ? 'Last 7 days' : 'Last 30 days'}
          </Button>
        ))}
        
        {['min', 'hour', 'day'].map((group) => (
          <Button
            key={group}
            variant={grouping === group ? "contained" : "outlined"}
            onClick={() => setGrouping(group)}
          >
            {group === 'min' ? 'By minutes' :
             group === 'hour' ? 'By hours' : 'By days'}
          </Button>
        ))}
      </Box>

      {loading && <Alert severity="info">Loading data...</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "repeat(2, 1fr)" }} gap="20px">
        {storageData.map((chart, index) => (
          <Box key={index} height="300px" sx={{ minWidth: 0 }}>
            <Typography variant="h6" sx={{ textAlign: 'center', mb: 1 }}>
              {chart.id}
            </Typography>
            <LineChart
              data={[{
                ...chart,
                data: chart.data.map(point => ({
                  x: point.x || new Date().toISOString(),
                  y: typeof point.y === 'number' ? point.y : 0
                }))
              }]}
              enableLegends={true}
              enableTooltip={true}
              yAxisLegend="Free space (%)"
              xAxisLegend="Time"
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Storage;