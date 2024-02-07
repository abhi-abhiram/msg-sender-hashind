"use client";
import React from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";

export const colors = ["#1A3345", "#86BBD8", "#5D90B1", "#33658A"] as const;

export const mapColor = {
  good: colors[0],
  very_good: colors[1],
  not_average: colors[2],
  average: colors[3],
};

export default function Example({
  values,
}: {
  values?: Record<"good" | "very_good" | "not_average" | "average", number>;
}) {
  const data = React.useMemo(() => {
    if (!values) {
      return [];
    }

    return Object.entries(values).map((v) => {
      return {
        name: v[0],
        value: v[1],
        color: mapColor[v[0] as keyof typeof mapColor],
      };
    });
  }, [values]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          dataKey="value"
          data={data}
          innerRadius={50}
          outerRadius={100}
          fill="currentColor"
          label
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
