import React from 'react';
import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateUser = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();


  const handleFormSubmit = (values) => {
    console.log(values);
     // Obtener usuarios existentes de localStorage
     const existingUsers = JSON.parse(localStorage.getItem('/settings/users')) || [];
     // Crear nuevo usuario con ID único
     // Crear nuevo usuario con ID único
    const newUser = {
      id: Math.max(...existingUsers.map(u => u.id), 0) + 1,
      name: `${values.firstName} ${values.lastName}`,
      email: values.email,
      phone: values.contact,
      date: new Date().toLocaleDateString(),
      type: 'regular', // Valor por defecto
      address: `${values.address1}, ${values.address2}`
    };

    // Actualizar y guardar
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem('/settings/users', JSON.stringify(updatedUsers));
    
    // Redirigir a la tabla de usuarios
    navigate('/settings/users'); // Ajusta esta ruta según tu configuración
  };
  

  return (
    <Box 
      sx={{
        backgroundColor: '#1A1F2D',
        minHeight: '100vh',
        p: 3
      }}
    >
      <Box 
        sx={{
          backgroundColor: '#242B3D',
          borderRadius: '8px',
          p: 4,
          mb: 4
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <UserPlus size={24} color="#60A5FA" />
          <Box>
            <Typography variant="h5" color="white" fontWeight="600">
              Create User
            </Typography>
            <Typography variant="body2" color="#94A3B8">
              Create a new user profile in the system
            </Typography>
          </Box>
        </Box>

        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={checkoutSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="24px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                {[
                  { name: "firstName", label: "First Name", span: 2 },
                  { name: "lastName", label: "Last Name", span: 2 },
                  { name: "email", label: "Email Address", span: 4 },
                  { name: "contact", label: "Contact Number", span: 4 },
                  { name: "address1", label: "Address Line 1", span: 4 },
                  { name: "address2", label: "Address Line 2", span: 4 },
                ].map((field) => (
                  <TextField
                    key={field.name}
                    fullWidth
                    variant="filled"
                    type="text"
                    label={field.label}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values[field.name]}
                    name={field.name}
                    error={!!touched[field.name] && !!errors[field.name]}
                    helperText={touched[field.name] && errors[field.name]}
                    sx={{
                      gridColumn: `span ${field.span}`,
                      "& .MuiFilledInput-root": {
                        backgroundColor: '#1A1F2D',
                        "&:hover": {
                          backgroundColor: '#1A1F2D',
                        },
                        "&.Mui-focused": {
                          backgroundColor: '#1A1F2D',
                        }
                      },
                      "& .MuiFilledInput-input": {
                        color: 'white'
                      },
                      "& .MuiInputLabel-root": {
                        color: '#94A3B8'
                      },
                      "& .Mui-focused .MuiInputLabel-root": {
                        color: '#60A5FA'
                      },
                      "& .MuiFilledInput-underline:after": {
                        borderBottomColor: '#60A5FA'
                      }
                    }}
                  />
                ))}
              </Box>
              <Box display="flex" justifyContent="flex-end" mt="24px">
                <Button 
                  type="submit" 
                  variant="contained"
                  
                  sx={{
                    backgroundColor: '#60A5FA',
                    '&:hover': {
                      backgroundColor: '#3B82F6'
                    },
                    textTransform: 'none',
                    px: 4,
                    py: 1.5
                  }}
                >
                  Create User
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  contact: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Contact number is required"),
  address1: yup.string().required("Address is required"),
  address2: yup.string().required("Address is required"),
});

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  address1: "",
  address2: "",
};

export default CreateUser;