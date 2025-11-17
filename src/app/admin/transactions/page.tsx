"use client"

import { useState, useMemo, ReactNode, MouseEventHandler } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search } from "lucide-react"
import { PageHeader } from "@/context/page-header-context"
import {
  useGetTransactionOverviewQuery,
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useActOnWithdrawalMutation,
  type TransactionItem,
} from "@/lib/redux/api/transactionApi";
import { AnimatedLogo } from "@/components/loading-logo"
import TransactionsFilter, { TransactionsFilterValue } from "@/components/transaction-filter"
import { SuccessModal } from "@/components/success-modal"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X } from "lucide-react"
// import { enqueueSnackbar } from "notistack"


export default function TransactionsPage() {
    // const router = useRouter()
    const [activeTab, setActiveTab] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [filter, setFilter] = useState<TransactionsFilterValue>({ mode: "none" })
    const [page, setPage] = useState(1)
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionItem | null>(null)
    const [isProcessModalOpen, setIsProcessModalOpen] = useState(false)
    const [resultModal, setResultModal] = useState<{ type: "completed" | "declined"; amount: number; name: string } | null>(null)
    const limit = 10


    const { data: overviewData } = useGetTransactionOverviewQuery();
    
    // Convert date strings to ISO date-time format
    const formatDateToISO = (dateString?: string, isEndDate: boolean = false): string | undefined => {
      if (!dateString) return undefined
      // If already in ISO format, return as is
      if (dateString.includes('T')) return dateString
      // Convert YYYY-MM-DD to ISO date-time
      // For startDate: start of day (00:00:00)
      // For endDate: end of day (23:59:59.999)
      const time = isEndDate ? '23:59:59.999' : '00:00:00.000'
      return new Date(`${dateString}T${time}Z`).toISOString()
    }
    
    // Format amount filter as API expects: "totalPaid>=min,totalPaid<=max"
    const formatAmountFilter = (min?: number, max?: number): string | undefined => {
      const parts: string[] = []
      if (min !== undefined && min !== null && !isNaN(min)) {
        parts.push(`totalPaid>=${min}`)
      }
      if (max !== undefined && max !== null && !isNaN(max)) {
        parts.push(`totalPaid<=${max}`)
      }
      return parts.length > 0 ? parts.join(',') : undefined
    }
    
    const { data: transactionsData, isLoading } = useGetTransactionsQuery({
      page,
      limit,
      status:
        activeTab !== "all"
          ? activeTab.toLowerCase().replace(" transactions", "")
          : undefined,
      startDate: filter.mode === "date" ? formatDateToISO(filter.startDate, false) : undefined,
      endDate: filter.mode === "date" ? formatDateToISO(filter.endDate, true) : undefined,
      amountFilter:
        filter.mode === "amount"
          ? formatAmountFilter(filter.minAmount, filter.maxAmount)
          : undefined,
    })
  const { data: transactionDetailData, isFetching: isFetchingTransaction } = useGetTransactionByIdQuery(
    selectedTransaction?._id ?? "",
    { skip: !selectedTransaction }
  )

  console.log(transactionDetailData)

  const [actOnWithdrawal] = useActOnWithdrawalMutation()

  const transactions =
    transactionsData?.data?.history && transactionsData.data.history.length > 0
      ? transactionsData.data.history
      : [
          {
            _id: "demo-transaction-1",
            status: "completed",
            transactionStatus: "completed",
            totalPaid: 1000000,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userEmail: "thankimedia@gmail.com",
            userAvatar: "https://i.pravatar.cc/160?img=48",
            userName: "Thankgod Ogbonna",
          },
        ];
  const total = transactionsData?.data?.total ?? 0;
  const totalPages = total ? Math.ceil(total / limit) : 1;

  const getString = (value: unknown, fallback: string) =>
    typeof value === "string" && value.trim().length > 0 ? value : fallback

  const getBoolean = (value: unknown, fallback: boolean) =>
    typeof value === "boolean" ? value : fallback

  const getNumber = (value: unknown, fallback: number) =>
    typeof value === "number" && !Number.isNaN(value) ? value : fallback

  const withdrawalDetail = useMemo(() => {
    if (!selectedTransaction) return null
    const apiData = (transactionDetailData?.data ?? {}) as Record<string, unknown>

    const fallbackAmount =
      typeof selectedTransaction.totalPaid === "number" && !Number.isNaN(selectedTransaction.totalPaid)
        ? selectedTransaction.totalPaid
        : 1000000

    return {
      id: selectedTransaction._id,
      fullName: getString(apiData.userName, selectedTransaction.userName ?? "ThankGod Ogbonna"),
      verified: getBoolean(apiData.verified, true),
      coverImage: getString(
        apiData.coverImage,
        "/cover1.jpg"
      ),
      avatar: getString(
        apiData.avatar,
        selectedTransaction.userAvatar ?? "/user.svg"
      ),
      accountName: getString(apiData.accountName, selectedTransaction.userName ?? "ThankGod Ogbonna"),
      bankName: getString(apiData.bankName, "First City Monument Bank"),
      bankShortName: getString(apiData.bankShortName, "FCMB"),
      accountNumber: getString(apiData.accountNumber, "7077900016"),
      amount: getNumber(apiData.amount, fallbackAmount),
    }
  }, [selectedTransaction, transactionDetailData])

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
  const handleRowClick = (transaction: TransactionItem) => {
    setSelectedTransaction(transaction)
    setIsProcessModalOpen(true)
  }

  const handleWithdrawalAction = async (action: "completed" | "declined") => {
    if (!withdrawalDetail) return

    const snapshot = {
      amount: withdrawalDetail.amount,
      name: withdrawalDetail.fullName,
      id: withdrawalDetail.id,
    }

    try {
      await actOnWithdrawal({ transactionId: withdrawalDetail.id, action }).unwrap()
    } catch (error) {
      console.error("Failed to process withdrawal action", error)
    } finally {
      setIsProcessModalOpen(false)
      setResultModal({ type: action, amount: snapshot.amount, name: snapshot.name })
      setSelectedTransaction(null)
    }
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
          title="Total Trans."
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
          title="Completed Trans."
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
          title="Pending Trans."
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
          title="Declined Trans."
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

        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center mb-4">
          <div className="flex overflow-x-auto whitespace-nowrap items-center gap-2 rounded-[10px] bg-[#F6F6F6] px-1 py-1 md:flex-nowrap">
            {["all", "Completed Trans.", "Pending Trans.", "Declined Trans."].map(
              (tab) => (
      <TabButton
        key={tab}
        active={activeTab === tab}
        onClick={() => {
          setActiveTab(tab)
          setPage(1)
        }}
      >
        {tab === "all" ? "View all" : tab}
      </TabButton>
              )
            )}
          </div>
          <div className="mt-2 md:mt-0">
            <div className="flex items-center gap-2 rounded-[10px] border border-[#E4E7EC] bg-white px-4 md:min-w-[360px]">
              <Search className="h-5 w-5 text-[#9CA3AF]" />
              <Input
                type="search"
                placeholder="Search by name or email address"
                className="flex-1 border-0 bg-transparent appearance-none px-2 py-0 text-sm text-[#111827] shadow-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:border-0"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setPage(1)
                }}
              />
              <TransactionsFilter
                initial={filter}
                onApply={(value) => {
                  setFilter(value)
                  setPage(1)
                }}
                onClear={() => {
                  setFilter({ mode: "none" })
                  setPage(1)
                }}
                triggerClassName="ml-1 h-10 w-10 rounded-2xl border border-[#E4E7EC] bg-white hover:bg-[#F5F7FA]"
              />
            </div>
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
                  <th className="text-left p-4 w-[16.6%]">Status</th>
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
                    onClick={() => handleRowClick(trx)}
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
                          {(() => {
                            const status = trx.status?.toLowerCase() || ""
                            const isCompleted = status === "completed" || status === "active"
                            const isDeclined = status === "declined" || status === "declined transactions"
                            const isPending = status === "pending"
                            
                            let bgColor = "bg-gray-100"
                            let textColor = "text-gray-600"
                            const displayText = trx.status ? trx.status.charAt(0).toUpperCase() + trx.status.slice(1) : "N/A"
                            
                            if (isCompleted) {
                              bgColor = "bg-[#E6FCEF]"
                              textColor = "text-[#17B266]"
                            } else if (isDeclined) {
                              bgColor = "bg-[#FEE2E2]"
                              textColor = "text-[#DC2626]"
                            } else if (isPending) {
                              bgColor = "bg-[#F98A0212]"
                              textColor = "text-[#F98A02]"
                            }
                            
                            return (
                              <span className={`inline-flex items-center px-3 py-1 rounded-[5px] text-xs font-medium ${bgColor} ${textColor}`}>
                                {displayText}
                              </span>
                            )
                          })()}
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

      <ProcessWithdrawalModal
        open={isProcessModalOpen}
        onClose={() => {
          setIsProcessModalOpen(false)
          setSelectedTransaction(null)
        }}
        detail={withdrawalDetail}
        isLoading={isFetchingTransaction && !withdrawalDetail}
        onAction={handleWithdrawalAction}
      />

      <SuccessModal
        isOpen={Boolean(resultModal)}
        onClose={() => setResultModal(null)}
        title={
          resultModal?.type === "completed"
            ? "Completed"
            : resultModal?.type === "declined"
              ? "Declined"
              : ""
        }
        description={
          resultModal
            ? `The withdrawal request of ₦${resultModal.amount.toLocaleString()} by ${resultModal.name} has been marked as ${resultModal.type}.`
            : undefined
        }
        icon={resultModal?.type === "declined" ? "warning" : "success"}
        actionLabel="Done"
      />
    </section>
  )
}

interface ProcessWithdrawalDetail {
  id: string
  fullName: string
  verified: boolean
  coverImage: string
  avatar: string
  accountName: string
  bankName: string
  bankShortName: string
  accountNumber: string
  amount: number
}

interface ProcessWithdrawalModalProps {
  open: boolean
  onClose: () => void
  detail: ProcessWithdrawalDetail | null
  isLoading: boolean
  onAction: (action: "completed" | "declined") => Promise<void> | void
}

function ProcessWithdrawalModal({
  open,
  onClose,
  detail,
  isLoading,
  onAction,
}: ProcessWithdrawalModalProps) {
  const [pendingAction, setPendingAction] = useState<"completed" | "declined" | null>(null)

  const handleAction = async (action: "completed" | "declined") => {
    setPendingAction(action)
    try {
      await onAction(action)
    } finally {
      setPendingAction(null)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose()
      }}
    >
      <DialogContent className="max-w-xl rounded-[10px] border-0 p-0 shadow-2xl h-[90vh] max-h-[90vh]">
        <div className="flex h-full flex-col font-sans overflow-hidden">
          {/* Header with title and close button */}
          <div className="relative flex items-center justify-center px-8 pt-6 pb-4">
            <h2 className="text-xl font-semibold text-[#111827]">Process withdrawal</h2>
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-600 shadow hover:bg-gray-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cover image with margin on all sides and rounded bottom corners */}
          <div
            className="relative h-42 mx-4 my-4 rounded-b-[32px] bg-gray-200 md:h-42"
            style={{
              backgroundImage: detail ? `url(${detail.coverImage})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: "calc(100% - 2rem)",
            }}
          >
          </div>

          {/* Avatar overlapping with cover image */}
          <div className="relative -mt-18 z-10 flex justify-center">
            <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-white bg-white shadow-md">
              {detail?.avatar ? (
                <Image src={detail.avatar} alt={detail.fullName} width={96} height={96} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-lg font-semibold text-gray-500">
                  {detail?.fullName?.[0] ?? "?"}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 pb-6 pt-6 text-center [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

            <div className="mt-2 space-y-1">
              <h3 className="text-lg font-semibold text-[#111827] capitalize">
                {detail?.fullName ?? (isLoading ? "Fetching details..." : "Unknown user")}
              </h3>
              {detail?.verified && (
                <span className="inline-flex items-center rounded-[10px] bg-[#E6FCEF] px-4 py-1 text-xs font-medium text-[#12B76A]">
                  Verified
                </span>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3 rounded-[10px] border border-[#A0A0A03B] bg-[#FFFFFF] px-6 py-5 text-left">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4C1D95] text-base font-semibold text-white">
                  {detail?.bankShortName ?? "FCMB"}
                </div>
                <div className="flex flex-col text-sm text-[#5A5555]">
                  <span className="font-semibold text-[#1F2937]">
                    Account Name: {detail?.accountName ?? "N/A"}
                  </span>
                  <span>{detail?.bankName ?? "N/A"}</span>
                  <span>{detail?.accountNumber ?? "N/A"}</span>
                </div>
              </div>

              <div className="rounded-[10px] border-1 border-[#17B266] bg-[#E6FCEF] px-5 py-3 text-left">
                <span className="text-xs font-medium text-[#17B266]">Amount</span>
                <p className="text-lg font-semibold text-[#17B266]">
                  ₦{detail ? detail.amount.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "0.00"}
                </p>
              </div>
            </div>
          </div>

          <div className="px-8 pb-3 pt-4 shadow-[0_-12px_24px_rgba(17,24,39,0.05)]">
            <div className="flex gap-4">
              <Button
                onClick={() => handleAction("completed")}
                className="flex-1 rounded-full bg-[#17B266] md:py-7 py-5 text-base font-semibold hover:bg-[#14965A]"
                disabled={!!pendingAction || !detail}
              >
                {pendingAction === "completed" ? "Processing..." : "Completed"}
              </Button>
              <Button
                onClick={() => handleAction("declined")}
                className="flex-1 rounded-full bg-[#F0483E] md:py-7 py-5 text-base font-semibold text-white hover:bg-[#D93C33]"
                disabled={!!pendingAction || !detail}
              >
                {pendingAction === "declined" ? "Processing..." : "Decline"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
      className={`px-3 py-2 md:px-4 md:py-2 rounded-[4px] text-xs md:text-sm transition-colors ${
        active ? "bg-white text-[#000000] font-medium" : "text-[#888888]"
      }`}
      onClick={onClick}
    >
      <span className="whitespace-nowrap">{children}</span>
    </button>
  )
}