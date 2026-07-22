import { useEffect } from "react";
import { useNavigate } from "react-router";

import { axiosPrivate } from "../lib/axios-instance";
import { useAuthStore } from "../store/authStore";
import api from "../lib/axios-instance";

const useAxiosPrivate = () => {
  const { auth, setAuth, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error?.config;

        if (error?.response?.status === 401 && !originalRequest?._retry) {
          originalRequest._retry = true;

          try {
            const res = await api.get("/auth/refresh", {
              withCredentials: true,
            });

            const { accessToken, user } = res.data;

            setAuth({ accessToken, user });

            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

            return axiosPrivate(originalRequest);
          } catch {
            logout();
            navigate("/sign-in", { replace: true });

            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [auth.accessToken, setAuth, logout, navigate]);

  return axiosPrivate;
};

export default useAxiosPrivate;
