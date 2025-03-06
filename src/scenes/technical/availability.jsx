import { Box, Typography, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import GaugeComponent from "react-gauge-component";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useParams, useLocation } from "react-router-dom";

const Availability = ({onDataUpdate}) => { //Ths is just added by Jose
  const { databaseName } = useParams(); // Get database name from the URL
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [responseData, setResponseData] = useState(52);
  const [memoryData, setMemoryData] = useState(33);
  const [spaceData, setSpaceData] = useState(98);
  const { source } = useParams(); // Retrieve source from the URL parameters
  const { organization } = useLocation().state || {};
  const [gaugeOrder, setGaugeOrder] = useState(["response", "memory", "space"]); // State for the gauges order
  const [alertVisible, setAlertVisible] = useState(false); // State to show the alert


  useEffect(() => {
    const fetchAvailibilityData = async () => {
      try {
        const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/dashboards/${organization}/technical/sources/${source}/availability`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`, // Add token to Authorization header
              'Content-Type': 'application/json',
            },
          }
        );        
        const data = await response.json();
        setResponseData(data.response);
        setMemoryData(data.memory);
        setSpaceData(data.space);
        // Push back the results to the tachnical_details.jsx page
        if (onDataUpdate) {
          onDataUpdate({
            response: data.response,
            memory: data.memory,
            space: data.space,
          });
        }
      } catch (error) {
        console.error("Error fetching availability data:", error);
      }
      };
      //Finish of the pushing

     //   console.log(data); // Check the fetched data
     // } catch (error) {
     //   console.error("Error fetching recovery data:", error);
     // }
   // };

    fetchAvailibilityData();
  }, [databaseName, organization,source, onDataUpdate]); //onDataUpdate is just added Jose 
  // Funtions for the drag and drop
  const handleDragStart = (index) => (event) => {
    event.dataTransfer.setData("text/plain", index); // Save the index for the drag element 
  };

  const handleDrop = (index) => (event) => {
    event.preventDefault();
    const fromIndex = event.dataTransfer.getData("text/plain"); // Obtiene el índice del elemento arrastrado
    const newOrder = [...gaugeOrder]; // Copy the currently copy
    const [movedItem] = newOrder.splice(fromIndex, 1); // Remove the element of the original position
    newOrder.splice(index, 0, movedItem); // Insert the element in the new position
    setGaugeOrder(newOrder); // Uodate the state with the new order

    // SHows a temporally alert
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 3000);
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Allow you to drop the element
  };
  return (

    <Box m="20px">
      <Header title={`Availibility for ${databaseName} Total: ${responseData}`} subtitle="Availibility"    />
      
    {/* Alert for the change in the order */}
    {alertVisible && (
        <Alert variant="outlined" severity="success" sx={{ mt: 2 }}>
          Gauge chart order changed!
        </Alert>
      )}

      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
      
      {gaugeOrder.map((gaugeName, index) => {
          let gaugeValue;
          let gaugeTitle;
/*This is new from 97 to ...*/
          switch (gaugeName) {
            case "response":
              gaugeValue = responseData;
              gaugeTitle = "Response";
              break;
            case "memory":
              gaugeValue = memoryData;
              gaugeTitle = "Memory";
              break;
            case "space":
              gaugeValue = spaceData;
              gaugeTitle = "Space";
              break;
            default:
              gaugeValue = 0;
              gaugeTitle = "Unknown";
          }

          return ( /*Here this is new*/ 
        <Box
        key={index}
              draggable // This make drag the element
              onDragStart={handleDragStart(index)} // Executes when dragging starts
              onDrop={handleDrop(index)} // This execute self when you drop the element
              onDragOver={handleDragOver} // This allow you to loss the element
          style={{ cursor: "pointer", backgroundColor: colors.primary[400], padding: "20px", borderRadius: "8px" }} // Change background color, padding, and border radius
        >
          <Typography variant="h6" color={colors.grey[100]}>
            {gaugeTitle}
          </Typography>
          <GaugeComponent
            value={gaugeValue}
            type="radial"
            arc={{
              colorArray: ['#EA4228','#5BE12C'],
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

export default Availability;
