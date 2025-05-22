// "use client"

// import type React from "react"
// import { useState } from "react"
// import {
//   Box,
//   Button,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   Typography,
//   Snackbar,
//   Alert,
//   CircularProgress,
//   Paper,
//   TextField,
//   InputAdornment,
// } from "@mui/material"
// import { Upload as UploadIcon, AttachFile as AttachFileIcon, Search as SearchIcon } from "@mui/icons-material"

// interface User {
//   id: string
//   name: string
// }

// interface FileUploaderProps {
//   users: User[]
//   onUpload: (file: File, userId: string) => Promise<void>
// }

// export default function FileUploader({ users, onUpload }: FileUploaderProps) {
//   const [file, setFile] = useState<File | null>(null)
//   const [userId, setUserId] = useState<string>("")
//   const [loading, setLoading] = useState(false)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [alert, setAlert] = useState<{
//     show: boolean
//     message: string
//     severity: "success" | "error"
//   }>({
//     show: false,
//     message: "",
//     severity: "success",
//   })

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0] || null
//     setFile(selectedFile)
//   }

//   const handleUserChange = (event: React.ChangeEvent<{ value: unknown }>) => {
//     setUserId(event.target.value as string)
//   }

//   const handleUpload = async () => {
//     if (!file || !userId) {
//       setAlert({
//         show: true,
//         message: "נא לבחור קובץ ומשתמש",
//         severity: "error",
//       })
//       setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 4000)
//       return
//     }

//     setLoading(true)
//     try {
//       await onUpload(file, userId)
//       setAlert({
//         show: true,
//         message: "הקובץ הועלה בהצלחה",
//         severity: "success",
//       })
//       setFile(null)
//       setUserId("")

//       // איפוס שדה הקובץ
//       const fileInput = document.getElementById("file-input") as HTMLInputElement
//       if (fileInput) fileInput.value = ""
//     } catch (error) {
//       // אין צורך להציג הודעת שגיאה כאן כי היא כבר מוצגת בקומפוננטה האב
//       console.error("שגיאה בהעלאת הקובץ:", error)
//     } finally {
//       setLoading(false)
//       setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 4000)
//     }
//   }

//   // וידוא שמערך המשתמשים קיים ותקין
//   const safeUsers = Array.isArray(users) ? users : []

//   // סינון משתמשים עם בדיקות בטיחות מקיפות
//   const filteredUsers = safeUsers.filter((user) => {
//     // וידוא שהמשתמש הוא אובייקט תקין
//     if (!user || typeof user !== "object") return false

//     // וידוא שיש למשתמש מאפיין שם תקין
//     const userName = user.name
//     if (userName === undefined || userName === null) return false

//     // וידוא שהשם הוא מחרוזת
//     if (typeof userName !== "string") return false

//     // סינון לפי מונח החיפוש
//     return searchTerm === "" || userName.toLowerCase().includes(searchTerm.toLowerCase())
//   })

//   return (
//     <Paper sx={{ p: 3, borderRadius: 2 }}>
//       <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
//         <Typography variant="h6" sx={{ textAlign: "right", fontWeight: "bold" }}>
//           העלאת קובץ חדש
//         </Typography>

//         <Box>
//           <TextField
//             fullWidth
//             label="חיפוש משתמש"
//             variant="outlined"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             sx={{ mb: 2 }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon />
//                 </InputAdornment>
//               ),
//               dir: "rtl",
//             }}
//           />
//           <FormControl fullWidth>
//             <InputLabel id="user-select-label" sx={{ right: 14, left: "auto" }}>
//               בחר משתמש
//             </InputLabel>
//             <Select
//               labelId="user-select-label"
//               id="user-select"
//               value={userId}
//               onChange={handleUserChange}
//               label="בחר משתמש"
//               sx={{ textAlign: "right" }}
//             >
//               {filteredUsers.map((user) => (
//                 <MenuItem key={user.id || "unknown"} value={user.id || ""}>
//                   {user.name || "משתמש לא ידוע"}
//                 </MenuItem>
//               ))}
//               {filteredUsers.length === 0 && (
//                 <MenuItem disabled value="">
//                   {searchTerm ? "לא נמצאו משתמשים התואמים לחיפוש" : "אין משתמשים זמינים"}
//                 </MenuItem>
//               )}
//             </Select>
//           </FormControl>
//         </Box>

//         <Box>
//           <Typography variant="body1" sx={{ mb: 1, textAlign: "right" }}>
//             בחר קובץ
//           </Typography>
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <Button
//               variant="outlined"
//               fullWidth
//               onClick={() => document.getElementById("file-input")?.click()}
//               startIcon={<AttachFileIcon />}
//               sx={{ height: 56 }}
//             >
//               בחר קובץ
//             </Button>
//             <input id="file-input" type="file" style={{ display: "none" }} onChange={handleFileChange} />
//           </Box>
//           {file && (
//             <Paper sx={{ mt: 2, p: 2, backgroundColor: "rgba(25, 118, 210, 0.05)", borderRadius: 1 }}>
//               <Typography variant="body2" sx={{ textAlign: "right", fontWeight: "bold" }}>
//                 הקובץ הנבחר:
//               </Typography>
//               <Typography variant="body2" sx={{ textAlign: "right" }}>
//                 {file.name}
//               </Typography>
//               <Typography variant="caption" sx={{ textAlign: "right", display: "block", color: "text.secondary" }}>
//                 גודל: {(file.size / 1024).toFixed(2)} KB
//               </Typography>
//             </Paper>
//           )}
//         </Box>

//         <Button
//           variant="contained"
//           color="primary"
//           fullWidth
//           onClick={handleUpload}
//           disabled={loading || !file || !userId}
//           startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <UploadIcon />}
//           sx={{ height: 48 }}
//         >
//           {loading ? "מעלה..." : "העלה קובץ"}
//         </Button>

//         <Snackbar
//           open={alert.show}
//           autoHideDuration={4000}
//           onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
//           anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//         >
//           <Alert
//             severity={alert.severity}
//             variant="filled"
//             onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
//           >
//             {alert.message}
//           </Alert>
//         </Snackbar>
//       </Box>
//     </Paper>
//   )
// }
