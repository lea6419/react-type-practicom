"use client"

import React from "react"
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
  DialogContentText,
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
  TableSortLabel,
  Tooltip,
  Typography,
} from "@mui/material"
import {
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  FileDownload as FileDownloadIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material"
import { ExtendedFileItem, FileStatus, FileStatusLabels } from "../../typs/FileType"
import PaginationComponent from "./PaginationComponent"

type Order = 'asc' | 'desc'
type OrderBy = 'name' | 'status' | 'createdAt' | 'userName'

interface FilesListProps {
  files: ExtendedFileItem[]
  onDownload: (fileId: string, isTypedVersion?: boolean) => Promise<void>
  onUploadTyped: (originalFileId: string, file: File, fileId: number) => Promise<void>
  onDelete: (fileId: string) => Promise<void>
  onView: (fileId: string, isTypedVersion?: boolean) => Promise<void>
  loading: boolean
  onRefresh: () => void
  // Pagination props
  currentPage?: number
  totalPages?: number
  totalItems?: number
  itemsPerPage?: number
  onPageChange?: (page: number) => void
  onItemsPerPageChange?: (itemsPerPage: number) => void
}

export default function FilesList({
  files,
  onDownload,
  onUploadTyped,
  onDelete,
  onView,
  loading,
  onRefresh,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange = () => {},
  onItemsPerPageChange = () => {},
}: FilesListProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedOriginalFileId, setSelectedOriginalFileId] = useState<string | null>(null)
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedFileDetails, setSelectedFileDetails] = useState<ExtendedFileItem | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<string | null>(null)
  
  // Sorting state
  const [order, setOrder] = useState<Order>('desc')
  const [orderBy, setOrderBy] = useState<OrderBy>('createdAt')
  const [sortedFiles, setSortedFiles] = useState<ExtendedFileItem[]>(files)

  // Update sorted files when files prop changes
  React.useEffect(() => {
    const sorted = [...files].sort((a, b) => {
      let aValue: any = a[orderBy]
      let bValue: any = b[orderBy]
      
      // Handle special cases
      if (orderBy === 'name') {
        aValue = a.name || a.fileName || ''
        bValue = b.name || b.fileName || ''
      } else if (orderBy === 'createdAt') {
        aValue = a.createdAt || a.uploadDate || ''
        bValue = b.createdAt || b.uploadDate || ''
      }
      
      // Convert to string for comparison if needed
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
    setSortedFiles(sorted)
  }, [files, order, orderBy])

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

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

  const handleDeleteClick = (fileId: string) => {
    setFileToDelete(fileId)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (fileToDelete) {
      await onDelete(fileToDelete)
      setDeleteDialogOpen(false)
      setFileToDelete(null)
    }
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

  // חישוב סטטיסטיקה של הקבצים
  const stats = {
    total: files.length,
    typed: files.filter((file) => file.hasTypedVersion).length,
    waiting: files.filter((file) => !file.hasTypedVersion).length,
  }

  return (
    <Box>
      {/* סטטיסטיקה */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} justifyContent="space-around">
          <Box>
            <Typography variant="body2" color="text.secondary" align="center">
              סה"כ קבצים
            </Typography>
            <Typography variant="h6" align="center">
              {stats.total}
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box>
            <Typography variant="body2" color="text.secondary" align="center">
              הוקלדו
            </Typography>
            <Typography variant="h6" align="center" color="success.main">
              {stats.typed}
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box>
            <Typography variant="body2" color="text.secondary" align="center">
              ממתינים להקלדה
            </Typography>
            <Typography variant="h6" align="center" color="warning.main">
              {stats.waiting}
            </Typography>
          </Box>
        </Grid>
      </Paper>

      <TableContainer component={Paper} sx={{ boxShadow: 2, borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead sx={{ backgroundColor: "rgba(25, 118, 210, 0.08)" }}>
            <TableRow>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                >
                  שם הקובץ
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleRequestSort('status')}
                >
                  סטטוס
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                <TableSortLabel
                  active={orderBy === 'createdAt'}
                  direction={orderBy === 'createdAt' ? order : 'asc'}
                  onClick={() => handleRequestSort('createdAt')}
                >
                  תאריך העלאה
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                <TableSortLabel
                  active={orderBy === 'userName'}
                  direction={orderBy === 'userName' ? order : 'asc'}
                  onClick={() => handleRequestSort('userName')}
                >
                  משתמש
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                פעולות
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedFiles.map((file) => (
              <TableRow key={file.id} sx={{ "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" } }}>
                <TableCell align="right" component="th" scope="row">
                  {file.name || file.fileName || "ללא שם"}
                </TableCell>
                <TableCell align="right">{getStatusChip(file.status)}</TableCell>
                <TableCell align="right">{formatDate(file.createdAt || file.uploadDate)}</TableCell>
                <TableCell align="right">{file.userName || "לא ידוע"}</TableCell>
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

                    <Tooltip title="צפה בקובץ">
                      <IconButton size="small" onClick={() => onView(file.id.toString())} color="info">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {file.status === FileStatus.InProgress && (
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

                    {file.status !== FileStatus.SoftDeleted && (
                      <Tooltip title="מחק קובץ">
                        <IconButton size="small" onClick={() => handleDeleteClick(file.id.toString())} color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* הוספת רכיב ה-Pagination */}
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
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
            <Box component="div" display="flex" flexDirection="column" sx={{ gap: 2 }}>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  מידע כללי
                </Typography>
                <Divider sx={{ my: 1 }} />
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  מזהה קובץ
                </Typography>
                <Typography variant="body1">{selectedFileDetails.id}</Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  שם קובץ
                </Typography>
                <Typography variant="body1">{selectedFileDetails.name || selectedFileDetails.fileName || "ללא שם"}</Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" color="text.secondary">
                  סטטוס
                </Typography>
                <Box sx={{ mt: 0.5 }}>{getStatusChip(selectedFileDetails.status)}</Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" color="text.secondary">
                  תאריך העלאה
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedFileDetails.createdAt || selectedFileDetails.uploadDate)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" color="text.secondary">
                  מזהה משתמש
                </Typography>
                <Typography variant="body1">{selectedFileDetails.userId}</Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" color="text.secondary">
                  שם משתמש
                </Typography>
                <Typography variant="body1">{selectedFileDetails.userName || "לא זמין"}</Typography>
              </Box>

              {selectedFileDetails.size && (
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="body2" color="text.secondary">
                    גודל קובץ
                  </Typography>
                  <Typography variant="body1">{formatFileSize(selectedFileDetails.size)}</Typography>
                </Box>
              )}

              {selectedFileDetails.type && (
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="body2" color="text.secondary">
                    סוג קובץ
                  </Typography>
                  <Typography variant="body1">{selectedFileDetails.type}</Typography>
                </Box>
              )}

              {selectedFileDetails.lastModified && (
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="body2" color="text.secondary">
                    עודכן לאחרונה
                  </Typography>
                  <Typography variant="body1">{formatDate(selectedFileDetails.lastModified)}</Typography>
                </Box>
              )}

              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>
                  גרסה מוקלדת
                </Typography>
                <Divider sx={{ my: 1 }} />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" color="text.secondary">
                  סטטוס גרסה מוקלדת
                </Typography>
                <Typography variant="body1">
                  {selectedFileDetails.hasTypedVersion ? "קיימת גרסה מוקלדת" : "אין גרסה מוקלדת"}
                  {selectedFileDetails.status === FileStatus.ReturnedToUser && !selectedFileDetails.hasTypedVersion && (
                    <Typography variant="caption" color="error" sx={{ display: "block", mt: 0.5 }}>
                      * שים לב: הקובץ הוחזר למשתמש אך אין גרסה מוקלדת מקושרת במערכת
                    </Typography>
                  )}
                </Typography>
              </Box>

              {selectedFileDetails.hasTypedVersion && selectedFileDetails.typedFileName && (
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="body2" color="text.secondary">
                    שם קובץ מוקלד
                  </Typography>
                  <Typography variant="body1">{selectedFileDetails.typedFileName}</Typography>
                </Box>
              )}

              <Box sx={{ display: "flex", flexDirection: "column", mt: 2, gap: 1 }}>
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

                <Button
                  variant="outlined"
                  color="info"
                  startIcon={<VisibilityIcon />}
                  onClick={() => {
                    onView(selectedFileDetails.id.toString())
                    handleCloseDetails()
                  }}
                >
                  צפה בקובץ
                </Button>

                {selectedFileDetails.hasTypedVersion && (
                  <Button
                    variant="outlined"
                    color="info"
                    startIcon={<VisibilityIcon />}
                    onClick={() => {
                      onView(selectedFileDetails.id.toString(), true)
                      handleCloseDetails()
                    }}
                  >
                    צפה בקובץ מוקלד
                  </Button>
                )}

                {selectedFileDetails.status !== FileStatus.SoftDeleted && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                      handleDeleteClick(selectedFileDetails.id.toString())
                      handleCloseDetails()
                    }}
                  >
                    מחק קובץ
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails} color="primary">
            סגור
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        dir="rtl"
      >
        <DialogTitle id="alert-dialog-title">{"האם אתה בטוח שברצונך למחוק את הקובץ?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            פעולה זו תסמן את הקובץ כמחוק במערכת. האם להמשיך?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            ביטול
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            מחק
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}