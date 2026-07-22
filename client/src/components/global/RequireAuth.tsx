import { Navigate, Outlet, useLocation } from "react-router";

import { useAuthStore } from "../../store/authStore";

const RequireAuth = () => {
  const { auth } = useAuthStore();
  const location = useLocation();

  if (!auth.accessToken) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
