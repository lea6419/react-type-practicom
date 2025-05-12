import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  CircularProgress,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import KeyboardIcon from "@mui/icons-material/Keyboard";

const API_URL = "https://server-type-practicom.onrender.com";

export default function Login({ onLogin }: { onLogin: (token: string, userData: any) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/User/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        onLogin(data.token, data.user);
        navigate("/dashboard");
      } else {
        setError(data.message || "התחברות נכשלה, נסה שוב");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("שגיאת רשת. נסה שוב.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0f7fa 0%, #bbdefb 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "6px",
              background: "linear-gradient(90deg, #2196f3, #64b5f6)",
            }}
          />

          <Box textAlign="center" mb={4}>
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #bbdefb, #2196f3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                mb: 2,
              }}
            >
              <KeyboardIcon sx={{ fontSize: 36, color: "#fff" }} />
            </Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              ברוכים הבאים
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              התחברו למערכת ניהול ההקלדות
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {error && (
            <Alert
              severity="error"
              icon={<ErrorOutlineIcon />}
              sx={{
                mb: 3,
                borderRadius: 2,
                "& .MuiAlert-icon": { alignItems: "center" },
              }}
            >
              {error}
            </Alert>
          )}

          <TextField
            label="אימייל"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          <TextField
            label="סיסמה"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            justifyContent="space-between"
            alignItems={isMobile ? "stretch" : "center"}
            mt={3}
          >
            <Button
              variant="text"
              onClick={() => navigate("/forgot-password")}
              sx={{
                mb: isMobile ? 2 : 0,
                color: "#2196f3",
                "&:hover": { backgroundColor: "rgba(33, 150, 243, 0.08)" },
              }}
            >
              שכחתי סיסמה
            </Button>

            <Button
              variant="contained"
              onClick={handleLogin}
              disabled={!email || !password || loading}
              sx={{
                py: 1.2,
                px: 4,
                borderRadius: 2,
                background: "linear-gradient(90deg, #2196f3, #64b5f6)",
                boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)",
                "&:hover": {
                  background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                  boxShadow: "0 6px 16px rgba(33, 150, 243, 0.4)",
                },
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  מתחבר...
                </>
              ) : (
                "התחבר"
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}