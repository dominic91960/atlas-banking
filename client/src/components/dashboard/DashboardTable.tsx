import type { Transaction } from "../../lib/types";
import Logo from "../global/icons/Logo";
import RecentTransactions from "./RecentTransactions";

interface DashboardTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

const DashboardTable = ({
  transactions,
  isLoading,
  error,
}: DashboardTableProps) => {
  return (
    <div className="bg-secondary flex min-h-0 grow flex-col gap-8 p-8">
      <p className="text-[18px] font-medium text-neutral-100">
        Recent Transactions
      </p>

      <div className="relative min-h-0 grow overflow-auto">
        {isLoading && (
          <div className="bg-secondary absolute inset-0 z-50 flex items-center justify-center border border-neutral-700">
            <Logo className="w-40 animate-pulse" />
          </div>
        )}

        {!isLoading && error && (
          <div className="bg-secondary absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 border border-neutral-700">
            <p>Failed to load recent transactions. Please try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="transition-default text-primary w-fit text-[1.2em] uppercase underline hover:text-neutral-100"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && transactions.length === 0 && (
          <div className="bg-secondary absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 border border-neutral-700">
            <p>No recent transactions found.</p>
          </div>
        )}

        {!isLoading && !error && transactions.length > 0 && (
          <RecentTransactions data={transactions} />
        )}
      </div>
    </div>
  );
};

export default DashboardTable;
