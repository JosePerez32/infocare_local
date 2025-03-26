import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
const ObjectTopButtons = ({databaseName}) => {
  const navigate = useNavigate();

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
              margin: "0 1px",
              borderColor: "#71D8BD",
              color: "#71D8BD",
              height: "50px", // Altura fija
                fontSize: "1.5rem", // Tamaño del texto más grande
              "&:hover": {
                backgroundColor: "#71D8BD",
                color: "white",
                
              },
            }}
            onClick={() => navigate(`/environment/objects/${databaseName}/history`)} // Surf to a new_page.jsx
          >
            History
          </Button>
      
          {/* Botón CHANGE */}
          <Button
            variant="outlined"
            sx={{
              flex: 1,
              margin: "0 1px",
              borderColor: "#71D8BD",
              color: "#71D8BD",
              height: "50px", // Altura fija
                fontSize: "1.5rem", // Tamaño del texto más grande
              "&:hover": {
                backgroundColor: "#71D8BD",
                color: "white",
                
              },
            }}
            onClick={() => navigate(`/environment/objects/${databaseName}/details`)} // Surf to a new_page.jsx
          >
            Details 
          </Button>
      
          
      
          </Box>
 );
};
export default ObjectTopButtons;