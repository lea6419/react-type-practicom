import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <AppBar
      position="fixed"
      elevation={3}
      sx={{
        background: "linear-gradient(to right, #1976d2, #42a5f5)",
        color: "#fff"
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ textDecoration: "none", color: "#fff", fontWeight: "bold" }}
        >
          הקלדות+
        </Typography>
        <Box>
          <Button
            component={Link}
            to="/about"
            sx={{ color: "#fff", mx: 1, "&:hover": { textDecoration: "underline" } }}
          >
            אודות
          </Button>
          <Button
            component={Link}
            to="/contact"
            sx={{ color: "#fff", mx: 1, "&:hover": { textDecoration: "underline" } }}
          >
            צור קשר
          </Button>
          <Button
            component={Link}
            to="/dashboard"
            variant="contained"
            sx={{
              ml: 2,
              bgcolor: "#fff",
              color: "#1976d2",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#e3f2fd" }
            }}
          >
            כניסה
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
