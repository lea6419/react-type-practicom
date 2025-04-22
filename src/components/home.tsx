
import { Box, Container, Typography, Grid, Button, Paper } from "@mui/material";
import StorageIcon from "@mui/icons-material/Storage";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function HomePage() {
  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(to bottom, #f0f4f8, #dbeafe)", pt: 10, pb: 6 }}>
      <Container>
        <Grid container spacing={6} alignItems="center">
          <Grid>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              מערכת ניהול הקלדות חכמה
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={4}>
              ניהול קבצים, מעקב התקדמות ושיתוף בזמן אמת – בקלות וביעילות.
            </Typography>
            <Button variant="contained" size="large" href="/login">
              התחילי עכשיו
            </Button>
          </Grid>
          <Grid>
            <img src="/assets/typing-illustration.svg" alt="הקלדה" style={{ width: "100%" }} />
          </Grid>
        </Grid>

        <Box mt={10}>
          <Typography variant="h5" textAlign="center" fontWeight="bold" gutterBottom>
            כל מה שאת צריכה – במקום אחד
          </Typography>
          <Grid container spacing={4} mt={2}>
            {[
              { icon: <StorageIcon fontSize="large" color="primary" />, label: "ניהול קבצים" },
              { icon: <CloudDoneIcon fontSize="large" color="primary" />, label: "שמירה בענן" },
              { icon: <AccessTimeIcon fontSize="large" color="primary" />, label: "גישה בזמן אמת" },
            ].map((item, index) => (
              <Grid  key={index}>
                <Paper elevation={3} sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
                  {item.icon}
                  <Typography variant="h6" mt={1}>
                    {item.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
