"use client";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type RowData,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import React from "react";

export const scale = ["veryGood", "good", "average", "notAverage"] as const;

interface DataTableProps {
  data: FeedBack[];
  setData?: ((callback: (old: FeedBack[]) => FeedBack[]) => void) | undefined;
  onRadioChange?:
    | ((
        callback: (
          old: Record<string, (typeof scale)[number]>,
        ) => Record<string, (typeof scale)[number]>,
      ) => void)
    | undefined;
}

export type FeedBack = {
  id: string;
  description: string;
  veryGood: boolean;
  good: boolean;
  average: boolean;
  notAverage: boolean;
};

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (id: string, columnId: (typeof scale)[number]) => void;
  }
}

const columns: ColumnDef<FeedBack>[] = [
  {
    accessorKey: "description",
    header: "Description",
    id: "description",
  },
  {
    accessorKey: "veryGood",
    header: "Very Good",
    id: "veryGood",
  },
  {
    accessorKey: "good",
    header: "Good",
    id: "good",
  },
  {
    accessorKey: "average",
    header: "Average",
    id: "average",
  },
  {
    accessorKey: "notAverage",
    header: "Not Average",
    id: "notAverage",
  },
];

const defaultColumn: Partial<ColumnDef<FeedBack>> = {
  cell: ({ getValue, row: { id: index }, column: { id }, table }) => {
    if (id === "description") {
      return getValue<string>();
    }

    return (
      <input
        type="radio"
        name={index}
        value={id}
        onChange={() => {
          table.options.meta?.updateData(index, id as (typeof scale)[number]);
        }}
      />
    );
  },
};

export function DataTable({ data, onRadioChange }: DataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn,
    meta: {
      updateData: (id, columnId) => {
        onRadioChange?.((old) => ({ ...old, [id]: columnId }));
      },
    },
    getRowId: (row) => row.id,
  });

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
