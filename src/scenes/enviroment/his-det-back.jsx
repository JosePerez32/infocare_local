import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
const ChangeButtons = ({databaseName}) => {
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
            onClick={() => navigate(`/environment/change/${databaseName}/details`)} // Surf to a new_page.jsx
          >
            Details 
          </Button>
      
          
      
          </Box>
 );
};
export default ChangeButtons;