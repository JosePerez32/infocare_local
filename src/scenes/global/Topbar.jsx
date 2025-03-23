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
import { source } from 'framer-motion/client';
import user from '../users/createUser'

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
    '/organization': 'Organization',
    '/statistics' : 'Statistics',
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
    '/environment': 'Environment', 
    '/monitoring' : 'Monitoring',   
    //'/monitoring of ' : 'Monitoring of',
  };

  const pathnames = location.pathname.split('/').filter((x) => x);

  const getBreadcrumbName = (pathname, part, index, parts) => {
    // Variable para rastrear si 'details/' ya ha sido procesado
    /*let x= 0;
    let detailsProcessed = false;
    if (part.startsWith('details/')  && detailsProcessed === false) {
      const detailName = part.split('/')[1]; // Extrae el nombre después de "details/"
      detailsProcessed = true; // Marca 'details/' como procesado
      return `Monitoring of ${detailName} `+x;
      x++;
    }
  
    // Si 'details/' ya fue procesado o no comienza con 'details/', continúa con la lógica normal
    if (breadcrumbNameMap[part]) {
      return breadcrumbNameMap[part];
    }
  
    // Capitaliza la primera letra de la parte si no cumple con ninguna condición anterior
    return part.charAt(0).toUpperCase() + part.slice(1);*/
    //if (!part.includes('organizacion')) {
      // Código que se ejecuta si 'organization' no está en part
      if (part.startsWith('details/') ) {
        const detailName = part.split('/')[1]; // Extrae el nombre después de "details/"
        
        return `Monitoring of ${detailName}`;
      }
      
  // Si la parte es "organization"
  if (part === 'organization') {
    return 'Organization';
  }

  // Si la parte es "statistics"
  if (part === 'statistics') {
    return 'Statistics';
  }
      if (breadcrumbNameMap[part]) {
        return breadcrumbNameMap[part];
      }
  
      return part.charAt(0).toUpperCase() + part.slice(1);
    /*} else {
      // Código que se ejecuta si 'organization' está en part
      return 'Organization'; // O cualquier otro valor que desees devolver
    }*/
  };
  
  const getLinkTo = (index, parts) => {
    const path = parts.slice(0, index + 1);
    if (path.some(part => part.startsWith('details/'))) {
      const detailsIndex = path.findIndex(part => part.startsWith('details/'));
      path[detailsIndex] = path[detailsIndex].replace('details/', );
    }
    return `/${path.join('/')}`;
  };

  const getCombinedBreadcrumbs = () => {
    /*let combinedPathnames = [];
    for (let i = 0; i < pathnames.length; i++) {
      if (pathnames[i] === 'details' && i + 1 < pathnames.length) {
        combinedPathnames.push(`details/${pathnames[i + 1]}`);
        i++; // Skip the next item as we've combined it
      }
      if (pathnames[i] === 'workload' && i + 1 < pathnames.length) {
        combinedPathnames.push(`workload of ${pathnames[i + 1]}`);
        i++; // Saltar la siguiente parte, ya que se ha combinado
      }
      // Verifica si la parte anterior es "monitoring"
      if (pathnames[i] === 'objects' && i + 1 < pathnames.length) {
        combinedPathnames.push(`objects of ${pathnames[i + 1]}`);
        i++; // Saltar la siguiente parte, ya que se ha combinado
      }
      // Verifica si la parte anterior es "monitoring"
      if (pathnames[i] === 'change' && i + 1 < pathnames.length) {
        combinedPathnames.push(`Change of ${pathnames[i + 1]}`);
        i++; // Saltar la siguiente parte, ya que se ha combinado
      }
      else {
        combinedPathnames.push(pathnames[i]);
      }
      
    }
    return combinedPathnames;*/
      let combinedPathnames = [];
      for (let i = 0; i < pathnames.length; i++) {
        if (pathnames[i] === 'details' && i + 1 < pathnames.length) {
          // Combina "details" y la siguiente parte (por ejemplo, "acc_midd")
          combinedPathnames.push(`details/${pathnames[i + 1]}`);
          if (pathnames[i] === pathnames[i+3]){
            combinedPathnames.push(`details/${pathnames[i + 1]}`);
            i=i+4;
          }
          i++; // Saltar la siguiente parte, ya que se ha combinado
        } else {
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
          
          <IconButtonWrapper title="Settings" /*onClick={open.user}*/>
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