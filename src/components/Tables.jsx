import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

const Table = () => {
  // Definición de las columnas de la tabla
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 90,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
  ];

  // Datos de las filas de la tabla
  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ];

  // Configuración de la paginación inicial
  const paginationModel = { page: 0, pageSize: 2 };

  return (
    <Paper sx={{ height: '200px', width: '100%', marginBottom: '30px' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[3, 5]}
        checkboxSelection
        sx={{
            border: 2, // Grosor del borde
            borderColor: 'rgba(0, 0, 0, 0.1)', // Borde semi-transparente
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid rgba(0, 0, 0, 50)', // Borde inferior de las celdas
            },
            '& .MuiDataGrid-columnHeaders': {
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)', // Borde inferior de los encabezados
            },
          }}
      />
    </Paper>
  );
};

export default Table;