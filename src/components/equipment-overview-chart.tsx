"use client";

import { useGetAdminEquipmentChartQuery } from "@/lib/redux/api/adminApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AnimatedLogo } from "./loading-logo";

type CustomizedDotProps = {
  cx?: number;
  cy?: number;
  value?: number;
};

const CustomizedDot = ({ cx = 0, cy = 0, value }: CustomizedDotProps) => {
  if (!cx || !cy) return null;
  return (
    <svg x={cx - 10} y={cy - 10} width={40} height={40} viewBox="0 0 40 40">
      <circle
        cx="10"
        cy="10"
        r="5"
        stroke="black"
        strokeWidth="2"
        fill="white"
      />
      {/* Value Badge */}
      <g transform="translate(0, -25)">
        <rect x="-10" y="0" width="40" height="20" fill="black" rx="4" />
        <text
          x="10"
          y="14"
          fill="white"
          textAnchor="middle"
          fontSize="10"
          fontWeight="bold"
        >
          {value}
        </text>
      </g>
    </svg>
  );
};

export function EquipmentOverviewChart() {
  const { data, isLoading, isError } = useGetAdminEquipmentChartQuery();

  if (isLoading) return <AnimatedLogo />;
  if (isError) return <p className="p-4 text-red-500">Error loading chart</p>;

  // Map API datasets to Recharts format
  const chartData =
    data?.data?.labels.map((label: string, i: number) => ({
      name: label,
      equipment: data.data.datasets[0].data[i],
      bookings: data.data.datasets[1].data[i],
    })) ?? [];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 30, right: 30, left: -20, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorEquipment" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#000000" stopOpacity={0.05} />
            <stop offset="95%" stopColor="#000000" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#17b266" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#17b266" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#f0f0f0"
          vertical={false}
        />

        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#9ca3af", fontSize: 11 }}
          dy={10}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#9ca3af", fontSize: 11 }}
          domain={[0, 100]}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        />

        {/* Paid Bookings - Dashed Green Line */}
        <Line
          name="Paid Bookings"
          type="monotone"
          dataKey="bookings"
          stroke="#17b266"
          strokeWidth={2}
          dot={false}
          strokeDasharray="5 5"
          activeDot={{ r: 6, fill: "#17b266", stroke: "white", strokeWidth: 2 }}
        />

        {/* Equipment Created - Solid Black Line */}
        <Line
          name="Equipment Created"
          type="monotone"
          dataKey="equipment"
          stroke="black"
          strokeWidth={2}
          dot={<CustomizedDot />}
          activeDot={{ r: 6, fill: "black", stroke: "white", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
