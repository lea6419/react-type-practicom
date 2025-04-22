import  { useEffect, useState } from "react";
import { MantineProvider } from "@mantine/core";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import FileManager from "./components/FileManagment";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import UserManagement from "./components/UserManagement";
import AppLayout from "./components/Layout"; // זה AppLayout שלך
import StatsDashboard from "./components/StatsDashboard";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <MantineProvider theme={{}}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />

          {isAuthenticated ? (
            <Route path="/" element={<AppLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="files" element={<FileManager />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="reports" element={<StatsDashboard />} />
              <Route index element={<Navigate to="dashboard" />} />
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;