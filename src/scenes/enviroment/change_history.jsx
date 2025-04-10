import { Box, Typography, Alert, Button, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import LineChart from '../../components/LineChart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useParams, useLocation } from "react-router-dom";

const Chanhist = () => {
  const { databaseName } = useParams();
  const [sourceNames, setSourceNames] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Datos estáticos para las gráficas (puedes mantenerlos)
  const workloadData = [
    {
      id: "Target only",
      color: "hsl(0, 0%, 0%)",
      data: Array.from({ length: 30 }, (_, i) => ({
        x: i % 5 === 0 ? i : null,
        y: Math.floor(Math.random() * 100),
      })).filter((item) => item.x !== null),
    },
    // ... (otros datos de gráficas)
  ];

  // Llamada a la API para llenar el menú desplegable
  useEffect(() => {
    const fetchSourceData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const organisation = localStorage.getItem('organization');

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/monitoring/overview`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'organisation': organisation
            },
          }
        );
        
        if (!response.ok) throw new Error('Error en la respuesta');
        
        const data = await response.json();
        console.log('Respuesta completa de la API:', data);
        if (data.sources) {
          setSourceNames(data.sources.map(source => source.name));
          

        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setSourceNames([]);
      }
    };

    fetchSourceData();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box m="20px">
      <Header title="Change of history" subtitle=""/>
      
      <Box m="10px" display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="10px">
        <Button
          variant="contained"
          endIcon={<ExpandMoreIcon />}
          onClick={handleClick}
          sx={{ width: '150px' }}
        >
          Compare
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          {sourceNames.length > 0 ? (
            sourceNames.map((name, index) => (
              <MenuItem key={index} onClick={handleClose}>
                {name}
              </MenuItem>
            ))
          ) : (
            
            <MenuItem onClick={handleClose}>No sources available</MenuItem>
          )}
        </Menu>
      </Box>

      {/* Gráficas (se mantienen igual) */}
      <Box m="2px 2px" display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="10px">
        {["TABLE", "INDEX", "VIEW"].map((text, index) => (
          <Box m="50px 2px" key={index} height="200px">
            <Typography variant="h4" gutterBottom>
              {text}
            </Typography>
            <LineChart 
              data={workloadData}  
              xAxisLabels={["0 hr\n19 DD\n03 MM", "5 hr\n20 DD\n04 MM"]} 
              yAxisLegend="" 
              xAxisLegend="" 
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Chanhist;