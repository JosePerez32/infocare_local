import React from 'react';
import { Button, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ReportPage = () => {
  // Datos del cliente y del reporte
  const clientData = {
    name: 'John Doe',
    company: 'Tech Solutions Inc.',
    date: 'June 2023',
    email: 'john.doe@techsolutions.com',
    phone: '+1 234 567 890',
  };

  // Datos de la tabla
  const tableData = [
    { id: 1, product: 'Laptop', quantity: 5, price: 1200, total: 6000 },
    { id: 2, product: 'Smartphone', quantity: 10, price: 800, total: 8000 },
    { id: 3, product: 'Tablet', quantity: 7, price: 500, total: 3500 },
    { id: 4, product: 'Monitor', quantity: 3, price: 300, total: 900 },
  ];

  // Función para descargar el reporte como PDF
  const downloadPDF = () => {
    const input = document.getElementById('report-content'); // Captura el contenido del reporte
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png'); // Convierte el contenido a una imagen
      const pdf = new jsPDF('p', 'mm', 'a4'); // Crea un nuevo documento PDF
      const imgWidth = 210; // Ancho de la página A4 en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calcula la altura de la imagen
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight); // Agrega la imagen al PDF
      pdf.save('report.pdf'); // Descarga el PDF
    });
  };

  return (
    <Box id="report-content" sx={{ p: 4 }}>
      {/* Encabezado del reporte */}
      <Typography variant="h4" gutterBottom>
        June 2023 Report
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Company Name: {clientData.company}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Client: {clientData.name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Date: {clientData.date}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Contact: {clientData.email} | {clientData.phone}
      </Typography>

      {/* Tabla de datos */}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Unit Price</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.product}</TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
                <TableCell align="right">{row.price}</TableCell>
                <TableCell align="right">{row.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Botones */}
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" color="primary" onClick={downloadPDF} sx={{ mr: 2 }}>
          Download PDF
        </Button>
        <Button variant="outlined" color="primary" onClick={() => alert('View Report')}>
          View Report
        </Button>
      </Box>
    </Box>
  );
};

export default ReportPage;