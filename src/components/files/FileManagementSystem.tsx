"use client"
import React from "react"
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

import { FileStatusLabels } from "../../typs/FileType"
import { useFileManagement } from "../../hooks/useFileManagement "
import FileFilters from "./FileFiltersProps "
import StatusCards from "./StatusCardsProps "
import FilesList from "./FileList"

export default function FileManagementSystem() {
  const {
    users,
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

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const totalItems = filteredFiles.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedFiles = filteredFiles.slice(startIndex, endIndex)

  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedUserId])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    const tableElement = document.querySelector('[data-testid="files-table"]')
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset to first page when changing items per page
  }

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

        <div data-testid="files-table">
          <FilesList
            files={paginatedFiles}
            onDownload={handleDownloadFile}
            onUploadTyped={handleUploadTypedFile}
            onDelete={handleDeleteFile}
            onView={handleViewFile}
            loading={loading}
            onRefresh={handleRefreshFiles}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
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