import { Navigate } from "react-router-dom";

export default function ProtectedUserRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/signin" replace />;
  }

  // Prevent admin from opening customer profile
  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
