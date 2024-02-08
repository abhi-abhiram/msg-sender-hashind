"use client";
import { DatePicker } from "~/components/ui/datepicker";
import { Input } from "~/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UseFormReturn, useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { api } from "~/trpc/react";
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
});

export default function AddCustomerForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      dob: undefined,
      anniversary: undefined,
      phone_no: "",
      email: undefined,
    },
  });
  const queryUtils = api.useUtils();

  const { toast } = useToast();

  const { isLoading, mutate } = api.customer.create.useMutation({
    onSuccess: () => {
      void queryUtils.customer.all.invalidate();
      toast({
        description: "Customer added successfully",
      });
    },
    onError: () => {
      toast({
        description: "Failed to add customer",
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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Customer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <CreateCustomerFormInputs form={form} />
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Customer
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

export function CreateCustomerFormInputs({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) {
  return (
    <>
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
                  format="P"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
