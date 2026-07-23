import { useEffect, useState } from "react";
import type { Transaction } from "../../lib/types";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import DashboardHeader from "../dashboard/DashboardHeader";
import DashboardTable from "../dashboard/DashboardTable";
import CreditTransferForm from "./CreditTransferForm";

const Transactions = () => {
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

  return (
    <div className="flex min-h-0 grow flex-col gap-px">
      <DashboardHeader />
      <div className="flex grow gap-px overflow-hidden">
        <DashboardTable
          transactions={transactions}
          isLoading={isLoading}
          error={error}
        />
        <CreditTransferForm />
      </div>
    </div>
  );
};

export default Transactions;

