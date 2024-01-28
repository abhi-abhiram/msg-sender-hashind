"use client";
import React from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";

const data02 = [
  { name: "Group A", value: 2400 },
  { name: "Group B", value: 4567 },
  { name: "Group C", value: 1398 },
  { name: "Group D", value: 9800 },
  { name: "Group E", value: 3908 },
  { name: "Group F", value: 4800 },
];

export default function Example() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          dataKey="value"
          data={data02}
          innerRadius={50}
          outerRadius={100}
          fill="currentColor"
          className="fill-primary"
          label
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
