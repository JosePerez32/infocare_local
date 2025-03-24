import { Box, useTheme, Typography, Alert } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import GaugeComponent from 'react-gauge-component';
import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import SettingsButtons  from "./buttonsSettings";

const Settings = () => {
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


  return (
    <Box m="20px">
      
        <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" gap="20px">
          
             
        <SettingsButtons ></SettingsButtons>
              </Box>
           
        </Box>
   
  
  );
};

export default Settings;
