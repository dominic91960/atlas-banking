import Actions from "./Actions";
import BalanceDetails from "./BalanceDetails";
import BankCard from "./BankCard";

const DashboardInfo = () => {
  return (
    <div className="flex gap-px">
      <BalanceDetails />
      <Actions />
      <BankCard />
    </div>
  );
};

export default DashboardInfo;
