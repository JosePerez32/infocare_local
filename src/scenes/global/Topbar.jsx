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
  const organisation = userInfo?.organisation;
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
    'deta/objects' : 'Objects of',  
    '/performance' : 'Performance'
    //'/monitoring of ' : 'Monitoring of',
  };

  const pathnames = location.pathname.split('/').filter((x) => x);

  const prefixMap = {
    'details/': (part) => `Monitoring of ${part.split('/')[1]}`,
    'deta/': (part) => `Workload of ${part.split('/')[1]}`,
    'objects/': (part) => `Objects of ${part.split('/')[1]}`
  };
  
  const specialCasesMap = {
    'change': (index, parts, pathnames) => 
      index + 1 < parts.length ? `Change of ${pathnames[index+1]}` : '',
    'objects': (index, parts, pathnames) =>
      index + 1 < parts.length ? `Objects of ${pathnames[index+1]}` : ''
  };
          const shouldBeTextOnly = (part) => {
            // Lista de partes que no deben ser clickeables
            const nonClickableParts = [
              
              'history',
              'workload',
              // Agrega aquí cualquier otro caso que no deba ser link
            ];
            
            return nonClickableParts.some(ncp => part.includes(ncp));
          };

          const getBreadcrumbName = (pathname, part, index, parts) => {
            // Caso para "details/[nombre]"
            if (part.startsWith('details/')) {
              const objName = part.split('/')[1];
              return `Monitoring of ${objName}`;
            }
            
            // Caso para "objects/[nombre]"
            if (part === 'objects' && index + 1 < parts.length) {
              return `Objects of ${parts[index + 1]}`;
            }
            // 1. Verificar prefijos especiales
            for (const [prefix, formatter] of Object.entries(prefixMap)) {
              if (part.startsWith(prefix)) {
                return formatter(part);
              }
            }
          
            // 2. Verificar casos especiales
            if (specialCasesMap[part]) {
              return specialCasesMap[part](index, parts, pathnames);
            }
          
            // 3. Ocultar valores después de 'change'
            if (index > 0 && parts[index - 1] === 'change') {
              return null; // Cambiado a null para que no se renderice
            }
            if (index > 0 && parts[index - 1] === 'objects') {
              return null; // Cambiado a null para que no se renderice
            }
          
            // 4. Buscar en el mapa de nombres
            if (breadcrumbNameMap[part]) {
              return breadcrumbNameMap[part];
            }
          
            // 5. Caso por defecto
            return part.charAt(0).toUpperCase() + part.slice(1);
          };
      
          const getLinkTo = (index, parts) => {
            const path = [];
            
            // Caso especial para rutas "objects/[nombre]/details"
            /*if (parts[index]?.startsWith('details/')) {
              // Para "details/prd_lst", regresar a "objects/prd_lst"
              const objName = parts[index].split('/')[1];
              return `/environment/objects/${objName}`;
            }*/
            
            // Caso especial para "Objects of [nombre]"
            if (parts[index] === 'objects' && index + 1 < parts.length) {
              return `/environment/objects/${parts[index + 1]}`;
            }
            if (parts[index] === 'change' && index + 1 < parts.length) {
              return `/environment/change/${parts[index + 1]}`;
            }
          
            // Construcción normal de la ruta
            for (let i = 0; i <= index; i++) {
              if (parts[i] && parts[i].trim() !== '') {
                // Saltamos el valor después de "details" ya que ya lo procesamos
                if (i > 0 && parts[i - 1] === 'details') continue;
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
          
          else if(pathnames[i] === 'details' && i + 1 < pathnames.length) {
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
          } else if (pathnames[i] === 'deta' && i + 1 < pathnames.length ){
            //combinedPathnames.push(pathnames[i]);
            // Mantenemos "change" y el valor separados para la URL
            combinedPathnames.push(`deta/${pathnames[i + 1]}`);
            
            //combinedPathnames.push(pathnames[i]);
            i=i+10;
          }else if(pathnames[i] === 'change' && pathnames[i-2] === 'change'){
            combinedPathnames.push(`${pathnames[i]}`);
            
            i=pathnames.length;

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
    const role = (userRole || '').toLowerCase(); // Fallback a string vacío
    
    let icon = <PersonIcon />;
    let label = 'could_be_you';
  
    // Verificación segura
    if (typeof role === 'string') {
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
    if (organisation) {
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
                  textDecoration: 'underline'
                },
                textDecoration: 'none'
              },
              '& .MuiTypography-root': {
                color: '#71D8BD',
                fontWeight: 'medium'
              }
            }}
          >
            <Link component={RouterLink} underline="hover" color="inherit" to="/">
              {breadcrumbNameMap['/']}
            </Link>
            {combinedPathnames.map((value, index) => {
              const last = index === combinedPathnames.length - 1;
              const to = getLinkTo(index, combinedPathnames);
              const displayName = getBreadcrumbName(location.pathname, value, index, combinedPathnames);
              
              if (!displayName) return null;
              
              if (last || shouldBeTextOnly(value)) {
                return (
                  <Typography color="text.primary" key={to || index}>
                    {displayName}
                  </Typography>
                );
              }
              
              return (
                <Link
                  component={RouterLink}
                  underline="hover"
                  color="inherit"
                  to={to}
                  state={{ organisation }}
                  key={to}
                  sx={{
                    color: theme.palette.text.primary,
                    '&:hover': {
                      color: '#71D8BD',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {displayName}
                </Link>
              );
            })}
        </Breadcrumbs>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButtonWrapper title="Toggle color mode" onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
          </IconButtonWrapper>
          
          <IconButtonWrapper title="Settings" onClick={() => navigate('settings')}>
            <SettingsOutlinedIcon />
          </IconButtonWrapper>
          
          {userName && getOrganizationChip()}
          {userInfo && getRoleChip()}

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