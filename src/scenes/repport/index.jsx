import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Menu, MenuItem } from '@mui/material';
import html2canvas from 'html2canvas';
import Header from "../../components/Header";
import jsPDF from 'jspdf';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ReportPage = () => {
  // Datos del cliente y del reporte
  const clientData = {
    name: 'John Doe',
    company: 'Tech Solutions Inc.',
    date: 'June 2023',
    email: 'john.doe@techsolutions.com',
    phone: '+1 234 567 890',
  };

  // Estados para los menús desplegables
  const [anchorElSource, setAnchorElSource] = useState(null);
  const [anchorElMonth, setAnchorElMonth] = useState(null);
  const [selectedSource, setSelectedSource] = useState('Select Source');
  const [selectedMonth, setSelectedMonth] = useState('Select Month');
  const [sources, setSources] = useState([]);
  const organisation = localStorage.getItem('organisation');
  const token = localStorage.getItem('accessToken');

  // Obtener los sources del endpoint
  useEffect(() => {
    const fetchSources = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/info/sources`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'organisation': organisation,
          },
        });
        console.log(`Organization es: ${organisation}` );
        if (!response.ok) {
          throw new Error('Failed to fetch sources');
        }
        
        const data = await response.json();
        setSources(data);
        console.log('Fetching compare data with:', {
          organisation,
        });
      } catch (error) {
        console.error("Error fetching sources:", error);
        setSources([]);
      }
    };
    
    if (organisation && token) {
      fetchSources();
    }
  }, [organisation, token]);

  // Manejadores para el menú de sources
  const handleSourceClick = (event) => {
    setAnchorElSource(event.currentTarget);
  };

  const handleSourceClose = (source) => {
    setSelectedSource(source);
    setAnchorElSource(null);
  };

  // Manejadores para el menú de meses
  const handleMonthClick = (event) => {
    setAnchorElMonth(event.currentTarget);
  };

  const handleMonthClose = (month) => {
    setSelectedMonth(month);
    setAnchorElMonth(null);
  };

  // Meses del año en el formato solicitado
  const months = [
    'Januari', 'Februari', 'Mart', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generar datos random para la tabla
  const generateRandomDate = () => {
    const start = new Date(2023, 0, 1);
    const end = new Date();
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.toLocaleDateString();
  };

  const generateRandomDescription = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';
    let result = '';
    for (let i = 0; i < 50; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Datos de la tabla (100 filas)
  const tableData = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    date: generateRandomDate(),
    description: generateRandomDescription()
  })).sort((a, b) => new Date(b.date) - new Date(a.date));

  // Función para descargar el PDF de una fila específica
  const downloadRowPDF = (rowData) => {
    const input = document.createElement('div');
    input.style.padding = '20px';
    input.innerHTML = `
      <h3>Report Details</h3>
      <p><strong>Date:</strong> ${rowData.date}</p>
      <p><strong>Description:</strong> ${rowData.description}</p>
      <p><strong>Client:</strong> ${clientData.name}</p>
      <p><strong>Company:</strong> ${clientData.company}</p>
      <p><strong>Source:</strong> ${selectedSource}</p>
      <p><strong>Month:</strong> ${selectedMonth}</p>
    `;
    document.body.appendChild(input);

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`report_${rowData.id}.pdf`);
      document.body.removeChild(input);
    });
  };

  return (
    <Box id="report-content" sx={{ p: 4 }}>
      {/* Encabezado del reporte */}
      <Header
        title="Reports"
        subtitle={``}
      />
      
      {/* Selector de source y mes */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: '10px' }}>
        <Typography variant="h4">
          {selectedMonth} {selectedSource !== 'Select Source' ? `- ${selectedSource}` : ''} Report
        </Typography>
      </Box>

      {/* Botones de selección */}
      <Box m="10px" display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="10px">
        {/* Botón de Compare (como en el ejemplo) */}
        <Button
          variant="contained"
          endIcon={<ExpandMoreIcon />}
          onClick={handleSourceClick}
          sx={{ width: '150px' }}
        >
          Compare
        </Button>
        <Menu
          anchorEl={anchorElSource}
          open={Boolean(anchorElSource)}
          onClose={() => setAnchorElSource(null)}
        >
          {sources.length > 0 ? (
            sources.map((name, index) => (
              <MenuItem key={index} onClick={() => handleSourceClose(name)}>
                {name}
              </MenuItem>
            ))
          ) : (
            <MenuItem onClick={() => setAnchorElSource(null)}>No sources available</MenuItem>
          )}
        </Menu>

        {/* Botón de selección de mes */}
        <Button
          variant="contained"
          endIcon={<ExpandMoreIcon />}
          onClick={handleMonthClick}
          sx={{ width: '150px' }}
        >
          {selectedMonth}
        </Button>
        <Menu
          anchorEl={anchorElMonth}
          open={Boolean(anchorElMonth)}
          onClose={() => setAnchorElMonth(null)}
        >
          {months.map((month, index) => (
            <MenuItem key={index} onClick={() => handleMonthClose(month)}>
              {month}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      <Typography variant="subtitle1" gutterBottom>
        Company Name: {clientData.company}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Client: {clientData.name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Contact: {clientData.email} | {clientData.phone}
      </Typography>

      {/* Tabla de datos */}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Download</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.description}</TableCell>
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