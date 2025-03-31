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
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import { Routes, Route, useNavigate } from "react-router-dom";

const SupportPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const email = "could_be_you@infocare.app";
  const phone = "+32 16 56 06 12";

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
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 600,
          width: "100%",
          textAlign: "center",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
          <HeadsetMicIcon fontSize="large" sx={{ mr: 1, verticalAlign: "middle" }} />
          Technical Support
        </Typography>

        <Typography variant="body1" sx={{ mb: 4 }}>
          Need help? Contact us through any of these options:
        </Typography>

        <Stack spacing={3} divider={<Divider />}>
          {/* Email Section */}
          <Box>
            <EmailIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Email Us
            </Typography>
            <Link href={`mailto:${email}`} underline="hover">
              {email}
            </Link>
            <Button
              variant="outlined"
              startIcon={<EmailIcon />}
              sx={{ mt: 2 }}
              onClick={() => window.location.href = `mailto:${email}`}
            >
              Open Email Client
            </Button>
          </Box>

          {/* Phone Section */}
          <Box>
            <PhoneIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Call Us
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {phone}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<PhoneIcon />}
              sx={{ mt: 1 
                
              }}
              onClick={() => window.location.href = `tel:${phone.replace(/\s/g, '')}`}
            >
              Call Now
            </Button>
          </Box>

          {/* Ticket Section */}
          <Box>
            <SupportAgentIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Ticket System
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Open a formal support ticket
            </Typography>
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
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default SupportPage;