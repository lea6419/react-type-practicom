import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";
import Header from "./header";

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token"); // מחיקת טוקן
    navigate("/login"); // חזרה להתחברות
  };

  return (
    <div className="h-screen flex flex-col">
    
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Header/>
        <h1>📂 מערכת ניהול קבצים</h1>
        <Button color="red" onClick={handleLogout}>🔴 התנתקות</Button>
      </header>

      <div className="flex flex-grow">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-gray-200 p-4">
          <ul>
            <li><Link to="/dashboard">🏠 דשבורד</Link></li>
            <li><Link to="/files">📁 ניהול קבצים</Link></li>
            <li><Link to="/users">👤 ניהול משתמשים</Link></li>
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-grow p-6">{children}</main>
      </div>
    </div>
  );
}
