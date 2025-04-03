import { Box, Typography, Alert, Button, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { useParams, useLocation } from "react-router-dom";
import LineChart from '../../../components/LineChart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MusicIcon } from "lucide-react";

const Logging = ({ onDataUpdate }) => {
  const { databaseName } = useParams(); // Get database name from the URL
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loggingData, setLoggingData] = useState([
    {
      id: "TL Write",
      color: colors.greenAccent[500],
      data: [{ x: new Date().toString(), y: 0}]
    },
    {
      id: "TL Space",
      color: colors.greenAccent[500],
      data: [{ x: new Date().toString(), y: 0}]
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [grouping, setGrouping] = useState('hour');

  const { source } = useParams(); // Retrieve source from the URL parameters
  const { organization } = useLocation().state || {};
  const [gaugeOrder, setGaugeOrder] = useState(["TL Write","TL Space"]); // State for the gauges order
  const [alertVisible, setAlertVisible] = useState(false); // State to show the alert


  // Crear workloadData con el mismo id que el texto mapeado
  // const workloadData = texts.map((text) => ({
  //   id: text, // Usar el texto como id
  //   color: "hsl(120, 70%, 50%)",
  //   data: Array.from({ length: 30 }, (_, i) => ({
  //     x: i % 5 === 0 ? i : null, // Solo asigna valor a x cada 5 iteraciones
  //     axisBottom: i,
  //     y: Math.floor(Math.random() * 100), // Número aleatorio entre 0 y 99
  //   })).filter((item) => item.x !== null), // Filtra los elementos donde x no sea null,
  // }));


    const fetchLoggingData = async () => {
      console.log(`Request data for José: ${timeRange} | Grouped by: ${grouping} | For the database: ${databaseName}`);

      try {
        setLoading(true);
        setError(null);
     
        const organisation = localStorage.getItem('organisation');
        const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage
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
          `${process.env.REACT_APP_API_URL}/metrics/recoverability/logging?${params}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`, // Add token to Authorization header
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
        const apiData = await response.json(); // <-- Variable renombrada aquí
  
        // Debug: Verifica estructura de datos
        console.log("Answer from the API:", {
          tieneTimestamps: Array.isArray(apiData.timestamps),
          tieneTlWrite: Array.isArray(apiData.tl_write),
          tieneTlSpace: Array.isArray(apiData.tl_space),
          conteos: {
            timestamps: apiData.timestamps?.length || 0,
            tl_write: apiData.tl_write?.length || 0,
            tl_space: apiData.tl_space?.length || 0
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
        tl_write: Array.isArray(apiData?.tl_write) ? 
                     apiData.tl_write.map(Number).filter(n => !isNaN(n)) : 
                     [],
        tl_space: Array.isArray(apiData?.tl_space) ? 
                           apiData.tl_space.map(Number).filter(n => !isNaN(n)) : 
                           []
      };

      // Asegurar misma longitud de arrays
      const minLength = Math.min(
        safeData.timestamps.length,
        safeData.tl_write.length,
        safeData.tl_space.length
      );

      const chartData = [
        {
          //id: 'TL Write',
          color: colors.greenAccent[500],
          data: minLength > 0 ? 
               Array(minLength).fill().map((_, i) => ({
                 x: new Date(safeData.timestamps[i]).toISOString('en-US', {  // <-- Cambia aquí
                 month: 'short',
                 day: 'numeric',
                 year: 'numeric',
                 hour: '2-digit',
                 minute: '2-digit',
                 hour12: true

               }),
                 y: safeData.tl_write[i]
               })) : 
               [{ x: new Date().toISOString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              }), y: 0 }]
        },
        {
          //id: 'TL Space',
          color: colors.blueAccent[500],
          data: minLength > 0 ? 
               Array(minLength).fill().map((_, i) => ({
                 x: new Date(safeData.timestamps[i]).toISOString('en-US', {  // <-- Cambia aquí
                 month: 'short',
                 day: 'numeric',
                 hour: '2-digit',
                 minute: '2-digit'
               }),
                 y: safeData.tl_space[i]
               })) : 
               [{ x: new Date().toISOString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              }), y: 0 }]
        }
      ];

      setLoggingData(chartData);
    } catch (transformError) {
      console.error("Error transforming data:", transformError);
      setError("Data format error");
      // Mantener datos anteriores si la transformación falla
    }
  };

  useEffect(() => {
    fetchLoggingData();
  }, [databaseName, timeRange, grouping]);

    // Añade estos estados (arriba del componente):
    const [anchorElTime, setAnchorElTime] = useState(null);
    const [anchorElGroup, setAnchorElGroup] = useState(null);
  return (
    <Box m="20px">
        <Header title={`Logging for ${databaseName}`} subtitle="" />
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            {/* Botón de Time Range */}
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

            {/* Botón de Grouping */}
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

            {/* Menú para Time Range */}
            <Menu
              anchorEl={anchorElTime}
              open={Boolean(anchorElTime)}
              onClose={() => setAnchorElTime(null)}
            >
              {['1h', '24h', '7d', '30d'].map((range) => (
                <MenuItem 
                  key={range} 
                  onClick={() => setTimeRange(range)}
                >
                  {range === '1h' ? 'Last hour' : 
                  range === '24h' ? 'Last 24h' :
                  range === '7d' ? 'Last 7 days' : 'Last 30 days'}
                </MenuItem>
              ))}
            </Menu>

            {/* Menú para Grouping */}
            <Menu
              anchorEl={anchorElGroup}
              open={Boolean(anchorElGroup)}
              onClose={() => setAnchorElGroup(null)}
            >
              {['min', 'hour', 'day'].map((group) => (
                <MenuItem 
                  key={group}
                  onClick={() => setGrouping(group)}
                >
                  {group === 'min' ? 'By minutes' :
                  group === 'hour' ? 'By hours' : 'By days'}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {loading && <Alert severity="info">Loading data...</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "repeat(2, 1fr)" }} gap="20px">
            {loggingData.map((chart, index) => (
              <Box key={index} height="300px" sx={{ minWidth: 0 }}>
                <Typography variant="h6" sx={{ textAlign: 'center', mb: 1 }}>
                  {/*Here to add an Title above the charts*/}
                </Typography>
                <LineChart
                  data={[{
                    ...chart,
                    data: chart.data.map(point => ({
                      x: point.x ? new Date().toISOString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      }) : new Date().toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      }),
                      y: typeof point.y === 'number' ? point.y : 0
                    }))
                  }]}
                  //enableLegends={true}
                  enableTooltip={true}
                  yAxisLegend="Procent (%)"
                  xAxisLegend="Time"
                />
              </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Logging;