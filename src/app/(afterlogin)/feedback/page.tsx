import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import { DatePicker } from "~/components/ui/datepicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { DataTable } from "./feedback-table";
import { columns, type Payment } from "./columns";
import { Button } from "~/components/ui/button";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      description: "Quality of Food",
      veryGood: true,
      good: false,
      average: false,
      notAverage: false,
    },
    {
      description: "Cleanliness",
      veryGood: true,
      good: false,
      average: false,
      notAverage: false,
    },
  ];
}

export default async function FeedbackPage() {
  const data = await getData();

  return (
    <div className="p-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Add Info</h3>
        <div className="relative w-1/2">
          <Input placeholder="Enter address" className="pr-8" />
          <button className="absolute right-3 top-0 flex h-full items-center">
            <Search className="h-4 w-4" />
          </button>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Input placeholder="Search Customer" />
            <DatePicker placeholder="DOB" className="w-fit" />
            <DatePicker placeholder="Anniversary" className="w-fit" />
            <div className="w-[200px] max-w-[200px]">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Visiting time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div>
          <DataTable columns={columns} data={data} />
        </div>
        <div className="flex items-center justify-center">
          <Button>Submit</Button>
        </div>
      </div>
    </div>
  );
}
