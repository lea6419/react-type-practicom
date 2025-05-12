import { useState } from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container, 
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Slide,
  useScrollTrigger
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardIcon from "@mui/icons-material/Keyboard";

interface Props {
  window?: () => Window;
  children: React.ReactElement;
}

function HideOnScroll(props: Props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const navItems = [
    { label: "ראשי", path: "/" },
    { label: "אודות", path: "/about" },
    { label: "שירותים", path: "/services" },
    { label: "צור קשר", path: "/contact" },
  ];

  return (
    <>
      <HideOnScroll>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            background: "linear-gradient(90deg, #1976d2, #42a5f5)",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src="/assets/logo.png" alt="הקלדות+" style={{ height: 40, marginRight: 10 }} />
          <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: "none", color: "#fff" }}>
            הקלדות+
          </Typography>
        </Box>

              {isMobile ? (
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={toggleDrawer(true)}
                >
                  <MenuIcon />
                </IconButton>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {navItems.map((item) => (
                    <Button
                      key={item.label}
                      component={Link}
                      to={item.path}
                      sx={{ 
                        color: "#fff", 
                        mx: 1, 
                        py: 1,
                        "&:hover": { 
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          textDecoration: "none" 
                        },
                        transition: "all 0.2s"
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                  <Button
                    component={Link}
                    to="/dashboard"
                    variant="contained"
                    sx={{
                      ml: 2,
                      bgcolor: "#fff",
                      color: "#1976d2",
                      fontWeight: "bold",
                      "&:hover": { 
                        bgcolor: "#e3f2fd",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                      },
                      transition: "all 0.2s",
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)"
                    }}
                  >
                    כניסה למערכת
                  </Button>
                </Box>
              )}
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '70%',
            maxWidth: 300,
            boxSizing: 'border-box',
            bgcolor: '#fff',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary" fontWeight="bold">
            תפריט
          </Typography>
          <IconButton onClick={toggleDrawer(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {navItems.map((item) => (
            <ListItem 
            key={item.label} 
            component={Link} 
            to={item.path}
            onClick={toggleDrawer(false)}
            sx={{
              py: 1.5,
              borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
              '&:hover': {
                bgcolor: 'rgba(25, 118, 210, 0.08)',
              }
            }}
          >
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ fontWeight: 'medium' }}
              />
            </ListItem>
          ))}
          <ListItem sx={{ mt: 2 }}>
            <Button
              component={Link}
              to="/dashboard"
              variant="contained"
              fullWidth
              onClick={toggleDrawer(false)}
              sx={{
                py: 1.2,
                fontWeight: "bold",
                background: "linear-gradient(90deg, #1976d2, #42a5f5)",
              }}
            >
              כניסה למערכת
            </Button>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}