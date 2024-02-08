import { Separator } from "~/components/ui/separator";
import { TableDemo } from "./CustomersTable";
import AddCustomerForm from "./add-customer-form";
import EditCustomerForm from "./edit-customer-form";

export default async function CustomerPage() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-2 space-y-2">
          <AddCustomerForm />
          <EditCustomerForm />
        </div>
        <div className="col-span-3">
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
