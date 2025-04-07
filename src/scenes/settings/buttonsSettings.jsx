import { Box, Button, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import TollIcon from '@mui/icons-material/Toll';
import BlurOnIcon from '@mui/icons-material/BlurOn';

const SettingsButtons = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(2, 1fr)" // 3 columnas de igual tamaño
      gap="10px" // Espacio entre los botones
      width="80%"
      marginTop="10px"
      marginRight="50px"
      marginLeft="50px"
    >
      {/* Botón USERS */}
      <Tooltip 
        title="Users" 
        arrow
        placement="top" // Puedes cambiar a "bottom", "left", "right"
      >
      <Button
        variant="outlined"
        sx={{
          height: "300px", // Altura fija
          borderColor: "#71D8BD",
          color: "#71D8BD",
          fontSize: "1.5rem", // Tamaño del texto más grande
          "&:hover": {
            backgroundColor: "#71D8BD",
            color: "white",
          },
        }}
        onClick={() => navigate("users")} // Navegar a la página de TABLES
      >Users
        <PersonIcon sx={{ fontSize: "4rem" }}></PersonIcon> 
      </Button></Tooltip>
      {/* Botón BELANG */}
      <Tooltip 
        title="Importance" 
        arrow
        placement="top" // Puedes cambiar a "bottom", "left", "right"
      >
      <Button
        variant="outlined"
        sx={{
          height: "300px", // Altura fija
          borderColor: "#71D8BD",
          color: "#71D8BD",
          fontSize: "1.5rem", // Tamaño del texto más grande
          "&:hover": {
            backgroundColor: "#71D8BD",
            color: "white",
          },
        }}
        onClick={() => navigate("/clients")}
        //onClick={() => navigate("/environment/change/history/change_details")} // Navegar a la página de INDEX
      >
       Importance 
       <AccessibilityNewIcon sx={{ fontSize: "4rem" }}/>
      </Button></Tooltip>
      {/* Botón MAPPING */}
      <Tooltip 
        title="Importance" 
        arrow
        placement="top" // Puedes cambiar a "bottom", "left", "right"
      >
      <Button
        variant="outlined"
        sx={{
          height: "300px", // Altura fija
          borderColor: "#71D8BD",
          color: "#71D8BD",
          fontSize: "1.5rem", // Tamaño del texto más grande
          "&:hover": {
            backgroundColor: "#71D8BD",
            color: "white",
          },
        }}
       onClick={() => navigate("/clients")} // Navegar a la página de VIEW
      >
      Mapping<TollIcon sx={{ fontSize: "4rem" }} /> 

      </Button>
      </Tooltip>
      {/* Botón OMGEVINGEN */}
      <Tooltip 
        title="Environments" 
        arrow
        placement="top" // Puedes cambiar a "bottom", "left", "right"
      >
      <Button
        variant="outlined"
        sx={{
          height: "300px", // Altura fija
          borderColor: "#71D8BD",
          color: "#71D8BD",
          fontSize: "1.5rem", // Tamaño del texto más grande
          "&:hover": {
            backgroundColor: "#71D8BD",
            color: "white",
          },
        }}
        //onClick={() => navigate("/environment/change/history/change_details")} // Navegar a la página de INDEX
      >
         Environments<BlurOnIcon sx={{ fontSize: "4rem" }}/><br/> 
      </Button>
      </Tooltip>
    </Box>
  );
};

export default SettingsButtons;