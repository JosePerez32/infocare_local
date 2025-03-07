import { Box, useTheme, Typography, Alert, Select, MenuItem, TextField, FormControl, InputLabel } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import GaugeComponent from 'react-gauge-component';
import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const Management = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [gaugeData, setGaugeData] = useState([]);
  const [gaugeOrder, setGaugeOrder] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const organization = localStorage.getItem('organization');
  
  // New state for gauge customization
  const [colorScheme, setColorScheme] = useState('red-green');
  const [thresholds, setThresholds] = useState({
    low: 33,
    //medium: 40,
    high: 66
    //veryHigh: 80
  });

  // Color scheme options
  const colorSchemes = {
    'red-green': ['#EA4228', '#5BE12C'],
    'yellow-blue': ['#FFD700', '#0000FF'],
    'orange-purple': ['#FFA500', '#800080']
  };

  // Fetch data and retrieve order from localStorage
  useEffect(() => {
    const fetchSourceData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/dashboards/${organization}/management/sources`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json',
          },
        });

        const data = await response.json();

        const filledGaugeData = data.sources.map(source => ({
          name: source.name,
          health: source.health,
        }));

        setGaugeData(filledGaugeData);

        const savedOrder = localStorage.getItem('order_management');
        if (savedOrder) {
          setGaugeOrder(JSON.parse(savedOrder));
        } else {
          setGaugeOrder(filledGaugeData.map(source => source.name));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSourceData();
  }, [organization]);
  
  const handleSourceClick = (source) => {
    const session = localStorage.getItem('session');
    navigate(`details/${source.name}`, { state: { organization, session } });
  };

  const handleDragStart = (index) => {
    return (event) => {
      event.dataTransfer.setData("text/plain", index);
    };
  };

  const handleDrop = (index) => {
    return (event) => {
      event.preventDefault();
      const fromIndex = event.dataTransfer.getData("text/plain");
      const newOrder = [...gaugeOrder];
      const [movedItem] = newOrder.splice(fromIndex, 1);
      newOrder.splice(index, 0, movedItem);
      setGaugeOrder(newOrder);

      localStorage.setItem('order_management', JSON.stringify(newOrder));
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
    };
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Handle threshold changes
  const handleThresholdChange = (type) => (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setThresholds(prev => ({
        ...prev,
        [type]: value
      }));
    }
  };

  const isNestedRoute = location.pathname.includes('/management/details');

  return (
    <Box m="20px">
      {!isNestedRoute && (
        <>
          <Header
            title="MANAGEMENT"
            subtitle={`Management view of ${organization}`}
          />
          <Box mb={3} display="flex" gap={2} alignItems="center">
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel>Color Scheme</InputLabel>
              <Select
                value={colorScheme}
                onChange={(e) => setColorScheme(e.target.value)}
                label="Color Scheme"
              >
                <MenuItem value="red-green">Red to Green</MenuItem>
                <MenuItem value="yellow-blue">Yellow to Blue</MenuItem>
                <MenuItem value="orange-purple">Orange to Purple</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Low Threshold"
              type="number"
              value={thresholds.low}
              onChange={handleThresholdChange('low')}
              InputProps={{ inputProps: { min: 0, max: 100 } }}
            />
            <TextField
              label="Medium Threshold"
              type="number"
              value={thresholds.medium}
              onChange={handleThresholdChange('medium')}
              InputProps={{ inputProps: { min: 0, max: 100 } }}
            />
            <TextField
              label="High Threshold"
              type="number"
              value={thresholds.high}
              onChange={handleThresholdChange('high')}
              InputProps={{ inputProps: { min: 0, max: 100 } }}
            />
            <TextField
              label="Very High Threshold"
              type="number"
              value={thresholds.veryHigh}
              onChange={handleThresholdChange('veryHigh')}
              InputProps={{ inputProps: { min: 0, max: 100 } }}
            />
          </Box>
        </>
      )}
      
      {alertVisible && <Alert variant="outlined" severity="success">Gauge chart order changed and saved</Alert>}
      
      {!isNestedRoute && (
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
          {gaugeOrder.map((gaugeName, index) => {
            const source = gaugeData.find(g => g.name === gaugeName);
            if (!source) return null;

            return (
              <Box
                key={index}
                draggable
                onDragStart={handleDragStart(index)}
                onDrop={handleDrop(index)}
                onDragOver={handleDragOver}
                onClick={() => handleSourceClick(source)}
                style={{
                  backgroundColor: colors.primary[400],
                  borderRadius: "8px",
                  padding: "20px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Typography variant="h6" color={colors.grey[100]}>
                  {source.name}
                </Typography>
                <GaugeComponent
                  value={source.health}
                  type="radial"
                  labels={{
                    tickLabels: {
                      type: "inner",
                      ticks: [
                        { value: thresholds.low },
                       /* { value: thresholds.medium },*/
                        { value: thresholds.high },
                        /*{ value: thresholds.veryHigh },*/
                        { value: 100 }
                      ]
                    }
                  }}
                  arc={{
                    colorArray: colorSchemes[colorScheme],
                    subArcs: [
                      { limit: thresholds.low },
                     /* { limit: thresholds.medium },*/
                      { limit: thresholds.high },
                     /* { limit: thresholds.veryHigh },*/
                      { limit: 100 }
                    ],
                    padding: 0.02,
                    width: 0.3
                  }}
                  pointer={{
                    elastic: true,
                    animationDelay: 0
                  }}
                />
              </Box>
            );
          })}
        </Box>
      )}
      {isNestedRoute && <Outlet />}
    </Box>
  );
};

export default Management;