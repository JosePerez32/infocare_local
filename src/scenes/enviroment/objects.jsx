import { Box, Typography, Alert, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import GaugeComponent from "react-gauge-component";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useParams, useLocation } from "react-router-dom";
import  BarChart from '../../components/BarChart';
import ChangeButtons from "./his-det-back";
import ObjectButtons from "./buttons_objects";
import ObjectTopButtons from "./buttons_history_details_objects";
import  LineChart from '../line';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Bar } from "react-chartjs-2";
//import CellsImg from "../../../public/assets/cells.png";
//import Enviroment from ".";

const Objects = ({onDataUpdate}) => { //Ths is just added by Jose
  const { databaseName } = useParams(); // Get database name from the URL
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [responseData, setResponseData] = useState(52);
  const [memoryData, setMemoryData] = useState(33);
  const [spaceData, setSpaceData] = useState(98);
  const { source } = useParams(); // Retrieve source from the URL parameters
  const { organization } = useLocation().state || {};
  const [gaugeOrder, setGaugeOrder] = useState(["workload", "change", "objects"]); // State for the gauges order
  const [alertVisible, setAlertVisible] = useState(false); // State to show the alert
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const changeData = [
    {
      id: "Porcent",
      color: "hsl(240, 70%, 50%)",
      data: [
        { x: "Production(Only)", y: Math.floor(Math.random() * 100) }, // Dato para "Production(Only)"
        { x: "Difference", y: Math.floor(Math.random() * 100) }, // Dato para "Difference"
        { x: "Acceptation(Only)", y: Math.floor(Math.random() * 100) }, // Dato para "Acceptation(Only)"
      ],
    },
  ];

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
  }, [databaseName, organization,source, onDataUpdate,selectedYear, selectedMonth, selectedDay]); //onDataUpdate is just added Jose 
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
    {/* Alert for the change in the order */}
        {/* Contenedor para los selectores de fecha */}
        <Box display="flex" m="50px 0 0 0 " alignItems="center" gap={1}>
          {/* Selector de Año */}
          <Typography variant="h2" gutterBottom>Objects of {databaseName} on </Typography>


          {/* Selector de Día */}
          <FormControl sx={{ minWidth: 80 }} size="big">
            <InputLabel>Day</InputLabel>
            <Select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              {Array.from({length: daysInMonth}, (_, i) => i + 1).map(day => (
                <MenuItem key={day} value={day}>{day}</MenuItem>
              ))}
            </Select>
          </FormControl>
                    
          {/* Selector de Mes */}
          <FormControl sx={{ minWidth: 120 }} size="big">
            <InputLabel>Month</InputLabel>
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {months.map((month, index) => (
                <MenuItem key={month} value={index + 1}>{month}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl  sx={{ m: "0 0 0px 0", minWidth: 100 }} size="big">
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {Array.from({length: 5}, (_, i) => new Date().getFullYear() - i).map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {alertVisible && (
          <Alert variant="outlined" severity="success" sx={{ mt: 2 }}>
            Gauge chart order changed!
          </Alert>
        )}
       <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
             <br />
              
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
              {/* Aquí puedes agregar el valor de Target si es dinámico */}
            </Typography>
          </Grid>
        </Grid>  
       {/* Contenedor de gráficos */}
       <Box m="10px" display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="10px">
        
        <ObjectTopButtons 
        databaseName={databaseName} 
        selectionData={{
          firstDate: `${selectedYear}-${selectedMonth}-${selectedDay}`,
        }}
        />
       </Box>
       
       <ObjectButtons></ObjectButtons>
      </Box>

  );
};
export default Objects;
