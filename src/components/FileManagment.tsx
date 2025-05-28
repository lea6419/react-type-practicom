// import { useState, useEffect, useRef } from "react";
// import {
//     TextField,
//     Button,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     IconButton,
//     Snackbar,
//     Select,
//     MenuItem,
//     Skeleton,
//     Alert,
//     Chip,
//     InputLabel,
//     FormControl,
//     Tabs,
//     Tab,
//     Typography,
//     Stack,
// } from "@mui/material";
// import { UploadFile, Visibility, Delete, Download } from "@mui/icons-material";

// interface MyFile {
//     id: string;
//     fileName: string;
//     size: number;
//     updatedAt: string;
//     status: number;
//     clientName: string;
// }

// const API_URL = "https://server-type-practicom.onrender.com";

// const STATUS_LABELS: Record<number, string> = {
//     0: "חדש",
//     1: "בהקלדה",
//     2: "הסתיים",
//     3: "הושלם",
// };

// const STATUS_COLORS: Record<number, string> = {
//     0: "error",
//     1: "warning",
//     2: "info",
//     3: "success",
// };

// const StatusChip = ({ status }: { status: number }) => (
//     <Chip
//         label={STATUS_LABELS[status]}
//         color={STATUS_COLORS[status] as any}
//         size="small"
//     />
// );

// export default function FileManager() {
//     const [files, setFiles] = useState<MyFile[]>([]);
//     const [searchName, setSearchName] = useState("");
//     const [searchQuery, setSearchQuery] = useState("");

//     const [searchClient, setSearchClient] = useState("");
//     const [searchDate, setSearchDate] = useState("");
//     const [searchSize, setSearchSize] = useState("");
//     const [searchStatus, setSearchStatus] = useState("");
//     const [file, setFile] = useState<File | null>(null);
//     const [loading, setLoading] = useState(false);
//     const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });
//     const inputRef = useRef<HTMLInputElement | null>(null);

//     const [tabValue, setTabValue] = useState("all");
//     const [searchInput, setSearchInput] = useState("");

//     const handleSearch = () => {
//         setSearchQuery(searchInput.toLowerCase().trim());
//     };

//     const handleKeyDown = (e: React.KeyboardEvent) => {
//         if (e.key === "Enter") {
//             handleSearch();
//         }
//     };
//     const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
//         setTabValue(newValue);
//     };

//     const showMessage = (message: string, severity: "success" | "error" = "success") => {
//         setSnackbar({ open: true, message, severity });
//     };

//     const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

//     useEffect(() => {
//         const fetchFiles = async () => {
//             setLoading(true);
//             const token = localStorage.getItem("token");
//             if (!token) return;

//             try {
//                 const res = await fetch(`${API_URL}/allFiles`, {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });

//                 const data = await res.json();
//                 console.log(data);

//                 setFiles(data);
//                 [...files].sort((a, b) => a.status - b.status)

//             } catch (err) {
//                 console.error("❌ Error:", err);
//             } finally {

//                 setLoading(false);
//             }
//         };
//         fetchFiles();
//     }, []);

//     const filteredFiles = files.filter((file) => {
//         const matchTab = tabValue === "all" ? true : file.status.toString() === tabValue;
//         const matchSearch = !searchQuery || file.fileName?.toLowerCase().includes(searchQuery);
//         const matchClient = !searchClient || file.clientName?.toLowerCase().includes(searchClient.toLowerCase());
//         const matchStatus = !searchStatus || file.status.toString() === searchStatus;
      
//         return matchTab && matchSearch && matchClient && matchStatus;
//       });
      

//     // const handleStatusChange = async (fileId: string, newStatus: number) => {
//     //     const token = sessionStorage.getItem("token");
//     //     if (!token) return;

//     //     try {
//     //         const res = await fetch(`${API_URL}/files/${fileId}/status`, {
//     //             method: "PUT",
//     //             headers: {
//     //                 "Content-Type": "application/json",
//     //                 Authorization: `Bearer ${token}`,
//     //             },
//     //             body: JSON.stringify({ status: newStatus }),
//     //         });

//     //         if (res.ok) {
//     //             setFiles((prev) =>
//     //                 prev.map((f) => (f.id === fileId ? { ...f, status: newStatus } : f))
//     //             );
//     //             showMessage("✅ סטטוס עודכן");
//     //         } else {
//     //             showMessage("❌ עדכון סטטוס נכשל", "error");
//     //         }
//     //     } catch {
//     //         showMessage("⚠️ שגיאה בעדכון סטטוס", "error");
//     //     }
//     // };

//     const handleUpload = async () => {
//         if (!file) return;
//         setLoading(true);
//         const token = localStorage.getItem("token");
//         if (!token) {
//             showMessage("אין אסימון התחברות", "error");
//             setLoading(false);
//             return;
//         }

//         const formData = new FormData();
//         formData.append("file", file);
//         formData.append("deadline", new Date().toISOString());

//         try {
//             const res = await fetch(`${API_URL}/upload-typist`, {
//                 method: "POST",
//                 headers: { Authorization: `Bearer ${token}` },
//                 body: formData,
//             });

//             if (res.ok) {
//                 showMessage("✅ קובץ הועלה");
//                 setTimeout(() => window.location.reload(), 1000);
//             } else {
//                 showMessage("❌ העלאה נכשלה", "error");
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     const downloadFile = async (id: string) => {
//         try {
//             const response = await fetch(`${API_URL}/download/${id}`);
//             const data = await response.json();
//             const fileResponse = await fetch(data.url);
//             const blob = await fileResponse.blob();
//             const url = window.URL.createObjectURL(blob);
//             const a = document.createElement("a");
//             a.href = url;
//             a.download = `file-${id}.docx`;
//             document.body.appendChild(a);
//             a.click();
//             document.body.removeChild(a);
//         } catch {
//             showMessage("❌ שגיאה בהורדה", "error");
//         }
//     };

//     const handleDelete = async (id: string) => {
//         const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
//         if (res.ok) {
//             setFiles((f) => f.filter((f) => f.id !== id));
//             showMessage("🗑️ קובץ נמחק");
//         } else {
//             showMessage("❌ מחיקה נכשלה", "error");
//         }
//     };
//     const getTabTitle = () => {
//         switch (tabValue) {
//             case "0":
//                 return "קבצים בטיוטה";
//             case "1":
//                 return "קבצים בהקלדה";
//             case "2":
//                 return "קבצים מוכנים";
//             default:
//                 return "כל הקבצים";
//         }
//     };


//     return (
//         <div className="p-6" >
//             <Tabs
//                 value={tabValue}
//                 onChange={handleTabChange}
//                 textColor="primary"
//                 indicatorColor="primary"
//                 variant="fullWidth"
//                 sx={{ mb: 2 }}
//             >
//                 <Tab label="כולם" value="all" />
//                 <Tab label="טיוטה" value="0" />
//                 <Tab label="בהקלדה" value="1" />
//                 <Tab label="מוכן" value="2" />
//             </Tabs>

//             <Typography variant="h6" sx={{ mb: 2 }}>
//                 {getTabTitle()}
//             </Typography>

//             <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
//                 <TextField
//                     label="חפש לפי שם קובץ"
//                     value={searchInput}
//                     onChange={(e) => setSearchInput(e.target.value)}
//                     onKeyDown={handleKeyDown}
//                 />

//                 <Button variant="contained" onClick={handleSearch}>
//                     חפש
//                 </Button>
//             </Stack>

//             {file && (
//                 <div className="text-sm text-gray-600">📄 {file.name}</div>
//             )}

//             <Button
//                 variant="outlined"
//                 onClick={handleUpload}

//                 disabled={!file || loading}
//             >
//                 העלאה
//             </Button>
//             <input
//                 type="file"
//                 ref={inputRef}
//                 style={{ display: "none" }}
//                 onChange={(e) => {
//                     if (e.target.files?.[0]) setFile(e.target.files[0]);
//                 }}
//             />
//             <Button onClick={() => inputRef.current?.click()}>בחר קובץ</Button>

//             {loading ? (
//                 <Skeleton variant="rectangular" height={400} animation="wave" />
//             ) : (
//                 <TableContainer component={Paper}>
//                     <Table>
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell>שם קובץ</TableCell>
//                                 <TableCell>לקוח</TableCell>
//                                 <TableCell>תאריך</TableCell>
//                                 <TableCell>סטטוס</TableCell>
//                                 <TableCell>גודל</TableCell>
//                                 <TableCell>פעולות</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {filteredFiles
//                                 .sort((a, b) => (a.status === 1 ? 1 : -1))
//                                 .map((file) => (
//                                     <TableRow key={file.id}>
//                                         <TableCell>{file.fileName}</TableCell>
//                                         <TableCell>{file.clientName}</TableCell>
//                                         <TableCell>{new Date(file.updatedAt).toLocaleDateString()}</TableCell>
//                                         <TableCell><StatusChip status={file.status} /></TableCell>
//                                         <TableCell>{file.size}</TableCell>
//                                         <TableCell>
//                                             <IconButton onClick={() => downloadFile(file.id)}>
//                                                 <Download />
//                                             </IconButton>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             )}

//             <Snackbar
//                 open={snackbar.open}
//                 autoHideDuration={4000}
//                 onClose={handleCloseSnackbar}
//             >
//                 <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
//                     {snackbar.message}
//                 </Alert>
//             </Snackbar>
//         </div>
//     );
// }
