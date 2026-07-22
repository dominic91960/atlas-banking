import DashboardHeader from "../dashboard/DashboardHeader";
import CreditTransferForm from "./CreditTransferForm";

const Transactions = () => {
  return (
    <div className="flex min-h-0 grow flex-col gap-px">
      <DashboardHeader />
      <CreditTransferForm />
    </div>
  );
};

export default Transactions;
