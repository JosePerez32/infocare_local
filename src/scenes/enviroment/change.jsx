import { Box, Typography, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import GaugeComponent from "react-gauge-component";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useParams, useLocation } from "react-router-dom";
import  BarChart from '../../components/BarChart';
import ChangeButtons from "./his-det-back";
import  LineChart from '../line';
import { Bar } from "react-chartjs-2";
import { Menu, Button } from "@mui/material";
import { Menu, Button } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
//import Enviroment from ".";

const Change = ({onDataUpdate}) => { //Ths is just added by Jose
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  // Cambia la definición de ChangeButtons para aceptar un manejador de clic
  // Dentro de tu componente:
  //Estados para la segunda fecha.
  const [secondSelectedYear, setSecondSelectedYear] = useState(new Date().getFullYear());
  const [secondSelectedMonth, setSecondSelectedMonth] = useState(new Date().getMonth() + 1);
  const [secondSelectedDay, setSecondSelectedDay] = useState(new Date().getDate());
  const navigate = useNavigate();
  
  // const buttons = [
  //   { label: "Tables", value: "tables" },
  //   { label: "Indexes", value: "indexes" },
  //   { label: "Views", value: "views" }
  // ];
  const [selectedParams, setSelectedParams] = useState({
    firstDate: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`, // Fecha actual
    selectedSource: 'Compare', // Valor inicial del dropdown
    secondDate: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}` // Fecha actual
  });

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

  // Calcula los días del mes seleccionado
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const { databaseName } = useParams(); // Get database name from the URL
  const theme = useTheme();

  const colors = tokens(theme.palette.mode);
  const [responseData, setResponseData] = useState(52);
  const [memoryData, setMemoryData] = useState(33);
  const [spaceData, setSpaceData] = useState(98);
  //const { organisation } = useLocation().state || {};
  const [gaugeOrder, setGaugeOrder] = useState(["workload", "change", "objects"]); // State for the gauges order
  const [alertVisible, setAlertVisible] = useState(false); // State to show the alert
  const [anchorEl, setAnchorEl] = useState(null);
  //const [compareData, setCompareData] = useState(null);
  const [selectedOption, setSelectedOption] = useState('Compare'); // Valor inicial
  //const organisation = localStorage.getItem('organisation');
  //const { source } = useParams(); // Asegúrate de que esto viene de la URL
  const { organization } = useLocation().state || {}; // Esto podría ser undefined
  const location = useLocation();
  const open = Boolean(anchorEl);
  const [sourceNames, setSourceNames] = useState([]); // Nuevo estado para los nombres
  //jp: API integration
  const { organisation = "cloud_be_you", source = databaseName } = location.state || {}; 
  //jp: API integration for the graphics/barcharts
  const [tableData, setTableData] = useState(null);
  const [indexData, setIndexData] = useState(null);
  const [viewsData, setViewsData] = useState(null);
  // Debuggeo (verifica en consola)
  useEffect(() => {
    fetchCompareData();
    // setSelectedParams(prev => ({
    //   ...prev,
    //   firstDate: `${selectedYear}-${selectedMonth}-${selectedDay}`,
    //   secondDate: `${selectedYear}-${selectedMonth}-${selectedDay}`
    // }));
  }, [selectedYear, selectedMonth, selectedDay]);
  //}, []); // <- Array vacío para que solo se ejecute una vez
  console.log("Datos obtenidos:", { databaseName, organisation, source });
  // const handleButtonClick = (buttonType) => {
  //   navigate(`/details/${databaseName}`, { 
  //     state: {
  //       ...selectedParams,
  //       comparisonType: buttonType
  //     }
  //   });
  // };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    fetchCompareData();
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  // Y cuando cambie la selección del dropdown
  const handleSourceSelect = (name) => {
    setSelectedOption(name);
    setSelectedParams(prev => ({
      ...prev,
      selectedSource: name
    }));
  };
  
  const fetchCompareData = async () => {
    const token = localStorage.getItem('accessToken');
    const org = localStorage.getItem('organisation') || "cloud_be_you"; // Fallback
    if (!organisation || !source) {
      console.error("Faltan parámetros:", { organisation, source });
      return;
    }
    try {
      
      // Llamada 2: /info/sources (en paralelo o secuencial)
      const sourcesResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/info/sources`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'organisation': org
          }
        }
      );
      const { sources } = await sourcesResponse.json(); // Destructuración directa
     


      console.log('Fetching compare data with:', {
        organisation,
        source
      });
      const compareResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/environment/compare`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'organisation': org,
            'source': databaseName
          }
        }
      );
      const compareData = await compareResponse.json();
          // Actualiza cada estado por separado
          setTableData(compareData.tables);
          setIndexData(compareData.indexes);
          setViewsData(compareData.views);
            
      //const sourcesData = await sourcesResponse.json();
      //const names = sourcesData.sources.map(source => source.name); // Extrae solo los nombres
      // Verifica que sources existe y tiene datos
      if (sources && sources.length > 0) {
        setSourceNames(sources.map(item => item.name)); // Mapeo correcto
      } else {
        setSourceNames([]); // Lista vacía si no hay datos
      }
    } catch (error) {
      console.error("Error fetching compare data:", error);
      setSourceNames([]); // Lista vacía en caso de error
    }
    //jp: To fill the menu
    

  };
  //Tot hier
  /*const changeData = [
    {
      id: "",
      color: "hsl(240, 70%, 50%)",
      data: [
        { x: "Source", y: Math.floor(Math.random() * 100) }, // Dato para "Production(Only)"
        { x: "Diff", y: Math.floor(Math.random() * 100) }, // Dato para "Difference"
        { x: "Target", y: Math.floor(Math.random() * 100) }, // Dato para "Acceptation(Only)"
      ],
    },
  ];*/
  //Transform the data for the barcharts
  const prepareChartData = (type) => {
    
    let data;
    switch(type){
      case 'tables':
        data = tableData;
        console.log(`Datos para ${type}:`, data);
        break;
      case 'indexes':
        data = indexData;
        break;
      case 'views':
        data = viewsData;
        break;
      default:
        return null;
    }
    if (!data) return null;
  
    return [
      {
        id: type,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        data: [ 
          { x: "Source Only", y: data.source_only },
          { x: "Target Only", y: data.target_only },
          { x: "Different", y: data.different }
        ]
      }
    ];
  };


  
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
    console.log("Valores actuales:", {
      databaseName, // ¿Es prd_lst?
      organisation, // ¿Tiene valor?
      source,       // ¿Tiene valor?
      apiUrl: process.env.REACT_APP_API_URL
    });
  return (
  <Box m="20px">
    {/* Alert for the change in the order */}
    {/* Contenedor flexible para título y selectores de fecha */}
      <Box display="flex" alignItems="center" gap={2} sx={{ flexWrap: 'wrap' }}>
        {/* Título */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Header title={`Difference's beetwen ${databaseName} of` } subtitle="" />
        </Box>
          {/* Contenedor para los selectores de fecha */}
          <Box display="flex" alignItems="center" gap={1}>
          {/* Selector de Año */}
          <FormControl  sx={{ m: "0 0 5px 0", minWidth: 100 }} size="big">
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
          </Box>
      </Box>
      {/*Renglon 2*/}
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="center" // Añade esto para centrar horizontalmente
        gap={2} 
        sx={{ flexWrap: 'wrap', width: '100%',transform: 'translateX(-120px)' }}
      >
        <Header 
          title={"and"} 
          sx={{ 
            textAlign: 'center',
            width: '80%',
            ms: 'auto', // Margen horizontal automático para centrado adicional
          }}
        />
         {/* jp: Deployder button */}
         <Button
            variant="contained"
            endIcon={<ExpandMoreIcon />}
            onClick={handleClick}
            sx={{ width: '150px' }}
          >
            {selectedOption} {/* Muestra la opción seleccionada o "Compare" */}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
              {sourceNames.length > 0 ? (
              sourceNames.map((name, index) => (
                <MenuItem key={index} onClick={() => {handleSourceSelect(name); // Actualiza la opción seleccionada
                  handleClose(); // Cierra el menú
                  }}>
                  {name}
                </MenuItem>
              ))
            ) : (
              <MenuItem onClick={handleClose}>No sources available</MenuItem>
            )}
          </Menu>
          {/* jp: End of the section */}
          <Header 
          title={"of"} 
          sx={{ 
            textAlign: 'center',
            width: '80%',
            ms: 'auto', // Margen horizontal automático para centrado adicional
          }}
        />
        {/* Contenedor para los selectores de fecha */}
        <Box display="flex" alignItems="center" gap={1}>
          {/* Selector de Año */}
          <FormControl  sx={{ m: "0 0 5px 0", minWidth: 100 }} size="big">
            <InputLabel>Year</InputLabel>
            <Select
              value={secondSelectedYear}
              onChange={(e) => setSecondSelectedYear(e.target.value)}
            >
              {Array.from({length: 5}, (_, i) => new Date().getFullYear() - i).map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Selector de Mes */}
          <FormControl sx={{ minWidth: 120 }} size="big">
            <InputLabel>Month</InputLabel>
            <Select
              value={secondSelectedMonth}
              onChange={(e) => setSecondSelectedMonth(e.target.value)}
            >
              {months.map((month, index) => (
                <MenuItem key={month} value={index + 1}>{month}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {/* Selector de Día */}
          <FormControl sx={{ minWidth: 80 }} size="big">
            <InputLabel>Day</InputLabel>
            <Select
              value={secondSelectedDay}
              onChange={(e) => setSecondSelectedDay(e.target.value)}
            >
              {Array.from({length: daysInMonth}, (_, i) => i + 1).map(day => (
                <MenuItem key={day} value={day}>{day}</MenuItem>
              ))}
            </Select>
          </FormControl>
          </Box>
      </Box>
      {alertVisible && (
        <Alert variant="outlined" severity="success" sx={{ mt: 2 }}>
          Gauge chart order changed!
        </Alert>
      )}
      {/* Contenedor de gráficos */}
      <Box m="10px" display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="10px">
       <ChangeButtons databaseName={databaseName}
        selectionData={{
        firstDate: `${selectedYear}-${selectedMonth}-${selectedDay}`,
        compareOption: selectedOption,
        secondDate: `${secondSelectedYear}-${secondSelectedMonth}-${secondSelectedDay}`
      }}
         />
    

      </Box>
      <Box m="2px" display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="5px">
          <Box  height="200px">
          </Box>
      </Box>
       <Box m="2px" display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="5px">
       {[
          { type: 'tables', label: 'TABLES' },
          { type: 'indexes', label: 'INDEXES' },
          { type: 'views', label: 'VIEWS' }
        ].map(({type, label}) => {
          const chartData = prepareChartData(type);
          return(
          <Box key={type} height="200px">
            <Typography variant="h4" gutterBottom>
              {label}
            </Typography>
            {chartData ? (              <BarChart data={chartData} yAxisLegend="Count" xAxisLegend="Comparison" />
            ):(<Typography>Loading data...</Typography>)
            }

          </Box>
          );
        })}
          
        </Box>

    </Box>
  );
};
export default Change;
