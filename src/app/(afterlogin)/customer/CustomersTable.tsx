"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Import,
  SlidersHorizontal,
} from "lucide-react";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  type ColumnDef,
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { DatePicker } from "~/components/ui/datepicker";
import { Label } from "~/components/ui/label";
import React from "react";
import axios from "axios";
import { format } from "date-fns";
import { PaginationEllipsis } from "~/components/ui/pagination";
import { Select } from "~/components/ui/select";
import { SelectTrigger } from "@radix-ui/react-select";

type Customer = {
  id: number;
  first_name: string;
  last_name: string;
  phone_no: string;
  dob: Date;
  anniversary: Date;
  email: string | null;
};

const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "first_name",
    header: "First Name",
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
  },
  {
    accessorKey: "phone_no",
    header: "Phone No",
  },
  {
    accessorKey: "dob",
    header: "DOB",
    cell(props) {
      return format(props.getValue<Date>(), "P");
    },
  },
  {
    accessorKey: "anniversary",
    header: "Anniversary",
    cell: (props) => {
      return format(props.getValue<Date>(), "P");
    },
  },
];

const searchFields = ["first_name", "phone_no", "last_name"];

export function TableDemo() {
  const [dob, setDob] = React.useState<Date | undefined>(undefined);
  const [anniversary, setAnniversary] = React.useState<Date | undefined>(
    undefined,
  );
  const [search, setSearch] = React.useState("");

  const { data } = api.customer.all.useQuery();

  const filteredData = React.useMemo(() => {
    if (!search) {
      return data ?? [];
    }

    return (
      data?.filter((customer) =>
        Object.entries(customer).some((value) => {
          if (searchFields.includes(value[0])) {
            return (value[1] as string)
              .toLowerCase()
              .includes(search.toLowerCase());
          }
        }),
      ) ?? []
    );
  }, [data, search]);

  return (
    <>
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search Customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filter By
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Filters</h4>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label htmlFor="dob">DOB</Label>
                  <DatePicker
                    className="w-full"
                    value={dob}
                    onChange={setDob}
                    placeholder="DOB"
                    format="P"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="anniverysary">Anniversary</Label>
                  <DatePicker
                    className="w-full"
                    value={anniversary}
                    onChange={setAnniversary}
                    placeholder="Anniversary"
                    format="P"
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <ImportCustomerData />
        <Button variant="ghost">
          <Download className="mr-2 h-4 w-4" /> Export Data
        </Button>
      </div>
      <CustomerTable data={filteredData} />
    </>
  );
}

function CustomerTable({ data }: { data: Customer[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id.toString(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
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
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="mt-4 flex items-center justify-end gap-4">
        <span className="flex items-center gap-1 text-sm">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span>
              <ChevronRight />
            </span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </>
  );
}

function ImportCustomerData() {
  const [file, setFile] = React.useState<File | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      axios
        .post("/api/upload/customers", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          setFile(null);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [file]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost">
          <Import className="mr-2 h-4 w-4" /> <span>Import Data</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-4">
          <a
            href="/customer-template.xlsx"
            download
            className={buttonVariants({
              variant: "ghost",
            })}
          >
            Download Template
          </a>
          <Button
            variant="ghost"
            onClick={() => {
              inputRef.current?.click();
            }}
          >
            Upload File
          </Button>
        </div>

        <Input
          type="file"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files[0]!);
            }
          }}
          ref={inputRef}
          accept=".xls, .xlsx"
        />
      </PopoverContent>
    </Popover>
  );
}
