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
  ListItemButton,
  Button
} from "@mui/material";
import { ColorModeContext } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation, Link as RouterLink, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
    /*
      // Decodifica los caracteres especiales como %20
      const decodedPart = decodeURIComponent(part);
      if (decodedPart.startsWith('change/')) {
        return `Change of ${decodedPart.split('/')[1]}`;
      }
      if (decodedPart.startsWith('change/')) {
        return `Change of ${decodedPart.split('/')[1]}`;
      }
      return decodedPart;
    */
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
      if (pathname.length && part !== 'change'){
       // part.filter(part => part !== '');
        return part.charAt(0).toUpperCase() + part.slice(1);
      }
      if (!part.includes('')){
        return pathname.length > 0 ? `/${pathname.join('/')}` : '/'; 
      }
      // Manejo especial para "change" + siguiente parte
      if (part === 'change' && index+1 < parts.length) {
        if (parts[index + 1] === 'history'){
          return '';
        }
        else{
          return `Change of ${pathnames[index+1]}`;
        }
      }
      // Si es el valor después de "change", lo omitimos porque ya lo mostramos en el anterior
      if (index > 0 && parts[index - 1] === 'change') {
        return '';
      }
    };

  const getLinkTo = (index, parts) => {
    const path = [];
  
    for (let i = 0; i <= index; i++) {
      // Saltamos el valor después de "change" porque ya está incluido en el breadcrumb anterior
      if (i > 0 && parts[i - 1] === 'change') continue;
      
      if (parts[i] && parts[i].trim() !== '') {
        path.push(parts[i]);
      }
    }
    
    return `/${path.join('/')}`;
  };

  const getCombinedBreadcrumbs = () => {

      let combinedPathnames = [];
      for (let i = 0; i < pathnames.length; i++) {
        
        // Primero filtramos elementos vacíos o que solo contengan espacios
        if (!pathnames[i] || pathnames[i].trim() === '') continue;
        
        if (pathnames[i] === 'details' && i + 1 < pathnames.length) {
          if (pathnames[i + 1] && pathnames[i + 1].trim() !== '') {
            // Combina "details" y la siguiente parte (por ejemplo, "acc_midd")
            combinedPathnames.push(`details/${pathnames[i + 1]}`);
            if (pathnames[i] === pathnames[i+3]){
              if (pathnames[i + 1] && pathnames[i + 1].trim() !== '') {
                combinedPathnames.push(`details/${pathnames[i + 1]}`);
              }
              i=i+4;
            }
          }
        i++; // Saltar la siguiente parte, ya que se ha combinado
        } else if (pathnames[i] === 'change' && i + 1 < pathnames.length ){
          //combinedPathnames.push(pathnames[i]);
          // Mantenemos "change" y el valor separados para la URL
          combinedPathnames.push('change');
          combinedPathnames.push(pathnames[i]);
          i++;
        }
        else {
              combinedPathnames.push(pathnames[i]);
        }
          //pathnames[i].filter(i => i !== '');
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
          label={'could_be_you'}
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
          {/* Botón "Back" */}
          <Button
            variant="outlined"
            onClick={() => navigate(-1)} // Navegar hacia atrás
            sx={{
              ml: 2, // Margen a la derecha para separar del resto del contenido
              color: theme.palette.text.primary,
              borderColor: theme.palette.divider,
              '&:hover': {
                borderColor: '#71D8BD',
                color: '#71D8BD',
              },
            }}
          >
            Back
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;