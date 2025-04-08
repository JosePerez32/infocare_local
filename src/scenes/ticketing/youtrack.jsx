import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

const YouTrackEmbed = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Verificar si ya tenemos token
    const token = localStorage.getItem('youtrack_token');
    
    if (token) {
      // Si ya está autenticado, puedes cargar directamente el iframe
      return;
    }

    // 2. Si no hay token, iniciar flujo OAuth
    const params = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = params.get('access_token');
    
    if (accessToken) {
      // Guardar token y recargar sin el hash
      localStorage.setItem('youtrack_token', accessToken);
      window.location.href = window.location.pathname;
    } else {
      // Redirigir a YouTrack para autenticación
      const authUrl = `https://infocare.youtrack.cloud/hub/auth/login?response_type=token&client_id=fd5169bf-1622-4177-9e82-d055c38761f0&redirect_uri=${encodeURIComponent(window.location.origin + window.location.pathname)}&scope=fd5169bf-1622-4177-9e82-d055c38761f0%20Upsource%20TeamCity%20YouTrack%2520Slack%2520Integration%200-0-0-0-0&state=YOUR_UNIQUE_STATE`;
      window.location.href = authUrl;
    }
  }, [navigate]);

  // Si tenemos token, mostrar iframe
  if (localStorage.getItem('youtrack_token')) {
    return (
      <Box sx={{ height: '80vh' }}>
        <iframe
          src={`https://infocare.youtrack.cloud/issues?token=${localStorage.getItem('youtrack_token')}`}
          title="YouTrack"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 'none' }}
        />
      </Box>
    );
  }

  // Mientras se autentica
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
      <CircularProgress />
      <Typography variant="body1" sx={{ mt: 2 }}>
        Redirecting to YouTrack authentication...
      </Typography>
    </Box>
  );
};

export default YouTrackEmbed;