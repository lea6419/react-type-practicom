import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box sx={{ mt: 10, textAlign: "center", py: 3, bgcolor: "#f1f5f9" }}>
      <Typography variant="body2" color="text.secondary">
        © 2025 כל הזכויות שמורות - הקלדות+
      </Typography>
    </Box>
  );
}
