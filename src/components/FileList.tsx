"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material"
import {
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  FileDownload as FileDownloadIcon,
} from "@mui/icons-material"
import { ExtendedFileItem, FileStatus, FileStatusLabels } from "./FileManagementSystem"


interface FilesListProps {
  files: ExtendedFileItem[]
  onDownload: (fileId: string, isTypedVersion?: boolean) => Promise<void>
  onUploadTyped: (originalFileId: string, file: File, fileId: number) => Promise<void>
  loading: boolean
  onRefresh: () => void
}

export default function FilesList({ files, onDownload, onUploadTyped, loading, onRefresh }: FilesListProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedOriginalFileId, setSelectedOriginalFileId] = useState<string | null>(null)
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedFileDetails, setSelectedFileDetails] = useState<ExtendedFileItem | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0])
    }
  }

  const handleUploadTyped = async (originalFileId: string, fileId: number) => {
    if (!selectedFile) return

    try {
      await onUploadTyped(originalFileId, selectedFile, fileId)
      setSelectedFile(null)
      setSelectedOriginalFileId(null)
      setSelectedFileId(null)
    } catch (error) {
      console.error("שגיאה בהעלאת הקובץ המוקלד:", error)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "לא זמין"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("he-IL", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (e) {
      return dateString
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "לא זמין"
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    if (bytes === 0) return "0 Byte"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i]
  }

  const handleShowDetails = (file: ExtendedFileItem) => {
    setSelectedFileDetails(file)
    setDetailsOpen(true)
  }

  const handleCloseDetails = () => {
    setDetailsOpen(false)
    setSelectedFileDetails(null)
  }

  const getStatusChip = (status?: number) => {
    const fileStatus = status !== undefined ? status : FileStatus.UploadedByUser
    const statusInfo = FileStatusLabels[fileStatus as FileStatus] || FileStatusLabels[FileStatus.UploadedByUser]

    return <Chip label={statusInfo.label} color={statusInfo.color as any} size="small" variant="outlined" />
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (files.length === 0) {
    return (
      <Card sx={{ textAlign: "center", p: 3 }}>
        <Typography variant="body1">אין קבצים להצגה</Typography>
        <Button startIcon={<RefreshIcon />} onClick={onRefresh} sx={{ mt: 2 }} variant="outlined">
          רענן רשימה
        </Button>
      </Card>
    )
  }

  return (
    <Box>
      <Paper elevation={0} sx={{ mb: 2, p: 1, display: "flex", justifyContent: "flex-end" }}>
        <Button startIcon={<RefreshIcon />} onClick={onRefresh} variant="outlined" size="small">
          רענן רשימה
        </Button>
      </Paper>

      <TableContainer component={Paper} sx={{ boxShadow: 2, borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead sx={{ backgroundColor: "rgba(25, 118, 210, 0.08)" }}>
            <TableRow>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                שם הקובץ
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                סטטוס
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                תאריך העלאה
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                פעולות
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.id} sx={{ "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" } }}>
                <TableCell align="right" component="th" scope="row">
                  {file.name || file.fileName || "ללא שם"}
                </TableCell>
                <TableCell align="right">{getStatusChip(file.status)}</TableCell>
                <TableCell align="right">{formatDate(file.createdAt || file.uploadDate)}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                    <Tooltip title="הורד קובץ מקורי">
                      <IconButton size="small" onClick={() => onDownload(file.id.toString())} color="primary">
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {file.hasTypedVersion && (
                      <Tooltip title="הורד קובץ מוקלד">
                        <IconButton size="small" onClick={() => onDownload(file.id.toString(), true)} color="success">
                          <FileDownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {file.status === FileStatus.UploadedByUser && (
                      <Tooltip title="העלה גרסה מוקלדת">
                        <IconButton
                          size="small"
                          color="warning"
                          component="label"
                          onClick={() => {
                            setSelectedOriginalFileId(file.id.toString())
                            setSelectedFileId(Number(file.id))
                          }}
                        >
                          <input
                            type="file"
                            hidden
                            onChange={handleFileChange}
                            onClick={(e) => {
                              e.stopPropagation()
                            }}
                          />
                          <CloudUploadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Tooltip title="פרטי קובץ">
                      <IconButton size="small" onClick={() => handleShowDetails(file)} color="info">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedFile && selectedOriginalFileId && selectedFileId && (
        <Box sx={{ mt: 2, p: 2, border: "1px dashed grey", borderRadius: 1 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            נבחר קובץ: {selectedFile.name}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleUploadTyped(selectedOriginalFileId, selectedFileId)}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
          >
            העלה גרסה מוקלדת
          </Button>
          <Button
            variant="outlined"
            sx={{ ml: 1 }}
            onClick={() => {
              setSelectedFile(null)
              setSelectedOriginalFileId(null)
              setSelectedFileId(null)
            }}
          >
            בטל
          </Button>
        </Box>
      )}

      {/* Dialog for file details */}
      <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="sm" fullWidth dir="rtl">
        <DialogTitle sx={{ fontWeight: "bold", backgroundColor: "rgba(25, 118, 210, 0.08)" }}>פרטי קובץ</DialogTitle>
        <DialogContent dividers>
          {selectedFileDetails && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">
                  מידע כללי
                </Typography>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  מזהה קובץ
                </Typography>
                <Typography variant="body1">{selectedFileDetails.id}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  שם קובץ
                </Typography>
                <Typography variant="body1">
                  {selectedFileDetails.name || selectedFileDetails.fileName || "לא זמין"}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  סטטוס
                </Typography>
                <Box sx={{ mt: 0.5 }}>{getStatusChip(selectedFileDetails.status)}</Box>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  תאריך העלאה
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedFileDetails.createdAt || selectedFileDetails.uploadDate)}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  מזהה משתמש
                </Typography>
                <Typography variant="body1">{selectedFileDetails.userId}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  שם משתמש
                </Typography>
                <Typography variant="body1">{selectedFileDetails.userName || "לא זמין"}</Typography>
              </Grid>

              {selectedFileDetails.size && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    גודל קובץ
                  </Typography>
                  <Typography variant="body1">{formatFileSize(selectedFileDetails.size)}</Typography>
                </Grid>
              )}

              {selectedFileDetails.type && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    סוג קובץ
                  </Typography>
                  <Typography variant="body1">{selectedFileDetails.type}</Typography>
                </Grid>
              )}

              {selectedFileDetails.lastModified && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    עודכן לאחרונה
                  </Typography>
                  <Typography variant="body1">{formatDate(selectedFileDetails.lastModified)}</Typography>
                </Grid>
              )}

              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>
                  גרסה מוקלדת
                </Typography>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  סטטוס גרסה מוקלדת
                </Typography>
                <Typography variant="body1">
                  {selectedFileDetails.hasTypedVersion ? "קיימת גרסה מוקלדת" : "אין גרסה מוקלדת"}
                </Typography>
              </Grid>

              {selectedFileDetails.hasTypedVersion && selectedFileDetails.typedFileName && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    שם קובץ מוקלד
                  </Typography>
                  <Typography variant="body1">{selectedFileDetails.typedFileName}</Typography>
                </Grid>
              )}

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={() => {
                      onDownload(selectedFileDetails.id.toString())
                      handleCloseDetails()
                    }}
                  >
                    הורד קובץ מקורי
                  </Button>

                  {selectedFileDetails.hasTypedVersion && (
                    <Button
                      variant="outlined"
                      color="success"
                      startIcon={<FileDownloadIcon />}
                      onClick={() => {
                        onDownload(selectedFileDetails.id.toString(), true)
                        handleCloseDetails()
                      }}
                    >
                      הורד קובץ מוקלד
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails} color="primary">
            סגור
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
