import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import GaugeComponent from "react-gauge-component";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useParams ,useLocation } from "react-router-dom";

const Efficiency = () => {
  const { databaseName } = useParams(); // Get database name from the URL
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [indexData, setIndexData] = useState(0);
  const [connectionsData, setConnectionsData] = useState([]);
  const [loggingData, setLoggingData] = useState([]);
  const [lockingData, setLockingData] = useState([]);
  const { source } = useParams(); // Retrieve source from the URL parameters
  const { organization } = useLocation().state || {};

 

  useEffect(() => {
    const fetchEfficiencyData = async () => {
      try {
        const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/dashboards/${organization}/technical/sources/${source}/efficiency`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`, // Add token to Authorization header
              'Content-Type': 'application/json',
            },
          }
        );     
        const data = await response.json();
        setIndexData(data.index);
        setConnectionsData(data.connections);
        setLoggingData(data.logging);
        setLockingData(data.locking);
    

        console.log(data); // Check the fetched data
      } catch (error) {
        console.error("Error fetching recovery data:", error);
      }
    };

    fetchEfficiencyData();
  }, [databaseName,source,organization]);

  return (

    <Box m="20px">
      <Header title={`Efficiency for ${databaseName}`} subtitle="Efficiency" />
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
        <Box
          style={{ cursor: "pointer", backgroundColor: colors.primary[400], padding: "20px", borderRadius: "8px" }} // Change background color, padding, and border radius
        >
          <Typography variant="h6" color={colors.grey[100]}>
            Index
          </Typography>
          <GaugeComponent
            value={indexData}
            type="radial"
            arc={{
              colorArray: ['#EA4228','#5BE12C'],
              subArcs: [{ limit: 33 }, { limit: 66 }, {}],
              padding: 0.02,
              width: 0.3
            }}
          />
        </Box>
        <Box  style={{             cursor: "pointer",
backgroundColor: colors.primary[400], padding: "20px", borderRadius: "8px" }}>
          <Typography variant="h6" color={colors.grey[100]}>
          Connections
          </Typography>
          <GaugeComponent
            value={connectionsData}
            type="radial"
            arc={{
              colorArray: ['#EA4228','#5BE12C'],
              subArcs: [{ limit: 33 }, { limit: 66 }, {}],
              padding: 0.02,
              width: 0.3
            }}
          />
        </Box>
        <Box 
        style={{ cursor: "pointer", backgroundColor: colors.primary[400], padding: "20px", borderRadius: "8px" }}>
          <Typography variant="h6" color={colors.grey[100]}>
            Logging
          </Typography>
          <GaugeComponent
            value={loggingData}
            type="radial"
            arc={{
              colorArray: ['#EA4228','#5BE12C'],
              subArcs: [{ limit: 33 }, { limit: 66 }, {}],
              padding: 0.02,
              width: 0.3
            }}
          />
        </Box>

        <Box 
        style={{ cursor: "pointer", backgroundColor: colors.primary[400], padding: "20px", borderRadius: "8px" }}>
          <Typography variant="h6" color={colors.grey[100]}>
            Locking
          </Typography>
          <GaugeComponent
            value={lockingData}
            type="radial"
            arc={{
              colorArray: ['#EA4228','#5BE12C'],
              subArcs: [{ limit: 33 }, { limit: 66 }, {}],
              padding: 0.02,
              width: 0.3
            }}
          />
        </Box>

      </Box>
    </Box>
  );
};

export default Efficiency;
