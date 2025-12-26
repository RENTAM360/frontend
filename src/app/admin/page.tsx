"use client";

import { AnimatedLogo } from "@/components/loading-logo";
import { Card, CardContent } from "@/components/ui/card";
import { EquipmentOverviewChart } from "@/components/equipment-overview-chart";
import { UserReportPieChart } from "@/components/users-report-chart";
import { PageHeader } from "@/context/page-header-context";
import { useGetAdminDashboardQuery } from "@/lib/redux/api/adminApi";
import { formatCurrency, formatNumber } from "../utils/formatters";

export default function Dashboard() {
  const { data, isLoading, isError } = useGetAdminDashboardQuery();
  // console.log(data)

  if (isLoading) return <AnimatedLogo />;
  if (isError) return <p>Error loading dashboard</p>;

  const dashboardData = data?.data;
  return (
    <>
      <PageHeader>
        <div>
          <h1 className="text-xl font-medium">Admin Dashboard</h1>
          {/* <p className="text-sm text-gray-500">
            You have <span className="text-[#17b266]">3 unread</span> Notifications
          </p> */}
        </div>
      </PageHeader>

      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {/* First row of stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6 mb-6">
        <StatsCard
          title="Total Money"
          value={formatCurrency(dashboardData?.totalMoney.thisMonth)}
          percentage={`${formatNumber(dashboardData?.totalMoney.compare)}%`}
          lastMonth="Last Month"
          lastMonthValue={formatCurrency(dashboardData?.totalMoney.lastMonth)}
        />
        <StatsCard
          title="Total Pending Payment"
          value={formatCurrency(dashboardData?.totalPending.thisMonth)}
          percentage={`${formatNumber(dashboardData?.totalPending.compare)}%`}
          lastMonth="Last Month"
          lastMonthValue={formatCurrency(dashboardData?.totalPending.lastMonth)}
        />
        <StatsCard
          title="Total Completed Payment"
          value={formatCurrency(dashboardData?.totalCompleted.thisMonth)}
          percentage={`${formatNumber(dashboardData?.totalCompleted.compare)}%`}
          lastMonth="Last Month"
          lastMonthValue={formatCurrency(
            dashboardData?.totalCompleted.lastMonth
          )}
        />
        <StatsCard
          title="Total listed items"
          value={`${dashboardData?.totalItems.thisMonth}`}
          percentage={`${formatNumber(dashboardData?.totalItems.compare)}%`}
          lastMonth="Last Month"
          lastMonthValue={`${dashboardData?.totalItems.lastMonth || 0}`}
        />
      </div>

      {/* Second row of stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6 mb-6">
        <StatsCard
          title="Active items"
          value={dashboardData?.activeItems.thisMonth || 0}
          percentage={`${formatNumber(dashboardData?.activeItems.compare)}%`}
          lastMonth="Last Month"
          lastMonthValue={`${dashboardData?.activeItems.lastMonth}`}
        />
        <StatsCard
          title="Completed rentals"
          value={dashboardData?.completed.thisMonth || 0}
          percentage={`${formatNumber(dashboardData?.completed.compare)}%`}
          lastMonth="Last Month"
          lastMonthValue={`${dashboardData?.completed.lastMonth}`}
        />
        <StatsCard
          title="Total users"
          value={dashboardData?.users.thisMonth || 0}
          percentage={`${formatNumber(dashboardData?.users.compare)}%`}
          lastMonth="Last Month"
          lastMonthValue={`${dashboardData?.users.lastMonth}`}
        />
        <StatsCard
          title="Users report"
          value={dashboardData?.reports.thisMonth || 0}
          percentage={`${formatNumber(dashboardData?.reports.compare)}%`}
          lastMonth="Last Month"
          lastMonthValue={`${dashboardData?.reports.lastMonth}`}
        />
      </div>

      {/* Charts */}
      <div className="md:flex gap-6">
        <Card className="flex-2 shadow-none">
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Users Overview</h3>
              <p className="text-[12px] text-gray-500">
                Overview of last Months
              </p>
            </div>
            <div className="flex items-center gap-4 mb-4">
              {/* <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-700 rounded-sm"></div>
                <span className="text-[9px]">New Users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#17b266] rounded-sm"></div>
                <span className="text-[9px]">Old Users</span>
              </div> */}
              <div className=" text-[9px] border rounded px-2 py-1">
                Last 6 months
                {/* <select className="text-[9px] border rounded px-2 py-1">
                  <option>Last 6 months</option>
                  <option>Last year</option>
                </select> */}
              </div>
            </div>
            <div className="h-[300px] w-full">
              <EquipmentOverviewChart />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none flex-1 border border-gray-100">
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Monthly User Report
              </h3>
              <p className="text-xs text-gray-500">
                Select a month to view registration data
              </p>
            </div>

            <div className="h-[320px] w-full">
              <UserReportPieChart />
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#17b266] rounded-full"></div>
                <span className="text-xs text-gray-600">New Sign-ups</span>
              </div>
              <span className="text-[10px] text-gray-400 italic">
                Live Data
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Component for stats cards
function StatsCard({
  title,
  value,
  percentage,
  lastMonth,
  lastMonthValue,
}: {
  title: string;
  value: string | number;
  percentage: string | number;
  lastMonth: string;
  lastMonthValue: string;
}) {
  return (
    <Card className="overflow-hidden border shadow-none border-[#EAEAEA]">
      <CardContent className="p-0">
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[12px] text-gray-500">{title}</h3>
            <span className="text-[10px] text-[#17b266] bg-[#17b266]/10 px-2 py-0.5 rounded">
              {percentage}
            </span>
          </div>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className=" p-3 flex items-center justify-between">
          <span className="text-xs text-gray-500">{lastMonth}</span>
          <span
            className={`text-xs ${
              lastMonthValue.startsWith("N")
                ? "text-[#17b266]"
                : "text-gray-500"
            }`}
          >
            {lastMonthValue}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
