import { Box, Typography } from "@mui/material";
import CopyrightIcon from "@mui/icons-material/Copyright";

export default function Footer() {
  return (
    <Box sx={{ mt: 10, textAlign: "center", py: 4, bgcolor: "#e3f2fd" }}>
      <Typography variant="body2" color="text.secondary" display="flex" justifyContent="center" alignItems="center">
        <CopyrightIcon fontSize="small" sx={{ mx: 0.5 }} />
        2025 כל הזכויות שמורות - הקלדות+
      </Typography>
    </Box>
  );
}
