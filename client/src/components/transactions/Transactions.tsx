import DashboardHeader from "../dashboard/DashboardHeader";
import DashboardTable from "../dashboard/DashboardTable";
import CreditTransferForm from "./CreditTransferForm";

const Transactions = () => {
  return (
    <div className="flex min-h-0 grow flex-col gap-px">
      <DashboardHeader />
      <div className="flex grow gap-px overflow-hidden">
        <DashboardTable />
        <CreditTransferForm />
      </div>
    </div>
  );
};

export default Transactions;
