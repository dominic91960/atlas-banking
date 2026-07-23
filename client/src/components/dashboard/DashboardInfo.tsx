import Actions from "./Actions";
import BalanceDetails from "./BalanceDetails";
import BankCard from "./BankCard";

interface DashboardInfoProps {
  balance: string | null;
  isLoading: boolean;
  error: string | null;
}

const DashboardInfo = ({ balance, isLoading, error }: DashboardInfoProps) => {
  return (
    <div className="flex gap-px">
      <BalanceDetails
        balance={balance}
        isLoading={isLoading}
        error={error}
      />
      <Actions />
      <BankCard />
    </div>
  );
};

export default DashboardInfo;
