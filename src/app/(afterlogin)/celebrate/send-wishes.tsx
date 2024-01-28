"use client";
import {
  FormSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { CustomersTable } from "./select-customers-table";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";

const formSchema = z.object({
  celebration: z.string(),
  template: z.string(),
  customers: z.record(z.boolean()),
});

export default function Celebrate() {
  return (
    <div className="grid w-full grid-cols-2 gap-4">
      <div>
        <CelebrateForm />
      </div>
      <div>
        <h3 className="text mb-2 text-lg font-semibold">
          Customize the Wishes
        </h3>
        <div className="flex flex-1 flex-col rounded-md border border-border">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <Avatar>
                <AvatarImage alt="William Smith" />
                <AvatarFallback>WS</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">William Smith</div>
                <div className="line-clamp-1 text-xs">Meeting Tomorrow</div>
                <div className="line-clamp-1 text-xs">
                  <span className="font-medium">Reply-To:</span>{" "}
                  williamsmith@example.com
                </div>
              </div>
            </div>
          </div>
          <Separator />
          <div className="min-h-[200px] flex-1 whitespace-pre-wrap p-4 text-sm">
            Hi, let have a meeting tomorrow to discuss the project.
          </div>
        </div>
        <div className="flex justify-center py-4">
          <Button onClick={(e) => e.preventDefault()} size="sm">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

function CelebrateForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      celebration: "",
      template: "",
      customers: {},
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="celebration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select a Celebration</FormLabel>
              <FormControl>
                <FormSelect {...field}>
                  <SelectTrigger>
                    <SelectValue placeholder="Visiting time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </FormSelect>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="template"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select a Template</FormLabel>
              <FormControl>
                <FormSelect {...field}>
                  <SelectTrigger>
                    <SelectValue placeholder="Visiting time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </FormSelect>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Textarea placeholder="Template Message here" />
        <div className="w-full">
          <CustomersTable
            data={[
              {
                id: "1",
                name: "John Doe",
              },
              {
                id: "2",
                name: "John Doe",
              },
            ]}
            onRowSelectionChange={(rows) => {
              form.setValue("customers", rows);
            }}
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
