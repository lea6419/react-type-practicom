"use client"

import { useEffect, useState } from "react"
import { Box, Card, Grid, Typography, Skeleton, Paper, CircularProgress, Alert } from "@mui/material"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js"
import { Pie, Bar } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

const COLORS = ["#2196f3", "#ff9800", "#4caf50", "#3f51b5", "#f44336"]

function StatCard({ label, value, loading }: { label: string; value: number | string; loading: boolean }) {
  return (
    <Paper elevation={2} sx={{ p: 3, height: "100%", borderRadius: 2 }}>
      {loading ? (
        <Skeleton variant="rectangular" height={60} />
      ) : (
        <>
          <Typography variant="body1" sx={{ fontWeight: 600, textAlign: "center", color: "text.secondary", mb: 1 }}>
            {label}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center" }}>
            {value}
          </Typography>
        </>
      )}
    </Paper>
  )
}

export default function StatsDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("אין הרשאת גישה, יש להתחבר מחדש")
      setLoading(false)
      return
    }

    fetch("https://server-type-practicom.onrender.com/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("שגיאה בטעינת הנתונים")
        }
        return res.json()
      })
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching data:", error)
        setError("שגיאה בטעינת הנתונים: " + error.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  if (!stats) {
    return <Alert severity="warning">לא נמצאו נתונים</Alert>
  }

  const filePieData = {
    labels: ["בהמתנה", "בתהליך", "הושלמו", "הוחזרו למשתמש", "נמחקו"],
    datasets: [
      {
        label: "סטטוס קבצים",
        data: [
          stats.filesWaiting || 0,
          stats.filesInProgress || 0,
          stats.filesCompleted || 0,
          stats.filesReturned || 0,
          stats.filesDeleted || 0,
        ],
        backgroundColor: COLORS,
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  }

  const userBarData = {
    labels: ["לקוחות", "קלדניות", "מנהלים"],
    datasets: [
      {
        label: "משתמשים לפי סוג",
        data: [stats.clientsCount || 0, stats.typistsCount || 0, stats.adminsCount || 0],
        backgroundColor: ["#2196f3", "#4caf50", "#f44336"],
      },
    ],
  }

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
        סטטיסטיקות מערכת
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="סה״כ משתמשים" value={stats.totalUsers || 0} loading={loading} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="קלדניות" value={stats.typistsCount || 0} loading={loading} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="לקוחות" value={stats.clientsCount || 0} loading={loading} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="סה״כ קבצים" value={stats.totalFiles || 0} loading={loading} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: "100%", boxShadow: 2, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}>
              התפלגות סטטוס קבצים
            </Typography>
            <Box sx={{ height: 300, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Pie data={filePieData} />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: "100%", boxShadow: 2, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}>
              משתמשים לפי סוג
            </Typography>
            <Box sx={{ height: 300, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Bar options={barOptions} data={userBarData} />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
