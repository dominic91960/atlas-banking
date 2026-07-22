import { NavLink, Outlet } from "react-router";

import { cn } from "../lib/utils";
import Dashboard from "../components/global/icons/Dashboard";
import Logo from "../components/global/icons/Logo";
import Transactions from "../components/global/icons/Transactions";

const DashboardLayout = () => {
  return (
    <main className="flex h-dvh p-8">
      {/* Container */}
      <div className="flex min-h-0 grow gap-px bg-neutral-700 p-px">
        <div className="bg-secondary w-70 p-8">
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
        </div>

        <Outlet />
      </div>
    </main>
  );
};

export default DashboardLayout;
