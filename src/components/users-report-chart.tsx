"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const data = [
  { name: "SignUp Users", value: 500 },
  { name: "Active Users", value: 500 },
  { name: "Inactive Users", value: 500 },
]

const COLORS = ["#000000", "#17b266", "#f0f0f0"]

export function UsersReportChart() {
  return (
    <div className="relative w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
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
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Pie
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
      <div className="absolute top-[35%] right-[27%] text-white">
        <span className="text-xs">500k</span>
      </div>
      <div className="absolute bottom-[20%] right-[46%] text-white">
        <span className="text-xs">500k</span>
      </div>
      <div className="absolute top-[35%] left-[27%] text-gray-800">
        <span className="text-xs">500k</span>
      </div>

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-xl font-bold">7,000k</p>
        <p className="text-xs text-gray-500">Total Users</p>
      </div>
    </div>
  )
}
