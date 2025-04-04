import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  useTheme, 
  Typography, 
  Card, 
  CardContent,
  Grid,
} from "@mui/material";
import { tokens } from "../../theme";
import HandshakeIcon from '@mui/icons-material/Handshake';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import Organization from "../monitoring/organization";

const Dashboard = ({ accessToken }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // Dentro de tu componente:
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const t = localStorage.getItem('accessToken');
      if (t) {
        try {
          const response = await fetch(process.env.REACT_APP_API_URL + '/info/user', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });
          const data = await response.json();
          if (data.organisation) {
            localStorage.setItem('organization', data.organisation);
          }
          if (data.role) { 
            localStorage.setItem('userRole', data.role);
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      }
    };

    fetchUserInfo();
  }, [accessToken]);

  const FeatureCard = ({ Icon, title, description, onClick  }) => (
    <Card 
      onClick={onClick}
      sx={{ 
        height: '100%',
        bgcolor: colors.primary[400],
        borderRadius: "16px",
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 8px 32px -8px ${colors.primary[200]}`,
        }
      }}
    >
      <CardContent>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            textAlign: 'center',
            gap: 2,
            p: 2
          }}
        >
          <Box 
            sx={{ 
              bgcolor: colors.primary[600],
              borderRadius: '12px',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon sx={{ fontSize: 40, color: colors.greenAccent[500] }} />
          </Box>
          <Typography 
            variant="h4" 
            color={colors.grey[100]}
            fontWeight="bold"
            sx={{ mb: 1 }}
          >
            {title}
          </Typography>
          <Typography 
            variant="body1" 
            color={colors.grey[300]}
            sx={{ lineHeight: 1.7 }}
          >
            {description}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box m="20px">
      {/* Hero Section with Logo */}
      <Box 
        sx={{ 
          bgcolor: colors.primary[400],
          borderRadius: "20px",
          p: 4,
          mb: 4,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '40%',
            height: '100%',
            background: `linear-gradient(45deg, ${colors.greenAccent[500]}22, ${colors.blueAccent[500]}22)`,
            clipPath: 'polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)',
          }}
        />
        
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h1" 
              color={colors.grey[100]}
              fontWeight="bold"
              sx={{ mb: 2 }}
            >
              
            </Typography>
            <Typography 
              variant="h4" 
              color={colors.grey[200]}
              sx={{ mb: 3 }}
            >
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box 
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2
              }}
            >
              <img 
                src="./assets/InfoCare_Logo_v2.png" 
                alt="InfoCare Logo" 
                style={{ 
                  maxWidth: '100%',
                  height: 'auto',
                  maxHeight: '200px',
                  objectFit: 'contain'
                }} 
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Feature Cards with Original Content */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={2.4}>
          <FeatureCard
            onClick={() => navigate('/monitoring')}
            Icon={HandshakeIcon}
            title="Monitoring"
            description="The monitoring provides a clear, qualified overview of all environments, with time navigation and drill-down options. It complements, rather than replaces, detailed third-party monitoring tools."
          />
        </Grid>
        <Grid item xs={12} md={2.4}>
          <FeatureCard
            onClick={() => navigate('/environment')}
            Icon={AutoAwesomeIcon}
            title="Environment"
            description="The environment section provides a high level overview of what exists in your environment including summarized execution statistics and differences between environments."
          />
        </Grid>
        <Grid item xs={12} md={2.4}>
        <FeatureCard
          onClick={() => navigate('/support')}
          Icon={AutoAwesomeIcon}
          title="Support"
          description="Access comprehensive support resources including documentation, troubleshooting guides, and direct assistance options for all your Infocare platform needs."
        />
        </Grid>
        <Grid item xs={12} md={2.4}>
          <FeatureCard
            Icon={MoreTimeIcon}
            onClick={() => navigate('/repports')}
            title="Reports"
            description="Here you can find monthly status reports of the different environments and our quarter reports. In case you are also an ILMT cients, you can find monthly ILMT reports of your IBM software licenses in your company."
          />
        </Grid>
   
        <Grid item xs={12} md={2.4}>
          <FeatureCard
            onClick={() => navigate('/faq')}
            Icon={AutoAwesomeIcon}
            title="FAQ"
            description="Answers to frequently asked questions about usage, data interpretation, and general Infocare functionality."
          />
        </Grid>
      </Grid>

     
    </Box>
  );
};

export default Dashboard;