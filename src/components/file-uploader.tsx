import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';

interface User {
  id: string;
  name: string;
}

interface FileUploaderProps {
  users: User[];
  onUpload: (file: File, userId: string) => Promise<void>;
}

export default function FileUploader({ users, onUpload }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    show: false,
    message: '',
    severity: 'success',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleUserChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setUserId(event.target.value as string);
  };

  const handleUpload = async () => {
    if (!file || !userId) {
      setAlert({
        show: true,
        message: 'נא לבחור קובץ ומשתמש',
        severity: 'error',
      });
      setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 4000);
      return;
    }

    setLoading(true);
    try {
      await onUpload(file, userId);
      setAlert({
        show: true,
        message: 'הקובץ הועלה בהצלחה',
        severity: 'success',
      });
      setFile(null);
      setUserId('');

      // איפוס שדה הקובץ
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      // אין צורך להציג הודעת שגיאה כאן כי היא כבר מוצגת בקומפוננטה האב
      console.error('שגיאה בהעלאת הקובץ:', error);
    } finally {
      setLoading(false);
      setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 4000);
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6" sx={{ textAlign: 'right' }}>
          העלאת קובץ חדש
        </Typography>

        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="user-select-label" sx={{ right: 14, left: 'auto' }}>
              בחר משתמש
            </InputLabel>
            <Select
              labelId="user-select-label"
              id="user-select"
              value={userId}
              onChange={handleUserChange}
              label="בחר משתמש"
              sx={{ textAlign: 'right' }}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ mb: 1, textAlign: 'right' }}>
            בחר קובץ
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => document.getElementById('file-input')?.click()}
            >
              בחר קובץ
            </Button>
            <input
              id="file-input"
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </Box>
          {file && (
            <Typography variant="body2" sx={{ mt: 1, textAlign: 'right' }}>
              הקובץ הנבחר: {file.name}
            </Typography>
          )}
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleUpload}
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <UploadIcon />
            )
          }
        >
          {loading ? 'מעלה...' : 'העלה קובץ'}
        </Button>

        <Snackbar
          open={alert.show}
          autoHideDuration={4000}
          onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            severity={alert.severity}
            variant="filled"
            onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </Box>
    </Paper>
  );
}