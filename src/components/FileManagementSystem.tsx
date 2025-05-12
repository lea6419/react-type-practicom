"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Box, Card, CardContent, Tabs, Tab, Snackbar, Alert, Typography, Chip } from "@mui/material"
import FileUploader from "./file-uploader"
import FilesList from "./FileList"
import axios from "axios"

// API URL - יש להגדיר את כתובת ה-API הנכונה
const API_URL = import.meta.env.VITE_API_URL || "https://server-type-practicom.onrender.com"

// File Status Enum
export enum FileStatus {
  UploadedByUser = 0,
  InProgress = 1,
  Completed = 2,
  ReturnedToUser = 3,
  SoftDeleted = 4,
}

// Status labels mapping
export const FileStatusLabels: Record<FileStatus, { label: string; color: string }> = {
  [FileStatus.UploadedByUser]: { label: "הועלה על ידי המשתמש", color: "info" },
  [FileStatus.InProgress]: { label: "בתהליך", color: "warning" },
  [FileStatus.Completed]: { label: "הושלם", color: "success" },
  [FileStatus.ReturnedToUser]: { label: "הוחזר למשתמש", color: "primary" },
  [FileStatus.SoftDeleted]: { label: "נמחק", color: "error" },
}

interface User {
  id: string
  name: string
}

export interface FileItem {
  id: string | number
  fileName: string
  name?: string
  userId: string | number
  userName?: string
  createdAt?: string
  hasTypedVersion?: boolean
  status?: number
  typedFileName?: string
  uploadDate?: string
  size?: number
  type?: string
  lastModified?: string
}

export interface ExtendedFileItem extends FileItem {
  statusLabel?: string
  statusColor?: string
}

export default function FileManagementSystem() {
  const [users, setUsers] = useState<User[]>([])
  const [files, setFiles] = useState<ExtendedFileItem[]>([])
  const [loading, setLoading] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: "success" | "error"
  }>({
    open: false,
    message: "",
    severity: "success",
  })

  // פונקציה להצגת הודעות למשתמש
  const showMessage = (message: string, severity: "success" | "error") => {
    setSnackbar({
      open: true,
      message,
      severity,
    })
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get("https://server-type-practicom.onrender.com/api/User/client", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
      setUsers(response.data)
    } catch (error: any) {
      console.error("שגיאה בשליפת משתמשים:", error)
    } finally {
      setLoading(false)
    }
  }

  // פונקציה לטעינת הקבצים מהשרת
  const fetchFiles = async () => {
    setLoading(true)
    const token = localStorage.getItem("token")
    if (!token) {
      showMessage("אין הרשאת גישה, יש להתחבר מחדש", "error")
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${API_URL}/allFiles`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        throw new Error("שגיאה בטעינת הקבצים")
      }

      const data = await res.json()
      console.log("קבצים שהתקבלו:", data)

      // מיון הקבצים לפי סטטוס ועיבוד המידע
      const processedFiles = data.map((file: FileItem) => {
        const status = file.status !== undefined ? file.status : FileStatus.UploadedByUser
        const statusInfo = FileStatusLabels[status as FileStatus] || FileStatusLabels[FileStatus.UploadedByUser]

        return {
          ...file,
          statusLabel: statusInfo.label,
          statusColor: statusInfo.color,
        }
      })

      const sortedFiles = [...processedFiles].sort((a, b) => (a.status || 0) - (b.status || 0))
      setFiles(sortedFiles)
    } catch (err) {
      console.error("❌ Error:", err)
      showMessage("שגיאה בטעינת הקבצים", "error")
    } finally {
      setLoading(false)
    }
  }

  // טעינת הקבצים בעת טעינת הקומפוננטה
  useEffect(() => {
    fetchFiles()
    fetchUsers()
  }, [])

  // פונקציה להעלאת קובץ חדש
  const handleUploadFile = async (file: File, userId: string) => {
    const token = localStorage.getItem("token")
    if (!token) {
      showMessage("אין הרשאת גישה, יש להתחבר מחדש", "error")
      throw new Error("אין הרשאת גישה")
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("userId", userId)

    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/upload-client`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (!res.ok) {
        throw new Error("שגיאה בהעלאת הקובץ")
      }

      const data = await res.json()
      showMessage("הקובץ הועלה בהצלחה", "success")

      // עדכון רשימת הקבצים
      const user = users.find((u) => u.id === userId)
      const status = FileStatus.UploadedByUser
      const statusInfo = FileStatusLabels[status]

      const newFile: ExtendedFileItem = {
        ...data,
        userName: user?.name || "לא ידוע",
        uploadDate: new Date().toLocaleDateString("he-IL"),
        hasTypedVersion: false,
        status,
        statusLabel: statusInfo.label,
        statusColor: statusInfo.color,
      }

      setFiles((prev) => [...prev, newFile].sort((a, b) => (a.status || 0) - (b.status || 0)))

      // מעבר לטאב של רשימת הקבצים לאחר העלאה מוצלחת
      setTabValue(1)

      return Promise.resolve()
    } catch (error) {
      console.error("שגיאה בהעלאת הקובץ:", error)
      showMessage("שגיאה בהעלאת הקובץ", "error")
      throw error
    } finally {
      setLoading(false)
    }
  }

  // פונקציה להעלאת גרסה מוקלדת של קובץ
  const handleUploadTypedFile = async (originalFileId: string, typedFile: File, fileId: number) => {
    const token = localStorage.getItem("token")
    if (!token) {
      showMessage("אין הרשאת גישה, יש להתחבר מחדש", "error")
      throw new Error("אין הרשאת גישה")
    }

    const formData = new FormData()
    formData.append("file", typedFile)
    formData.append("originalFileId", originalFileId)
    formData.append("fileId", `${originalFileId}`)

    formData.forEach((value, key) => {
      console.log(`${key}:`, value)
    })

    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/upload-typist`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (!res.ok) {
        throw new Error("שגיאה בהעלאת הקובץ המוקלד")
      }

      const data = await res.json()
      showMessage("הקובץ המוקלד הועלה בהצלחה", "success")

      // עדכון סטטוס הקובץ המקורי
      setFiles((prev) =>
        prev
          .map((file) => {
            if (file.id === originalFileId) {
              const newStatus = data.status || FileStatus.Completed
              const statusInfo = FileStatusLabels[newStatus as FileStatus] || FileStatusLabels[FileStatus.Completed]

              return {
                ...file,
                hasTypedVersion: true,
                status: newStatus,
                typedFileName: data.fileName || typedFile.name,
                statusLabel: statusInfo.label,
                statusColor: statusInfo.color,
              }
            }
            return file
          })
          .sort((a, b) => (a.status || 0) - (b.status || 0)),
      )

      return Promise.resolve()
    } catch (error) {
      console.error("שגיאה בהעלאת הקובץ המוקלד:", error)
      showMessage("שגיאה בהעלאת הקובץ המוקלד", "error")
      throw error
    } finally {
      setLoading(false)
    }
  }

  // פונקציה להורדת קובץ
  const handleDownloadFile = async (fileId: string, isTypedVersion = false) => {
    const token = localStorage.getItem("token")
    if (!token) {
      showMessage("אין הרשאת גישה, יש להתחבר מחדש", "error")
      return
    }

    try {
      setLoading(true)
      // בחירת נקודת הקצה המתאימה בהתאם לסוג הקובץ (מקורי או מוקלד)
      const endpoint = isTypedVersion ? `${API_URL}/download-typed/${fileId}` : `${API_URL}/download/${fileId}`

      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error(`שגיאה בהורדת הקובץ ${isTypedVersion ? "המוקלד" : "המקורי"}`)
      }

      const data = await response.json()
      const fileResponse = await fetch(data.url)

      if (!fileResponse.ok) {
        throw new Error(`שגיאה בהורדת הקובץ ${isTypedVersion ? "המוקלד" : "המקורי"}`)
      }

      const blob = await fileResponse.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url

      // מציאת שם הקובץ המתאים
      const file = files.find((f) => f.id === fileId)
      if (isTypedVersion && file?.typedFileName) {
        a.download = file.typedFileName
      } else if (file) {
        a.download = file.name || file.fileName || `file-${fileId}`
      } else {
        a.download = `file-${fileId}${isTypedVersion ? "-typed" : ""}`
      }

      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      showMessage(`הקובץ ${isTypedVersion ? "המוקלד" : "המקורי"} הורד בהצלחה`, "success")
    } catch (error) {
      console.error(`שגיאה בהורדת הקובץ ${isTypedVersion ? "המוקלד" : "המקורי"}:`, error)
      showMessage(`שגיאה בהורדת הקובץ ${isTypedVersion ? "המוקלד" : "המקורי"}`, "error")
    } finally {
      setLoading(false)
    }
  }

  // פונקציה לרענון רשימת הקבצים
  const handleRefreshFiles = () => {
    fetchFiles()
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: "bold", textAlign: "right" }}>
            מערכת ניהול קבצים
          </Typography>
          {tabValue === 1 && (
            <Chip label="רענן רשימה" color="primary" onClick={handleRefreshFiles} sx={{ cursor: "pointer" }} />
          )}
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            mb: 2,
            "& .MuiTab-root": {
              fontWeight: "bold",
              borderRadius: "8px 8px 0 0",
              transition: "all 0.2s",
              "&.Mui-selected": {
                backgroundColor: "rgba(25, 118, 210, 0.08)",
              },
            },
          }}
          dir="rtl"
        >
          <Tab label="העלאת קובץ" />
          <Tab label="רשימת קבצים" />
        </Tabs>

        <Box hidden={tabValue !== 0}>
          {tabValue === 0 && <FileUploader users={users} onUpload={handleUploadFile} />}
        </Box>

        <Box hidden={tabValue !== 1}>
          {tabValue === 1 && (
            <FilesList
              files={files}
              onDownload={handleDownloadFile}
              onUploadTyped={handleUploadTypedFile}
              loading={loading}
              onRefresh={handleRefreshFiles}
            />
          )}
        </Box>
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
