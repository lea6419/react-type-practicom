import { MantineProvider } from "@mantine/core";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import FileManager from "./components/FileManagment";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import { useEffect, useState } from "react";
import UserManagement from "./components/UserManagement";
import Header from "./components/header";
import HomePage from "./components/home";
import Footer from "./components/footer";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // useEffect(() => {
  //   const token = sessionStorage.getItem("token");
  //   setIsAuthenticated(!!token);
  // }, [sessionStorage.getItem("token")]); // נוודא שהסטייט יתעדכן אם ה-token ישתנה
  

  return (

    
    <MantineProvider theme={{}}>
      <Router>
        <Routes>
        <Route path="/" element={<><Header /><HomePage /><Footer /></>} />
  {/* <Route path="/about" element={<><Header /><About /><Footer /></>} /> */}
  {/* <Route path="/contact" element={<><Header /><Contact /><Footer /></>} /> */}
  <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
  <Route path="/dashboard" element={isAuthenticated ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />} />
  <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />} />

          {/* <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} /> */}
          {/* דפים פרטיים עם Layout */}
          {/* <Route path="/dashboard" element={isAuthenticated ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />} /> */}
          <Route path="/files" element={isAuthenticated ? <Layout><FileManager /></Layout> : <Navigate to="/login" />} />
          <Route path="/users" element={isAuthenticated ? <Layout><UserManagement /></Layout> : <Navigate to="/users" />} />
          {/* ברירת מחדל - שליחת משתמש בהתאם למצב התחברות */}
          {/* <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} /> */}
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;