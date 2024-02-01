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
import AddCustomerForm from "./add-customer-form";

export default async function CustomerPage() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <AddCustomerForm />
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
            <TableDemo />
          </div>
        </div>
      </div>
    </div>
  );
}
