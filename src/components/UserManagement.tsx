import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Fade,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import {
  Person,
  Email,
  Lock,
  PersonAdd,
  AdminPanelSettings
} from '@mui/icons-material';
import axios from 'axios';

const UserManagement = () => {
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    email: '',
    role: 'User',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validateForm = () => {
    if (!userDetails.fullName) {
      setError('אנא הזן שם מלא');
      return false;
    }
    if (!userDetails.email) {
      setError('אנא הזן כתובת אימייל');
      return false;
    }
    if (!userDetails.password || userDetails.password.length < 6) {
      setError('סיסמה חייבת להכיל לפחות 6 תווים');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/user/register', userDetails);
      setSuccess('משתמש נרשם בהצלחה');
      setUserDetails({
        fullName: '',
        email: '',
        role: 'User',
        password: '',
      });
    } catch (error: any) {
      setError(error.response?.data?.message || 'שגיאה בהרשמת משתמש');
    } finally {
      setLoading(false);
    }
  };

  const roleColors = {
    User: '#4CAF50',
    Admin: '#F44336', 
    Typeist: '#2196F3'
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4
      }}
    >
      <Container maxWidth="md">
        <Fade in timeout={600}>
          <Card 
            elevation={10}
            sx={{
              borderRadius: 4,
              overflow: 'visible',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <CardContent sx={{ p: 5 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: 'primary.main',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)',
                  }}
                >
                  <AdminPanelSettings sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography
                  variant="h4"
                  component="h1"
                  fontWeight="bold"
                  color="text.primary"
                  sx={{ mb: 1 }}
                >
                  ניהול משתמשים
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  הוספת משתמש חדש למערכת
                </Typography>
              </Box>

              {error && (
                <Fade in>
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                  </Alert>
                </Fade>
              )}

              {success && (
                <Fade in>
                  <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                    {success}
                  </Alert>
                </Fade>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="שם מלא"
                  value={userDetails.fullName}
                  onChange={(e) => setUserDetails({
                    ...userDetails, 
                    fullName: e.target.value
                  })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="דואר אלקטרוני"
                  type="email"
                  value={userDetails.email}
                  onChange={(e) => setUserDetails({
                    ...userDetails, 
                    email: e.target.value
                  })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />

                <FormControl 
                  fullWidth 
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                >
                  <InputLabel>תפקיד</InputLabel>
                  <Select
                    value={userDetails.role}
                    label="תפקיד"
                    onChange={(e) => setUserDetails({
                      ...userDetails, 
                      role: e.target.value
                    })}
                  >
                    <MenuItem value="User">משתמש</MenuItem>
                    <MenuItem value="Admin">מנהל</MenuItem>
                    <MenuItem value="Typeist">קלדנית</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="סיסמה"
                  type="password"
                  value={userDetails.password}
                  onChange={(e) => setUserDetails({
                    ...userDetails, 
                    password: e.target.value
                  })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 4,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <PersonAdd />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                    boxShadow: '0 4px 15px rgba(33, 150, 243, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976D2, #1CB5E0)',
                      boxShadow: '0 6px 20px rgba(33, 150, 243, 0.6)',
                    },
                  }}
                >
                  {loading ? 'מוסיף משתמש...' : 'הוסף משתמש'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default UserManagement;