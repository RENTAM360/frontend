"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

const data = [
  { name: "JAN", newUsers: 10, oldUsers: 5 },
  { name: "FEB", newUsers: 15, oldUsers: 8 },
  { name: "MAR", newUsers: 25, oldUsers: 15 },
  { name: "APR", newUsers: 55, oldUsers: 35 },
  { name: "MAY", newUsers: 65, oldUsers: 45 },
  { name: "JUN", newUsers: 75, oldUsers: 55, highlight: true },
  { name: "JUL", newUsers: 60, oldUsers: 60 },
  { name: "AUG", newUsers: 40, oldUsers: 60 },
  { name: "SEP", newUsers: 30, oldUsers: 55 },
  { name: "OCT", newUsers: 35, oldUsers: 53 },
  { name: "NOV", newUsers: 45, oldUsers: 58 },
  { name: "DEC", newUsers: 55, oldUsers: 65 },
]

// Define proper types for the dot props
type CustomizedDotProps = {
  cx?: number
  cy?: number
  payload?: {
    highlight?: boolean
    name?: string
  }
  value?: number
}

const CustomizedDot = (props: CustomizedDotProps) => {
  const { cx = 0, cy = 0, payload } = props

  // Return early if we don't have the required properties
  if (!cx || !cy || !payload) {
    return null
  }

  return (
    <svg x={cx - 10} y={cy - 10} width={20} height={20} fill="white" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="6" stroke="black" strokeWidth="2" fill="white" />
      {payload.highlight && (
        <g>
          <rect x="-25" y="-45" width="60" height="30" fill="black" rx="4" />
          <text x="5" y="-25" fill="white" textAnchor="middle" dominantBaseline="middle" fontSize="12">
            100k
          </text>
        </g>
      )}
    </svg>
  )
}

export function UsersOverviewChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#999", fontSize: 10 }} dy={5} />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#999", fontSize: 10 }}
          domain={[0, 100]}
          ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
          width={25}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #f0f0f0",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
          formatter={(value) => [`${value}k`, ""]}
        />

        {/* Reference line for June */}
        <ReferenceLine x="JUN" stroke="#ddd" strokeDasharray="3 3" />

        {/* Dashed green line for Old Users */}
        <Line
          type="monotone"
          dataKey="oldUsers"
          stroke="#17b266"
          strokeWidth={2}
          dot={false}
          strokeDasharray="5 5"
          activeDot={{ r: 8, fill: "#17b266", stroke: "white", strokeWidth: 2 }}
          fillOpacity={0.2}
          fill="url(#colorOldUsers)"
        />

        {/* Solid black line for New Users */}
        <Line
          type="monotone"
          dataKey="newUsers"
          stroke="black"
          strokeWidth={2}
          dot={<CustomizedDot />}
          activeDot={{ r: 8, fill: "black", stroke: "white", strokeWidth: 2 }}
          fillOpacity={0.1}
          fill="url(#colorNewUsers)"
        />

        {/* Gradient fills for area under the lines */}
        <defs>
          <linearGradient id="colorNewUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f0f0f0" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#f0f0f0" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorOldUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#17b266" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#17b266" stopOpacity={0} />
          </linearGradient>
        </defs>
      </LineChart>
    </ResponsiveContainer>
  )
}
