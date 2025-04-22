
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Container,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActionArea,
  Box,
} from "@mui/material";
import {
  Folder as FolderIcon,
  People as PeopleIcon,
  BarChart as ReportsIcon,
  Settings as SettingsIcon,
  ListAlt as ActivityIcon,
} from "@mui/icons-material";

import { BarChart } from '@mui/x-charts/BarChart';

const Dashboard = () => {
  const navigate = useNavigate();
  const dashboardItems = [
    {
      icon: <FolderIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
      title: "ניהול קבצים",
      description: "העלאה, הורדה וארגון קבצים",
      route: "/files",
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
      title: "ניהול משתמשים",
      description: "הוספה וניהול משתמשים",
      route: "/users",
    },
    {
      icon: <ReportsIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
      title: "דוחות וסטטיסטיקות",
      description: "סקירה גרפית של נתוני המערכת",
      route: "/reports",
    },
    {
      icon: <SettingsIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
      title: "הגדרות מערכת",
      description: "התאמה אישית והגדרות כלליות",
      route: "/settings",
    },
    {
      icon: <ActivityIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
      title: "יומן פעילות",
      description: "מעקב אחר פעולות במערכת",
      route: "/activity-log",
    },
  ];

  return (
    <>



      <Container sx={{ py: 5 }}>
        <Typography variant="h4" gutterBottom>
          לוח בקרה
        </Typography>
        <Grid container spacing={3}>
          {dashboardItems.map((item) => (
            <Grid key={item.title}>
              <Card
                sx={{
                  transition: "0.3s",
                  boxShadow: 3,
                  borderRadius: 3,
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  }
                }}
              >
                <CardActionArea onClick={() => navigate(item.route)}>
                  <CardContent>
                    <Box display="flex" justifyContent="center" mb={2}>
                      {item.icon}
                    </Box>
                    <Typography variant="h6" align="center" sx={{ fontWeight: "bold" }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      {item.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>

            </Grid>
          ))}
        </Grid>

        {/* גרף דוגמה */}
        <Box mt={6}>
          <Typography variant="h5" gutterBottom>
            סקירה גרפית
          </Typography>
          <Paper sx={{ p: 3 }}>
            <BarChart
              xAxis={[{ scaleType: 'band', data: ['ינואר', 'פברואר', 'מרץ', 'אפריל'] }]}
              series={[{ data: [15, 20, 10, 25], label: 'מספר הקבצים שהועלו' }]}
              width={500}
              height={300}
            />
          </Paper>
        </Box>
      </Container>



    </>
  );
};

export default Dashboard;
