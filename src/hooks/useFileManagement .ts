import { useState, useEffect } from "react"
import axios from "axios"
import { ExtendedFileItem, FileItem, FileStatus, FileStatusLabels, SnackbarState, User } from "../typs/FileType"


const API_URL = import.meta.env.VITE_API_URL || "https://server-type-practicom.onrender.com"

export const useFileManagement = () => {
  const [users, setUsers] = useState<User[]>([])
  const [files, setFiles] = useState<ExtendedFileItem[]>([])
  const [filteredFiles, setFilteredFiles] = useState<ExtendedFileItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUserId, setSelectedUserId] = useState<string>("all")
  const [statusCounts, setStatusCounts] = useState<Record<number, number>>({})
  const [snackbar, setSnackbar] = useState<SnackbarState>({
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
      const token = localStorage.getItem("token")
      if (!token) {
        console.error("אין טוקן אימות")
        setUsers([])
        setLoading(false)
        return
      }

      const response = await axios.get(`${API_URL}/api/User/client`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (Array.isArray(response.data)) {
        setUsers(response.data)
      } else {
        console.error("נתוני המשתמשים שהתקבלו אינם במבנה מערך תקין:", response.data)
        setUsers([])
      }
    } catch (error: any) {
      console.error("שגיאה בשליפת משתמשים:", error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

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

      if (!Array.isArray(data)) {
        console.error("נתוני הקבצים שהתקבלו אינם במבנה מערך תקין:", data)
        setFiles([])
        setFilteredFiles([])
        setStatusCounts({})
        setLoading(false)
        return
      }

      const processedFiles = data.map((file: FileItem) => {
        const status = file.status !== undefined ? file.status : FileStatus.UploadedByUser
        const statusInfo = FileStatusLabels[status as FileStatus] || FileStatusLabels[FileStatus.UploadedByUser]

        const hasTypedVersion =
          file.hasTypedVersion || status === FileStatus.ReturnedToUser || status === FileStatus.Completed

        return {
          ...file,
          statusLabel: statusInfo.label,
          statusColor: statusInfo.color,
          hasTypedVersion,
        }
      })

      const sortedFiles = [...processedFiles].sort((a, b) => (a.status || 0) - (b.status || 0))
      setFiles(sortedFiles)
      setFilteredFiles(sortedFiles)

      const counts: Record<number, number> = {}
      sortedFiles.forEach((file) => {
        const status = file.status !== undefined ? file.status : 0
        counts[status] = (counts[status] || 0) + 1
      })
      setStatusCounts(counts)
    } catch (err) {
      console.error("❌ Error:", err)
      showMessage("שגיאה בטעינת הקבצים", "error")
      setFiles([])
      setFilteredFiles([])
      setStatusCounts({})
    } finally {
      setLoading(false)
    }
  }

  // Filter files based on search term and selected user
  useEffect(() => {
    let result = [...files]

    if (selectedUserId !== "all") {
      result = result.filter((file) => file.userId?.toString() === selectedUserId)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (file) =>
          (file.name && typeof file.name === "string" && file.name.toLowerCase().includes(term)) ||
          (file.fileName && typeof file.fileName === "string" && file.fileName.toLowerCase().includes(term)) ||
          (file.userName && typeof file.userName === "string" && file.userName.toLowerCase().includes(term)),
      )
    }

    setFilteredFiles(result)
  }, [searchTerm, selectedUserId, files])

  useEffect(() => {
    fetchFiles()
    fetchUsers()
  }, [])

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

      const updatedFiles = files
        .map((file) => {
          if (file.id === originalFileId) {
            const oldStatus = file.status || 0
            const newStatus = data.status || FileStatus.Completed
            const statusInfo = FileStatusLabels[newStatus as FileStatus] || FileStatusLabels[FileStatus.Completed]

            const newStatusCounts = { ...statusCounts }
            newStatusCounts[oldStatus] = Math.max(0, (newStatusCounts[oldStatus] || 0) - 1)
            newStatusCounts[newStatus] = (newStatusCounts[newStatus] || 0) + 1
            setStatusCounts(newStatusCounts)

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
        .sort((a, b) => (a.status || 0) - (b.status || 0))

      setFiles(updatedFiles)

      return Promise.resolve()
    } catch (error) {
      console.error("שגיאה בהעלאת הקובץ המוקלד:", error)
      showMessage("שגיאה בהעלאת הקובץ המוקלד", "error")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadFile = async (fileId: string, isTypedVersion = false) => {
    const token = localStorage.getItem("token")
    if (!token) {
      showMessage("אין הרשאת גישה, יש להתחבר מחדש", "error")
      return
    }

    try {
      setLoading(true)
      const endpoint = isTypedVersion ? `${API_URL}/download-type/${fileId}` : `${API_URL}/download/${fileId}`

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

  const handleViewFile = async (fileId: string, isTypedVersion = false) => {
    const token = localStorage.getItem("token")
    if (!token) {
      showMessage("אין הרשאת גישה, יש להתחבר מחדש", "error")
      return
    }

    try {
      setLoading(true)
      const endpoint = isTypedVersion ? `${API_URL}/download-typed/${fileId}` : `${API_URL}/download/${fileId}`

      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error(`שגיאה בטעינת הקובץ ${isTypedVersion ? "המוקלד" : "המקורי"}`)
      }

      const data = await response.json()
      const fileResponse = await fetch(data.url)

      if (!fileResponse.ok) {
        throw new Error(`שגיאה בטעינת הקובץ ${isTypedVersion ? "המוקלד" : "המקורי"}`)
      }

      const blob = await fileResponse.blob()
      const url = window.URL.createObjectURL(blob)

      window.open(url, "_blank")

      showMessage(`הקובץ ${isTypedVersion ? "המוקלד" : "המקורי"} נפתח בהצלחה`, "success")
    } catch (error) {
      console.error(`שגיאה בצפייה בקובץ ${isTypedVersion ? "המוקלד" : "המקורי"}:`, error)
      showMessage(`שגיאה בצפייה בקובץ ${isTypedVersion ? "המוקלד" : "המקורי"}`, "error")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    const token = localStorage.getItem("token")
    if (!token) {
      showMessage("אין הרשאת גישה, יש להתחבר מחדש", "error")
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/delete-file/${fileId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error("שגיאה במחיקת הקובץ")
      }

      const updatedFiles = files
        .map((file) => {
          if (file.id === fileId) {
            const oldStatus = file.status || 0
            const newStatus = FileStatus.SoftDeleted
            const statusInfo = FileStatusLabels[newStatus]

            const newStatusCounts = { ...statusCounts }
            newStatusCounts[oldStatus] = Math.max(0, (newStatusCounts[oldStatus] || 0) - 1)
            newStatusCounts[newStatus] = (newStatusCounts[newStatus] || 0) + 1
            setStatusCounts(newStatusCounts)

            return {
              ...file,
              status: newStatus,
              statusLabel: statusInfo.label,
              statusColor: statusInfo.color,
            }
          }
          return file
        })
        .sort((a, b) => (a.status || 0) - (b.status || 0))

      setFiles(updatedFiles)
      showMessage("הקובץ נמחק בהצלחה", "success")
    } catch (error) {
      console.error("שגיאה במחיקת הקובץ:", error)
      showMessage("שגיאה במחיקת הקובץ", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleRefreshFiles = () => {
    fetchFiles()
  }

  return {
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
  }
}