import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import GaugeComponent from "react-gauge-component";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useParams } from "react-router-dom";

const TechnicalRecovery = () => {
  const { databaseName } = useParams(); // Get database name from the URL
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [drpData, setDrpData] = useState(0);
  const [loggingData, setLoggingData] = useState([]);
  const [backupsData, setBackupsData] = useState([]);
 

  useEffect(() => {
    const fetchRecoveryData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3001/api/recovery/${databaseName}`);
        const data = await response.json();
        setDrpData(data.recovery.drp);
        setLoggingData(data.recovery.logging);
        setBackupsData(data.recovery.backups);
    

        console.log(data); // Check the fetched data
      } catch (error) {
        console.error("Error fetching recovery data:", error);
      }
    };

    fetchRecoveryData();
  }, [databaseName]);

  return (

    <Box m="20px">
      <Header title={`Recovery for ${databaseName}`} subtitle="Recovery" />
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
        <Box
          style={{ cursor: "pointer", backgroundColor: colors.primary[400], padding: "20px", borderRadius: "8px" }} // Change background color, padding, and border radius
        >
          <Typography variant="h6" color={colors.grey[100]}>
            DRP
          </Typography>
          <GaugeComponent
            value={drpData}
            type="radial"
            arc={{
              colorArray: ['#5BE12C', '#EA4228'],
              subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
              padding: 0.02,
              width: 0.3
            }}
          />
        </Box>
        <Box  style={{             cursor: "pointer",
backgroundColor: colors.primary[400], padding: "20px", borderRadius: "8px" }}>
          <Typography variant="h6" color={colors.grey[100]}>
          Logging
          </Typography>
          <GaugeComponent
            value={loggingData}
            type="radial"
            arc={{
              colorArray: ['#5BE12C', '#EA4228'],
              subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
              padding: 0.02,
              width: 0.3
            }}
          />
        </Box>
        <Box 
        style={{ cursor: "pointer", backgroundColor: colors.primary[400], padding: "20px", borderRadius: "8px" }}>
          <Typography variant="h6" color={colors.grey[100]}>
            Backups
          </Typography>
          <GaugeComponent
            value={backupsData}
            type="radial"
            arc={{
              colorArray: ['#5BE12C', '#EA4228'],
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

export default TechnicalRecovery;
