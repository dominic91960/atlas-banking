import { AxiosError } from "axios";
import { NavLink, Outlet, useNavigate } from "react-router";

import { axiosPrivate } from "../lib/axios-instance";
import { cn } from "../lib/utils";
import { useAuthStore } from "../store/authStore";
import { useToastStore } from "../store/toastStore";

import Dashboard from "../components/global/icons/Dashboard";
import Logo from "../components/global/icons/Logo";
import Transactions from "../components/global/icons/Transactions";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { addToast } = useToastStore();

  const handleLogout = async () => {
    try {
      await axiosPrivate.post("/auth/logout");
    } catch (err) {
      let errMsg = "Something went wrong. Please try again.";
      if (err instanceof AxiosError) {
        errMsg = err.response?.data?.message ?? err.message ?? errMsg;
      } else if (err instanceof Error) {
        errMsg = err.message;
      }
      addToast({ message: errMsg, type: "error" });
    } finally {
      logout();
      navigate("/login");
    }
  };

  return (
    <main className="flex h-dvh p-8">
      {/* Container */}
      <div className="flex min-h-0 grow gap-px bg-neutral-700 p-px">
        <div className="bg-secondary flex w-70 flex-col justify-between p-8">
          <div className="space-y-16">
            <Logo className="w-full" />

            {/* Link Container */}
            <div className="space-y-10">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  cn(
                    "transition-default flex w-full items-center justify-between px-4 py-2 font-medium text-neutral-100 uppercase disabled:pointer-events-none disabled:opacity-50",
                    isActive ? "bg-primary text-secondary" : "hover:opacity-80",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    Dashboard
                    <Dashboard
                      className="size-5"
                      fill={
                        isActive
                          ? "var(--color-secondary)"
                          : "var(--color-neutral-100)"
                      }
                    />
                  </>
                )}
              </NavLink>

              <NavLink
                to="/transactions"
                className={({ isActive }) =>
                  cn(
                    "transition-default flex w-full items-center justify-between px-4 py-2 font-medium text-neutral-100 uppercase disabled:pointer-events-none disabled:opacity-50",
                    isActive ? "bg-primary text-secondary" : "hover:opacity-80",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    Transactions
                    <Transactions
                      className={"size-5"}
                      fill={
                        isActive
                          ? "var(--color-secondary)"
                          : "var(--color-neutral-100)"
                      }
                    />
                  </>
                )}
              </NavLink>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="transition-default hover:bg-primary hover:text-secondary group flex w-full items-center justify-between px-4 py-2 font-medium text-neutral-100 uppercase disabled:pointer-events-none disabled:opacity-50"
          >
            Logout
            <svg
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4"
            >
              <path
                d="M6.74707 0.5H5.7832C4.40655 0.5 3.42392 0.501126 2.67773 0.601562C1.94585 0.700118 1.51552 0.88621 1.2002 1.20117C0.885366 1.51579 0.699987 1.94506 0.601562 2.67676C0.501185 3.42313 0.5 4.40621 0.5 5.7832V13.4932C0.5 14.8701 0.50119 15.8532 0.601562 16.5996C0.699969 17.3313 0.885407 17.7606 1.2002 18.0752L1.20117 18.0762C1.51637 18.3912 1.94549 18.5764 2.67676 18.6748C3.42301 18.7752 4.40621 18.7764 5.78418 18.7764H6.74805C8.1249 18.7764 9.10744 18.7752 9.85352 18.6748C10.5851 18.5764 11.0144 18.3912 11.3291 18.0762V18.0752C11.644 17.7605 11.8303 17.3315 11.9287 16.5996C12.0291 15.8532 12.0293 14.8701 12.0293 13.4932C12.0293 13.1448 12.0289 12.9212 12.0117 12.7529C11.9954 12.5933 11.9687 12.539 11.9512 12.5127V12.5117C11.9179 12.4618 11.8748 12.4194 11.8252 12.3857C11.7987 12.3682 11.7442 12.3405 11.584 12.3242C11.4155 12.3072 11.1912 12.3066 10.8428 12.3066H6.74707C6.03931 12.3066 5.35984 12.0259 4.85938 11.5254C4.35911 11.025 4.07822 10.3462 4.07812 9.63867C4.07812 8.93094 4.35895 8.25143 4.85938 7.75098C5.35984 7.25051 6.03931 6.96973 6.74707 6.96973H10.8428C11.1915 6.96973 11.4156 6.96932 11.584 6.95215C11.7438 6.93584 11.7979 6.90819 11.8242 6.89062H11.8252C11.8498 6.87402 11.8726 6.85489 11.8936 6.83398L11.9512 6.76367C11.9687 6.73728 11.9955 6.68278 12.0117 6.52344C12.0288 6.35515 12.0293 6.1315 12.0293 5.7832C12.0293 4.40621 12.0291 3.42313 11.9287 2.67676C11.8303 1.94483 11.6441 1.51582 11.3291 1.20117V1.2002C11.0144 0.885202 10.5851 0.700008 9.85352 0.601562C9.10731 0.501194 8.12441 0.5 6.74707 0.5ZM15.8857 6.52441C15.8566 6.5267 15.8278 6.5346 15.8018 6.54785C15.7757 6.56112 15.7524 6.57937 15.7334 6.60156C15.7144 6.62381 15.7005 6.64989 15.6914 6.67773C15.6824 6.70548 15.6785 6.73457 15.6807 6.76367C15.6829 6.79281 15.6909 6.82159 15.7041 6.84766C15.7173 6.87368 15.7357 6.897 15.7578 6.91602L17.6484 8.53613L18.6748 9.41504H6.74707C6.68796 9.41504 6.63066 9.43867 6.58887 9.48047C6.54711 9.52226 6.52441 9.57959 6.52441 9.63867C6.52451 9.69756 6.54726 9.75421 6.58887 9.7959C6.63067 9.8377 6.68796 9.86133 6.74707 9.86133H18.6738L17.6475 10.7412L15.7578 12.3604C15.7129 12.3988 15.6852 12.4537 15.6807 12.5127C15.6761 12.5716 15.695 12.6299 15.7334 12.6748C15.7719 12.7197 15.8268 12.7473 15.8857 12.752C15.9448 12.7565 16.0039 12.7377 16.0488 12.6992H16.0479L19.4219 9.80762C19.4463 9.78669 19.466 9.76069 19.4795 9.73145C19.4929 9.70233 19.4999 9.67072 19.5 9.63867C19.5 9.60648 19.493 9.57416 19.4795 9.54492C19.4728 9.5304 19.4647 9.5166 19.4551 9.50391L19.4219 9.46875L16.0488 6.57617C16.0266 6.55724 16.0004 6.54324 15.9727 6.53418C15.9448 6.52509 15.915 6.52215 15.8857 6.52441Z"
                className="transition-default group-hover:fill-secondary group-hover:stroke-secondary fill-neutral-100 stroke-neutral-100"
              />
            </svg>
          </button>
        </div>

        <Outlet />
      </div>
    </main>
  );
};

export default DashboardLayout;
