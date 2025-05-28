// "use client"



// import type React from "react"
// import { useState, useEffect } from "react"
// import {
//   Box,
//   Card,
//   CardContent,
//   Tabs,
//   Tab,
//   Snackbar,
//   Alert,
//   Typography,
//   Chip,
//   Grid,
//   Paper,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   InputAdornment,
//   IconButton,
//   Button,
// } from "@mui/material"
// import { Search as SearchIcon, Refresh as RefreshIcon } from "@mui/icons-material"
// // import FileUploader from "./file-uploader"
// import FilesList from "./FileList"

// import axios from "axios"

// // API URL - יש להגדיר את כתובת ה-API הנכונה
// const API_URL = import.meta.env.VITE_API_URL || "https://server-type-practicom.onrender.com"

// // File Status Enum
// export enum FileStatus {
//   UploadedByUser = 0,
//   InProgress = 1,
//   Completed = 2,
//   ReturnedToUser = 3,
//   SoftDeleted = 4,
// }

// // Status labels mapping
// export const FileStatusLabels: Record<FileStatus, { label: string; color: string }> = {
//   [FileStatus.UploadedByUser]: { label: "הועלה על ידי המשתמש", color: "info" },
//   [FileStatus.InProgress]: { label: "בתהליך", color: "warning" },
//   [FileStatus.Completed]: { label: "הושלם", color: "success" },
//   [FileStatus.ReturnedToUser]: { label: "הוחזר למשתמש", color: "primary" },
//   [FileStatus.SoftDeleted]: { label: "נמחק", color: "error" },
// }

// interface User {
//   id: string
//   name: string
// }

// export interface FileItem {
//   id: string | number
//   fileName: string
//   name?: string
//   userId: string | number
//   userName?: string
//   createdAt?: string
//   hasTypedVersion?: boolean
//   status?: number
//   typedFileName?: string
//   uploadDate?: string
//   size?: number
//   type?: string
//   lastModified?: string
// }

// export interface ExtendedFileItem extends FileItem {
//   statusLabel?: string
//   statusColor?: string
// }

// export default function FileManagementSystem() {
//   const [users, setUsers] = useState<User[]>([])
//   const [files, setFiles] = useState<ExtendedFileItem[]>([])
//   const [filteredFiles, setFilteredFiles] = useState<ExtendedFileItem[]>([])
//   const [loading, setLoading] = useState(false)
//   const [tabValue, setTabValue] = useState(0)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedUserId, setSelectedUserId] = useState<string>("all")
//   const [statusCounts, setStatusCounts] = useState<Record<number, number>>({})
//   const [snackbar, setSnackbar] = useState<{
//     open: boolean
//     message: string
//     severity: "success" | "error"
//   }>({
//     open: false,
//     message: "",
//     severity: "success",
//   })

//   // פונקציה להצגת הודעות למשתמש
//   const showMessage = (message: string, severity: "success" | "error") => {
//     setSnackbar({
//       open: true,
//       message,
//       severity,
//     })
//   }

//   const fetchUsers = async () => {
//     try {
//       setLoading(true)
//       const token = localStorage.getItem("token")
//       if (!token) {
//         console.error("אין טוקן אימות")
//         setUsers([])
//         setLoading(false)
//         return
//       }

//       const response = await axios.get("https://server-type-practicom.onrender.com/api/User/client", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       })

//       // וידוא שהנתונים שהתקבלו הם מערך תקין
//       if (Array.isArray(response.data)) {
//         setUsers(response.data)
//       } else {
//         console.error("נתוני המשתמשים שהתקבלו אינם במבנה מערך תקין:", response.data)
//         setUsers([])
//       }
//     } catch (error: any) {
//       console.error("שגיאה בשליפת משתמשים:", error)
//       setUsers([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   // פונקציה לטעינת הקבצים מהשרת
//   const fetchFiles = async () => {
//     setLoading(true)
//     const token = localStorage.getItem("token")
//     if (!token) {
//       showMessage("אין הרשאת גישה, יש להתחבר מחדש", "error")
//       setLoading(false)
//       return
//     }

//     try {
//       const res = await fetch(`${API_URL}/allFiles`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       if (!res.ok) {
//         throw new Error("שגיאה בטעינת הקבצים")
//       }

//       const data = await res.json()
//       console.log("קבצים שהתקבלו:", data)

//       // וידוא שהנתונים שהתקבלו הם מערך תקין
//       if (!Array.isArray(data)) {
//         console.error("נתוני הקבצים שהתקבלו אינם במבנה מערך תקין:", data)
//         setFiles([])
//         setFilteredFiles([])
//         setStatusCounts({})
//         setLoading(false)
//         return
//       }

//       // מיון הקבצים לפי סטטוס ועיבוד המידע
//       const processedFiles = data.map((file: FileItem) => {
//         const status = file.status !== undefined ? file.status : FileStatus.UploadedByUser
//         const statusInfo = FileStatusLabels[status as FileStatus] || FileStatusLabels[FileStatus.UploadedByUser]

//         // Fix for ReturnedToUser status - if status is ReturnedToUser, it should have a typed version
//         const hasTypedVersion =
//           file.hasTypedVersion || status === FileStatus.ReturnedToUser || status === FileStatus.Completed

//         return {
//           ...file,
//           statusLabel: statusInfo.label,
//           statusColor: statusInfo.color,
//           hasTypedVersion,
//         }
//       })

//       const sortedFiles = [...processedFiles].sort((a, b) => (a.status || 0) - (b.status || 0))
//       setFiles(sortedFiles)
//       setFilteredFiles(sortedFiles)

//       // Calculate status counts
//       const counts: Record<number, number> = {}
//       sortedFiles.forEach((file) => {
//         const status = file.status !== undefined ? file.status : 0
//         counts[status] = (counts[status] || 0) + 1
//       })
//       setStatusCounts(counts)
//     } catch (err) {
//       console.error("❌ Error:", err)
//       showMessage("שגיאה בטעינת הקבצים", "error")
//       setFiles([])
//       setFilteredFiles([])
//       setStatusCounts({})
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Filter files based on search term and selected user
//   useEffect(() => {
//     let result = [...files]

//     // Filter by user
//     if (selectedUserId !== "all") {
//       result = result.filter((file) => file.userId?.toString() === selectedUserId)
//     }

//     // Filter by search term
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase()
//       result = result.filter(
//         (file) =>
//           (file.name && typeof file.name === "string" && file.name.toLowerCase().includes(term)) ||
//           (file.fileName && typeof file.fileName === "string" && file.fileName.toLowerCase().includes(term)) ||
//           (file.userName && typeof file.userName === "string" && file.userName.toLowerCase().includes(term)),
//       )
//     }

//     setFilteredFiles(result)
//   }, [searchTerm, selectedUserId, files])

//   // טעינת הקבצים בעת טעינת הקומפוננטה
//   useEffect(() => {
//     fetchFiles()
//     fetchUsers()
//   }, [])

//   // פונקציה להעלאת קובץ חדש
//   const handleUploadFile = async (file: File, userId: string) => {
//     const token = localStorage.getItem("token")
//     if (!token) {
//       showMessage("אין הרשאת גישה, יש להתחבר מחדש", "error")
//       throw new Error("אין הרשאת גישה")
//     }

//     const formData = new FormData()
//     formData.append("file", file)
//     formData.append("userId", userId)

//     try {
//       setLoading(true)
//       const res = await fetch(`${API_URL}/upload-client`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       })

//       if (!res.ok) {
//         throw new Error("שגיאה בהעלאת הקובץ")
//       }

//       const data = await res.json()
//       showMessage("הקובץ הועלה בהצלחה", "success")

//       // עדכון רשימת הקבצים
//       const user = users.find((u) => u.id === userId)
//       const status = FileStatus.UploadedByUser
//       const statusInfo = FileStatusLabels[status]

//       const newFile: ExtendedFileItem = {
//         ...data,
//         userName: user?.name || "לא ידוע",
//         uploadDate: new Date().toLocaleDateString("he-IL"),
//         hasTypedVersion: false,
//         status,
//         statusLabel: statusInfo.label,
//         statusColor: statusInfo.color,
//       }

//       const updatedFiles = [...files, newFile].sort((a, b) => (a.status || 0) - (b.status || 0))
//       setFiles(updatedFiles)

//       // Update status counts
//       const newStatusCounts = { ...statusCounts }
//       newStatusCounts[status] = (newStatusCounts[status] || 0) + 1
//       setStatusCounts(newStatusCounts)

//       // מעבר לטאב של רשימת הקבצים לאחר העלאה מוצלחת
//       setTabValue(1)

//       return Promise.resolve()
//     } catch (error) {
//       console.error("שגיאה בהעלאת הקובץ:", error)
//       showMessage("שגיאה בהעלאת הקובץ", "error")
//       throw error
//     } finally {
//       setLoading(false)
//     }
//   }

//   // פונקציה להעלאת גרסה מוקלדת של קובץ
//   const handleUploadTypedFile = async (originalFileId: string, typedFile: File, fileId: number) => {
//     const token = localStorage.getItem("token")
//     if (!token) {
//       showMessage("אין הרשאת גישה, יש להתחבר מחדש", "error")
//       throw new Error("אין הרשאת גישה")
//     }

//     const formData = new FormData()
//     formData.append("file", typedFile)
//     formData.append("originalFileId", originalFileId)
//     formData.append("fileId", `${originalFileId}`)

//     formData.forEach((value, key) => {
//       console.log(`${key}:`, value)
//     })

//     try {
//       setLoading(true)
//       const res = await fetch(`${API_URL}/upload-typist`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
      
//       })
//          const a = await fetch(`${API_URL}/start-typing`, {
//           method: "POST",
//           headers: { Authorization: `Bearer ${token}` },
//           body: formData,
//         })

//       if (!res.ok||!a.ok) {
//         throw new Error("שגיאה בהעלאת הקובץ המוקלד")
//       }

//       const data = await res.json()
//       showMessage("הקובץ המוקלד הועלה בהצלחה", "success")

//       // עדכון סטטוס הקובץ המקורי
//       const updatedFiles = files
//         .map((file) => {
//           if (file.id === originalFileId) {
//             const oldStatus = file.status || 0
//             const newStatus = data.status || FileStatus.Completed
//             const statusInfo = FileStatusLabels[newStatus as FileStatus] || FileStatusLabels[FileStatus.Completed]

//             // Update status counts
//             const newStatusCounts = { ...statusCounts }
//             newStatusCounts[oldStatus] = Math.max(0, (newStatusCounts[oldStatus] || 0) - 1)
//             newStatusCounts[newStatus] = (newStatusCounts[newStatus] || 0) + 1
//             setStatusCounts(newStatusCounts)

//             return {
//               ...file,
//               hasTypedVersion: true,
//               status: newStatus,
//               typedFileName: data.fileName || typedFile.name,
//               statusLabel: statusInfo.label,
//               statusColor: statusInfo.color,
//             }
//           }
//           return file
//         })
//         .sort((a, b) => (a.status || 0) - (b.status || 0))

//       setFiles(updatedFiles)

//       return Promise.resolve()
//     } catch (error) {
//       console.error("שגיאה בהעלאת הקובץ המוקלד:", error)
//       showMessage("שגיאה בהעלאת הקובץ המוקלד", "error")
//       throw error
//     } finally {
//       setLoading(false)
//     }
//   }

//   // פונקציה להורדת קובץ
//   const handleDownloadFile = async (fileId: string, isTypedVersion = false) => {
//     const token = localStorage.getItem("token")
//     if (!token) {
//       showMessage("אין הרשאת גישה, יש להתחבר מחדש", "error")
//       return
//     }

//     try {
//       setLoading(true)
//       // בחירת נקודת הקצה המתאימה בהתאם לסוג הקובץ (מקורי או מוקלד)
//       const endpoint = isTypedVersion ? `${API_URL}/download-type/${fileId}` : `${API_URL}/download/${fileId}`

//       const response = await fetch(endpoint, {
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       if (!response.ok) {
//         throw new Error(`שגיאה בהורדת הקובץ ${isTypedVersion ? "המוקלד" : "המקורי"}`)
//       }

//       const data = await response.json()
//       const fileResponse = await fetch(data.url)

//       if (!fileResponse.ok) {
//         throw new Error(`שגיאה בהורדת הקובץ ${isTypedVersion ? "המוקלד" : "המקורי"}`)
//       }

//       const blob = await fileResponse.blob()
//       const url = window.URL.createObjectURL(blob)
//       const a = document.createElement("a")
//       a.href = url

//       // מציאת שם הקובץ המתאים
//       const file = files.find((f) => f.id === fileId)
//       if (isTypedVersion && file?.typedFileName) {
//         a.download = file.typedFileName
//       } else if (file) {
//         a.download = file.name || file.fileName || `file-${fileId}`
//       } else {
//         a.download = `file-${fileId}${isTypedVersion ? "-typed" : ""}`
//       }

//       document.body.appendChild(a)
//       a.click()
//       document.body.removeChild(a)

//       showMessage(`הקובץ ${isTypedVersion ? "המוקלד" : "המקורי"} הורד בהצלחה`, "success")
//     } catch (error) {
//       console.error(`שגיאה בהורדת הקובץ ${isTypedVersion ? "המוקלד" : "המקורי"}:`, error)
//       showMessage(`שגיאה בהורדת הקובץ ${isTypedVersion ? "המוקלד" : "המקורי"}`, "error")
//     } finally {
//       setLoading(false)
//     }
//   }

//   // פונקציה לצפייה בקובץ
//   const handleViewFile = async (fileId: string, isTypedVersion = false) => {
//     const token = localStorage.getItem("token")
//     if (!token) {
//       showMessage("אין הרשאת גישה, יש להתחבר מחדש", "error")
//       return
//     }

//     try {
//       setLoading(true)
//       // בחירת נקודת הקצה המתאימה בהתאם לסוג הקובץ (מקורי או מוקלד)
//       const endpoint = isTypedVersion ? `${API_URL}/download-typed/${fileId}` : `${API_URL}/download/${fileId}`

//       const response = await fetch(endpoint, {
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       if (!response.ok) {
//         throw new Error(`שגיאה בטעינת הקובץ ${isTypedVersion ? "המוקלד" : "המקורי"}`)
//       }

//       const data = await response.json()
//       const fileResponse = await fetch(data.url)

//       if (!fileResponse.ok) {
//         throw new Error(`שגיאה בטעינת הקובץ ${isTypedVersion ? "המוקלד" : "המקורי"}`)
//       }

//       const blob = await fileResponse.blob()
//       const url = window.URL.createObjectURL(blob)

//       // פתיחת הקובץ בחלון חדש
//       window.open(url, "_blank")

//       showMessage(`הקובץ ${isTypedVersion ? "המוקלד" : "המקורי"} נפתח בהצלחה`, "success")
//     } catch (error) {
//       console.error(`שגיאה בצפייה בקובץ ${isTypedVersion ? "המוקלד" : "המקורי"}:`, error)
//       showMessage(`שגיאה בצפייה בקובץ ${isTypedVersion ? "המוקלד" : "המקורי"}`, "error")
//     } finally {
//       setLoading(false)
//     }
//   }

//   // פונקציה למחיקת קובץ (מחיקה רכה)
//   const handleDeleteFile = async (fileId: string) => {
//     const token = localStorage.getItem("token")
//     if (!token) {
//       showMessage("אין הרשאת גישה, יש להתחבר מחדש", "error")
//       return
//     }

//     try {
//       setLoading(true)
//       const response = await fetch(`${API_URL}/delete-file/${fileId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       if (!response.ok) {
//         throw new Error("שגיאה במחיקת הקובץ")
//       }

//       // עדכון סטטוס הקובץ ל-SoftDeleted
//       const updatedFiles = files
//         .map((file) => {
//           if (file.id === fileId) {
//             const oldStatus = file.status || 0
//             const newStatus = FileStatus.SoftDeleted
//             const statusInfo = FileStatusLabels[newStatus]

//             // Update status counts
//             const newStatusCounts = { ...statusCounts }
//             newStatusCounts[oldStatus] = Math.max(0, (newStatusCounts[oldStatus] || 0) - 1)
//             newStatusCounts[newStatus] = (newStatusCounts[newStatus] || 0) + 1
//             setStatusCounts(newStatusCounts)

//             return {
//               ...file,
//               status: newStatus,
//               statusLabel: statusInfo.label,
//               statusColor: statusInfo.color,
//             }
//           }
//           return file
//         })
//         .sort((a, b) => (a.status || 0) - (b.status || 0))

//       setFiles(updatedFiles)
//       showMessage("הקובץ נמחק בהצלחה", "success")
//     } catch (error) {
//       console.error("שגיאה במחיקת הקובץ:", error)
//       showMessage("שגיאה במחיקת הקובץ", "error")
//     } finally {
//       setLoading(false)
//     }
//   }

//   // פונקציה לרענון רשימת הקבצים
//   const handleRefreshFiles = () => {
//     fetchFiles()
//   }

//   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//     setTabValue(newValue)
//   }

//   return (
//     <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
//       <CardContent sx={{ p: 0 }}>
//         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//           <Typography variant="h5" component="h1" sx={{ fontWeight: "bold", textAlign: "right" }}>
//             מערכת ניהול קבצים
//           </Typography>
//           {tabValue === 1 && (
//             <Chip label="רענן רשימה" color="primary" onClick={handleRefreshFiles} sx={{ cursor: "pointer" }} />
//           )}
//         </Box>

//         <Tabs
//           value={tabValue}
//           onChange={handleTabChange}
//           variant="fullWidth"
//           sx={{
//             mb: 2,
//             "& .MuiTab-root": {
//               fontWeight: "bold",
//               borderRadius: "8px 8px 0 0",
//               transition: "all 0.2s",
//               "&.Mui-selected": {
//                 backgroundColor: "rgba(25, 118, 210, 0.08)",
//               },
//             },
//           }}
//           dir="rtl"
//         >
//           {/* <Tab label="העלאת קובץ" /> */}
//           {/* <Tab label="רשימת קבצים" /> */}
//           <Tab label="קבצים לפי משתמש" />
//         </Tabs>

//         {/* <Box hidden={tabValue !== 0}>
//           {tabValue === 0 && <FileUploader users={users} onUpload={handleUploadFile} />}
//         </Box> */}

//         {/* <Box hidden={tabValue !== 1}>
//           {tabValue === 1 && ( */}
//             <>
//               <Box sx={{ mb: 3 }}>
//                 <Grid container spacing={2} alignItems="center">
//                   <Grid component="div" container spacing={2} alignItems="center">
//                     <TextField
//                       fullWidth
//                       label="חיפוש קבצים"
//                       variant="outlined"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       InputProps={{
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <SearchIcon />
//                           </InputAdornment>
//                         ),
//                         endAdornment: searchTerm && (
//                           <InputAdornment position="end">
//                             <IconButton onClick={() => setSearchTerm("")} edge="end" size="small">
//                               ×
//                             </IconButton>
//                           </InputAdornment>
//                         ),
//                       }}
//                       dir="rtl"
//                     />
//                   </Grid>
//                   <Grid component="div" container spacing={2} alignItems="center">
//                     <FormControl fullWidth>
//                       <InputLabel id="user-filter-label" sx={{ right: 14, left: "auto" }}>
//                         סנן לפי משתמש
//                       </InputLabel>
//                       <Select
//                         labelId="user-filter-label"
//                         value={selectedUserId}
//                         onChange={(e) => setSelectedUserId(e.target.value as string)}
//                         label="סנן לפי משתמש"
//                         sx={{ textAlign: "right" }}
//                       >
//                         <MenuItem value="all">כל המשתמשים</MenuItem>
//                         {users.map((user) => (
//                           <MenuItem key={user.id || "unknown"} value={user.id || ""}>
//                             {user.name || "משתמש לא ידוע"}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </Grid>
//                   <Grid component="div" container spacing={2} alignItems="center">
//                     <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//                       <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefreshFiles}>
//                         רענן רשימה
//                       </Button>
//                     </Box>
//                   </Grid>
//                 </Grid>
//               </Box>

//               <Box sx={{ mb: 3 }}>
//                 <Grid container spacing={2}>
//                   {Object.entries(FileStatusLabels).map(([statusKey, statusInfo]) => {
//                     const count = statusCounts[Number(statusKey)] || 0
//                     return (
                      
                      
//                       <Grid container item xs={6} sm={4} md={3} key={statusKey}>
//                         <Paper
//                           sx={{
//                             p: 1.5,
//                             textAlign: "center",
//                             border: `1px solid ${statusInfo.color === "info"
//                                 ? "#2196f3"
//                                 : statusInfo.color === "warning"
//                                   ? "#ff9800"
//                                   : statusInfo.color === "success"
//                                     ? "#4caf50"
//                                     : statusInfo.color}`,
//                           }}
//                         >
//                         <Typography variant="body2" color="text.secondary">
//                           {statusInfo.label}
//                         </Typography>
//                         <Typography variant="h6" fontWeight="bold">
//                           {count}
//                         </Typography>
//                       </Paper>
//                     </Grid>
//                     )
//                   })}
//                 </Grid>
//               </Box>

//               <FilesList
//                 files={filteredFiles}
//                 onDownload={handleDownloadFile}
//                 onUploadTyped={handleUploadTypedFile}
//                 onDelete={handleDeleteFile}
//                 onView={handleViewFile}
//                 loading={loading}
//                 onRefresh={handleRefreshFiles}
//               />
//             </>
//           {/* )} */}
//         {/* </Box> */}

//         {/* <Box hidden={tabValue !== 2}> */}
//           {/* {tabValue === 2 && (
//             <FileStatus
//               files={files}
//               users={users}
//               onDownload={handleDownloadFile}
//               onView={handleViewFile}
//               onDelete={handleDeleteFile}
//               loading={loading}
//             />
//           )} */}
//         {/* </Box> */}
//       </CardContent>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={4000}
//         onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert
//           severity={snackbar.severity}
//           variant="filled"
//           onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Card>
//   )
// }
