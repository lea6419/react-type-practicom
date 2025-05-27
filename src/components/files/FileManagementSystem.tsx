"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Typography,
  Chip,
} from "@mui/material"
import { useFileManagement } from "../../hooks/useFileManagement "
import FileFilters from "./FileFiltersProps "
import StatusCards from "./StatusCardsProps "
import { FileStatusLabels } from "../../typs/FileType"
import FilesList from "../FileList"


export default function FileManagementSystem() {
  const {
    users,
    files,
    filteredFiles,
    loading,
    statusCounts,
    snackbar,
    setSnackbar,
    searchTerm,
    setSearchTerm,
    selectedUserId,
    setSelectedUserId,
    handleUploadTypedFile,
    handleDownloadFile,
    handleDeleteFile,
    handleViewFile,
    handleRefreshFiles,
  } = useFileManagement()

  return (
    <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: "bold", textAlign: "right" }}>
            מערכת ניהול קבצים
          </Typography>
          <Chip 
            label="רענן רשימה" 
            color="primary" 
            onClick={handleRefreshFiles} 
            sx={{ cursor: "pointer" }} 
          />
        </Box>

        <FileFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedUserId={selectedUserId}
          setSelectedUserId={setSelectedUserId}
          users={users}
          onRefresh={handleRefreshFiles}
        />

        <StatusCards
          statusCounts={statusCounts}
          statusLabels={FileStatusLabels}
        />

        <FilesList
          files={filteredFiles}
          onDownload={handleDownloadFile}
          onUploadTyped={handleUploadTypedFile}
          onDelete={handleDeleteFile}
          onView={handleViewFile}
          loading={loading}
          onRefresh={handleRefreshFiles}
        />
      </CardContent>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  )
}

export { FileStatus, FileStatusLabels } from "../../typs/FileType"