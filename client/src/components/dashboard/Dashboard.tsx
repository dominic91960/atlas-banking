import { useEffect, useState } from "react";
import type { Transaction } from "../../lib/types";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import DashboardHeader from "./DashboardHeader";
import DashboardInfo from "./DashboardInfo";
import DashboardTable from "./DashboardTable";

const Dashboard = () => {
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
      } catch {
        if (isMounted) {
          setError("Failed to load data. Please try again.");
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

  const currentBalance =
    transactions.length > 0 ? transactions[0].balance : null;

  return (
    <div className="flex min-h-0 grow flex-col gap-px">
      <DashboardHeader />
      <DashboardInfo
        balance={currentBalance}
        isLoading={isLoading}
        error={error}
      />
      <DashboardTable
        transactions={transactions}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default Dashboard;
