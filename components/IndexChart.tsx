"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { SeriesPoint } from "@/lib/index-engine";

export default function IndexChart({ series }: { series: SeriesPoint[] }) {
  // Thin the series a bit for chart performance/readability (weekly points).
  const sampled = series.filter((_, i) => i % 5 === 0 || i === series.length - 1);

  return (
    <ResponsiveContainer width="100%" height={420}>
      <LineChart data={sampled} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#232c42" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: "#8890a6", fontSize: 11, fontFamily: "var(--font-data)" }}
          tickLine={false}
          axisLine={{ stroke: "#232c42" }}
          minTickGap={60}
        />
        <YAxis
          tick={{ fill: "#8890a6", fontSize: 11, fontFamily: "var(--font-data)" }}
          tickLine={false}
          axisLine={false}
          width={50}
        />
        <Tooltip
          contentStyle={{
            background: "#182342",
            border: "1px solid #232c42",
            borderRadius: 6,
            fontFamily: "var(--font-data)",
            fontSize: 12,
          }}
          labelStyle={{ color: "#8890a6" }}
        />
        <Line
          type="monotone"
          dataKey="indexValue"
          name="IND-V"
          stroke="#f0a202"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="benchmarkValue"
          name="Nifty 50"
          stroke="#8890a6"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
