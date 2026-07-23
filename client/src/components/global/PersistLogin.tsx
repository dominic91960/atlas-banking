import { useEffect, useState } from "react";
import { Outlet } from "react-router";

import { useAuthStore } from "../../store/authStore";
import api from "../../lib/axios-instance";
import Logo from "./icons/Logo";

const PersistLogin = () => {
  const { auth, persist, setAuth } = useAuthStore();
  const needsRefresh = persist && !auth.accessToken;
  const [refreshing, setRefreshing] = useState(needsRefresh);

  useEffect(() => {
    if (!refreshing) return;

    let ignore = false;

    (async () => {
      try {
        const res = await api.get("/auth/refresh", {
          withCredentials: true,
        });

        if (!ignore) {
          setAuth({
            accessToken: res.data.accessToken,
            user: res.data.user,
          });
        }
      } finally {
        if (!ignore) {
          setRefreshing(false);
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, [refreshing, setAuth]);

  if (!persist) return <Outlet />;

  if (refreshing) {
    return (
      <div className="bg-secondary fixed inset-0 z-50 flex items-center justify-center">
        <Logo className="w-45 animate-pulse" />
      </div>
    );
  }

  return <Outlet />;
};

export default PersistLogin;
