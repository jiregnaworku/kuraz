import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // No login session
  if (!token || !user) {
    return <Navigate to="/signin" replace />;
  }

  // User is not admin
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
