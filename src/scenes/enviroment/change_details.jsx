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
  const [selectedTarget, setSelectedTarget] = useState(null);
  const open = Boolean(anchorEl);
  const organization = localStorage.getItem('organization');
  const [selectedDate1, setSelectedDate1] = useState('');
  const [selectedDate2, setSelectedDate2] = useState('');
  const [anchorElDate1, setAnchorElDate1] = useState(null);
  const [anchorElDate2, setAnchorElDate2] = useState(null);
  const [compareData, setCompareData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  const handleClose = (name) => {
    setSelectedTarget(name);
    setAnchorEl(null);
  };

  const fetchCompareData = async () => {
    // Verifica que las fechas estén seleccionadas antes de continuar
    if (!selectedDate1 || !selectedDate2) {
      setError("Please select both dates");
      return;
    }
  
    try {
      const token = localStorage.getItem('accessToken');
      
      // Parsea las fechas correctamente
      const parseDate = (dateStr) => {
        if (!dateStr) throw new Error("Fecha no seleccionada");
        const [day, month, year] = dateStr.split('/');
        return new Date(`${month}/${day}/${year}`);
      };
  
      const queryParams = new URLSearchParams({
        source: databaseName,
        compare_source: databaseName,
        compare_target: selectedTarget,
        compare_source_time: parseDate(selectedDate1).toISOString().split('T')[0],
        compare_target_time: parseDate(selectedDate2).toISOString().split('T')[0]
      });
  
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/environment/compare/detail?${queryParams}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'organisation': organization
          }
        }
      );
  
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      setCompareData(data);
    } catch (err) {
      const errorMessage = err.message.includes("Fecha no seleccionada") 
        ? "Por favor selecciona ambas fechas" 
        : err.message;
      setError(errorMessage);
      console.error("Error en fetchCompareData:", {
        error: err.message,
        selectedDates: { date1: selectedDate1, date2: selectedDate2 }
      });
    } finally {
      setLoading(false);
    }
  };
  console.log("Parámetros disponibles:", {
    source: databaseName,
    target: selectedTarget,
    date1: selectedDate1 || "No seleccionada", // Muestra el string directamente
    date2: selectedDate2 || "No seleccionada"  // Muestra el string directamente
  });

  useEffect(() => {
    if (selectedTarget && selectedDate1 && selectedDate2) {
      fetchCompareData();
    }
  }, [selectedTarget, selectedDate1, selectedDate2]);

  return (
    <Box m="20px">
      <Header title="Details of change" subtitle=""/>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
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
                p: 0
              }}
            >
              {selectedDate1 || "Select date"}
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
            Target: {selectedTarget || "Not selected"}
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
              onClose={() => setAnchorEl(null)}
            >
              {sourceNames.map((name, index) => (
                <MenuItem key={index} onClick={() => handleClose(name)}>
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
                p: 0
              }}
            >
              {selectedDate2 || "Select date"}
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

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <Typography variant="h4" color="white">Loading comparison data...</Typography>
        </Box>
      ) : compareData ? (
        <>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>Comparison Results</Typography>
            
            <Typography variant="h5" sx={{ color: 'white', mt: 3 }}>Only in Source</Typography>
            <Tables height="200px" data={compareData.source_only} />
            
            <Typography variant="h5" sx={{ color: 'white', mt: 3 }}>Only in Target</Typography>
            <Tables height="200px" data={compareData.target_only} />
            
            <Typography variant="h5" sx={{ color: 'white', mt: 3 }}>Differences</Typography>
            <Tables height="200px" data={compareData.different} />
          </Box>
        </>
      ) : (
        ["TABLE", "INDEX", "VIEW"].map((text, index) => (
          <Box key={index} sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white' }}>
              {text}
            </Typography>
            <Tables height="200px" data={databaseName.slice(0, 5)} />
          </Box>
        ))
      )}
    </Box>
  );
};

export default Details;