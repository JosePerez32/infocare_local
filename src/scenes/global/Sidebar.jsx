import { useState } from "react";
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, 
         Collapse, IconButton, Typography, useTheme, Divider, Avatar, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import SchemaIcon from "@mui/icons-material/Schema";
import BookIcon from "@mui/icons-material/Book";
import GroupIcon from "@mui/icons-material/Group";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import PublicIcon from '@mui/icons-material/Public';
import ArticleIcon from '@mui/icons-material/Article';
import ReportIcon from '@mui/icons-material/Report';

const SectionTitle = ({ title, isCollapsed }) => {
  if (isCollapsed) return null;
  return (
    <Typography
      variant="body2"
      sx={{
        px: 3,
        py: 1.5,
        fontSize: "0.75rem",
        fontWeight: 600,
        textTransform: "uppercase",
        color: "text.secondary",
        letterSpacing: "0.5px",
      }}
    >
      {title}
    </Typography>
  );
};

const MenuItem = ({ title, to, icon, selected, setSelected, children, isCollapsed }) => {
  const [open, setOpen] = useState(false);
  const hasChildren = Boolean(children);

  const handleClick = () => {
    if (hasChildren) {
      setOpen(!open);
    } else {
      setSelected(title);
    }
  };

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          component={hasChildren ? "div" : Link}
          to={hasChildren ? undefined : to}
          selected={selected === title}
          onClick={handleClick}
          sx={{
            my: 0.5,
            mx: 1,
            borderRadius: 2,
            justifyContent: isCollapsed ? 'center' : 'flex-start',
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
          <ListItemIcon
            sx={{
              minWidth: isCollapsed ? 0 : 40,
              mr: isCollapsed ? 0 : 2,
              justifyContent: 'center',
              color: selected === title ? "#71D8BD" : "inherit",
            }}
          >
            {icon}
          </ListItemIcon>
          {!isCollapsed && (
            <>
              <ListItemText 
                primary={title}
                sx={{
                  "& .MuiTypography-root": {
                    fontWeight: selected === title ? 600 : 400,
                    color: selected === title ? "#71D8BD" : "inherit",
                  },
                }}
              />
              {hasChildren && (open ? <ExpandLess /> : <ExpandMore />)}
            </>
          )}
        </ListItemButton>
      </ListItem>
      {!isCollapsed && hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            {children}
          </List>
        </Collapse>
      )}
    </>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const userRole = localStorage.getItem("userRole");

  const hasAccess = (allowedRoles) => {
    return allowedRoles.includes(userRole);
  };

  const drawerWidth = isCollapsed ? 80 : 280;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: theme.palette.mode === "dark" ? "#1F2A40" : "#fcfcfc",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: "hidden",
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
        }}
      >
        {!isCollapsed && (
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              src="./assets/Watermark_Project_rechts_24pxPNG.png"
              alt="Infocare Logo"
              sx={{ width: 20, height: 20}}
            />
            <Typography
              variant="h6"
              sx={{
                background: "linear-gradient(45deg, #71D8BD 30%, #4FB3A0 90%)",
                backgroundClip: "text",
                textFillColor: "transparent",
                fontWeight: 600,
              }}
            >
              Infocare
            </Typography>
            <Chip
              label="v2.0"
              size="small"
              sx={{
                ml: 1,
                bgcolor: '#71D8BD',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.75rem',
                height: '20px',
              }}
            />
          </Box>
        )}
        <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
          <MenuOutlinedIcon />
        </IconButton>
      </Box>

      <Divider sx={{ my: 1 }} />

      <List>
        
        

        {hasAccess(["writer", "admin"]) && (
          <>
            <MenuItem
              title="Monitoring"
              to="/monitoring"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
            />
            <Divider sx={{ my: 2 }} />
            <MenuItem
              title="Environment"
              to="/environment"
              icon={<PublicIcon/>}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
            />
            <Divider sx={{ my: 2 }} />
            <MenuItem
              title="Support"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
            >
              <MenuItem
              title="Ticket"
              to="/ticketing"
              icon={<ArticleIcon/>}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
            />
              <MenuItem
                title="Create User"
                to="/createUser"
                icon={<GroupAddIcon />}
                selected={selected}
                setSelected={setSelected}
                isCollapsed={isCollapsed}
              />
              <MenuItem
                title="Users List"
                to="/users"
                icon={<GroupIcon />}
                selected={selected}
                setSelected={setSelected}
                isCollapsed={isCollapsed}
              />
            </MenuItem>
            <Divider sx={{ my: 2 }} />
            <MenuItem
              title="Q-reports"
              to="/ilmt"
              icon={<ReportIcon/>}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
            />
            
          </>
        )}

        {hasAccess(["reader"]) && (
          <> 
          <Divider sx={{ my: 2 }} />

            <SectionTitle title="Views" isCollapsed={isCollapsed} />
            <MenuItem
              title="Monitoring"
              to="/monitoring"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
            />
            
          </>
        )}

        {hasAccess(["admin"]) && (
          <>
            <SectionTitle title="Administration" isCollapsed={isCollapsed} />
            <MenuItem
              title="Logging"
              to="/logging"
              icon={<BookIcon />}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
            />
            <MenuItem
              title="Clients"
              to="/clients"
              icon={<RecentActorsIcon />}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
            />
          </>
        )}
         <Divider sx={{ my: 2 }} />
        
        <MenuItem
          title="ILMT"
          to="/ilmt"
          icon={<DonutLargeIcon />}
          selected={selected}
          setSelected={setSelected}
          isCollapsed={isCollapsed}
        />
        <Divider sx={{ my: 2 }} />
        
        <MenuItem
          title="FAQ"
          to="/faq"
          icon={<HelpOutlineOutlinedIcon />}
          selected={selected}
          setSelected={setSelected}
          isCollapsed={isCollapsed}
        />
      </List>
    </Drawer>
  );
};

export default Sidebar;