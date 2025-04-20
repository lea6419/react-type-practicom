import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <AppBar position="fixed" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" component={Link} to="/" color="inherit" sx={{ textDecoration: "none" }}>
          הקלדות+
        </Typography>
        <Box>
          <Button component={Link} to="/about" color="inherit">אודות</Button>
          <Button component={Link} to="/contact" color="inherit">צור קשר</Button>
          <Button component={Link} to="/dashboard" variant="outlined" sx={{ ml: 2 }}>כניסה</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
