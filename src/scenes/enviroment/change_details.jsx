import { Box, Typography, Grid, Button, Menu, MenuItem, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Tables from '../../components/Tables';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useParams, useLocation } from "react-router-dom";

const Details = () => {
  const { databaseName, source } = useParams();
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

  return (
    <Box m="20px">
      <Header title="Details of change" subtitle=""/>
      
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={6}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white' }}>
            Source: {databaseName}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white' }}>
            DATE: 
            <Button 
              onClick={(e) => setAnchorElDate1(e.currentTarget)}
              sx={{ 
                color: 'white', 
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textTransform: 'none',
                p: 0 // Elimina padding interno para mejor alineación
              }}
            >
              {selectedDate1 || "DATE:"}
            </Button>
            <Menu anchorEl={anchorElDate1} open={Boolean(anchorElDate1)} onClose={() => setAnchorElDate1(null)}>
              {dates1.map((date1, i) => (
                <MenuItem key={i} onClick={() => { 
                  setSelectedDate1(date1); 
                  setAnchorElDate1(null); 
                }}>
                  {date1}
                </MenuItem>
              ))}
            </Menu>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white' }}>
            Target: 
            <Button
              variant="contained"
              endIcon={<ExpandMoreIcon />}
              onClick={handleClick}
              sx={{ ml: 2, verticalAlign: 'middle' }}
            >
              Select
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              {sourceNames.map((name, index) => (
                <MenuItem key={index} onClick={handleClose}>
                  {name}
                </MenuItem>
              ))}
            </Menu>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white' }}>
            DATE:   
            <Button 
              onClick={(e) => setAnchorElDate2(e.currentTarget)}
              sx={{ 
                color: 'white', 
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textTransform: 'none',
                p: 0 // Elimina padding interno para mejor alineación
              }}
            >
              {selectedDate2 || "DATE:"}
            </Button>
            <Menu anchorEl={anchorElDate2} open={Boolean(anchorElDate2)} onClose={() => setAnchorElDate2(null)}>
              {dates2.map((date2, i) => (
                <MenuItem key={i} onClick={() => { 
                  setSelectedDate2(date2); 
                  setAnchorElDate2(null); 
                }}>
                  {date2}
                </MenuItem>
              ))}
            </Menu>
          </Typography>
        </Grid>
      </Grid>

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