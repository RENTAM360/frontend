"use client"

import { useState, useEffect } from "react"

interface DatePickerProps {
  onDateChange: (startDate: Date | null, endDate: Date | null) => void
}

export function DatePicker({ onDateChange }: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [showMonthSelector, setShowMonthSelector] = useState(false)
  const [showYearSelector, setShowYearSelector] = useState(false)

  useEffect(() => {
    onDateChange(startDate, endDate)
  }, [startDate, endDate, onDateChange])

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const getPreviousMonthDays = (year: number, month: number) => {
    const firstDay = getFirstDayOfMonth(year, month)
    const prevMonth = month === 0 ? 11 : month - 1
    const prevMonthYear = month === 0 ? year - 1 : year
    const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth)

    const days = []
    for (let i = 0; i < firstDay; i++) {
      days.unshift({
        date: new Date(prevMonthYear, prevMonth, daysInPrevMonth - i),
        isCurrentMonth: false,
      })
    }
    return days
  }

  const getCurrentMonthDays = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month)

    const days = []
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      })
    }
    return days
  }

  const getNextMonthDays = (year: number, month: number, currentDays: number) => {
    const totalCells = 42 // 6 rows of 7 days
    const remainingCells = totalCells - currentDays

    const nextMonth = month === 11 ? 0 : month + 1
    const nextMonthYear = month === 11 ? year + 1 : year

    const days = []
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        date: new Date(nextMonthYear, nextMonth, i),
        isCurrentMonth: false,
      })
    }
    return days
  }

  const getAllDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const prevMonthDays = getPreviousMonthDays(year, month)
    const currentMonthDays = getCurrentMonthDays(year, month)
    const nextMonthDays = getNextMonthDays(year, month, prevMonthDays.length + currentMonthDays.length)

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
  }

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      const prevMonth = new Date(prev)
      prevMonth.setMonth(prev.getMonth() - 1)
      return prevMonth
    })
  }

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      const nextMonth = new Date(prev)
      nextMonth.setMonth(prev.getMonth() + 1)
      return nextMonth
    })
  }

  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date)
      setEndDate(null)
    } else {
      if (date < startDate) {
        setEndDate(startDate)
        setStartDate(date)
      } else {
        setEndDate(date)
      }
    }
  }

  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) return false
    return date > startDate && date < endDate
  }

  const isStartDate = (date: Date) => {
    return startDate && date.toDateString() === startDate.toDateString()
  }

  const isEndDate = (date: Date) => {
    return endDate && date.toDateString() === endDate.toDateString()
  }

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const handleMonthYearClick = () => {
    setShowMonthSelector(true)
    setShowYearSelector(false)
  }

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(monthIndex)
      return newDate
    })
    setShowMonthSelector(false)
    setShowYearSelector(false)
  }

  const handleYearSelect = (year: number) => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      newDate.setFullYear(year)
      return newDate
    })
    setShowYearSelector(false)
  }

  const renderMonthSelector = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

    return (
      <div className="absolute top-16 left-0 right-0 bg-white border rounded-lg shadow-lg z-50 p-2">
        <div className="flex justify-between items-center mb-2 px-2">
          <button
            onClick={() => {
              setShowMonthSelector(false)
              setShowYearSelector(true)
            }}
            className="text-primary font-medium hover:underline"
          >
            {currentMonth.getFullYear()}
          </button>
          <button onClick={() => setShowMonthSelector(false)} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {months.map((month, index) => (
            <button
              key={month}
              onClick={() => handleMonthSelect(index)}
              className={`p-2 rounded-md text-sm ${
                index === currentMonth.getMonth() ? "bg-primary text-white" : "hover:bg-gray-100"
              }`}
            >
              {month}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const renderYearSelector = () => {
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 12 }, (_, i) => currentYear - 5 + i)

    return (
      <div className="absolute top-16 left-0 right-0 bg-white border rounded-lg shadow-lg z-50 p-2">
        <div className="flex justify-between items-center mb-2 px-2">
          <span className="font-medium">Select Year</span>
          <button onClick={() => setShowYearSelector(false)} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => handleYearSelect(year)}
              className={`p-2 rounded-md text-sm ${
                year === currentMonth.getFullYear() ? "bg-primary text-white" : "hover:bg-gray-100"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Helper function to determine if a date is the first date in a week
  const isFirstDayOfWeek = (index: number) => {
    return index % 7 === 0
  }

  // Helper function to determine if a date is the last date in a week
  const isLastDayOfWeek = (index: number) => {
    return index % 7 === 6
  }

  // Helper function to determine range styling
  const getRangeStyle = (date: Date, index: number, days: any[]) => {
    if (!startDate || !endDate) return ""

    const isStart = isStartDate(date)
    const isEnd = isEndDate(date)
    const isRange = isDateInRange(date)

    if (isStart && isEnd) return ""
    if (isStart) return "rounded-l-full bg-green-100 pr-0"
    if (isEnd) return "rounded-r-full bg-green-100 pl-0"
    if (isRange) {
      if (isFirstDayOfWeek(index)) return "rounded-l-full bg-green-100"
      if (isLastDayOfWeek(index)) return "rounded-r-full bg-green-100"
      return "bg-green-100"
    }
    return ""
  }

  const days = getAllDays()
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  return (
    <div className="rounded-lg border p-6 relative">
      <div className="flex justify-between items-center mb-6 relative z-20">
        <button onClick={handleMonthYearClick} className="text-sm font-[600] hover:text-primary">
          {formatMonth(currentMonth)}
        </button>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={handleNextMonth}
            className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Month/Year Selectors with higher z-index */}
      {showMonthSelector && renderMonthSelector()}
      {showYearSelector && renderYearSelector()}

      {/* Calendar Grid with lower z-index */}
      <div className="grid grid-cols-7 gap-1 relative z-10">
        {weekDays.map((day, index) => (
          <div key={`weekday-${index}`} className="text-center text-gray-400 font-medium py-2">
            {day}
          </div>
        ))}

        <div className="col-span-7 grid grid-cols-7">
          {days.map((day, index) => {
            const isStart = isStartDate(day.date)
            const isEnd = isEndDate(day.date)
            // const isRange = isDateInRange(day.date)
            const rangeStyle = getRangeStyle(day.date, index, days)

            return (
              <div key={index} className={`relative  flex items-center justify-center ${rangeStyle}`}>
                <button
                  onClick={() => handleDateClick(day.date)}
                  className={`
                    h-8 w-8 flex items-center justify-center flex-shrink-0 rounded-full text-[12px]
                    ${!day.isCurrentMonth ? "text-gray-300" : ""}
                    ${isStart || isEnd ? "bg-primary text-white" : ""}
                    ${!isStart && !isEnd && day.isCurrentMonth ? "hover:bg-gray-100" : ""}
                  `}
                >
                  {day.date.getDate()}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
