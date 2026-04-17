"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface FundingChartProps {
  data: Array<{ company: string; amount: string; stage: string; date: string }>;
}

function parseAmount(amount: string): number {
  const num = parseFloat(amount.replace(/[€$£,]/g, "").replace("B", "e9").replace("M", "e6").replace("K", "e3"));
  if (amount.includes("B")) return parseFloat(amount.replace(/[^0-9.]/g, "")) * 1000;
  return parseFloat(amount.replace(/[^0-9.]/g, ""));
}

export default function FundingChart({ data }: FundingChartProps) {
  const chartData = data.map((d) => ({
    name: d.company,
    amount: parseAmount(d.amount),
    label: d.amount,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#64748B" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#64748B" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `€${v}M`}
        />
        <Tooltip
          contentStyle={{
            background: "#fff",
            border: "1px solid #E2E8F0",
            borderRadius: "8px",
            fontSize: 12,
          }}
          formatter={(value: unknown) => [`€${value}M`, "Raised"]}
        />
        <Bar dataKey="amount" fill="#2563EB" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
