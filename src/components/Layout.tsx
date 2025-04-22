
import { Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Button
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

function AppLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      width="100%"
    >
      {/* Header מוצמד למעלה ברוחב מלא */}
      <AppBar position="static" sx={{ backgroundColor: "#1976d2", width: "100%" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            מערכת ניהול הקלדות
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            התנתקות
          </Button>
        </Toolbar>
      </AppBar>

      {/* תוכן דינמי – יתפוס את כל הגובה שנותר */}
      <Box flex="1" width="100%">
        <Container maxWidth="lg" sx={{ py: 5 }}>
          <Outlet />
        </Container>
      </Box>

      {/* Footer מוצמד לתחתית המסך */}
      <Box
        component="footer"
        sx={{
          bgcolor: "#f5f5f5",
          py: 2,
          width: "100%"
        }}
      >
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
