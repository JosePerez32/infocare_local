import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const Header = ({ title, subtitle, className  }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box mb="30px">
      <Typography
        
        className={className}
        variant="h2"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ m: "10px 0 5px 0"}}
      >
        {title}
      </Typography>
      <Typography variant="h5" color={colors.greenAccent[400]}>
        
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
