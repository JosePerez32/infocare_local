import { Box, Typography, Alert } from "@mui/material"; //jp: Add the Alert bibliothec here 
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import GaugeComponent from "react-gauge-component";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useParams , useLocation} from "react-router-dom";

const Security = () => {
  const { databaseName } = useParams(); // Get database name from the URL
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [publicData, setPublicData] = useState(0);
  const [usersData, setUsersData] = useState([]);
  const [sslData, setsslData] = useState([]);
  const { source } = useParams(); // Retrieve source from the URL parameters
  const { organization } = useLocation().state || {};
  const [alertVisible, setAlertVisible] = useState(false); // jp: State to show an alert
 
 

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/dashboards/${organization}/technical/sources/${source}/security`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`, // Add token to Authorization header
              'Content-Type': 'application/json',
            },
          }
        );     
        const data = await response.json();
        setPublicData(data.public);
        setUsersData(data.users);
        setsslData(data.ssl);
    

        console.log(data); // Check the fetched data
      } catch (error) {
        console.error("Error fetching security data:", error);
      }
    };

    fetchSecurityData();
  }, [databaseName, organization,source]);


// jp: Functions for drag and drop
const handleDragStart = (index) => (event) => {
  event.dataTransfer.setData("text/plain", index); // Save the index for the dragged element
};

const handleDrop = (index) => (event) => {
  event.preventDefault();
  const fromIndex = event.dataTransfer.getData("text/plain"); // Get the index of the dragged element
  const newOrder = [...gaugeOrder]; // Copy the currently order
  const [movedItem] = newOrder.splice(fromIndex, 1); // Romove the element of his original position
  newOrder.splice(index, 0, movedItem); // Insert the element in the new position 
  setGaugeOrder(newOrder); // Update the state with the new order

  // Shows a temporary alert
  setAlertVisible(true);
  setTimeout(() => setAlertVisible(false), 3000);
};

const handleDragOver = (event) => {
  event.preventDefault(); // Allow you to drop the element
};









  return (

    <Box m="20px">
      <Header title={`Efficiency for ${databaseName}`} subtitle="Efficiency" />
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
        <Box
          style={{ cursor: "pointer", backgroundColor: colors.primary[400], padding: "20px", borderRadius: "8px" }} // Change background color, padding, and border radius
        >
          <Typography variant="h6" color={colors.grey[100]}>
            Public
          </Typography>
          <GaugeComponent
            value={publicData}
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
          Users
          </Typography>
          <GaugeComponent
            value={usersData}
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
            SSL
          </Typography>
          <GaugeComponent
            value={sslData}
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
            Scripts
          </Typography>
          <GaugeComponent
            value={scriptsData}
            type="radial"
            arc={{
              colorArray: ['#5BE12C', '#EA4228'],
              subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
              padding: 0.02,
              width: 0.3
            }}
          />
        </Box>

      </Box>
    </Box>
  );
};

export default Security;
