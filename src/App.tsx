
// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { SetStateAction, useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import AppLayout from './components/Layout';

import UserManagement from './components/UserManagement';
import StatsDashboard from './components/StatsDashboard';
import Login from './pages/Login';
import SettingsPage from './components/SettingsPage';
import ActivityLogPage from './components/ActivityLogPage';
import FileManagementSystem from './components/files/FileManagementSystem';
// import Profile from './pages/Profile'; // new profile page

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get('https://server-type-practicom.onrender.com/api/User/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(data);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = (token: string, userData: SetStateAction<null>) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div style={{ display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',flexDirection:'column' }}><div className="loading-spinner"/><p>טוען...</p></div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />

        {isAuthenticated ? (
          <Route path="/" element={<AppLayout onLogout={handleLogout} />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="files" element={<FileManagementSystem />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="reports" element={<StatsDashboard />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/activity-log" element={<ActivityLogPage />} />
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
