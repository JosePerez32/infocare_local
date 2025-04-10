import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
const Botones = ({databaseName}) => {
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
            onClick={() =>  navigate(`deta/${databaseName}/workload`)
        }
          
            >
            WORKLOAD
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
            onClick={() => navigate(`change/${databaseName}`)}
          >
            CHANGE
          </Button>
      
          {/* Botón OBJECTS */}
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
            onClick={() => navigate(`objects/${databaseName}`)}
          >
            OBJECTS
          </Button>
      
          </Box>
 );
};
export default Botones;