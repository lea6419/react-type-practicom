import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,

  CircularProgress,
  Box,
  Snackbar,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  Avatar,
  Chip,
  Alert,
  Tooltip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Backdrop
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  PersonAdd as PersonAddIcon,
  Refresh as RefreshIcon,
  FileCopy as FileIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Person as PersonIcon
} from '@mui/icons-material';

// טיפוסי נתונים
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface UserFile {
  id: string;
  name: string;
  uploadDate: string;
  status: number;
  hasTypedVersion: boolean;
}

const UserManagement = () => {
  // מצבים
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // מצבי דיאלוג
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filesDialogOpen, setFilesDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  
  // נתוני משתמש לעריכה/מחיקה
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [userFiles, setUserFiles] = useState<UserFile[]>([]);
  const [userFilesLoading, setUserFilesLoading] = useState(false);
  
  // נתוני משתמש חדש
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });

  // פונקציה לשליפת משתמשים
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
      setError(null);
    } catch (error: any) {
      console.error('שגיאה בשליפת משתמשים:', error);
      setError('שגיאה בעת שליפת המשתמשים: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // פונקציה לרענון רשימת המשתמשים
  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  // פונקציה לפתיחת דיאלוג עריכה
  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditedUser({
      username: user.username,
      email: user.email,
      role: user.role
    });
    setEditDialogOpen(true);
  };

  // פונקציה לשמירת שינויים בעריכה
  const handleSaveEdit = async () => {
    if (!selectedUser || !editedUser.username || !editedUser.email) {
      setError('נא למלא את כל השדות הנדרשים');
      return;
    }

    try {
      await axios.put(
        `https://server-type-practicom.onrender.com/api/User/${selectedUser.id}`,
        editedUser,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setEditDialogOpen(false);
      setSuccess(`המשתמש ${editedUser.username} עודכן בהצלחה`);
      fetchUsers();
    } catch (error: any) {
      setError('שגיאה בעדכון המשתמש: ' + (error.response?.data?.message || error.message));
    }
  };

  // פונקציה לפתיחת דיאלוג מחיקה
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  // פונקציה למחיקת משתמש
  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      await axios.delete(`https://server-type-practicom.onrender.com/api/User/${selectedUser.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      setDeleteDialogOpen(false);
      setSuccess(`המשתמש ${selectedUser.username} נמחק בהצלחה`);
      fetchUsers();
    } catch (error: any) {
      setError('שגיאה במחיקת המשתמש: ' + (error.response?.data?.message || error.message));
    }
  };

  // פונקציה לפתיחת דיאלוג הוספת משתמש
  const handleAddUserClick = () => {
    setNewUser({
      username: '',
      email: '',
      password: '',
      role: 'user'
    });
    setAddUserDialogOpen(true);
  };

  // פונקציה להוספת משתמש חדש
  const handleAddUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      setError('נא למלא את כל השדות הנדרשים');
      return;
    }

    try {
      await axios.post(
        'https://server-type-practicom.onrender.com/api/User/register',
        newUser,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setAddUserDialogOpen(false);
      setSuccess(`המשתמש ${newUser.username} נוסף בהצלחה`);
      fetchUsers();
    } catch (error: any) {
      setError('שגיאה בהוספת המשתמש: ' + (error.response?.data?.message || error.message));
    }
  };

  // פונקציה לצפייה בקבצי משתמש
  const handleViewFiles = async (user: User) => {
    setSelectedUser(user);
    setUserFilesLoading(true);
    setFilesDialogOpen(true);
    
    try {
      const response = await axios.get(
        `https://server-type-practicom.onrender.com/user-files/${user.id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setUserFiles(response.data);
    } catch (error: any) {
      console.error('שגיאה בשליפת קבצים:', error);
      setError('שגיאה בשליפת קבצי המשתמש: ' + (error.response?.data?.message || error.message));
      setUserFiles([]);
    } finally {
      setUserFilesLoading(false);
    }
  };

  // פונקציה לסגירת הודעות
  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  // שליפת משתמשים בטעינה ראשונית
  useEffect(() => {
    fetchUsers();
  }, []);

  // פונקציה להצגת סטטוס קובץ
  const getFileStatusChip = (status: number, _hasTypedVersion: boolean) => {
    switch (status) {
      case 0:
        return <Chip size="small" label="ממתין להקלדה" color="warning" />;
      case 1:
        return <Chip size="small" label="הוקלד" color="success" icon={<CheckCircleIcon />} />;
      case 2:
        return <Chip size="small" label="בתהליך" color="info" />;
      case 3:
        return <Chip size="small" label="נדחה" color="error" icon={<ErrorIcon />} />;
      default:
        return <Chip size="small" label="לא ידוע" />;
    }
  };

  // פונקציה להצגת צבע לפי תפקיד
  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'error';
      case 'manager':
        return 'primary';
      case 'typist':
        return 'success';
      default:
        return 'default';
    }
  };

  // פונקציה להצגת אות ראשונה של שם משתמש
  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, direction: 'rtl' }}>
      {/* כותרת וכפתורים */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          ניהול משתמשים
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={handleAddUserClick}
            sx={{ ml: 1 }}
          >
            הוסף משתמש
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            רענן
          </Button>
        </Box>
      </Box>

      {/* הודעות שגיאה והצלחה */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity="success" variant="filled">
          {success}
        </Alert>
      </Snackbar>

      {/* מסך טעינה */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" flexDirection="column">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            טוען משתמשים...
          </Typography>
        </Box>
      ) : (
        <>
          {/* רשימת משתמשים */}
          {users.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6">לא נמצאו משתמשים</Typography>
            </Paper>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
            {users.map((user) => (
              <div key={user.id} style={{ flexBasis: 'calc(33.33% - 16px)', maxWidth: 'calc(33.33% - 16px)', padding: '16px' }}>
                <Card 
                  elevation={3} 
                  sx={{ 
                    borderRadius: 2,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: getRoleColor(user.role), 
                          width: 50, 
                          height: 50,
                          mr: 2
                        }}
                      >
                        {getInitial(user.username)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {user.username}
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 1.5 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label={user.role} 
                        color={getRoleColor(user.role) as any}
                        size="small"
                        icon={<PersonIcon />}
                      />
                      
                      <Box>
                        <Tooltip title="ערוך משתמש" arrow>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleEditClick(user)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="מחק משתמש" arrow>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteClick(user)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="צפה בקבצים" arrow>
                          <IconButton 
                            size="small" 
                            color="info"
                            onClick={() => handleViewFiles(user)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          )}
        </>
      )}

      {/* דיאלוג עריכת משתמש */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        dir="rtl"
      >
        <DialogTitle>
          עריכת משתמש: {selectedUser?.username}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="שם משתמש"
              fullWidth
              value={editedUser.username || ''}
              onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="אימייל"
              fullWidth
              type="email"
              value={editedUser.email || ''}
              onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel id="edit-role-label">תפקיד</InputLabel>
              <Select
                labelId="edit-role-label"
                value={editedUser.role || ''}
                label="תפקיד"
                onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
              >
                <MenuItem value="admin">מנהל מערכת</MenuItem>
                <MenuItem value="manager">מנהל</MenuItem>
                <MenuItem value="typist">מקליד</MenuItem>
                <MenuItem value="user">משתמש רגיל</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="inherit">
            ביטול
          </Button>
          <Button onClick={handleSaveEdit} color="primary" variant="contained">
            שמור שינויים
          </Button>
        </DialogActions>
      </Dialog>

      {/* דיאלוג מחיקת משתמש */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        dir="rtl"
      >
        <DialogTitle>
          מחיקת משתמש
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            האם אתה בטוח שברצונך למחוק את המשתמש <strong>{selectedUser?.username}</strong>?
            <br />
            פעולה זו אינה ניתנת לביטול.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            ביטול
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            מחק
          </Button>
        </DialogActions>
      </Dialog>

      {/* דיאלוג הוספת משתמש */}
      <Dialog
        open={addUserDialogOpen}
        onClose={() => setAddUserDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        dir="rtl"
      >
        <DialogTitle>
          הוספת משתמש חדש
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="שם משתמש"
              fullWidth
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              required
            />
            <TextField
              label="אימייל"
              fullWidth
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
            <TextField
              label="סיסמה"
              fullWidth
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required
            />
            <FormControl fullWidth>
              <InputLabel id="new-role-label">תפקיד</InputLabel>
              <Select
                labelId="new-role-label"
                value={newUser.role}
                label="תפקיד"
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <MenuItem value="admin">מנהל מערכת</MenuItem>
                <MenuItem value="manager">מנהל</MenuItem>
                <MenuItem value="typist">מקליד</MenuItem>
                <MenuItem value="user">משתמש רגיל</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddUserDialogOpen(false)} color="inherit">
            ביטול
          </Button>
          <Button onClick={handleAddUser} color="primary" variant="contained">
            הוסף משתמש
          </Button>
        </DialogActions>
      </Dialog>

      {/* דיאלוג צפייה בקבצי משתמש */}
      <Dialog
        open={filesDialogOpen}
        onClose={() => setFilesDialogOpen(false)}
        fullWidth
        maxWidth="md"
        dir="rtl"
      >
        <DialogTitle>
          קבצים של {selectedUser?.username}
        </DialogTitle>
        <DialogContent>
          {userFilesLoading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : userFiles.length === 0 ? (
            <Box textAlign="center" my={4}>
              <FileIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5 }} />
              <Typography variant="h6" color="text.secondary" mt={2}>
                אין קבצים למשתמש זה
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="right">שם הקובץ</TableCell>
                    <TableCell align="right">תאריך העלאה</TableCell>
                    <TableCell align="right">סטטוס</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell align="right">{file.name}</TableCell>
                      <TableCell align="right">{new Date(file.uploadDate).toLocaleDateString('he-IL')}</TableCell>
                      <TableCell align="right">
                        {getFileStatusChip(file.status, file.hasTypedVersion)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilesDialogOpen(false)} color="primary">
            סגור
          </Button>
        </DialogActions>
      </Dialog>

      {/* אפקט טעינה */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={refreshing}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
};

export default UserManagement;