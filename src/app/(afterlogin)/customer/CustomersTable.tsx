"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Download, Import, SlidersHorizontal } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import moment from "moment";

export function TableDemo() {
  const { data } = api.customer.all.useQuery();

  return (
    <>
      <div className="flex items-center gap-2">
        <Input placeholder="Search Customer" />
        <Button variant="ghost">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filter By
        </Button>
        <Button variant="ghost">
          <Import className="mr-2 h-4 w-4" /> <span>Import Data</span>
        </Button>
        <Button variant="ghost">
          <Download className="mr-2 h-4 w-4" /> Export Data
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">S.NO</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>DOB</TableHead>
            <TableHead>Anniversary</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((invoice, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{i + 1}</TableCell>
              <TableCell>{invoice.name}</TableCell>
              <TableCell>
                {invoice.dob && moment(invoice.dob).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell className="text-right">
                {invoice.aniversary &&
                  moment(invoice.aniversary).format("DD/MM/YYYY")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
