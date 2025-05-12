import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  Typography,
} from '@mui/material';
import FileUploader from './file-uploader';
import FilesList from './FileList';
import axios from 'axios';

// API URL - יש להגדיר את כתובת ה-API הנכונה
const API_URL = import.meta.env.VITE_API_URL || 'https://server-type-practicom.onrender.com';

interface User {
  id: string;
  name: string;
}

interface FileItem {
  id: string;
  fileName: string;
  userId: string;
  userName: string;
  createdAt: string;
  hasTypedVersion: boolean;
  status?: number;
}

interface FileManagementSystemProps {
  users: User[];
}

export default function FileManagementSystem() {
     const [users, setUsers] = useState<User[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // פונקציה להצגת הודעות למשתמש
  const showMessage = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://server-type-practicom.onrender.com/api/User/client', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      setUsers(response.data);
     
    } catch (error: any) {
      console.error('שגיאה בשליפת משתמשים:', error);
    
    } finally {
      setLoading(false);
    }

  };
  // פונקציה לטעינת הקבצים מהשרת
  const fetchFiles = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      showMessage('אין הרשאת גישה, יש להתחבר מחדש', 'error');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/allFiles`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error('שגיאה בטעינת הקבצים');
      }

      const data = await res.json();
      console.log('קבצים שהתקבלו:', data);

      // מיון הקבצים לפי סטטוס
      const sortedFiles = [...data].sort((a, b) => a.status - b.status);
      setFiles(sortedFiles);
    } catch (err) {
      console.error('❌ Error:', err);
      showMessage('שגיאה בטעינת הקבצים', 'error');
    } finally {
      setLoading(false);
    }
  };

  // טעינת הקבצים בעת טעינת הקומפוננטה
  useEffect(() => {
    fetchFiles();
  }, []);

  // פונקציה להעלאת קובץ חדש
  const handleUploadFile = async (file: File, userId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showMessage('אין הרשאת גישה, יש להתחבר מחדש', 'error');
      throw new Error('אין הרשאת גישה');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/upload-client`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        throw new Error('שגיאה בהעלאת הקובץ');
      }

      const data = await res.json();
      showMessage('הקובץ הועלה בהצלחה', 'success');

      // עדכון רשימת הקבצים
      const user = users.find((u) => u.id === userId);
      const newFile: FileItem = {
        ...data,
        userName: user?.name || 'לא ידוע',
        uploadDate: new Date().toLocaleDateString('he-IL'),
        hasTypedVersion: false,
      };

      setFiles((prev) => [...prev, newFile].sort((a, b) => (a.status || 0) - (b.status || 0)));
      
      // מעבר לטאב של רשימת הקבצים לאחר העלאה מוצלחת
      setTabValue(1);
      
      return Promise.resolve();
    } catch (error) {
      console.error('שגיאה בהעלאת הקובץ:', error);
      showMessage('שגיאה בהעלאת הקובץ', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

 // פונקציה להעלאת גרסה מוקלדת של קובץ
  const handleUploadTypedFile = async (originalFileId: string, typedFile: File,fileId:string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showMessage('אין הרשאת גישה, יש להתחבר מחדש', 'error');
      throw new Error('אין הרשאת גישה');
    }

    const formData = new FormData();
    formData.append('file', typedFile);
    formData.append('originalFileId', originalFileId);
    formData.append('id',fileId );

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/upload-typist`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        throw new Error('שגיאה בהעלאת הקובץ המוקלד');
      }

      const data = await res.json();
      showMessage('הקובץ המוקלד הועלה בהצלחה', 'success');

      // עדכון סטטוס הקובץ המקורי
      setFiles((prev) =>
        prev
          .map((file) =>
            file.id === originalFileId ? { ...file, hasTypedVersion: true, status: data.status || file.status } : file,
          )
          .sort((a, b) => (a.status || 0) - (b.status || 0)),
      );

      return Promise.resolve();
    } catch (error) {
      console.error('שגיאה בהעלאת הקובץ המוקלד:', error);
      showMessage('שגיאה בהעלאת הקובץ המוקלד', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // const handleUploadTypedFile = async (originalFileId: string, typedFile: File) => {
  //     const token = localStorage.getItem('token');
  //     if (!token) {
  //       showMessage('אין הרשאת גישה, יש להתחבר מחדש', 'error');
  //       throw new Error('אין הרשאת גישה');
  //     }
  
  //     const formData = new FormData();
  //     formData.append('file', typedFile);
  //     formData.append('originalFileId', originalFileId);
  
  
  //     try {
  //       setLoading(true);
  //       const res = await fetch(`${API_URL}/upload-client`, {
  //         method: 'POST',
  //         headers: { Authorization: `Bearer ${token}` },
  //         body: formData,
  //       });
  
  //       if (!res.ok) {
  //         throw new Error('שגיאה בהעלאת הקובץ המוקלד');
  //       }
  
  //       const data = await res.json();
  //       showMessage('הקובץ המוקלד הועלה בהצלחה', 'success');
  
  //       // עדכון סטטוס הקובץ המקורי
  //       setFiles((prev) =>
  //         prev
  //           .map((file) =>
  //             file.id === originalFileId ? { ...file, hasTypedVersion: true, status: data.status || file.status } : file,
  //           )
  //           .sort((a, b) => (a.status || 0) - (b.status || 0)),
  //       );
  
  //       return Promise.resolve();
  //     } catch (error) {
  //       console.error('שגיאה בהעלאת הקובץ המוקלד:', error);
  //       showMessage('שגיאה בהעלאת הקובץ המוקלד', 'error');
  //       throw error;
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  // פונקציה להורדת קובץ
  const handleDownloadFile = async (fileId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showMessage('אין הרשאת גישה, יש להתחבר מחדש', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/download/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('שגיאה בהורדת הקובץ');
      }

      const data = await response.json();
      const fileResponse = await fetch(data.url);

      if (!fileResponse.ok) {
        throw new Error('שגיאה בהורדת הקובץ');
      }

      const blob = await fileResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // מציאת שם הקובץ המקורי אם קיים
      const file = files.find((f) => f.id === fileId);
      a.download = file ? file.fileName : `file-${fileId}.docx`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      showMessage('הקובץ הורד בהצלחה', 'success');
    } catch (error) {
      console.error('שגיאה בהורדת הקובץ:', error);
      showMessage('שגיאה בהורדת הקובץ', 'error');
    } finally {
      setLoading(false);
    }
  };

  // פונקציה לרענון רשימת הקבצים
  const handleRefreshFiles = () => {
    fetchFiles();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Card sx={{ p: 2, boxShadow: 3 }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', textAlign: 'right' }}>
            מערכת ניהול קבצים
          </Typography>
        </Box>
        
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            mb: 2,
            '& .MuiTab-root': {
              fontWeight: 'bold',
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
            files={files as ExtendedFileItem[]}
              onDownload={handleDownloadFile}
              onUploadTyped={handleUploadTypedFile}
              loading={loading}
            />
          )}
        </Box>
      </CardContent>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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
  );
}
