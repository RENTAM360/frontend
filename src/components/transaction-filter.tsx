import React, { useState, useRef, useEffect, useMemo } from "react"

const FilterIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z" fill="#97A2AC"/>
    <path d="M15.5781 19.2501C15.1681 19.2501 14.8281 18.9101 14.8281 18.5001V14.6001C14.8281 14.1901 15.1681 13.8501 15.5781 13.8501C15.9881 13.8501 16.3281 14.1901 16.3281 14.6001V18.5001C16.3281 18.9101 15.9881 19.2501 15.5781 19.2501Z" fill="#97A2AC"/>
    <path d="M15.5781 8.2C15.1681 8.2 14.8281 7.86 14.8281 7.45V5.5C14.8281 5.09 15.1681 4.75 15.5781 4.75C15.9881 4.75 16.3281 5.09 16.3281 5.5V7.45C16.3281 7.86 15.9881 8.2 15.5781 8.2Z" fill="#97A2AC"/>
    <path d="M15.5766 13.4C13.7266 13.4 12.2266 11.9 12.2266 10.05C12.2266 8.19995 13.7266 6.69995 15.5766 6.69995C17.4266 6.69995 18.9266 8.19995 18.9266 10.05C18.9266 11.9 17.4166 13.4 15.5766 13.4ZM15.5766 8.19995C14.5566 8.19995 13.7266 9.02995 13.7266 10.05C13.7266 11.07 14.5566 11.9 15.5766 11.9C16.5966 11.9 17.4266 11.07 17.4266 10.05C17.4266 9.02995 16.5866 8.19995 15.5766 8.19995Z" fill="#97A2AC"/>
    <path d="M8.42188 19.25C8.01188 19.25 7.67188 18.91 7.67188 18.5V16.55C7.67188 16.14 8.01188 15.8 8.42188 15.8C8.83187 15.8 9.17188 16.14 9.17188 16.55V18.5C9.17188 18.91 8.84187 19.25 8.42188 19.25Z" fill="#97A2AC"/>
    <path d="M8.42188 10.15C8.01188 10.15 7.67188 9.81 7.67188 9.4V5.5C7.67188 5.09 8.01188 4.75 8.42188 4.75C8.83187 4.75 9.17188 5.09 9.17188 5.5V9.4C9.17188 9.81 8.84187 10.15 8.42188 10.15Z" fill="#97A2AC"/>
    <path d="M8.42031 17.3001C6.57031 17.3001 5.07031 15.8001 5.07031 13.9501C5.07031 12.1001 6.57031 10.6001 8.42031 10.6001C10.2703 10.6001 11.7703 12.1001 11.7703 13.9501C11.7703 15.8001 10.2703 17.3001 8.42031 17.3001ZM8.42031 12.1001C7.40031 12.1001 6.57031 12.9301 6.57031 13.9501C6.57031 14.9701 7.40031 15.8001 8.42031 15.8001C9.44031 15.8001 10.2703 14.9701 10.2703 13.9501C10.2703 12.9301 9.45031 12.1001 8.42031 12.1001Z" fill="#97A2AC"/>
  </svg>

)

type FilterMode = "none" | "date" | "amount"

export interface TransactionsFilterValue {
  mode: FilterMode
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
}

interface TransactionsFilterProps {
  onApply: (value: TransactionsFilterValue) => void
  onClear?: () => void
  initial?: TransactionsFilterValue
  triggerClassName?: string
}

export const TransactionsFilter: React.FC<TransactionsFilterProps> = ({
  onApply,
  onClear,
  initial,
  triggerClassName,
}) => {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<FilterMode>(initial?.mode ?? "none")
  const [startDate, setStartDate] = useState(initial?.startDate ?? "")
  const [endDate, setEndDate] = useState(initial?.endDate ?? "")
  const [minAmount, setMinAmount] = useState<string>(initial?.minAmount?.toString() ?? "")
  const [maxAmount, setMaxAmount] = useState<string>(initial?.maxAmount?.toString() ?? "")
  const [expandedSection, setExpandedSection] = useState<FilterMode>(initial?.mode ?? "none")
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  const headerLabel = useMemo(() => {
    if (expandedSection === "date") return "Date"
    if (expandedSection === "amount") return "Amount"
    return "Filter"
  }, [expandedSection])

  const hasActiveFilter = useMemo(() => {
    if (mode === "date") return Boolean(startDate || endDate)
    if (mode === "amount") return Boolean(minAmount || maxAmount)
    return false
  }, [mode, startDate, endDate, minAmount, maxAmount])

  function toggleSection(section: FilterMode) {
    if (section === "none") {
      setExpandedSection("none")
      setMode("none")
      return
    }

    setExpandedSection((prev) => {
      if (prev === section) {
        setMode("none")
        return "none"
      }

      setMode(section)
      return section
    })
  }

  function handleApply() {
    const payload: TransactionsFilterValue = { mode }
    if (mode === "date") {
      payload.startDate = startDate || undefined
      payload.endDate = endDate || undefined
    }
    if (mode === "amount") {
      payload.minAmount = minAmount ? Number(minAmount) : undefined
      payload.maxAmount = maxAmount ? Number(maxAmount) : undefined
    }
    onApply(payload)
    setOpen(false)
  }

  function handleClear() {
    setExpandedSection("none")
    setMode("none")
    setStartDate("")
    setEndDate("")
    setMinAmount("")
    setMaxAmount("")
    onClear?.()
    setOpen(false)
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className={`flex h-10 w-10 items-center justify-center rounded-full border border-transparent transition-colors ${
          open ? "bg-primary/10 text-primary" : hasActiveFilter ? "bg-primary/10 text-primary" : "text-gray-500"
        } ${triggerClassName ?? ""}`}
        aria-expanded={open}
      >
        <FilterIcon />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-[#E4E7EC] bg-white shadow-xl z-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-[#1F2937]">{headerLabel}</span>
            <button
              type="button"
              onClick={() => {
                toggleSection("none")
              }}
              className="text-xs text-[#636C78] hover:text-[#111827]"
            >
              Close
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <button
                type="button"
                onClick={() => toggleSection("date")}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                  expandedSection === "date" ? "border-primary bg-primary/10 text-primary" : "border-[#E4E7EC]"
                }`}
              >
                <span>Date</span>
                <span className="text-xs">{expandedSection === "date" ? "Hide" : "Select"}</span>
              </button>
              {expandedSection === "date" && (
                <div className="mt-3 space-y-3 rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] p-4">
                  <div className="space-y-1">
                    <label className="text-xs text-[#636C78]">Start from</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-lg border border-[#D0D5DD] px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[#636C78]">End</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full rounded-lg border border-[#D0D5DD] px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApply}
                    className="mt-1 w-full rounded-full bg-primary py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
                  >
                    Confirm
                  </button>
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => toggleSection("amount")}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                  expandedSection === "amount" ? "border-primary bg-primary/10 text-primary" : "border-[#E4E7EC]"
                }`}
              >
                <span>Amount</span>
                <span className="text-xs">{expandedSection === "amount" ? "Hide" : "Select"}</span>
              </button>
              {expandedSection === "amount" && (
                <div className="mt-3 space-y-3 rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] p-4">
                  <div className="space-y-1">
                    <label className="text-xs text-[#636C78]">Start from</label>
                    <div className="flex items-center rounded-lg border border-[#D0D5DD] px-3 py-2">
                      <span className="text-sm text-[#98A2B3] mr-2">₦</span>
                      <input
                        type="number"
                        min={0}
                        value={minAmount}
                        onChange={(e) => setMinAmount(e.target.value)}
                        className="w-full bg-transparent text-sm outline-none"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[#636C78]">End</label>
                    <div className="flex items-center rounded-lg border border-[#D0D5DD] px-3 py-2">
                      <span className="text-sm text-[#98A2B3] mr-2">₦</span>
                      <input
                        type="number"
                        min={0}
                        value={maxAmount}
                        onChange={(e) => setMaxAmount(e.target.value)}
                        className="w-full bg-transparent text-sm outline-none"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleApply}
                    className="mt-1 w-full rounded-full bg-primary py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
                  >
                    Confirm
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleClear}
              className="font-medium text-[#636C78] hover:text-[#111827] transition-colors"
            >
              Clear filter
            </button>
            <span className="text-[#98A2B3]">
              {mode !== "none" && hasActiveFilter ? "Filter applied" : "No filter applied"}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default TransactionsFilter;