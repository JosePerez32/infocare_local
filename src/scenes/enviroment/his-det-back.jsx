import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
  // Cambia la definición de ChangeButtons para aceptar un manejador de clic
const ChangeButtons = ({ databaseName, selectionData  }) => {

  const navigate = useNavigate();
  const handleDetailsClick = () => {
    navigate(`/environment/change/${databaseName}/details`, { 
      state: { 
        databaseName,
        ...selectionData 
      } 
    });
  };
 return (
          <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
          marginTop="10px"
        >
          {/* Botón WORKLOAD */}
          <Button
            variant="outlined"
            sx={{
              flex: 1,
              margin: "0 2px",
              borderColor: "#71D8BD",
              color: "#71D8BD",
              "&:hover": {
                backgroundColor: "#71D8BD",
                color: "white",
              },
            }}
            onClick={() => navigate(`/environment/change/${databaseName}/history`)} //
          >
            History
          </Button>
      
          {/* Botón CHANGE */}
          
          <Button
            variant="contained"
            sx={{
              flex: 1,
              margin: "0 2px",
              borderColor: "#71D8BD",
              color: "#71D8BD",
              "&:hover": {
                backgroundColor: "#71D8BD",
                color: "white",
              },
            }}
            onClick={handleDetailsClick} // Surf to a new_page.jsx
          >
            Details 
          </Button>
      
          
      
          </Box>
 );
};
export default ChangeButtons;