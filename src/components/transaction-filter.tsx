import React, { useState, useRef, useEffect } from "react"

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
}

export const TransactionsFilter: React.FC<TransactionsFilterProps> = ({ onApply, onClear, initial }) => {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<FilterMode>(initial?.mode ?? "none")
  const [startDate, setStartDate] = useState(initial?.startDate ?? "")
  const [endDate, setEndDate] = useState(initial?.endDate ?? "")
  const [minAmount, setMinAmount] = useState<string>(initial?.minAmount?.toString() ?? "")
  const [maxAmount, setMaxAmount] = useState<string>(initial?.maxAmount?.toString() ?? "")
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

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
        className="px-3 py-2 border rounded-md bg-white hover:bg-gray-50 flex items-center gap-2"
        aria-expanded={open}
      >
        <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none"><path d="M3 5h18M8 5v14M16 5v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Filter
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg z-50 p-4">
          <div className="mb-3">
            <label className="block text-xs text-gray-500 mb-2">Filter By</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode("date")}
                className={`flex-1 px-2 py-1 rounded-md text-sm ${mode === "date" ? "bg-primary text-white" : "bg-gray-100"}`}
              >
                Date
              </button>
              <button
                type="button"
                onClick={() => setMode("amount")}
                className={`flex-1 px-2 py-1 rounded-md text-sm ${mode === "amount" ? "bg-primary text-white" : "bg-gray-100"}`}
              >
                Amount
              </button>
            </div>
          </div>

          {mode === "date" && (
            <div className="space-y-2 mb-3">
              <label className="text-xs text-gray-500">Start From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border rounded-md px-2 py-2 text-sm"
              />
              <label className="text-xs text-gray-500">End</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border rounded-md px-2 py-2 text-sm"
              />
            </div>
          )}

          {mode === "amount" && (
            <div className="space-y-2 mb-3">
              <label className="text-xs text-gray-500">Min Amount</label>
              <input
                type="number"
                min={0}
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="w-full border rounded-md px-2 py-2 text-sm"
                placeholder="0"
              />
              <label className="text-xs text-gray-500">Max Amount</label>
              <input
                type="number"
                min={0}
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className="w-full border rounded-md px-2 py-2 text-sm"
                placeholder="0"
              />
            </div>
          )}

          <div className="flex justify-between gap-2">
            <button type="button" onClick={handleClear} className="px-3 py-2 text-sm rounded-md bg-gray-100">
              Clear
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-3 py-2 text-sm rounded-md bg-primary text-white"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TransactionsFilter;