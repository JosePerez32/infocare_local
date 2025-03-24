import { Box, Button } from "@mui/material";
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
        //onClick={() => navigate("/environment/change/history/change_history")} // Navegar a la página de TABLES
      >
        <PersonIcon sx={{ fontSize: "4rem" }}></PersonIcon> 
      </Button>
      {/* Botón BELANG */}
      <Button
        variant="outlined"
        sx={{
          height: "300px", // Altura fija
          borderColor: "#71D8BD",
          color: "#71D8BD",
          fontSize: "3rem", // Tamaño del texto más grande
          "&:hover": {
            backgroundColor: "#71D8BD",
            color: "white",
          },
        }}
        //onClick={() => navigate("/environment/change/history/change_details")} // Navegar a la página de INDEX
      ><AccessibilityNewIcon sx={{ fontSize: "4rem" }}/>
      </Button>
      {/* Botón MAPPING */}
      <Button
        variant="outlined"
        sx={{
          height: "300px", // Altura fija
          borderColor: "#71D8BD",
          color: "#71D8BD",
          fontSize: "10rem", // Tamaño del texto más grande
          "&:hover": {
            backgroundColor: "#71D8BD",
            color: "white",
          },
        }}
       // onClick={() => navigate("/environment/change/history/change_details")} // Navegar a la página de VIEW
      ><TollIcon sx={{ fontSize: "4rem" }} /> 
      </Button>
      {/* Botón OMGEVINGEN */}
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
         <BlurOnIcon sx={{ fontSize: "4rem" }}/><br/> 
      </Button>
    </Box>
  );
};

export default SettingsButtons;