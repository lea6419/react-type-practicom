import React from "react"
import { Box, Grid, Paper, Typography } from "@mui/material"
import { FileStatus } from "../../typs/FileType";

interface StatusCardsProps {
  statusCounts: Record<number, number>
  statusLabels: Record<FileStatus, { label: string; color: string }>
}

const StatusCards: React.FC<StatusCardsProps> = ({ statusCounts, statusLabels }) => {
  const getStatusColor = (color: string) => {
    const colorMap: Record<string, string> = {
      info: "#2196f3",
      warning: "#ff9800",
      success: "#4caf50",
      primary: "#1976d2",
      error: "#f44336",
    }
    return colorMap[color] || color
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        {Object.entries(statusLabels).map(([statusKey, statusInfo]) => {
          const count = statusCounts[Number(statusKey)] || 0
          return (
            <Grid item xs={6} sm={4} md={2.4} key={statusKey}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: "center",
                  border: `2px solid ${getStatusColor(statusInfo.color)}`,
                  borderRadius: 2,
                  backgroundColor: `${getStatusColor(statusInfo.color)}10`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: "0.85rem", mb: 1 }}
                >
                  {statusInfo.label}
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{ color: getStatusColor(statusInfo.color) }}
                >
                  {count}
                </Typography>
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default StatusCards