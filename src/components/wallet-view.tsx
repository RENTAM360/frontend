"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { WithdrawView } from "@/components/withdraw-view"
import { AddBankModal } from "@/components/add-bank-modal"

interface Transaction {
  id: string
  title: string
  date: string
  amount: number
  status: "debit" | "successful" | "pending" | "withdrawal" | "deposit"
  type: "rental" | "transaction"
}

interface WalletViewProps {
  balance: number
  transactions: Transaction[]
}

export function WalletView({ balance, transactions }: WalletViewProps) {
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [showAddBankModal, setShowAddBankModal] = useState(false)
  const [filter, setFilter] = useState<string>("All")
  const [activeTab, setActiveTab] = useState<"all" | "rentals" | "transactions">("all")

  if (showWithdraw) {
    return <WithdrawView onCancel={() => setShowWithdraw(false)} balance={balance} />
  }

  const filteredTransactions = transactions.filter((transaction) => {
    // First filter by transaction type
    if (activeTab === "rentals" && transaction.type !== "rental") return false
    if (activeTab === "transactions" && transaction.type !== "transaction") return false
    // No filtering needed for "all"

    // Then filter by status if not "All"
    if (filter !== "All" && transaction.status !== filter.toLowerCase()) return false

    return true
  })

  const handleAddBank = (data: { accountName: string; accountNumber: string; bankName: string }) => {
    console.log("Adding bank account:", data)
    // Here you would typically call an API to add the bank account
  }

  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Wallet</h2>
        <Button className="bg-primary hover:bg-green-600 text-white" onClick={() => setShowAddBankModal(true)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.9987 15.1666C4.04536 15.1666 0.832031 11.9533 0.832031 7.99992C0.832031 4.04659 4.04536 0.833252 7.9987 0.833252C11.952 0.833252 15.1654 4.04659 15.1654 7.99992C15.1654 11.9533 11.952 15.1666 7.9987 15.1666ZM7.9987 1.83325C4.5987 1.83325 1.83203 4.59992 1.83203 7.99992C1.83203 11.3999 4.5987 14.1666 7.9987 14.1666C11.3987 14.1666 14.1654 11.3999 14.1654 7.99992C14.1654 4.59992 11.3987 1.83325 7.9987 1.83325Z" fill="white"/>
                <path d="M10.6654 8.5H5.33203C5.0587 8.5 4.83203 8.27333 4.83203 8C4.83203 7.72667 5.0587 7.5 5.33203 7.5H10.6654C10.9387 7.5 11.1654 7.72667 11.1654 8C11.1654 8.27333 10.9387 8.5 10.6654 8.5Z" fill="white"/>
                <path d="M8 11.1666C7.72667 11.1666 7.5 10.9399 7.5 10.6666V5.33325C7.5 5.05992 7.72667 4.83325 8 4.83325C8.27333 4.83325 8.5 5.05992 8.5 5.33325V10.6666C8.5 10.9399 8.27333 11.1666 8 11.1666Z" fill="white"/>
            </svg>

          Add account
        </Button>
      </div>

      {/* Balance Card */}
      <div className="bg-black text-white rounded-lg p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-lg mb-2">Available balance</p>
            <h3 className="text-4xl font-bold mb-2">₦{balance.toLocaleString()}</h3>
            <p className="text-sm opacity-80">₦{balance.toLocaleString()} (Total balance)</p>
          </div>
          <Button
            onClick={() => setShowWithdraw(true)}
            className="bg-white text-black hover:bg-gray-100 rounded-full px-6"
          >
            Withdraw
          </Button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-2xl font-bold">History</h3>
        <div className="flex gap-2">
          {/* Transaction Type Filter */}
          <div className="relative">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as "all" | "rentals" | "transactions")}
              className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm"
            >
              <option value="all">All</option>
              <option value="rentals">Rentals</option>
              <option value="transactions">Transactions</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6L0 0H12L6 6Z" fill="#333" />
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm"
            >
              <option>All</option>
              <option>Debit</option>
              <option>Successful</option>
              <option>Pending</option>
              <option>Withdrawal</option>
              <option>Deposit</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6L0 0H12L6 6Z" fill="#333" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mr-3">
                    <svg width="27" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.32824 21.3942C5.44391 20.8174 4.06005 19.8092 3.17665 18.3694C2.29326 16.9297 1.85156 15.4878 1.85156 14.0437C1.85156 12.5996 2.29326 11.1577 3.17665 9.71803C4.06005 8.27832 5.44354 7.27045 7.32714 6.69442V7.85634C6.03198 8.29438 4.97812 9.07922 4.16554 10.2108C3.35297 11.3425 2.94704 12.6201 2.94777 14.0437C2.9485 15.4674 3.35443 16.745 4.16554 17.8766C4.97666 19.0083 6.03089 19.7931 7.32824 20.2311V21.3942ZM16.0892 21.7095C13.9559 21.7095 12.1449 20.9649 10.6563 19.4755C9.16767 17.9862 8.42299 16.1756 8.42226 14.0437C8.42153 11.9119 9.1662 10.1013 10.6563 8.61197C12.1464 7.12261 13.957 6.37793 16.0881 6.37793C17.0824 6.37793 18.0279 6.5568 18.9244 6.91454C19.8224 7.27227 20.6237 7.77603 21.3282 8.4258L20.5539 9.20004C19.9655 8.65395 19.2953 8.22977 18.5433 7.92752C17.7913 7.62454 16.9729 7.47305 16.0881 7.47305C14.2629 7.47305 12.7115 8.11186 11.4338 9.3895C10.1562 10.6671 9.51737 12.2185 9.51737 14.0437C9.51737 15.8689 10.1562 17.4203 11.4338 18.698C12.7115 19.9756 14.2629 20.6144 16.0881 20.6144C16.9729 20.6144 17.7913 20.4633 18.5433 20.1611C19.2953 19.8581 19.9651 19.4335 20.5529 18.8874L21.3282 19.6628C20.6237 20.3111 19.8228 20.8141 18.9255 21.1718C18.0282 21.5303 17.0828 21.7095 16.0892 21.7095ZM22.2382 17.6664L21.4629 16.891L23.7626 14.5913H15.12V13.4962H23.7626L21.4629 11.1964L22.2382 10.4211L25.8609 14.0437L22.2382 17.6664Z" fill="#85CB33"/>
                    </svg>

                  </div>
                  <div>
                    <h4 className="font-medium">{transaction.title}</h4>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={` ${
                      transaction.status === "debit" || transaction.status === "withdrawal"
                        ? "text-red-500"
                        : transaction.status === "successful" || transaction.status === "deposit"
                          ? "text-primary"
                          : "text-orange-500"
                    }`}
                  >
                    <span>
                      {transaction.status === "debit"
                        ? "debit"
                        : transaction.status === "successful"
                          ? "Successful"
                          : transaction.status === "pending"
                            ? "Pending"
                            : transaction.status === "withdrawal"
                              ? "withdrawal"
                              : "deposit"}
                    </span>
                  </p>
                  <p className="font-medium">₦{transaction.amount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">No {activeTab} found matching the selected filter.</div>
        )}
      </div>

      <AddBankModal isOpen={showAddBankModal} onClose={() => setShowAddBankModal(false)} onAddBank={handleAddBank} />
    </div>
  )
}
