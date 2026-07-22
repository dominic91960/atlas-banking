import DashboardHeader from "./DashboardHeader";
import DashboardInfo from "./DashboardInfo";
import DashboardTable from "./DashboardTable";

const Dashboard = () => {
  return (
    <div className="flex grow min-h-0 flex-col gap-px">
      <DashboardHeader />
      <DashboardInfo />
      <DashboardTable />
    </div>
  );
};

export default Dashboard;
