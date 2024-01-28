import { Check, Download, Import, SlidersHorizontal } from "lucide-react";
import { ComboboxDemo } from "~/components/ui/Combobox";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { DatePicker } from "~/components/ui/datepicker";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { TableDemo } from "./CustomersTable";

export default function CustomerPage() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Input placeholder="Name" />
                <Input placeholder="Email" />
                <div className="flex justify-center gap-2">
                  <DatePicker placeholder="Date of Birth" />
                  <DatePicker placeholder="Anniversary" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Check className="mr-2 h-4 w-4" /> Add Customer
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Edit Customer</CardTitle>
              <ComboboxDemo />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg">Search Result</CardTitle>
              <div className="space-y-2">
                <Input placeholder="Name" />
                <Input placeholder="Email" />
                <div className="flex justify-center gap-2">
                  <DatePicker placeholder="Date of Birth" />
                  <DatePicker placeholder="Anniversary" />
                </div>
              </div>
            </CardContent>
            <CardFooter className=" flex justify-center gap-4">
              <Button className="w-full">
                <Check className="mr-2 h-4 w-4" /> Add Customer
              </Button>
              <Button className="w-full" variant="destructive">
                <Check className="mr-2 h-4 w-4" /> Delete Customer
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div>
          <div className="p-4">
            <h3 className="text-lg">Customer List</h3>
          </div>
          <Separator />
          <div className="py-4">
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
            <TableDemo />
          </div>
        </div>
      </div>
    </div>
  );
}
