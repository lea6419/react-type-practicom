import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  TextInput, 
  PasswordInput, 
  Button, 
  Paper, 
  Title, 
  Container, 
  Group, 
  Alert 
} from "@mantine/core";
import { IconLock, IconMail, IconAlertCircle } from "@tabler/icons-react";

const API_URL = "https://server-type-practicom.onrender.com";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async () => {
    // // בדיקות תקינות
    // if (!email || !password) {
    //   setError("אנא הזן אימייל וסיסמה");
    //   return;
    // }

    // if (!validateEmail(email)) {
    //   setError("כתובת אימייל לא תקינה");
    //   return;
    // }

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
        setError(data.message || "התחברות נכשלה, נסה שנית");
      }
    } catch (err) {
      setError("בעיית התחברות. אנא בדוק את החיבור שלך");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Paper withBorder shadow="md" p={30} radius="md">
        <Title textAlign="center" mb={20}>
          כניסה למערכת
        </Title>

        {error && (
          <Alert 
            icon={<IconAlertCircle size={16} />} 
            title="שגיאה" 
            color="red" 
            mb={15}
          >
            {error}
          </Alert>
        )}

        <TextInput
          label="אימייל"
          placeholder="הזן את כתובת האימייל שלך"
          icon={<IconMail size={16} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <PasswordInput
          label="סיסמה"
          placeholder="הזן את הסיסמה שלך"
          icon={<IconLock size={16} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          mt="md"
        />

        <Group align="apart" mt="lg">
          <Button 
            variant="outline" 
            color="blue"
            onClick={() => navigate("/forgot-password")}
          >
            שכחתי סיסמה
          </Button>

          <Button 
            onClick={handleLogin} 
            loading={loading}
            disabled={!email || !password}
          >
            התחבר
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}