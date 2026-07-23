import { useEffect, useState } from "react";
import type { Transaction } from "../../lib/types";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import RecentTransactions from "./RecentTransactions";

const DashboardTable = () => {
  const axiosPrivate = useAxiosPrivate();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await axiosPrivate.get("/transactions/recent");

        if (isMounted) {
          setTransactions(res.data.transactions);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load recent transactions.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTransactions();

    return () => {
      isMounted = false;
    };
  }, [axiosPrivate]);

  return (
    <div className="bg-secondary flex min-h-0 grow flex-col gap-8 p-8">
      <p className="text-[18px] font-medium text-neutral-100">
        Recent Transactions
      </p>

      <div className="min-h-0 grow overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <svg
                className="h-8 w-8 animate-spin text-neutral-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <p className="text-sm text-neutral-400">
                Loading transactions...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <svg
                className="h-8 w-8 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
              <p className="text-sm text-red-400">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-1 cursor-pointer rounded-md bg-neutral-800 px-4 py-1.5 text-xs text-neutral-200 transition-colors hover:bg-neutral-700"
              >
                Retry
              </button>
            </div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-neutral-400">
              No recent transactions found.
            </p>
          </div>
        ) : (
          <RecentTransactions data={transactions} />
        )}
      </div>
    </div>
  );
};

export default DashboardTable;

