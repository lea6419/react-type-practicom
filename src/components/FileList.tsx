import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
} from '@mui/material';
import { 
  Download as DownloadIcon, 
  Upload as UploadIcon, 
  Check as CheckIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

interface FileItem {
  id: string;
  name: string;
  userId: string;
  userName: string;
  uploadDate: string;
  hasTypedVersion: boolean;
  status?: number;
}

interface FilesListProps {
  files: FileItem[];
  onDownload: (fileId: string) => void;
  onUploadTyped: (fileId: string, file: File) => Promise<void>;
  loading?: boolean;
}

// מיפוי סטטוסים לתצוגה
const statusMap: Record<number, { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }> = {
  0: { label: 'ממתין להקלדה', color: 'warning' },
  1: { label: 'הוקלד', color: 'success' },
  2: { label: 'בתהליך', color: 'info' },
  3: { label: 'נדחה', color: 'error' },
};

export default function FilesList({ files, onDownload, onUploadTyped, loading: externalLoading }: FilesListProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<number | 'all'>('all');
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>(files);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // עדכון הקבצים המסוננים כאשר הקבצים, מונח החיפוש או מסנן הסטטוס משתנים
  useEffect(() => {
    let result = [...files];
    
    // סינון לפי מונח חיפוש
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        file => 
          file.name.toLowerCase().includes(searchLower) || 
          file.userName.toLowerCase().includes(searchLower)
      );
    }
    
    // סינון לפי סטטוס
    if (statusFilter !== 'all') {
      result = result.filter(file => file.status === statusFilter);
    }
    
    setFilteredFiles(result);
  }, [files, searchTerm, statusFilter]);

  const handleDownload = (fileId: string) => {
    if (externalLoading) return; // אם יש טעינה חיצונית, לא לאפשר הורדה
    onDownload(fileId);
  };

  const handleTypedFileUpload = async (fileId: string, originalFileName: string) => {
    if (externalLoading) return; // אם יש טעינה חיצונית, לא לאפשר העלאה
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.doc,.docx,.pdf,.txt';

    input.onchange = async () => {
      const typedFile = input.files?.[0];
      if (!typedFile) return;

      setLoading(fileId);
      try {
        await onUploadTyped(fileId, typedFile);
        setSnackbar({
          open: true,
          message: 'הקובץ המוקלד הועלה בהצלחה!',
          severity: 'success',
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'אירעה שגיאה בהעלאת הקובץ המוקלד',
          severity: 'error',
        });
      } finally {
        setLoading(null);
      }
    };

    input.click();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  // חישוב סטטיסטיקה של הקבצים
  const stats = {
    total: files.length,
    typed: files.filter(file => file.hasTypedVersion).length,
    waiting: files.filter(file => !file.hasTypedVersion).length,
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" sx={{ textAlign: 'right' }}>
        רשימת קבצים
      </Typography>

      {/* סטטיסטיקה */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} justifyContent="space-around">
        <Grid component="div">
            <Typography variant="body2" color="text.secondary" align="center">
              סה"כ קבצים
            </Typography>
            <Typography variant="h6" align="center">
              {stats.total}
            </Typography>
          </Grid>
          <Divider orientation="vertical" flexItem />
         <Grid container>
            <Typography variant="body2" color="text.secondary" align="center">
              הוקלדו
            </Typography>
            <Typography variant="h6" align="center" color="success.main">
              {stats.typed}
            </Typography>
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid container>
            <Typography variant="body2" color="text.secondary" align="center">
              ממתינים להקלדה
            </Typography>
            <Typography variant="h6" align="center" color="warning.main">
              {stats.waiting}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* חיפוש וסינון */}
      <Grid container spacing={2} sx={{ mb: 2 }} >
       <Grid >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="חיפוש לפי שם קובץ או משתמש..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <Button 
                    size="small" 
                    onClick={() => setSearchTerm('')}
                    sx={{ minWidth: 'auto' }}
                  >
                    <ClearIcon fontSize="small" />
                  </Button>
                </InputAdornment>
              ),
              sx: { direction: 'rtl' }
            }}
          />
        </Grid>
        <Grid >
          <FormControl fullWidth>
            <InputLabel id="status-filter-label" sx={{ right: 14, left: 'auto' }}>
              סינון לפי סטטוס
            </InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="סינון לפי סטטוס"
              onChange={(e) => setStatusFilter(e.target.value as number | 'all')}
              sx={{ textAlign: 'right' }}
              startAdornment={
                <InputAdornment position="start">
                  <FilterIcon />
                </InputAdornment>
              }
            >
              <MenuItem value="all">הכל</MenuItem>
              {Object.entries(statusMap).map(([value, { label }]) => (
                <MenuItem key={value} value={Number(value)}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* כפתור ניקוי מסננים */}
      {(searchTerm || statusFilter !== 'all') && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={clearFilters}
            startIcon={<ClearIcon />}
          >
            נקה מסננים
          </Button>
        </Box>
      )}

      {externalLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={24} />
          <Typography sx={{ mr: 2 }}>טוען נתונים...</Typography>
        </Box>
      )}

      {!externalLoading && filteredFiles.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          {files.length === 0 ? (
            <Typography>אין קבצים להצגה</Typography>
          ) : (
            <Typography>לא נמצאו קבצים התואמים לחיפוש</Typography>
          )}
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table dir="rtl">
            <TableHead>
              <TableRow>
                <TableCell align="right">שם הקובץ</TableCell>
                <TableCell align="right">משתמש</TableCell>
                <TableCell align="right">תאריך העלאה</TableCell>
                <TableCell align="right">סטטוס</TableCell>
                <TableCell align="right">פעולות</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow key={file.id}>
                  <TableCell align="right" component="th" scope="row">
                    {file.name}
                  </TableCell>
                  <TableCell align="right">{file.userName}</TableCell>
                  <TableCell align="right">{file.uploadDate}</TableCell>
                  <TableCell align="right">
                    <Chip 
                      label={statusMap[file.status || 0]?.label || 'לא ידוע'} 
                      color={statusMap[file.status || 0]?.color || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleDownload(file.id)}
                        startIcon={<DownloadIcon />}
                      >
                        הורד
                      </Button>

                      {file.hasTypedVersion ? (
                        <Button
                          variant="outlined"
                          size="small"
                          disabled
                          startIcon={<CheckIcon />}
                          color="success"
                        >
                          הועלה מוקלד
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleTypedFileUpload(file.id, file.name)}
                          disabled={loading === file.id}
                          startIcon={
                            loading === file.id ? (
                              <CircularProgress size={16} />
                            ) : (
                              <UploadIcon />
                            )
                          }
                        >
                          {loading === file.id ? 'מעלה...' : 'העלה מוקלד'}
                        </Button>
                      )}
                    </Box>
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
    </Box>
  );
}