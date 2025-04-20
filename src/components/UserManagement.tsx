import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Card, CardContent, Typography, Button, Grid, CircularProgress, Box, Snackbar, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';

const UserManagement = () => {
  const [users, setUsers] = useState<{ id: number; username: string; email: string; role: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://server-type-practicom.onrender.com/api/User/client', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      setError('שגיאה בעת שליפת המשתמשים');
      setLoading(false);
    }
  };

  const editUser = async (userId: number, updatedUser: { username: string; email: string; role: string }) => {
    try {
      await axios.put(
        `https://server-type-practicom.onrender.com/api/User/${userId}`,
        updatedUser,
        {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      fetchUsers();
    } catch (error: any) {
      console.error('שגיאה בעדכון:', error.response?.data || error.message);
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      await axios.delete(`https://server-type-practicom.onrender.com/api/User/${userId}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      fetchUsers();
    } catch (error) {
      console.error('שגיאה במחיקה:', error);
    }
  };

  const viewFiles = (userId: number) => {
    console.log('צפייה בקבצים של:', userId);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        ניהול משתמשים
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Snackbar
          open={!!error}
          message={error}
          action={
            <IconButton size="small" color="inherit" onClick={() => setError(null)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      ) : (
        <Grid container spacing={3}>
          {users.map((user) => (
            <Grid item xs={12} md={6} key={user.id}>
              <Card elevation={3} sx={{ borderRadius: 4 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{user.username}</Typography>
                  <Typography color="textSecondary" variant="body2">📧 {user.email}</Typography>
                  <Typography variant="body2">🎯 תפקיד: {user.role}</Typography>

                  <Box mt={2} display="flex" gap={1}>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      variant="outlined"
                      onClick={() =>
                        editUser(user.id, {
                          username: user.username,
                          email: user.email,
                          role: user.role,
                        })
                      }
                    >
                      עריכה
                    </Button>

                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={() => deleteUser(user.id)}
                    >
                      מחיקה
                    </Button>

                    <Button
                      size="small"
                      color="primary"
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      onClick={() => viewFiles(user.id)}
                    >
                      קבצים
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default UserManagement;
