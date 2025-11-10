"use client"

import { useState, useMemo, ReactNode, MouseEventHandler, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search } from "lucide-react"
import { PageHeader } from "@/context/page-header-context"
import { useRouter } from "next/navigation"
import {
  useGetTransactionOverviewQuery,
  useGetTransactionsQuery,
} from "@/lib/redux/api/transactionApi";
import { AnimatedLogo } from "@/components/loading-logo"
// import { enqueueSnackbar } from "notistack"


export default function TransactionsPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState(searchQuery)
    const [page, setPage] = useState(1)
    const limit = 10

    console.log(debouncedSearch)

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedSearch(searchQuery)
      }, 500)

      return () => {
        clearTimeout(handler)
      }
    }, [searchQuery])

    const { data: overviewData } = useGetTransactionOverviewQuery();
  const { data: transactionsData, isLoading } = useGetTransactionsQuery({
    page,
    limit,
    status:
      activeTab !== "all"
        ? activeTab.toLowerCase().replace(" transactions", "")
        : undefined,
  });

  const transactions = transactionsData?.data?.history ?? [];
  const total = transactionsData?.data?.total ?? 0;
  const totalPages = total ? Math.ceil(total / limit) : 1;

  // Overview metrics
  const metrics = useMemo(() => {
    const data = overviewData?.data;
    return {
      total: data?.total.thisMonth ?? 0,
      lastMonthTotal: data?.total.lastMonth ?? 0,
      completed: data?.completed.thisMonth ?? 0,
      lastMonthCompleted: data?.completed.lastMonth ?? 0,
      pending: data?.pending.thisMonth ?? 0,
      lastMonthPending: data?.pending.lastMonth ?? 0,
      declined: data?.declined.thisMonth ?? 0,
      lastMonthDeclined: data?.declined.lastMonth ?? 0,
    };
  }, [overviewData]);
  const handleRowClick = (userId: string | number) => {
    router.push(`/admin/users/${userId}`)
  }

  return (
    <section className="">
      <PageHeader>
        <div>
          <h1 className="text-2xl font-bold uppercase">TRANSACTIONS</h1>
          <p className="text-sm text-gray-500">Find all platform customers here</p>
        </div>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Transactions"
          value={metrics.total.toLocaleString()}
          percentage={`${(
            ((metrics.total - metrics.lastMonthTotal) /
              (metrics.lastMonthTotal || 1)) *
            100
          ).toFixed(2)}%`}
          lastMonth="Last Month"
          lastMonthValue={metrics.lastMonthTotal.toLocaleString()}
        />
        <StatsCard
          title="Completed Transactions"
          value={metrics.completed.toLocaleString()}
          percentage={`${(
            ((metrics.completed - metrics.lastMonthCompleted) /
              (metrics.lastMonthCompleted || 1)) *
            100
          ).toFixed(2)}%`}
          lastMonth="Last Month"
          lastMonthValue={metrics.lastMonthCompleted.toLocaleString()}
        />
        <StatsCard
          title="Pending Transactions"
          value={metrics.pending.toLocaleString()}
          percentage={`${(
            ((metrics.pending - metrics.lastMonthPending) /
              (metrics.lastMonthPending || 1)) *
            100
          ).toFixed(2)}%`}
          lastMonth="Last Month"
          lastMonthValue={metrics.lastMonthPending.toLocaleString()}
        />
        <StatsCard
          title="Declined Transactions"
          value={metrics.declined.toLocaleString()}
          percentage={`${(
            ((metrics.declined - metrics.lastMonthDeclined) /
              (metrics.lastMonthDeclined || 1)) *
            100
          ).toFixed(2)}%`}
          lastMonth="Last Month"
          lastMonthValue={metrics.lastMonthDeclined.toLocaleString()}
        />
      </div>

      {/* Users Table */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          {activeTab === "all"
            ? `All Transactions (${total})`
            : `${activeTab} (${transactions.length})`}
        </h2>

        <div className="md:flex justify-between items-center mb-4">
          <div className="flex space-x-2 rounded-lg w-fit bg-[#F6F6F6]">
            {["all", "Completed Transactions", "Pending Transactions", "Declined Transactions"].map(
              (tab) => (
                <TabButton
                  key={tab}
                  active={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "all" ? "View all" : tab}
                </TabButton>
              )
            )}
          </div>
          <div className="relative mt-4 md:mt-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search by name, email, address"
              className="w-[300px] pl-9 shadow-none py-4 rounded-lg border-[#EAEAEA]"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
            />
          </div>
        </div>

       <div className="w-full">
        <div className="bg-white rounded-md border">
          <div className="w-full overflow-x-auto max-w-full">
            <table className="min-w-full text-sm text-gray-700">
              {/* Table Header */}
              <thead className="bg-gray-50 border-b text-gray-500 font-medium" style={{ fontSize: "14px" }}>
                <tr>
                  <th className="text-left p-4 w-[25%]">Full Name</th>
                  <th className="text-left p-4 w-[16.6%]">Email</th>
                  <th className="text-left p-4 w-[16.6%]">Amount</th>
                  <th className="text-left p-4 w-[16.6%]">Date</th>
                  <th className="text-right p-4 w-[16.6%]">Status</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center">
                      <AnimatedLogo />
                    </td>
                  </tr>
                ) : transactions.length > 0 ? (
                  transactions.map((trx) => (
                    <tr
                      key={trx._id}
                      onClick={() => handleRowClick(trx._id)}
                      className="border-b hover:bg-gray-50 cursor-pointer text-[12px]"
                    >
                        <td className="p-4">
                        <div className="flex items-center gap-3">
                            <Avatar>
                            <AvatarImage src="/user-avatar.png" alt={trx.userAvatar } />
                            <AvatarFallback>
                                {trx.userName?.[0]?.toUpperCase() || "N"}
                            </AvatarFallback>
                            </Avatar>
                            <p className="font-medium">{trx.userName || "N/A"}</p>
                        </div>
                        </td>
                        <td className="p-4">{trx.userEmail || "N/A"}</td>
                        <td className="p-4">${trx.totalPaid.toLocaleString()}</td>
                        <td className="p-4">
                        {new Date(trx.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                        </td>
                        <td className="p-4">
                        <div className="flex items-center gap-2">
                            <div
                            className={`w-2 h-2 rounded-full ${
                                trx.status === "active"
                                ? "bg-[#17b266]"
                                : trx.status === "inactive"
                                ? "bg-yellow-400"
                                : trx.status === "Declined transactions"
                                ? "bg-red-500"
                                : "bg-gray-400"
                            }`}
                            ></div>
                            <span>
                            {trx.status.charAt(0).toUpperCase() + trx.status.slice(1)}
                            
                            </span>
                        </div>
                        </td> 
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {transactions.length > 0 && (
            <div className="flex justify-end items-center p-4 border-t">
              <div className="text-sm text-gray-500 mr-4">
                Page {page} of {totalPages}
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="px-2"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  &lt; Prev
                </Button>
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className={`px-2 ${page === i + 1 ? "bg-gray-200" : ""}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="px-2"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next &gt;
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>



      </div>
    </section>
  )
}

// Component for stats cards
function StatsCard({ title, value, percentage, lastMonth, lastMonthValue } : {
  title: string
  value: string | number
  percentage: string | number
  lastMonth: string
  lastMonthValue: string 
}) {
  return (
    <Card className="overflow-hidden shadow-none border border-[#EAEAEA]">
      <CardContent className="p-0">
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-500">{title}</h3>
            <span className="text-xs text-[#17b266] bg-[#17b266]/10 px-2 py-0.5 rounded">{percentage}</span>
          </div>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="p-3 flex items-center justify-between">
          <span className="text-xs text-gray-500">{lastMonth}</span>
          <span className={`text-xs ${lastMonthValue.startsWith("N") ? "text-[#17b266]" : "text-gray-500"}`}>
            {lastMonthValue}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

interface TabButtonProps {
  children: ReactNode
  active: boolean
  onClick: MouseEventHandler<HTMLButtonElement>
}

// Component for tab buttons
function TabButton({ children, active, onClick }: TabButtonProps) {
  return (
    <button
      className={`px-2 md:px-4 m-1 text-xs rounded-lg py-2 md:text-sm ${
        active ? "bg-white text-[#000000] font-medium" : "text-[#97A2AC]"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}