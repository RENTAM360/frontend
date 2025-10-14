"use client"

import { useGetAdminEquipmentChartQuery } from "@/lib/redux/api/adminApi"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { AnimatedLogo } from "./loading-logo"

// const data = [
//   { name: "SignUp Users", value: 500 },
//   { name: "Active Users", value: 500 },
//   { name: "Inactive Users", value: 500 },
// ]

const COLORS = ["#17b266", "#000000"]

export function EquipmentReportChart() {
  const { data, isLoading, isError } = useGetAdminEquipmentChartQuery()

   if (isLoading) return <AnimatedLogo />
  if (isError) return <p>Error loading chart</p>

  const latestMonthIndex = (data?.data?.labels?.length ?? 0) - 1
  const datasets = data?.data?.datasets ?? [];
  const chartData = datasets.map((ds) => ({
    name: ds.label,
    value: ds.data?.[latestMonthIndex] ?? 0,
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0)
  const hasOnlyActive = chartData[0]?.value === total;

  // const normalizedData =
  //   total > 0
  //     ? chartData.map((d) => ({
  //         ...d,
  //         percentage: ((d.value / total) * 100).toFixed(1),
  //       }))
  //     : []
  return (
    <div className="relative w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={0}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  hasOnlyActive
                    ? "#17b266"
                    : COLORS[index % COLORS.length]
                }
              />
            ))}
          </Pie>
          <Pie
            dataKey="value"
            data={[{ value: 100 }]}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={60}
            fill="#ffffff"
            stroke="#e0e0e0"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Labels for each segment */}
      {chartData.map((item, i) => (
        <div
          key={i}
          className={`absolute text-xs font-medium ${
            i === 0
              ? "top-[35%] right-[20%] text-white"
              : i === 1
              ? "bottom-[20%] right-[46%] text-white"
              : "top-[35%] left-[27%] text-white"
          }`}
        >
          <span>{item.value}</span>
        </div>
      ))}

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-xl font-bold">{total}</p>
        <p className="text-[10px] text-gray-500">Total</p>
      </div>
    </div>
  )
}
