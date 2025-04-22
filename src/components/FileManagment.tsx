import  { useState, useEffect, useRef } from "react";
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
    Snackbar,
    Select,
    MenuItem,
    Skeleton,
    Alert,
    Chip,
    InputLabel,
    FormControl,
} from "@mui/material";
import { UploadFile, Visibility, Delete, Download } from "@mui/icons-material";

interface MyFile {
    id: string;
    fileName: string;
    size: number;
    date: string;
    status: number;
    clientName: string;
}

const API_URL = "https://server-type-practicom.onrender.com";

const STATUS_LABELS: Record<number, string> = {
    0: "חדש",
    1: "בהקלדה",
    2: "הסתיים",
    3: "הושלם",
};

const STATUS_COLORS: Record<number, string> = {
    0: "error",
    1: "warning",
    2: "info",
    3: "success",
};

const StatusChip = ({ status }: { status: number }) => (
    <Chip
        label={STATUS_LABELS[status]}
        color={STATUS_COLORS[status] as any}
        size="small"
    />
);

export default function FileManager() {
    const [files, setFiles] = useState<MyFile[]>([]);
    const [searchName, setSearchName] = useState("");
    const [searchClient, setSearchClient] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [searchSize, setSearchSize] = useState("");
    const [searchStatus, setSearchStatus] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });
    const inputRef = useRef<HTMLInputElement | null>(null);

    const showMessage = (message: string, severity: "success" | "error" = "success") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

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
        const matchesName = file.fileName?.toLowerCase().includes(searchName.toLowerCase());
        const matchesClient = (file.clientName || "").toLowerCase().includes(searchClient.toLowerCase());
        const matchesDate = searchDate ? file.date.includes(searchDate) : true;
        const matchesSize = searchSize ? file.size <= parseInt(searchSize) : true;
        const matchesStatus = searchStatus !== "" ? file.status.toString() === searchStatus : true;
        return matchesName && matchesClient && matchesDate && matchesSize && matchesStatus;
    });

    // const handleStatusChange = async (fileId: string, newStatus: number) => {
    //     const token = sessionStorage.getItem("token");
    //     if (!token) return;

    //     try {
    //         const res = await fetch(`${API_URL}/files/${fileId}/status`, {
    //             method: "PUT",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             body: JSON.stringify({ status: newStatus }),
    //         });

    //         if (res.ok) {
    //             setFiles((prev) =>
    //                 prev.map((f) => (f.id === fileId ? { ...f, status: newStatus } : f))
    //             );
    //             showMessage("✅ סטטוס עודכן");
    //         } else {
    //             showMessage("❌ עדכון סטטוס נכשל", "error");
    //         }
    //     } catch {
    //         showMessage("⚠️ שגיאה בעדכון סטטוס", "error");
    //     }
    // };

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
            const res = await fetch(`${API_URL}/upload`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (res.ok) {
                showMessage("✅ קובץ הועלה");
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
            showMessage("❌ שגיאה בהורדה", "error");
        }
    };

    const handleDelete = async (id: string) => {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (res.ok) {
            setFiles((f) => f.filter((f) => f.id !== id));
            showMessage("🗑️ קובץ נמחק");
        } else {
            showMessage("❌ מחיקה נכשלה", "error");
        }
    };

    return (
        <div className="p-6">
            <div className="flex flex-wrap gap-4 mb-4">
                <TextField label="חיפוש לפי שם קובץ" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
                <TextField label="חיפוש לפי לקוח" value={searchClient} onChange={(e) => setSearchClient(e.target.value)} />
                <TextField label="תאריך" type="date" InputLabelProps={{ shrink: true }} value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
                <TextField label="גודל מקסימלי (בייט)" value={searchSize} onChange={(e) => setSearchSize(e.target.value)} />

                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="status-select-label">סטטוס</InputLabel>
                    <Select
                        labelId="status-select-label"
                        value={searchStatus}
                        label="סטטוס"
                        onChange={(e) => setSearchStatus(e.target.value)}
                    >
                        <MenuItem value="">הכל</MenuItem>
                        <MenuItem value="0">חדש</MenuItem>
                        <MenuItem value="1">בהקלדה</MenuItem>
                        <MenuItem value="2">הסתיים</MenuItem>
                        <MenuItem value="3">הושלם</MenuItem>
                    </Select>
                </FormControl>

                <input hidden type="file" ref={inputRef} onChange={(e) => setFile(e.target.files?.[0] || null)} />
                <Button variant="contained" startIcon={<UploadFile />} onClick={() => inputRef.current?.click()}>
                    בחר קובץ
                </Button>
                <Button variant="outlined" onClick={handleUpload} disabled={!file || loading}>
                    העלאה
                </Button>
            </div>

            {loading ? (
                <Skeleton variant="rectangular" height={400} animation="wave" />
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                    <TableHead>
    <TableRow>
        <TableCell>שם קובץ</TableCell>
        <TableCell>לקוח</TableCell>
        <TableCell>תאריך</TableCell>
        <TableCell>סטטוס</TableCell>
        <TableCell>גודל</TableCell>
        <TableCell>פעולות</TableCell>
    </TableRow>
</TableHead>
<TableBody>
    {filteredFiles.map((file) => (
        <TableRow key={file.id}>
            <TableCell>{file.fileName}</TableCell>
            <TableCell>{file.clientName}</TableCell>
            <TableCell>{file.date}</TableCell>
            <TableCell><StatusChip status={file.status} /></TableCell>
            <TableCell>{file.size}</TableCell>
            <TableCell>
                <IconButton onClick={() => downloadFile(file.id)}><Visibility /></IconButton>
                <IconButton onClick={() => handleDelete(file.id)}><Delete color="error" /></IconButton>
                <IconButton onClick={() => downloadFile(file.id)}><Download /></IconButton>
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
