import  { useState } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import KeyboardIcon from "@mui/icons-material/Keyboard";

const API_URL = "https://server-type-practicom.onrender.com";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        sessionStorage.setItem("token", data.token);
        onLogin();
        navigate("/dashboard");
      } else {
        setError(data.message || "התחברות נכשלה, נסה שוב");
      }
    } catch {
      setError("שגיאת רשת. נסה שוב.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc, #e0f2fe)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Box textAlign="center" mb={2}>
            <KeyboardIcon sx={{ fontSize: 50, color: "#3b82f6" }} />
            <Typography variant="h5" fontWeight="bold" mt={1}>
              התחברות למערכת
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              ניהול הקלדות בקלות וביעילות
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" icon={<ErrorOutlineIcon />} sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="אימייל"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="סיסמה"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Box display="flex" justifyContent="space-between" mt={3}>
            <Button
              variant="text"
              onClick={() => navigate("/forgot-password")}
            >
              שכחתי סיסמה
            </Button>

            <Button
              variant="contained"
              onClick={handleLogin}
              disabled={!email || !password || loading}
              endIcon={loading && <CircularProgress size={16} />}
            >
              התחבר
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
