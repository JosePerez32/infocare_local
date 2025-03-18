import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ObjectButtons = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(3, 1fr)" // 3 columnas de igual tamaño
      gap="10px" // Espacio entre los botones
      width="100%"
      marginTop="10px"
    >
      {/* Botón TABLES */}
      <Button
        variant="outlined"
        sx={{
          height: "200px", // Altura fija
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
        TABLES <br/><br/> 123.512
      </Button>

      {/* Botón INDEX */}
      <Button
        variant="outlined"
        sx={{
          height: "200px", // Altura fija
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
        INDEX <br/><br/> 63.000
      </Button>

      {/* Botón VIEW */}
      <Button
        variant="outlined"
        sx={{
          height: "200px", // Altura fija
          borderColor: "#71D8BD",
          color: "#71D8BD",
          fontSize: "1.5rem", // Tamaño del texto más grande
          "&:hover": {
            backgroundColor: "#71D8BD",
            color: "white",
          },
        }}
       // onClick={() => navigate("/environment/change/history/change_details")} // Navegar a la página de VIEW
      >
        VIEW<br/><br/> 1.500
      </Button>
    </Box>
  );
};

export default ObjectButtons;