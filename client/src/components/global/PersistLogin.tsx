import { useEffect, useState } from "react";
import { Outlet } from "react-router";

import { useAuthStore } from "../../store/authStore";
import api from "../../lib/axios-instance";
import Logo from "./icons/Logo";

const PersistLogin = () => {
  const { auth, persist, setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const refreshSession = async () => {
      try {
        const res = await api.get("/auth/refresh", {
          withCredentials: true,
        });

        if (isMounted) {
          setAuth({
            accessToken: res.data.accessToken,
            user: res.data.user,
          });
        }
      } catch {
        /*
         * Refresh failed — the user will be redirected
         * to sign-in by the RequireAuth guard.
         */
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (!auth.accessToken && persist) {
      refreshSession();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  if (!persist) {
    return <Outlet />;
  }

  if (isLoading) {
    return (
      <div className="bg-secondary fixed inset-0 z-50 flex items-center justify-center">
        <Logo className="w-45 animate-pulse" />
      </div>
    );
  }

  return <Outlet />;
};

export default PersistLogin;
