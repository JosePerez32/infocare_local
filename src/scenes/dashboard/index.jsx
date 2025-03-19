import { useEffect } from "react";
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

const Dashboard = ({ accessToken }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const t = localStorage.getItem('accessToken');
      if (t) {
        try {
          const response = await fetch(process.env.REACT_APP_API_URL + '/userinfo', {
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

  const FeatureCard = ({ Icon, title, description }) => (
    <Card 
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
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <FeatureCard
            Icon={HandshakeIcon}
            title="Sustainable Partnership"
            description="We prioritize creating enduring bonds with both our clients and employees. Our vision is rooted in executing transformative projects that not only challenge the norm but also provide sustained value to our clients. We believe in growth, and our approach ensures that both our clients and employees grow alongside us."
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FeatureCard
            Icon={AutoAwesomeIcon}
            title="Mastery in Innovation"
            description="Our edge lies in our expertise in cutting-edge technologies. We don't just follow technological trends; we master them, ensuring our clients and employees benefit from the very forefront of technological advancements. Through continuous education, collaboration, and undivided focus, we ensure that we remain a beacon of innovation in our field."
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FeatureCard
            Icon={MoreTimeIcon}
            title="Beyond the Clock Commitment"
            description="We go beyond the constraints of traditional working hours. We don't endorse a mere 9 to 5 mindset; we champion ownership, flexibility, and unwavering dedication. Our team is always ready, ensuring that we meet client needs while also fostering an environment where our employees can flourish without feeling confined."
          />
        </Grid>
      </Grid>

     
    </Box>
  );
};

export default Dashboard;