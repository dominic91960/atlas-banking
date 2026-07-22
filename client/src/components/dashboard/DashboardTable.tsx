import type { Transaction } from "../../lib/types";
import RecentTransactions from "./RecentTransactions";

const transactions: Transaction[] = [
  {
    id: "1",
    name: "transfer",
    date: "19/11/2025",
    amount: 3000,
    balance: 89999.28,
  },
  {
    id: "2",
    name: "eCom Spotify PP343",
    date: "19/08/2025",
    amount: -180,
    balance: 89999.28,
  },
  {
    id: "3",
    name: "eCom Spotify PP343",
    date: "19/08/2025",
    amount: -180,
    balance: 89999.28,
  },
  {
    id: "4",
    name: "eCom Spotify PP343",
    date: "19/08/2025",
    amount: -180,
    balance: 89999.28,
  },
];

const DashboardTable = () => {
  return (
    <div className="bg-secondary flex min-h-0 flex-1 flex-col gap-8 p-8">
      <p>Recent Transactions</p>

      <div className="min-h-0 flex-1 overflow-auto">
        <RecentTransactions data={transactions} />
      </div>
    </div>
  );
};

export default DashboardTable;
