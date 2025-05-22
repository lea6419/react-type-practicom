// src/components/AppLayout.jsx

import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  Fade,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Description as FileIcon,
  People as PeopleIcon,
  Assessment as ReportIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon
} from "@mui/icons-material";
import { SetStateAction, useState } from "react";

const drawerWidth = 240;

function AppLayout({ onLogout}: { onLogout: any} ) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);

  // Use parent logout to sync auth state
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    onLogout();
    navigate("/login", { replace: true });
    window.location.reload();
  };

  // const handleProfileMenuOpen = (event: { currentTarget: SetStateAction<null>; }) => setAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);
  const handleProfileMenuOpen = (event: React.MouseEvent) => setAnchorEl(event.currentTarget);
  const menuItems = [
    { text: 'דשבורד', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'ניהול קבצים', icon: <FileIcon />, path: '/files' },
    { text: 'ניהול משתמשים', icon: <PeopleIcon />, path: '/users' },
    { text: 'דוחות', icon: <ReportIcon />, path: '/reports' },
    { text: 'הפרופיל שלי', icon: <AccountIcon />, path: '/profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setDrawerOpen(!drawerOpen)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            מערכת ניהול הקלדות
          </Typography>
          <Tooltip title="הגדרות משתמש">
            <IconButton color="inherit" onClick={handleProfileMenuOpen}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#bbdefb', color: '#1565c0' }}>
                <AccountIcon />
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            TransitionComponent={Fade}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}>
              <ListItemIcon><AccountIcon fontSize="small" /></ListItemIcon>
              <ListItemText>פרופיל</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/settings'); }}>
              <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
              <ListItemText>הגדרות</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
              <ListItemText sx={{ color: 'error.main' }}>התנתקות</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: drawerOpen ? '4px 0 10px rgba(0, 0, 0, 0.05)' : 'none'
          }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          {isMobile && (
            <Box display="flex" justifyContent="flex-end" px={1}>
              <IconButton onClick={() => setDrawerOpen(false)}><ChevronLeftIcon /></IconButton>
            </Box>
          )}
          <List>
            {menuItems.map(item => (
              <ListItem
                button
                key={item.text}
                onClick={() => { navigate(item.path); if (isMobile) setDrawerOpen(false); }}
                sx={{
                  mb: 0.5,
                  mx: 1,
                  borderRadius: 1,
                  backgroundColor: isActive(item.path) ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                  '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.12)' },
                  ...(isActive(item.path) && { borderRight: '3px solid #1976d2' })
                }}
              >
                <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ fontWeight: isActive(item.path) ? 'bold' : 'normal', color: isActive(item.path) ? 'primary.main' : 'inherit' }}
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)` }, transition: theme.transitions.create(['width','margin'],{ easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.leavingScreen }), backgroundColor: '#f5f5f5' }}>
        <Toolbar />
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>

      <Box component="footer" sx={{ position: 'fixed', bottom: 0, width: '100%', bgcolor: '#fff', borderTop: '1px solid rgba(0,0,0,0.08)', py: 1.5 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="textSecondary" align="center">
            © {new Date().getFullYear()} מערכת ניהול הקלדות. כל הזכויות שמורות.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default AppLayout;

