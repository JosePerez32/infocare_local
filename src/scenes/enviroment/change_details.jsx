import { Box, Typography, Grid, Button, Menu, MenuItem, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Tables from '../../components/Tables';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useParams, useLocation } from "react-router-dom";

const Details = () => {
  const { source, databaseName } = useParams();
  const [sourceNames, setSourceNames] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const organization = localStorage.getItem('organization');
  const [selectedDate1, setSelectedDate1] = useState('');
  const [selectedDate2, setSelectedDate2] = useState('');
  const [anchorElDate1, setAnchorElDate1] = useState(null);
  const [anchorElDate2, setAnchorElDate2] = useState(null);
  const dates1 = Array.from({length: 30}, (_, i) => new Date(Date.now() - (i * 86400000)).toLocaleDateString());
  const dates2 = Array.from({length: 30}, (_, i) => new Date(Date.now() - (i * 86400000)).toLocaleDateString());
  // Llamada API para el menú desplegable
  // Dentro del componente de destino:
  const location = useLocation();


  // console.log("Parámetros recibidos:", {
  //   firstDate,
  //   selectedSource,
  //   secondDate,
  //   comparisonType
  // });
  //Fin de acceder a los parametros de change.jsx
  useEffect(() => {
    const fetchSourceData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/monitoring/overview`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'organisation': organization
            }
          }
        );
        const data = await response.json();
        if (data.sources) {
          setSourceNames(data.sources.map(source => source.name));
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchSourceData();
  }, [organization]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { state } = useLocation();
  const { 
    
    firstDate,
    compareOption,
    secondDate 
  } = state || {};
  return (
    <Box m="20px">
      <Header title="Comparison details" subtitle=""/>
      <Box m="10px" display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="10px">
        <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white' }} gutterBottom>
          Comparison details for {databaseName.toUpperCase()}  
        </Typography>
        <Typography variant="h3" gutterBottom>
          Date of the source  <strong>{firstDate}</strong>
        </Typography>
      </Box>
      <Box m="10px" display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="10px">
        <Typography variant="h3"  gutterBottom>
        Target database <strong>{compareOption.toUpperCase()}</strong> 
        </Typography>
        <Typography variant="h3"  gutterBottom>
        Date of the target  <strong>{secondDate}</strong>
        </Typography>
      </Box>
    
   
   

      {["TABLE", "INDEX", "VIEW"].map((text, index) => (
        <Box key={index} sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white' }}>
            {text}
          </Typography>
          <Tables height="200px" data={databaseName.slice(0, 5)} />
        </Box>
      ))}
    </Box>
  );
};

export default Details;