import { Box, Typography, Alert } from "@mui/material"; //jp: Alert imported for the temporary message
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import GaugeComponent from "react-gauge-component";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const Organization = () => {
  const { databaseName } = useParams(); // Get database name from the URL
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [designData, setDesignData] = useState(0);
  //const [comparisonData, setComparisonData] = useState(0);
  const [statisticsData, setStatisticsData] = useState(0);
  //const [scriptsData, setScriptsData] = useState(0);
  const { source } = useParams(); // Retrieve source from the URL parameters
  const { organization } = useLocation().state || {};
  const [gaugeOrder, setGaugeOrder] = useState(["design", /*"comparison",*/ "statistics"/*, "scripts"*/]); // jp: State for the gauge order
  const [alertVisible, setAlertVisible] = useState(false); // jp: State to show an alert
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/dashboards/${organization}/technical/sources/${source}/organization`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`, // Add token to Authorization header
              'Content-Type': 'application/json',
            },
          }
        );     
        const data = await response.json();
        setDesignData(data.design);
        //setComparisonData(data.comparison);
        setStatisticsData(data.statistics);
        //setScriptsData(data.scripts);
    

        console.log(data); // Check the fetched data
      } catch (error) {
        console.error("Error fetching recovery data:", error);
      }
    };

    fetchOrganizationData();
  }, [databaseName,organization,source]);

  
// jp: Functions for drag and drop
const handleDragStart = (index) => (event) => {
  event.dataTransfer.setData("text/plain", index); // Save the design for the dragged element
};

const handleDrop = (index) => (event) => {
  event.preventDefault();
  const fromIndex = event.dataTransfer.getData("text/plain"); // Get the design of the dragged element
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
      <Header title={`Organization for ${databaseName}`} subtitle="" />

       {/* jp: Alert para cambios en el orden */}
        {alertVisible && (
        <Alert variant="outlined" severity="success" sx={{ mt: 2 }}>
          Gauge chart order changed!
        </Alert>
        )}


      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
        
      {gaugeOrder.map((gaugeName, index) => {
          let gaugeValue;
          let gaugeTitle;
          let gaugeRoute;

          switch (gaugeName) {
            case "design":
              gaugeValue = designData;
              gaugeTitle = "Design";
              

              break;
            /*case "comparison":
              gaugeValue = comparisonData;
              gaugeTitle = "Comparison";
              break;*/
            case "statistics":
              gaugeValue = statisticsData;
              gaugeTitle = "Statistics";
              gaugeRoute = "/statistics";
              break;
            /*case "scripts":
              gaugeValue = scriptsData;
              gaugeTitle = "Scripts";
              break;*/
            default:
              gaugeValue = 0;
              gaugeTitle = "Unknown";
          }

          return (
            <Box
              key={index}
              draggable // jp: Makes the element draggable
              onDragStart={handleDragStart(index)} // jp: Runs when the drag starts
              onDrop={handleDrop(index)} // jp: Runs when the element is dropped
              onDragOver={handleDragOver} // jp: Makes the element droppable
              onClick={() => {
                if (gaugeRoute) {
                  navigate('statistics', {
                    /*state: { organization },*/
                  });
                }
              }}
              
              style={{
                cursor: "pointer",
                backgroundColor: colors.primary[400],
                padding: "20px",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Typography variant="h6" color={colors.grey[100]}>
                {gaugeTitle}
              </Typography>
              <GaugeComponent
              
                value={gaugeValue}
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
              />
            </Box>
          );
        })}



      </Box>
    </Box>
  );
};

export default Organization;
