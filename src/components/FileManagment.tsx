import { useState, useEffect } from "react";
import { TextInput, Button, Table, ScrollArea, FileInput } from "@mantine/core";
import { IconUpload, IconDownload, IconEye, IconTrash } from "@tabler/icons-react";

interface MyFile {
    id: string;
    fileName: string;
    size: number; // בייטים
    date: string;
    status: string;
}

const API_URL = "https://server-type-practicom.onrender.com";

export default function FileManager() {
    const [files, setFiles] = useState<MyFile[]>([]);
    const [search, setSearch] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [searchSize, setSearchSize] = useState("");
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        const token = sessionStorage.getItem("token"); 
        if (!token) {
            console.error("❌ אין אסימון התחברות.");
            return;
        }
    
        fetch(`${API_URL}/user-files/9`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                console.log("📄 קבצים שהתקבלו:", data);
                setFiles(data);
            })
            .catch((err) => console.error("❌ Error fetching files:", err));
    }, []);
    const downloadFile = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/download/${id}`);
            const data = await response.json();
    
            if (data.url) {
                // הורדת הקובץ מ-S3
                const fileResponse = await fetch(data.url);
                if (!fileResponse.ok) {
                    throw new Error(`HTTP error! status: ${fileResponse.status}`);
                }
    
                const blob = await fileResponse.blob();
                console.log("Blob:", blob); // בדיקת ה-blob
                console.log("Content-Type:", fileResponse.headers.get("Content-Type")); // בדיקת סוג הקובץ
                console.log("Content-Length:", fileResponse.headers.get("Content-Length")); // בדיקת גודל הקובץ
    
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `file-${id}.docx`; // קביעת שם קובץ
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                console.error("Presigned URL לא התקבל");
            }
        } catch (error) {
            console.error("שגיאה בהורדה", error);
        }
    };
    const handleUpload = async () => {
        if (!file) return;

        const token = sessionStorage.getItem("token");
        if (!token) {
            alert("❌ אין אסימון התחברות. התחבר/י מחדש.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("deadline", new Date().toISOString());

        const response = await fetch(`${API_URL}/upload`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (response.ok) {
            alert("✅ קובץ הועלה בהצלחה!");
            window.location.reload();
        } else {
            alert("❌ העלאה נכשלה");
        }
    };


    
    const handleView = async (fileId: string) => {
        try {
            const response = await fetch(`${API_URL}/files/${fileId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`, // הוספת אסימון הרשאה
                },
            });
            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                window.open(url, "_blank");
            } else {
                console.error("❌ טעינת הקובץ נכשלה:", response.status, await response.json());
                alert("❌ טעינת הקובץ נכשלה.");
            }
        } catch (error) {
            console.error("❌ שגיאה בטעינה:", error);
            alert("❌ שגיאה בטעינה.");
        }
    };
/*************  ✨ Codeium Command ⭐  *************/
/******  4cc3c81f-98f2-4641-85da-2574e835910b  *******/
    const downloadFileStream = async (fileId: string) => {
        try {
            const response = await fetch(`https://server-type-practicom.onrender.com/download/stream/${fileId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // אם יש צורך בהרשאה
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to download file');
            }
    
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
    
            // קביעת שם קובץ (אם יש מידע מה-API ניתן להשתמש בו)
            a.download = `file-${fileId}.pdf`; 
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };
    const handleDelete = async (fileId: string) => {
        console.log(`🔴 מנסה למחוק קובץ עם ID: ${fileId}`);
        const response = await fetch(`${API_URL}/files/${fileId}`, { method: "DELETE" });
        if (response.ok) {
            setFiles(files.filter((file) => file.id !== fileId));
        } else {
            console.error("❌ מחיקת הקובץ נכשלה:", response.status);
        }
    };

    // סינון לפי שם קובץ, תאריך וגודל
    const filteredFiles = files.filter((file) => {
        const matchesName = file.fileName?.toLowerCase().includes(search.toLowerCase());
        const matchesDate = searchDate ? file.date.includes(searchDate) : true;
        const matchesSize = searchSize ? file.size <= parseInt(searchSize) : true;
        return matchesName && matchesDate && matchesSize;
    });

    return (
        <div className="p-6">
            <div className="flex gap-4 mb-4">
                <TextInput
                    placeholder="🔎 חפש קובץ..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-1/3"
                />
                <TextInput
                    placeholder="🔎 חפש לפי תאריך (YYYY-MM-DD)"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="w-1/3"
                />
                <TextInput
                    placeholder="🔎 חפש לפי גודל (בייטים)"
                    value={searchSize}
                    onChange={(e) => setSearchSize(e.target.value)}
                    className="w-1/3"
                />
                <FileInput
                    placeholder="בחר קובץ..."
                    onChange={(file: File | null) => setFile(file)}
                />
                <Button onClick={handleUpload} leftSection={<IconUpload size={16} />}>
                    העלאת קובץ
                </Button>
            </div>

            <ScrollArea>
                <Table striped highlightOnHover>
                    <thead>
                        <tr>
                            <th>שם הקובץ</th>
                            <th>תאריך</th>
                            <th>סטטוס</th>
                            <th>גודל (בייטים)</th>
                            <th>פעולות</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFiles.map((file) => (
                            <tr key={file.id}>
                                <td>{file.fileName}</td>
                                <td>{file.date}</td>
                                <td>{file.status}</td>
                                <td>{file.size}</td>
                                <td>
                                    <Button variant="subtle" onClick={() => handleView(file.id)}>
                                        <IconEye size={16} />
                                    </Button>
                                    <Button variant="subtle" onClick={() => downloadFile(file.id)}>
                                        <IconDownload size={16} />
                                    </Button>
                                    <Button variant="subtle" color="red" onClick={() => handleDelete(file.id)}>
                                        <IconTrash size={16} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </ScrollArea>
        </div>
    );
}
