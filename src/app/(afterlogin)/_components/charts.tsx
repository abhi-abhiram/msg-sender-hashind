"use client";

import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { mapColor } from "./overall-review";
import { type Visitings } from "../feedback/feedback-form";

export function Overview({
  data: preData,
}: {
  data?: Record<
    (typeof Visitings)[number],
    Record<"good" | "very_good" | "not_average" | "average", number>
  >;
}) {
  const formatedData =
    preData &&
    Object.entries(preData).map((item) => {
      return {
        name:
          item[0] === "morning"
            ? "Breakfast"
            : item[0] === "afternoon"
              ? "Lunch"
              : item[0] === "evening_snacks"
                ? "Bites"
                : "Dinner",
        veryGood: item[1].very_good,
        good: item[1].good,
        average: item[1].average,
        notAverage: item[1].not_average,
      };
    });
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={formatedData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />

        <Bar
          name="Very Good"
          dataKey="veryGood"
          fill={mapColor.very_good}
          radius={[4, 4, 0, 0]}
        />
        <Bar
          name="Good"
          dataKey="good"
          fill={mapColor.good}
          radius={[4, 4, 0, 0]}
        />
        <Bar
          name="Average"
          dataKey="average"
          fill={mapColor.average}
          radius={[4, 4, 0, 0]}
        />
        <Bar
          name="Not Average"
          dataKey="notAverage"
          fill={mapColor.not_average}
          radius={[4, 4, 0, 0]}
        />
        <Legend verticalAlign="top" />
      </BarChart>
    </ResponsiveContainer>
  );
}
