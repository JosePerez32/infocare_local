import React, { useState, useMemo, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AppID from 'ibmcloud-appid-js';
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Typography,
  AppBar,
  Toolbar,
  Container,
  Box,
  Grid,
  LinearProgress,
  Fade,
} from "@mui/material";
import { Database, Shield, Activity, Cloud, Kanban } from "lucide-react";
import { styled } from '@mui/material/styles';
import logoImage from './images/Watermark_Project_rechts_24pxPNG.png';

// Import all existing components
import { ColorModeContext, useMode } from "./theme";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Management from "./scenes/management";
import Users from "./scenes/users";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./components/Unauthorized";
import Technical from "./scenes/technical";
import CreateUser from "./scenes/users/createUser";
import Ticketing from "./scenes/ticketing/ticketing";
import Logging from './scenes/logging/logging';
import ManagementDetails from './scenes/management/management_details';
import TechnicalDetails from './scenes/technical/technical_details';
//import Technical from "./pages/Technical";
import Recovery from './scenes/management/recovery';
import RecoveryDrp from './scenes/management/recover_drp';
import RecoveryBackups from './scenes/management/recover_backups';
import RecoveryLogging from './scenes/management/recover_logging';
import Recover from './scenes/technical/technical_recover';
import Efficiency from './scenes/technical/efficiency';
import Organization from './scenes/technical/organization';
import Security from './scenes/management/security';
import SecurityEncryption from './scenes/management/security_encryption';
import SecurityUsers from './scenes/management/security_users';
import SecurityMasking from './scenes/management/security_masking';
import Availability from './scenes/technical/availability';
import FAQ from "./scenes/faq";
import Responsiveness from './scenes/management/responsiveness';
import ResponsivenessCpu from './scenes/management/responsiveness_cpu';
import ResponsivenessMemory from './scenes/management/responsiveness_memory';
import ResponsivenessSpace from './scenes/management/responsiveness_space';
import ResponsivenessSpeed from './scenes/management/responsiveness_speed';
import ResponsivenessReadyness from './scenes/management/responsiveness_readyness';
import Calendar from "./scenes/calendar/calendar";
import Clients from "./scenes/clients/clients";
import  UserIdleLogout  from './components/UserIdleLogout';
import Enviroment from './scenes/enviroment';
import EnviromentMonitoring from "./scenes/enviroment/new_page";
//import NewPage from "./scenes/enviroment/new_page"; // Import the new component
//




const loginTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4FD1C5',
      light: '#63E6BE',
      dark: '#38A89D',
    },
    secondary: {
      main: '#9F7AEA',
      light: '#B794F4',
      dark: '#805AD5',
    },
    background: {
      default: '#171923',
      paper: '#1A202C',
    },
    text: {
      primary: '#F7FAFC',
      secondary: '#A0AEC0',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      color: '#F7FAFC',
    },
    body1: {
      fontSize: '1.1rem',
      color: '#A0AEC0',
    },
  },
  shape: {
    borderRadius: 12,
  },
});

// Styled Components for Login Page Only
const LoginContainer = styled('div')({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  background: 'linear-gradient(135deg, #1a1f2c 0%, #2d3748 100%)',
  overflow: 'hidden',
});

const CircuitPattern = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: 0.1,
  backgroundImage: `
    radial-gradient(circle at 25px 25px, #ffffff 2%, transparent 2.5%),
    radial-gradient(circle at 75px 75px, #ffffff 2%, transparent 2.5%)
  `,
  backgroundSize: '100px 100px',
  pointerEvents: 'none',
});

const BackgroundElement = styled('div')(({ index }) => ({
  position: 'absolute',
  width: '150px',
  height: '150px',
  background: 'linear-gradient(135deg, rgba(79, 209, 197, 0.2), rgba(159, 122, 234, 0.2))',
  borderRadius: '50%',
  filter: 'blur(50px)',
  animation: 'float 10s infinite',
  opacity: 0.5,
  '@keyframes float': {
    '0%, 100%': {
      transform: 'translate(0, 0) rotate(0deg)',
    },
    '50%': {
      transform: 'translate(100px, 50px) rotate(180deg)',
    },
  },
  animationDelay: `${index * 0.5}s`,
}));

const LoginCard = styled(Box)({
  background: 'rgba(23, 25, 35, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: '32px',
  width: '100%',
  maxWidth: '440px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
});

const IconWrapper = styled(Box)({
  background: 'linear-gradient(135deg, #4FD1C5, #9F7AEA)',
  borderRadius: '12px',
  padding: '12px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const Logo = styled('img')({
  height: '40px',
  marginRight: '16px',
});

const StyledButton = styled('button')({
  background: 'linear-gradient(135deg, #4FD1C5, #9F7AEA)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  padding: '12px 24px',
  fontSize: '1.1rem',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  width: '100%',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
  '&:disabled': {
    background: '#4a5568',
    cursor: 'not-allowed',
    transform: 'none',
  },
});

const DataPulse = styled('div')({
  position: 'absolute',
  width: '4px',
  height: '4px',
  background: '#4FD1C5',
  borderRadius: '50%',
  animation: 'pulse 4s infinite',
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(20)',
      opacity: 0,
    },
  },
});

const RotatingIcon = styled('div')({
  animation: 'rotate 20s linear infinite',
  '@keyframes rotate': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
});

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const navigate = useNavigate();

  // AppID Authentication
  const appID = useMemo(() => new AppID(), []);
  const [errorState, setErrorState] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [isAppIDInitialized, setIsAppIDInitialized] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initAppID = async () => {
      try {
        await appID.init({
          clientId: 'a1aecd93-e29f-4359-8dc0-953460f71acd',
          discoveryEndpoint: 'https://eu-de.appid.cloud.ibm.com/oauth/v4/facad6f3-96d0-4451-beda-e2b7dbc2df61/.well-known/openid-configuration'
        });
        setIsAppIDInitialized(true);
      } catch (e) {
        setErrorState(true);
        setErrorMessage('Failed to initialize AppID: ' + e.message);
      }
    };
    initAppID();
  }, [appID]);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setIsAuthenticated(true);
      setAccessToken(storedToken);
      fetchUserInfo(storedToken);
    }
  }, []);

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/userinfo', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data)
      setUserInfo(data);
      if (data.organisation) {
        localStorage.setItem('organization', data.organisation);
      }
      if (data.role) {
        localStorage.setItem('userRole', data.role);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const loginAction = async () => {
    if (!isAppIDInitialized) {
      setErrorState(true);
      setErrorMessage('AppID is not initialized yet. Please try again in a moment.');
      return;
    }

    setIsLoading(true);
    try {
      const tokens = await appID.signin();
      setErrorState(false);
      setIsAuthenticated(true);
      setUserName(tokens.idTokenPayload.name);
      setAccessToken(tokens.idToken);
      localStorage.setItem('accessToken', tokens.idToken);
      await fetchUserInfo(tokens.idToken);
    } catch (e) {
      setErrorState(true);
      setErrorMessage('Login failed: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const logoutAction = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('organization');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserName('');
    setAccessToken(null);
    setUserInfo(null);
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={loginTheme}>
        <CssBaseline />
        <LoginContainer>
          <CircuitPattern />
          {[...Array(6)].map((_, index) => (
            <BackgroundElement
              key={index}
              index={index}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${index * 0.5}s`,
              }}
            />
          ))}
          
          {[...Array(20)].map((_, index) => (
            <DataPulse
              key={`pulse-${index}`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}

          <AppBar position="static" elevation={0} sx={{ background: 'transparent' }}>
            <Toolbar>
              <Box display="flex" alignItems="center">
                <Logo src={logoImage} alt="Infocare Logo" />
                <Typography variant="h6" component="div" sx={{ color: 'white' }}>
                  Infocare 
                </Typography>
              </Box>
            </Toolbar>
          </AppBar>

          <Container 
            sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              py: 4,
              position: 'relative',
            }}
          >
            <Fade in timeout={1000}>
              <LoginCard>
                <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
                  <RotatingIcon>
                    <Database size={48} color="#4FD1C5" />
                  </RotatingIcon>
                  
                  <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                    <Typography variant="h4" component="h1" gutterBottom>
                      Welcome to Infocare
                    </Typography>
                    <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: '300px' }}>
                      Your comprehensive database monitoring and management solution
                    </Typography>
                  </Box>

                  <Grid container spacing={3} justifyContent="center" sx={{ mb: 3 }}>
                    <Grid item xs={4}>
                      <IconWrapper>
                        <Activity size={24} color="white" />
                      </IconWrapper>
                      <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                        Real-time
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <IconWrapper>
                        <Shield size={24} color="white" />
                      </IconWrapper>
                      <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                        Secure
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <IconWrapper>
                        <Cloud size={24} color="white" />
                      </IconWrapper>
                      <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                        Cloud-Ready
                      </Typography>
                    </Grid>
                  </Grid>

                  <StyledButton
                    onClick={loginAction}
                    disabled={!isAppIDInitialized || isLoading}
                  >
                    {isLoading ? 'Signing in...' : (isAppIDInitialized ? 'Sign in with IBM' : 'Initializing...')}
                  </StyledButton>

                  {isLoading && (
                    <LinearProgress 
                      sx={{ 
                        width: '100%', 
                        borderRadius: 1,
                        mt: 2,
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(45deg, #4FD1C5 30%, #9F7AEA 90%)',
                        }
                      }} 
                    />
                  )}

                  {errorState && (
                    <Typography 
                      color="error" 
                      variant="body2" 
                      align="center"
                      sx={{ mt: 2 }}
                    >
                      {errorMessage}
                    </Typography>
                  )}
                </Box>
              </LoginCard>
            </Fade>
          </Container>
        </LoginContainer>
      </ThemeProvider>
    );
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar 
              setIsSidebar={setIsSidebar} 
              userName={userName} 
              userInfo={userInfo}
              onLogout={logoutAction} 
            />
            <UserIdleLogout timeout={1000000} onLogout={logoutAction} />
            <Routes>
              <Route path="/" element={<Dashboard accessToken={accessToken} />} />
              
              {/* Protected Management Routes */}
              <Route
                path="/management/*"
                element={
                  <ProtectedRoute allowedRoles={['reader', 'writer','admin']}>
                    <Routes>
                      <Route path="/" element={<Management />} />
                      <Route path="details/:source" element={<ManagementDetails />} />
                      <Route path="details/:databaseName/responsiveness" element={<Responsiveness />} />
                      <Route path="details/:source/responsiveness/cpu" element={<ResponsivenessCpu />} />
                      <Route path="details/:source/responsiveness/memory" element={<ResponsivenessMemory />} />
                      <Route path="details/:source/responsiveness/space" element={<ResponsivenessSpace />} />
                      <Route path="details/:source/responsiveness/speed" element={<ResponsivenessSpeed />} />
                      <Route path="details/:databaseName/responsiveness/readyness" element={<ResponsivenessReadyness />} />
                      <Route path="details/:databaseName/security" element={<Security />} />
                      <Route path="details/:databaseName/security/encryption" element={<SecurityEncryption />} />
                      <Route path="details/:databaseName/security/users" element={<SecurityUsers />} />
                      <Route path="details/:databaseName/security/masking" element={<SecurityMasking />} />
                      <Route path="details/:databaseName/recovery" element={<Recovery />} />
                      <Route path="details/:databaseName/recovery/drp" element={<RecoveryDrp />} />
                      <Route path="details/:databaseName/recovery/backups" element={<RecoveryBackups />} />
                      <Route path="details/:databaseName/recovery/logging" element={<RecoveryLogging />} />

                    </Routes>
                  </ProtectedRoute>
                }
              />

              {/* Protected Technical Routes */}
              <Route
                path="/technical/*"
                element={
                  <ProtectedRoute allowedRoles={['reader', 'writer', 'admin']}>
                    <Routes>
                      <Route path="/" element={<Technical />} />
                      <Route path="details/:databaseName" element={<TechnicalDetails />} />
                      <Route path="details/:databaseName/availability" element={<Availability />} />
                      <Route path="details/:databaseName/efficiency" element={<Efficiency />} />
                      <Route path="details/:databaseName/organization" element={<Organization />} />
                      <Route path="details/:databaseName/technical_recover" element={<Recover />} />
                    </Routes>
                  </ProtectedRoute>
                }
                
              />
               {/* Protected Technical Routes */}
               <Route
                path="/enviroment/*"
                element={
                  <ProtectedRoute allowedRoles={['reader', 'writer', 'admin']}>
                    <Routes>
                       {/* Otras rutas */}
                      <Route path="/" element={<Enviroment />} />
                      {/* New dinamic route */}
                      <Route path="details/:databaseName" element={<EnviromentMonitoring />} />
                    </Routes>
                  </ProtectedRoute>
                }
                
              />

              {/* Protected Admin Routes */}
              <Route
                path="/users"
                element={
                  <ProtectedRoute allowedRoles={['writer', 'admin']}>
                    <Users />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/createUser"
                element={
                  <ProtectedRoute allowedRoles={['writer', 'admin']}>
                    <CreateUser />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/logging"
                element={
                  <ProtectedRoute allowedRoles={['writer', 'admin']}>
                    <Logging />
                  </ProtectedRoute>
                }
              />


              <Route
                path="/ticketing"
                element={
                  <ProtectedRoute allowedRoles={['writer', 'reader', 'admin']}>
                    <Ticketing />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/clients"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Clients />
                  </ProtectedRoute>
                }
              />

              {/* Common Routes */}
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
