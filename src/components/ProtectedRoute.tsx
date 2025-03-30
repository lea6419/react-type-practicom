import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = !!sessionStorage.getItem("token"); // בדיקה ישירה של טוקן

  return isAuthenticated ? children : <Navigate to="/login" />;
}
