import React, { useState, useEffect, useRef } from "react";
import {
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    CircularProgress,
    Select,
    MenuItem,
    Skeleton,
    Alert,
} from "@mui/material";
import { UploadFile, Visibility, Delete, Download } from "@mui/icons-material";

interface MyFile {
    id: string;
    fileName: string;
    size: number;
    date: string;
    status: string;
}

const API_URL = "https://server-type-practicom.onrender.com";

const StatusChip = ({ status }: { status: string }) => {
    const getColor = () => {
        switch (status) {
            case "הושלם":
                return "green";
            case "בהקלדה":
                return "orange";
            case "חדש":
            default:
                return "red";
        }
    };

    return (
        <span
            style={{
                backgroundColor: getColor(),
                color: "white",
                padding: "4px 10px",
                borderRadius: "10px",
                fontSize: "0.8rem",
            }}
        >
            {status}
        </span>
    );
};

export default function FileManager() {
    const [files, setFiles] = useState<MyFile[]>([]);
    const [search, setSearch] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [searchSize, setSearchSize] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFileClick = () => {
        inputRef.current?.click();
    };
    const showMessage = (message: string, severity: "success" | "error" = "success") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    useEffect(() => {
        const fetchFiles = async () => {
            setLoading(true);
            const token = sessionStorage.getItem("token");
            if (!token) return;

            try {
                const res = await fetch(`${API_URL}/user-files/9`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setFiles(data);
            } catch (err) {
                console.error("❌ Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFiles();
    }, []);

    const filteredFiles = files.filter((file) => {
        const matchesName = file.fileName?.toLowerCase().includes(search.toLowerCase());
        const matchesDate = searchDate ? file.date.includes(searchDate) : true;
        const matchesSize = searchSize ? file.size <= parseInt(searchSize) : true;
        return matchesName && matchesDate && matchesSize;
    });

    const handleStatusChange = async (fileId: string, newStatus: string) => {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch(`${API_URL}/files/${fileId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                setFiles((prevFiles) =>
                    prevFiles.map((f) => (f.id === fileId ? { ...f, status: newStatus } : f))
                );
                showMessage("✅ סטטוס עודכן בהצלחה");
            } else {
                showMessage("❌ עדכון סטטוס נכשל", "error");
            }
        } catch {
            showMessage("⚠️ שגיאה בעדכון סטטוס", "error");
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        const token = sessionStorage.getItem("token");
        if (!token) {
            showMessage("אין אסימון התחברות", "error");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("deadline", new Date().toISOString());

        try {
            const response = await fetch(`${API_URL}/upload`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (response.ok) {
                showMessage("✅ קובץ הועלה בהצלחה");
                setTimeout(() => window.location.reload(), 1000);
            } else {
                showMessage("❌ העלאה נכשלה", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    const downloadFile = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/download/${id}`);
            const data = await response.json();
            const fileResponse = await fetch(data.url);
            const blob = await fileResponse.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `file-${id}.docx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch {
            showMessage("שגיאה בהורדה", "error");
        }
    };

    const handleDelete = async (id: string) => {
        const res = await fetch(`${API_URL}/files/${id}`, { method: "DELETE" });
        if (res.ok) {
            setFiles(files.filter((f) => f.id !== id));
            showMessage("קובץ נמחק");
        } else {
            showMessage("❌ מחיקה נכשלה", "error");
        }
    };
   

    return (
        <div className="p-6">
            <div className="flex gap-4 mb-4 flex-wrap">
                <TextField label="חפש קובץ..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <TextField label="לפי תאריך" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
                <TextField label="גודל מירבי (בייט)" value={searchSize} onChange={(e) => setSearchSize(e.target.value)} />
                <TextField label="חפש קובץ..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <TextField label="לפי תאריך" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
                <TextField label="גודל מירבי (בייט)" value={searchSize} onChange={(e) => setSearchSize(e.target.value)} />

                {/* input file מוסתר */}
                <input
                    type="file"
                    ref={inputRef}
                    hidden
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />

                {/* כפתור שפותח את הסייר */}
                <Button
                    variant="contained"
                    startIcon={<UploadFile />}
                    onClick={handleFileClick}
                >
                    בחר קובץ
                </Button>

                {/* כפתור העלאה */}
                <Button
                    variant="outlined"
                    onClick={handleUpload}
                    disabled={!file || loading}
                >
                    העלה
                </Button>
            </div>

            {loading ? (
                <Skeleton variant="rectangular" height={400} animation="wave" />
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>שם</TableCell>
                                <TableCell>תאריך</TableCell>
                                <TableCell>סטטוס</TableCell>
                                <TableCell>עדכון סטטוס</TableCell>
                                <TableCell>גודל</TableCell>
                                <TableCell>פעולות</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredFiles.map((file) => (
                                <TableRow key={file.id}>
                                    <TableCell>{file.fileName}</TableCell>
                                    <TableCell>{file.date}</TableCell>
                                    <TableCell>
                                        <StatusChip status={file.status} />
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={file.status}
                                            onChange={(e) => handleStatusChange(file.id, e.target.value)}
                                            size="small"
                                        >
                                            <MenuItem value="חדש">חדש</MenuItem>
                                            <MenuItem value="בהקלדה">בהקלדה</MenuItem>
                                            <MenuItem value="הושלם">הושלם</MenuItem>
                                        </Select>
                                    </TableCell>
                                    <TableCell>{file.size}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => downloadFile(file.id)}>
                                            <Visibility />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(file.id)}>
                                            <Delete color="error" />
                                        </IconButton>
                                        <IconButton onClick={() => downloadFile(file.id)}>
                                            <Download />
                                        </IconButton>

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
}
