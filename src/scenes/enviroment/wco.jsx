import { Box, Button } from "@mui/material";
const botones = () => {
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
          >
            OBJECTS
          </Button>
      
          </Box>
 );
};
export default botones;