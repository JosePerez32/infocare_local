import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Menu, MenuItem } from '@mui/material';
import html2canvas from 'html2canvas';
import Header from "../../components/Header";
import jsPDF from 'jspdf';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Arrays de palabras estructuradas
const subjects = ['The system', 'The database', 'The application', 'The server', 'The network', 'The API', 'The UI', 'The backend', 'The cloud', 'The cache'];
const verbs = ['processed', 'analyzed', 'optimized', 'monitored', 'secured', 'updated', 'debugged', 'deployed', 'migrated', 'scaled'];
const nouns = ['data', 'logs', 'requests', 'errors', 'transactions', 'queries', 'indexes', 'clusters', 'containers', 'endpoints'];
const adverbs = ['quickly', 'efficiently', 'securely', 'reliably', 'consistently', 'automatically', 'manually', 'periodically', 'randomly', 'silently'];
const adjectives = ['critical', 'important', 'minor', 'major', 'urgent', 'scheduled', 'unexpected', 'routine', 'complex', 'simple'];
const statuses = ['completed', 'failed', 'pending', 'running', 'canceled', 'timeout', 'successful', 'interrupted', 'queued', 'skipped'];
const locations = ['in production', 'in staging', 'in development', 'on AWS', 'on Azure', 'on-premise', 'in the cloud', 'locally', 'remotely', 'globally'];
  // Generar años disponibles (últimos 5 años)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
// Función para generar datos estructurados con al menos 10 registros de Marzo 2025
const generateStructuredData = () => {
  const now = new Date();
  
  // Generar 10 registros fijos de Marzo 2025
  const march2025Data = Array.from({ length: 10 }, (_, i) => {
    const day = Math.floor(Math.random() * 28) + 1; // Días del 1 al 28
    const date = new Date(2025, 2, day); // Marzo es el mes 2 (0-indexado)
    
    return {
      id: i + 1,
      date: date.toLocaleDateString(),
      description: [
        subjects[Math.floor(Math.random() * subjects.length)],
        verbs[Math.floor(Math.random() * verbs.length)],
        nouns[Math.floor(Math.random() * nouns.length)],
        adverbs[Math.floor(Math.random() * adverbs.length)],
        locations[Math.floor(Math.random() * locations.length)]
      ].join(' '),
      type: statuses[Math.floor(Math.random() * statuses.length)],
      severity: adjectives[Math.floor(Math.random() * adjectives.length)],
      year: 2025,
      month: 2 // Marzo
    };
  });

  // Generar 20 registros aleatorios (del mes pasado real o históricos)
  const randomData = Array.from({ length: 20 }, (_, i) => {
    // 50% de probabilidad de ser del mes pasado real, 50% de ser histórico
    const useLastMonth = Math.random() > 0.5;
    const randomDate = useLastMonth
      ? new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          Math.floor(Math.random() * 28) + 1
        )
      : new Date(
          2023 + Math.floor(Math.random() * 3), // Años 2023-2025
          Math.floor(Math.random() * 12), // Todos los meses
          Math.floor(Math.random() * 28) + 1
        );

    return {
      id: i + 11, // Continuar IDs desde donde terminaron los fijos
      date: randomDate.toLocaleDateString(),
      description: [
        subjects[Math.floor(Math.random() * subjects.length)],
        verbs[Math.floor(Math.random() * verbs.length)],
        nouns[Math.floor(Math.random() * nouns.length)],
        adverbs[Math.floor(Math.random() * adverbs.length)],
        locations[Math.floor(Math.random() * locations.length)]
      ].join(' '),
      type: statuses[Math.floor(Math.random() * statuses.length)],
      severity: adjectives[Math.floor(Math.random() * adjectives.length)],
      year: randomDate.getFullYear(),
      month: randomDate.getMonth()
    };
  });
  const combinedData = [...march2025Data, ...randomData];
    
    return combinedData.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA; // Orden descendente
    });
  };
  // // Combinar y ordenar por fecha (más reciente primero)
  // return [...march2025Data, ...randomData].sort((a, b) => 
  //   new Date(b.date) - new Date(a.date)
  // );
//};

const ReportPage = () => {
  // Estados
  const [anchorElEnv, setAnchorElEnv] = useState(null);
  const [anchorElMonth, setAnchorElMonth] = useState(null);
  const [anchorElYear, setAnchorElYear] = useState(null);
  const [selectedEnv, setSelectedEnv] = useState('Environment');
  // Con esto:
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const [selectedMonth, setSelectedMonth] = useState(months[lastMonth.getMonth()]);
  const [selectedYear, setSelectedYear] = useState(lastMonth.getFullYear().toString());
  const [environments, setEnvironments] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const organisation = localStorage.getItem('organisation');
  const token = localStorage.getItem('accessToken');

  // Obtener environments del endpoint
  useEffect(() => {
    const fetchEnvironments = async () => {
      if (!token) return;
      
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/info/sources`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'organisation': organisation,
          },
        });
        
        if (response.ok) {
          const { sources } = await response.json();
          setEnvironments(Array.isArray(sources) ? sources : []);
        }
      } catch (error) {
        console.error("Error fetching environments:", error);
      }
    };
    
    if (organisation && token) fetchEnvironments();
  }, [organisation, token]);

  // Cargar o generar datos iniciales
  useEffect(() => {
    const savedData = localStorage.getItem('reportData');
    const now = new Date();
    
    if (savedData) {
      setTableData(JSON.parse(savedData));
    } else {
      const newData = generateStructuredData();
      setTableData(newData);
      localStorage.setItem('reportData', JSON.stringify(newData));
    }
  }, []);

  // Filtrar datos según selecciones
  useEffect(() => {
    let result = [...tableData];
    
    // Siempre filtrar por año y mes seleccionados
    if (selectedYear && selectedMonth) {
      const monthIndex = months.findIndex(m => m === selectedMonth);
      result = result.filter(item => 
        item.year === parseInt(selectedYear) && 
        item.month === monthIndex
      );
    }
    
    setFilteredData(result);
  }, [tableData, selectedYear, selectedMonth]);

  // Filtrar y ordenar datos según selecciones
useEffect(() => {
  if (tableData.length === 0) return;
  
  const monthIndex = months.findIndex(m => m === selectedMonth);
  const yearNum = parseInt(selectedYear);
  
  // Filtrar primero
  let filtered = tableData.filter(item => {
    // Si no hay filtros, mostrar solo el mes pasado
    if (selectedYear === 'Year' && selectedMonth === 'Month') {
      const lastMonth = new Date().getMonth() - 1;
      const lastYear = new Date().getFullYear();
      return item.month === lastMonth && item.year === lastYear;
    }
    
    // Aplicar filtros seleccionados
    return item.year === yearNum && item.month === monthIndex;
  });

  // Ordenar por fecha descendente (más reciente primero)
  const sorted = [...filtered].sort((a, b) => {
    // Convertir a Date objects para comparación precisa
    const dateA = new Date(a.date.split('/').reverse().join('-'));
    const dateB = new Date(b.date.split('/').reverse().join('-'));
    return dateB - dateA;
  });

  setFilteredData(sorted);
}, [tableData, selectedYear, selectedMonth]); // Eliminar filteredData de las dependencias
  // Manejadores para los menús
  const handleEnvClick = (event) => setAnchorElEnv(event.currentTarget);
  const handleMonthClick = (event) => setAnchorElMonth(event.currentTarget);
  const handleYearClick = (event) => setAnchorElYear(event.currentTarget);

  const handleEnvClose = (env = null) => {
    if (env) setSelectedEnv(env);
    setAnchorElEnv(null);
  };

  const handleMonthClose = (month = null) => {
    if (month) setSelectedMonth(month);
    setAnchorElMonth(null);
  };

  const handleYearClose = (year = null) => {
    if (year) setSelectedYear(year);
    setAnchorElYear(null);
  };



  // Función para descargar PDF
  const downloadRowPDF = async (rowData) => {
    try {
      // Crear un elemento temporal fuera del DOM
      const element = document.createElement('div');
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      element.style.padding = '20px';
      element.style.backgroundColor = 'white';
      
      // Contenido del PDF
      element.innerHTML = `
        <h3 style="color: #333; font-family: Arial;">Report Details</h3>
        <p style="color: #555; font-family: Arial;"><strong>Date:</strong> ${rowData.date}</p>
        <p style="color: #555; font-family: Arial;"><strong>Description:</strong> ${rowData.description}</p>
        <p style="color: #555; font-family: Arial;"><strong>Type:</strong> ${rowData.type}</p>
        <p style="color: #555; font-family: Arial;"><strong>Severity:</strong> ${rowData.severity}</p>
        <p style="color: #555; font-family: Arial;"><strong>Environment:</strong> ${selectedEnv}</p>
        <p style="color: #555; font-family: Arial;"><strong>Period:</strong> ${selectedMonth} ${selectedYear}</p>
      `;
      
      // Añadir temporalmente al body
      document.body.appendChild(element);
      
      // Esperar a que el elemento esté en el DOM
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Capturar con html2canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Mejor calidad
        logging: false, // Desactivar logs
        useCORS: true, // Para evitar problemas con CORS
        allowTaint: true // Permitir imágenes externas
      });
      
      // Crear PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // Ancho A4 en mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`report_${rowData.id}.pdf`);
      
      // Limpiar
      document.body.removeChild(element);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Header title="Reports" />
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: '10px' }}>
        <Typography variant="h4">
          {selectedMonth} {selectedYear !== 'Year' ? selectedYear : ''} Report
          {selectedEnv !== 'Environment' ? ` - ${selectedEnv}` : ''}
        </Typography>
      </Box>

      {/* Filtros */}
      <Box m="10px" display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="10px">
        {/* Environment */}
        <Button
          variant="contained"
          endIcon={<ExpandMoreIcon />}
          onClick={handleEnvClick}
          sx={{ width: '180px' }}
        >
          {selectedEnv}
        </Button>
        <Menu anchorEl={anchorElEnv} open={Boolean(anchorElEnv)} onClose={() => handleEnvClose()}>
          {environments.map((env) => (
            <MenuItem key={env.id} onClick={() => handleEnvClose(env.name)}>
              {env.name}
            </MenuItem>
          ))}
        </Menu>

        {/* Year */}
        <Button
          variant="contained"
          endIcon={<ExpandMoreIcon />}
          onClick={handleYearClick}
          sx={{ width: '120px' }}
        >
          {selectedYear}
        </Button>
        <Menu anchorEl={anchorElYear} open={Boolean(anchorElYear)} onClose={() => handleYearClose()}>
          {years.map((year) => (
            <MenuItem key={year} onClick={() => handleYearClose(year.toString())}>
              {year}
            </MenuItem>
          ))}
        </Menu>

        {/* Month */}
        <Button
          variant="contained"
          endIcon={<ExpandMoreIcon />}
          onClick={handleMonthClick}
          sx={{ width: '120px' }}
        >
          {selectedMonth}
        </Button>
        <Menu anchorEl={anchorElMonth} open={Boolean(anchorElMonth)} onClose={() => handleMonthClose()}>
          {months.map((month, index) => (
            <MenuItem key={index} onClick={() => handleMonthClose(month)}>
              {month}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Tabla */}
      <TableContainer component={Paper} sx={{ mt: 4, maxHeight: '600px', overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell align="right">Download</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.severity}</TableCell>
                <TableCell align="right">
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={() => downloadRowPDF(row)}
                    sx={{ width: '120px' }}
                  >
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReportPage;