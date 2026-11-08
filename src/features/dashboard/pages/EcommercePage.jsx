import WelcomeCard from "@/features/dashboard/components/WelcomeCard.jsx";
import StatisticsCard from "@/features/dashboard/components/StatisticsCard.jsx";
import OrdersCard from "@/features/dashboard/components/OrdersCard.jsx";
import ProfitCard from "@/features/dashboard/components/ProfitCard.jsx";
import EarningsCard from "@/features/dashboard/components/EarningsCard.jsx";
import RevenueReportCard from "@/features/dashboard/components/RevenueReportCard.jsx";
import CompaniesTable from "@/features/dashboard/components/CompaniesTable.jsx";
import SalesGoalCard from "@/features/dashboard/components/SalesGoalCard.jsx";

export default function EcommercePage() {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <div className="xl:col-span-4">
        <WelcomeCard />
      </div>
      <div className="xl:col-span-8">
        <StatisticsCard />
      </div>

      <div className="grid grid-cols-2 content-start gap-6 xl:col-span-4">
        <OrdersCard />
        <ProfitCard />
        <div className="col-span-2">
          <EarningsCard />
        </div>
      </div>
      <div className="xl:col-span-8">
        <RevenueReportCard />
      </div>

      <div className="xl:col-span-8">
        <CompaniesTable />
      </div>
      <div className="xl:col-span-4">
        <SalesGoalCard />
      </div>
    </div>
  );
}
