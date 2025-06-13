"use client"

import { Card, CardContent } from "@/components/ui/card"
import { UsersOverviewChart } from "@/components/users-overview-chart"
import { UsersReportChart } from "@/components/users-report-chart"
import { PageHeader } from "@/context/page-header-context"

export default function Dashboard() {
  return (
    <>
      <PageHeader>
        <div>
          <h1 className="text-xl font-medium">Welcome Back, Agba</h1>
          <p className="text-sm text-gray-500">
            You have <span className="text-[#17b266]">3 unread</span> Notifications
          </p>
        </div>
      </PageHeader>

      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {/* First row of stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total Money"
          value="N20,000.00"
          percentage="+23%"
          lastMonth="Last Month"
          lastMonthValue="N10,000.00"
        />
        <StatsCard
          title="Total Pending Payment"
          value="N5,000.00"
          percentage="+23%"
          lastMonth="Last Month"
          lastMonthValue="N10,000.00"
        />
        <StatsCard
          title="Total Completed Payment"
          value="N5,000.00"
          percentage="+23%"
          lastMonth="Last Month"
          lastMonthValue="N10,000.00"
        />
        <StatsCard
          title="Total listed items"
          value="100"
          percentage="+23%"
          lastMonth="Last Month"
          lastMonthValue="80"
        />
      </div>

      {/* Second row of stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard title="Active items" value="200" percentage="+23%" lastMonth="Last Month" lastMonthValue="50" />
        <StatsCard title="Completed rentals" value="800" percentage="+23%" lastMonth="Last Month" lastMonthValue="50" />
        <StatsCard title="Total users" value="300" percentage="+23%" lastMonth="Last Month" lastMonthValue="50" />
        <StatsCard title="Users report" value="1000" percentage="+23%" lastMonth="Last Month" lastMonthValue="80" />
      </div>

      {/* Charts */}
      <div className="flex gap-6">
        <Card className="flex-1 shadow-none">
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Users Overview</h3>
              <p className="text-[12px] text-gray-500">Overview of last Months</p>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-700 rounded-sm"></div>
                <span className="text-[9px]">New Users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#17b266] rounded-sm"></div>
                <span className="text-[9px]">Old Users</span>
              </div>
              <div className="ml-auto">
                <select className="text-[9px] border rounded px-2 py-1">
                  <option>Last 6 months</option>
                  <option>Last year</option>
                </select>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <UsersOverviewChart />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Users Reports</h3>
            </div>
            <div className="h-[300px] w-full flex items-center justify-center">
              <UsersReportChart />
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-700 rounded-sm"></div>
                <span className="text-sm">SignUp Users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#17b266] rounded-sm"></div>
                <span className="text-sm">Active Users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
                <span className="text-sm">Inactive Users</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

// Component for stats cards
function StatsCard({ title, value, percentage, lastMonth, lastMonthValue }) {
  return (
    <Card className="overflow-hidden border shadow-none border-[#EAEAEA]">
      <CardContent className="p-0">
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[12px] text-gray-500">{title}</h3>
            <span className="text-[10px] text-[#17b266] bg-[#17b266]/10 px-2 py-0.5 rounded">{percentage}</span>
          </div>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className=" p-3 flex items-center justify-between">
          <span className="text-xs text-gray-500">{lastMonth}</span>
          <span className={`text-xs ${lastMonthValue.startsWith("N") ? "text-[#17b266]" : "text-gray-500"}`}>
            {lastMonthValue}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
