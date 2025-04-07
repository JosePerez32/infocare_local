import React from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Paper,
  Stack,
  Link,
  useTheme,
  Grid,
  Card,
  CardContent
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";

const SupportPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const email = "could_be_you@infocare.app";
  const phone = "+32 016 29 64 34";

  const FeatureCard = ({ Icon, title, content, button }) => (
    <Card 
      sx={{ 
        bgcolor: theme.palette.background.paper,
        height: '100%',
        
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
            p: 3
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
          {content}
          {button}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        p: 3,
      }}
    >
      <Box sx={{ maxWidth: 1200, width: "100%" }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            textAlign: "center",
            backgroundColor: theme.palette.background.paper,
            mb: 4
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
            <HeadsetMicIcon fontSize="large" sx={{ mr: 1, verticalAlign: "middle" }} />
            Technical Support
          </Typography>

          <Typography variant="body1" sx={{ mb: 4 }}>
            Need help? Contact us through any of these options:
          </Typography>
        </Paper>

        <Grid container spacing={3} >
          {/* Email Card */}
          <Grid item xs={12} md={4} >
            <FeatureCard
              Icon={EmailIcon}
              title="Email Us"
              sx={{
                backgroundColor: theme.palette.background.paper
              }}
              content={
                
                <>
                  <Typography variant="body1" color={colors.grey[300]} sx={{ mb: 2 }}>
                    {email}
                  </Typography>
                </>
              }
              button={
                <Button
                  variant="outlined"
                  startIcon={<EmailIcon />}
                  sx={{
                      backgroundColor: theme.palette.background.paper,
                 
                    mt: 1,
                    bgcolor: "#71D8BD",
                    "&:hover": { bgcolor: "#5abfaa" },
                  }}
                  onClick={() => window.location.href = `mailto:${email}`}
                >
                  Open Email Client
                </Button>
              }
            />
          </Grid>
          {/* Ticket Card */}
          <Grid item xs={12} md={4}>
            <FeatureCard
              Icon={SupportAgentIcon}
              title="Ticket System"
              content={
                <Typography variant="body1" color={colors.grey[300]} sx={{ mb: 2 }}>
                  Open a formal support ticket
                </Typography>
              }
              button={
                <Button
                  variant="contained"
                  startIcon={<SupportAgentIcon />}
                  sx={{
                    mt: 1,
                    bgcolor: "#71D8BD",
                    "&:hover": { bgcolor: "#5abfaa" },
                  }}
                  onClick={() => navigate("../ticketing")}
                >
                  Open Ticket
                </Button>
              }
            />
          </Grid>
          {/* Phone Card */}
          <Grid item xs={12} md={4}>
            <FeatureCard
              Icon={PhoneIcon}
              title="Call Us"
              content={
                <>
                  <Typography variant="body1" color={colors.grey[300]} sx={{ mb: 2 }}>
                    {phone}
                  </Typography>
                </>
              }
              button={
                <Button
                  variant="outlined"
                  startIcon={<PhoneIcon />}
                  sx={{
                    mt: 1,
                    bgcolor: "#71D8BD",
                    "&:hover": { bgcolor: "#5abfaa" },
                  }}
                  onClick={() => window.location.href = `tel:${phone.replace(/\s/g, '')}`}
                >
                  Call Now
                </Button>
              }
            />
          </Grid>

          
        </Grid>
      </Box>
    </Box>
  );
};

export default SupportPage;