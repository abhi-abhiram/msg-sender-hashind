"use client";
import { DatePicker } from "~/components/ui/datepicker";
import { Input } from "~/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { api } from "~/trpc/react";
import { CustomerCombox } from "../_components/customer-combox";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { cn } from "~/lib/utils";
import { useToast } from "~/components/ui/use-toast";

const formSchema = z.object({
  first_name: z.string().min(3, {
    message: "First name must be atleast 3 characters long",
  }),
  last_name: z.string().min(3, {
    message: "Last name must be atleast 3 characters long",
  }),
  email: z.string().email().optional(),
  dob: z.date(),
  anniversary: z.date(),
  phone_no: z
    .string()
    .min(10, {
      message: "Phone number must be 10 characters long",
    })
    .max(10, {
      message: "Phone number must be 10 characters long",
    }),
  id: z.number(),
});

export default function EditCustomerForm() {
  const [customerId, setCustomerId] = React.useState<string>("");
  const { data } = api.customer.all.useQuery();

  const customer = React.useMemo(
    () => data?.find((c) => c.id.toString() === customerId),
    [customerId, data],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Edit Customer</CardTitle>
        <CustomerCombox value={customerId} setValue={setCustomerId} />
      </CardHeader>
      <CustomerForm customer={customer} key={customer?.id} />
    </Card>
  );
}

type CustomerEdit = {
  first_name: string;
  last_name: string;
  email: string | null;
  dob: Date;
  phone_no: string;
  anniversary: Date;
  id: number;
  created_at: Date | null;
};

function CustomerForm({ customer }: { customer?: CustomerEdit }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: customer?.first_name ?? undefined,
      last_name: customer?.last_name ?? undefined,
      email: customer?.email ?? undefined,
      anniversary: customer?.anniversary ?? undefined,
      dob: customer?.dob ?? undefined,
      phone_no: customer?.phone_no,
      id: customer?.id,
    },
  });

  const { toast } = useToast();

  const queryUtils = api.useUtils();

  const { isLoading, mutate } = api.customer.edit.useMutation({
    onSuccess: () => {
      void queryUtils.customer.all.invalidate();
      toast({
        description: "Customer updated successfully",
      });
    },
    onError: () => {
      toast({
        description: "Failed to update customer",
        variant: "destructive",
      });
    },
  });

  const { mutate: deleteCustomer } = api.customer.delete.useMutation({
    onSuccess: () => {
      void queryUtils.customer.all.invalidate();
      toast({
        description: "Customer deleted successfully",
      });
    },
    onError: () => {
      toast({
        description: "Failed to delete customer",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-2">
          <CardTitle className="text-lg">Search Result</CardTitle>
          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="First Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="Last Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone_no"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="1234567890" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl className="w-full">
                    <DatePicker
                      placeholder="Date of birth"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="anniversary"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl className="w-full">
                    <DatePicker
                      placeholder="Anniversary"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
        <CardFooter className=" flex justify-center gap-4">
          <Button className="w-full" type="submit">
            Save Changes
          </Button>
          <AlertDialog>
            <AlertDialogTrigger
              className={cn(
                buttonVariants({ variant: "destructive" }),
                "w-full",
              )}
            >
              Delete Customer
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  customer details.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: "destructive" })}
                  onClick={() => {
                    customer?.id && deleteCustomer({ id: customer.id });
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </form>
    </Form>
  );
}
