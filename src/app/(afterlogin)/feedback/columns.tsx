"use client";

import { type ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  description: string;
  veryGood: boolean;
  good: boolean;
  average: boolean;
  notAverage: boolean;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "veryGood",
    header: "Very Good",
  },
  {
    accessorKey: "good",
    header: "Good",
  },
  {
    accessorKey: "average",
    header: "Average",
  },
  {
    accessorKey: "notAverage",
    header: "Not Average",
  },
];
