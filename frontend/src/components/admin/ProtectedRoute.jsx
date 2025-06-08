import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({allowedRoles, children}) => {
    const {user} = useSelector(store=>store.auth);

    if (!user) {
    // Not logged in
    return <Navigate to="/login" />;
  }

   if (!allowedRoles.includes(user.role)) {
    // Logged in but role not allowed
    return <Navigate to="/" />;
  }

  return children;
};
export default ProtectedRoute;