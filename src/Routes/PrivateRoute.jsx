import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ requiredRole, children }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/admin" />;
  }

  if (children) {
    return children;
  }

  // If children exist (e.g. direct element usage), render them.
  return  <Outlet />;
};

export default PrivateRoute;
