import React, { useContext } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  useTheme,
  Tooltip,
  Chip,
  Breadcrumbs,
  ListItemButton
} from "@mui/material";
import { ColorModeContext } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import CreateIcon from '@mui/icons-material/Create';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Topbar = ({ userName, userInfo, setIsSidebar, onLogout }) => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const location = useLocation();
  const userRole = userInfo?.role;
  const organization = userInfo?.organisation;

  const breadcrumbNameMap = {
    '/': 'Home',
    '/dashboard': 'Dashboard',
    '/management': 'Management',
    '/monitoring': 'Monitoring',
    '/invoices': 'Invoices',
    '/form': 'Form',
    '/faq': 'FAQ',
    '/calendar': 'Calendar',
    '/responsiveness': 'Responsiveness',
    '/cpu': 'CPU',
    '/memory': 'Memory',
    '/space': 'Space',
    '/speed': 'Speed',
    '/readiness': 'Readiness',
    '/security': 'Security',
    '/recovery': 'Recovery',
    '/enironment': 'Environment',
  };

  const pathnames = location.pathname.split('/').filter((x) => x);

  const getBreadcrumbName = (pathname, part, index, parts) => {
    if (breadcrumbNameMap[part]) {
      return breadcrumbNameMap[part];
    }
    if (part.startsWith('details/')) {
      // Verifica si la parte anterior es "technical"
      if (index > 0 && parts[index - 1] === 'technical') {
        return `Monitoring of ${part.split('/')[1]}`; // Cambia "Details" por "Monitoring"
      }
      if (index > 0 && parts[index - 1] === 'monitoring') {
        return `Monitoring of ${part.split('/')[1]}`; // Cambia "Details" por "Monitoring"
      }
      return `Details of ${part.split('/')[1]}`;
    }
    // Si la parte contiene "technical", cámbiala a "Monitoring" y capitaliza
    if (part.toLowerCase().includes('technical')) {
      return 'Monitoring';
    }
    // Capitaliza la primera letra de la parte
    return part.charAt(0).toUpperCase() + part.slice(1);
  };
  
  const getLinkTo = (index, parts) => {
    const path = parts.slice(0, index + 1);
    if (path.some(part => part.startsWith('details/'))) {
      const detailsIndex = path.findIndex(part => part.startsWith('details/'));
      path[detailsIndex] = path[detailsIndex].replace('details/', 'details/');
    }
    return `/${path.join('/')}`;
  };

  const getCombinedBreadcrumbs = () => {
    let combinedPathnames = [];
    for (let i = 0; i < pathnames.length; i++) {
      if (pathnames[i] === 'details' && i + 1 < pathnames.length) {
        combinedPathnames.push(`details/${pathnames[i + 1]}`);
        i++; // Skip the next item as we've combined it
      }
     
      else {
        combinedPathnames.push(pathnames[i]);
      }
      
    }
    return combinedPathnames;
  };

  const combinedPathnames = getCombinedBreadcrumbs();

  const IconButtonWrapper = ({ children, title, onClick }) => (
    <ListItemButton
      onClick={onClick}
      sx={{
        my: 0.5,
        mx: 0.5,
        borderRadius: 2,
        width: 'auto',
        minWidth: 'auto',
        padding: '8px',
        "&:hover": {
          bgcolor: "rgba(113, 216, 189, 0.1)",
        },
        "&.Mui-selected": {
          bgcolor: "rgba(113, 216, 189, 0.2)",
          "&:hover": {
            bgcolor: "rgba(113, 216, 189, 0.3)",
          },
        },
      }}
    >
      <Tooltip title={title}>
      <IconButton
        color="inherit"
        sx={{
          color: theme.palette.mode === "dark" ? "inherit" : "#333", // Cambia el color en modo claro
          "&:hover": { color: "#71D8BD" }, // Color al hacer hover
        }}
      >
        {children}
      </IconButton>

      </Tooltip>
    </ListItemButton>
  );

  const getRoleChip = () => {
    const role = userRole?.toLowerCase();
    
    let icon = <PersonIcon />;
    let label = 'Normal User';
    
    if (role.includes('admin')) {
      icon = <AdminPanelSettingsIcon />;
      label = 'Admin';
    } else if (role.includes('writer')) {
      icon = <CreateIcon />;
      label = 'Writer';
    } else if (role.includes('reader')) {
      icon = <VisibilityIcon />;
      label = 'Reader';
    }
    
    return (
      <Chip
        icon={icon}
        label={label}
        sx={{
          ml: 2,
          bgcolor: 'rgba(113, 216, 189, 0.1)',
          color: theme.palette.text.primary,
          '& .MuiChip-icon': {
            color: '#71D8BD',
          },
          border: '1px solid rgba(113, 216, 189, 0.2)',
        }}
      />
    );
  };

  const getOrganizationChip = () => {
    if (organization) {
      return (
        <Chip
          label={organization}
          sx={{
            ml: 2,
            bgcolor: 'rgba(113, 216, 189, 0.1)',
            color: theme.palette.text.primary,
            border: '1px solid rgba(113, 216, 189, 0.2)',
          }}
        />
      );
    }
    return null;
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: theme.palette.mode === "dark" ? "#1F2A40" : "#fcfcfc",
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Breadcrumbs 
            aria-label="breadcrumb" 
            sx={{ 
              flexGrow: 1,
              '& .MuiLink-root': {
                color: theme.palette.text.primary,
                '&:hover': {
                  color: '#71D8BD',
                }
              },
              '& .MuiTypography-root': {
                color: '#71D8BD',
              }
            }}
          >
            <Link component={RouterLink} underline="hover" color="inherit" to="/">
              {breadcrumbNameMap['/']}
            </Link>
            {combinedPathnames.map((value, index) => {
              const last = index === combinedPathnames.length - 1;
              const to = getLinkTo(index, combinedPathnames);

              return last ? (
                <Typography color="text.primary" key={to}>
                  {getBreadcrumbName(location.pathname, value, index, combinedPathnames)}
                </Typography>
              ) : (
                <Link
                component={RouterLink}
                underline="hover"
                color="inherit"
                to={to}
                state={{ organization }} // Add this line
                key={to}
              >
                {getBreadcrumbName(location.pathname, value, index, combinedPathnames)}
              </Link>
              );
            })}
          </Breadcrumbs>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButtonWrapper title="Toggle color mode" onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
          </IconButtonWrapper>
          
          <IconButtonWrapper title="Settings">
            <SettingsOutlinedIcon />
          </IconButtonWrapper>
          
          {userInfo && getOrganizationChip()}
          {userRole && getRoleChip()}

          {userName && (
            <Chip
              avatar={
                <Avatar 
                  sx={{ 
                    bgcolor: 'rgba(113, 216, 189, 0.2)',
                    color: '#71D8BD',
                  }}
                >
                  {userName.charAt(0).toUpperCase()}
                </Avatar>
              }
              label={userName}
              sx={{
                ml: 2,
                bgcolor: 'rgba(113, 216, 189, 0.1)',
                color: theme.palette.text.primary,
                border: '1px solid rgba(113, 216, 189, 0.2)',
                '& .MuiChip-label': {
                  color: theme.palette.text.primary,
                },
              }}
            />
          )}
          
          <IconButtonWrapper title="Logout" onClick={handleLogout}>
            <LogoutIcon />
          </IconButtonWrapper>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;