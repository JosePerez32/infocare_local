import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import ListIcon from '@mui/icons-material/List';
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek';
import AlbumIcon from '@mui/icons-material/Album';
import TableChartIcon from '@mui/icons-material/TableChart';

const ObjectButtons = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr) )"
      gap="10px"
      width="100%"
      marginTop="10px"
    >
      {/* Botón TABLES */}
      <Button
        variant="outlined"
        sx={{
          height: "200px",
          width: "100%",
          borderColor: "#71D8BD",
          color: "#71D8BD",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
          padding: "12px",
          "&:hover": {
            backgroundColor: "#71D8BD",
            color: "white",
            '& img': {
              filter: "brightness(0) invert(1)"
            }
          },
        }}
      >
        <Box
          sx={{
            flex: "1 1 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            maxHeight: "60%",
            width: "100%"
          }}
        >
          <TableChartIcon
       
            style={{
              width: "auto",
              height: "100%",
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
        <Box textAlign="center">
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>TABLES</Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>123.512</Typography>
        </Box>
      </Button>

      {/* Botón INDEX */}
      <Button
        variant="outlined"
        sx={{
          height: "200px",
          width: "100%",
          borderColor: "#71D8BD",
          color: "#71D8BD",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
          padding: "12px",
          "&:hover": {
            backgroundColor: "#71D8BD",
            color: "white",
            '& .MuiSvgIcon-root': {
              color: "white"
            }
          },
        }}
      >
        <Box
          sx={{
            flex: "1 1 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            maxHeight: "60%",
            width: "100%"
          }}
        >
          <ViewTimelineIcon 
            sx={{ 
              fontSize: '80px',
              width: '100%',
              height: '100%',
              maxWidth: '100px',
              maxHeight: '100px'
            }} 
          />
        </Box>
        <Box textAlign="center">
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>INDEX</Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>63.000</Typography>
        </Box>
      </Button>

      {/* Botón VIEW */}
      <Button
        variant="outlined"
        sx={{
          height: "200px",
          width: "100%",
          borderColor: "#71D8BD",
          color: "#71D8BD",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
          padding: "12px",
          "&:hover": {
            backgroundColor: "#71D8BD",
            color: "white",
            '& .MuiSvgIcon-root': {
              color: "white"
            }
          },
        }}
      >
        <Box
          sx={{
            flex: "1 1 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            maxHeight: "60%",
            width: "100%"
          }}
        >
          <ListIcon 
            sx={{ 
              fontSize: '80px',
              width: '100%',
              height: '100%',
              maxWidth: '100px',
              maxHeight: '100px'
            }} 
          />
        </Box>
        <Box textAlign="center">
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>VIEW</Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>1.500</Typography>
        </Box>
        </Button>
        {/* Botón COLUMNS */}
        <Button
          variant="outlined"
          sx={{
            height: "200px",
            width: "100%",
            borderColor: "#71D8BD",
            color: "#71D8BD",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
            padding: "12px",
            "&:hover": {
              backgroundColor: "#71D8BD",
              color: "white",
              '& .MuiSvgIcon-root': {
                color: "white"
              }
            },
          }}
        >
          <Box
            sx={{
              flex: "1 1 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              maxHeight: "60%",
              width: "100%"
            }}
          >
          <CalendarViewWeekIcon
            sx={{ 
              fontSize: '80px',
              width: '100%',
              height: '100%',
              maxWidth: '100px',
              maxHeight: '100px'
            }} 
          />
            
          </Box>
          <Box textAlign="center">
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>COLUMNS</Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>1.000.500</Typography>
          </Box>
      </Button>
      {/* Botón ALLOCATED */}
      <Button
          variant="outlined"
          sx={{
            height: "200px",
            width: "100%",
            borderColor: "#71D8BD",
            color: "#71D8BD",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
            padding: "12px",
            "&:hover": {
              backgroundColor: "#71D8BD",
              color: "white",
              '& .MuiSvgIcon-root': {
                color: "white"
              }
            },
          }}
        >
          <Box
            sx={{
              flex: "1 1 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              maxHeight: "60%",
              width: "100%"
            }}
          >
            <AlbumIcon
              sx={{ 
                fontSize: '80px',
                width: '100%',
                height: '100%',
                maxWidth: '100px',
                maxHeight: '100px'
              }} 
            />
          </Box>
          <Box textAlign="center">
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>ALLOCATED SPACE</Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>800TB</Typography>
          </Box>
      </Button>
  </Box>
  );
};

export default ObjectButtons;