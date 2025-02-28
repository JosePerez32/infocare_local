import { Box, useTheme, Typography, Alert } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import GaugeComponent from 'react-gauge-component';
import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const Technical = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [gaugeData, setGaugeData] = useState([]);
  const [gaugeOrder, setGaugeOrder] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const organization = localStorage.getItem('organization');

  // Fetch data and retrieve order from localStorage
  useEffect(() => {
    const fetchSourceData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/dashboards/${organization}/technical/sources`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json',
          },
        });

        const data = await response.json();

        // Populate gauge data with the fetched sources
        const filledGaugeData = data.sources.map(source => ({
          name: source.name,
          health: source.health,
        }));

        setGaugeData(filledGaugeData);

        // Load saved order from localStorage, if exists
        const savedOrder = localStorage.getItem('order_technical');
        if (savedOrder) {
          setGaugeOrder(JSON.parse(savedOrder));
        } else {
          setGaugeOrder(filledGaugeData.map(source => source.name)); // Default order
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSourceData();
  }, [organization]);
  
  const handleSourceClick = (source) => {
    const session = localStorage.getItem('session'); // Assuming 'session' is stored in localStorage
    navigate(`details/${source.name}`, { state: { organization, session } });
  };
  

  // Drag and drop handlers
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

      // Save the new order in localStorage
      localStorage.setItem('order_technical', JSON.stringify(newOrder));

      // Show alert on order change
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
    };
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Allow the drop
  };

  const isNestedRoute = location.pathname.includes('/technical/details');

  return (
    <Box m="20px">
      {!isNestedRoute && (
        <Header
          title="Technical"
          subtitle={`Technical view of ${organization}`}
        />
      )}
      {alertVisible && <Alert variant="outlined" severity="success">Gauge chart order changed and saved</Alert>}
      {!isNestedRoute && (
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
          {gaugeOrder.map((gaugeName, index) => {
            const source = gaugeData.find(g => g.name === gaugeName); // Find source by name
            if (!source) return null; // If the source is not found, skip rendering

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
                        { value: 20 },
                        { value: 40 },
                        { value: 60 },
                        { value: 80 },
                        { value: 100 }
                      ]
                    }
                  }}
                  arc={{
                    colorArray: ['#EA4228', '#5BE12C'],
                    subArcs: [{ limit: 33 }, { limit: 66 }, {}],
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

export default Technical;
