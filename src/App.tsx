import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from "axios";
import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import AppLayout from "./components/Layout";
import FileManagementSystem from "./components/FileManagementSystem";
import UserManagement from "./components/UserManagement";
import StatsDashboard from "./components/StatsDashboard";
import Login from "./components/Login";

// שינויים בקומפוננטת App
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  interface LoginProps {
    onLogin: (token: string, userData: any) => void;
  }
  // בדיקת אימות בטעינה ראשונית
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://server-type-practicom.onrender.com/api/User/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('שגיאת אימות:', error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // פונקציית התחברות
  const handleLogin = (token: string, userData: any) => {
    localStorage.setItem("token", token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  // טיפול בהתנתקות
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  // מסך טעינה
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div className="loading-spinner"></div>
        <p>טוען...</p>
      </div>
    );
  }

  return (

      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
          />

          {isAuthenticated ? (
            <Route path="/" element={<AppLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="files" element={<FileManagementSystem />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="reports" element={<StatsDashboard />} />
              <Route index element={<Navigate to="dashboard" />} />
              <Route path="*" element={<Navigate to="dashboard" />} />
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Router>
  );
}

export default App;