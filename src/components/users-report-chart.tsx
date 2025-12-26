"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { AnimatedLogo } from "./loading-logo";
import { useGetAdminUserChartQuery } from "@/lib/redux/api/adminApi";

export function UserReportPieChart() {
  const { data, isLoading, isError } = useGetAdminUserChartQuery();
  // State to track which month index we are looking at
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number | null>(
    null
  );

  if (isLoading) return <AnimatedLogo />;
  if (isError)
    return (
      <p className="text-sm text-red-500 text-center">Error loading chart</p>
    );

  const rawData = data?.data?.chartData || [];

  // Set default to the latest month if no month is selected yet
  const currentIndex =
    selectedMonthIndex !== null ? selectedMonthIndex : rawData.length - 1;
  const selectedData = rawData[currentIndex];

  const chartData = [
    { name: selectedData?.month, value: selectedData?.count || 0 },
  ];

  return (
    <div className="flex flex-col w-full h-full">
      {/* Month Selector Dropdown */}
      <div className="flex justify-end mb-4">
        <select
          className="text-[11px] border rounded-md px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-green-500"
          value={currentIndex}
          onChange={(e) => setSelectedMonthIndex(parseInt(e.target.value))}
        >
          {rawData.map((item, index) => (
            <option key={item.month} value={index}>
              {item.month}
            </option>
          ))}
        </select>
      </div>

      <div className="relative flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              <Cell fill="#17b266" />
            </Pie>
            <Pie
              dataKey="value"
              data={[{ value: 1 }]}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={65}
              fill="#f3f4f6"
              stroke="none"
              isAnimationActive={false}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-3xl font-bold text-gray-900">
            {selectedData?.count || 0}
          </p>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
            Users Created
          </p>
        </div>
      </div>
    </div>
  );
}
