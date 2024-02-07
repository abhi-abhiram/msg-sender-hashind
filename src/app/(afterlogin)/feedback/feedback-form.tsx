"use client";
import React from "react";
import { DataTable, scale } from "./feedback-table";
import { Button } from "~/components/ui/button";
import { DatePicker } from "~/components/ui/datepicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { CustomerCombox } from "../_components/customer-combox";
import { Form, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { api } from "~/trpc/react";

export const KPIs = [
  "quality_of_food",
  "cleanliness",
  "quality_of_service",
  "employee_behaviour",
  "speed_of_service",
  "apperance_of_employee",
  "value_of_cash",
] as const;

const feedback_form: {
  id: (typeof KPIs)[number];
  description: string;
  veryGood: boolean;
  good: boolean;
  average: boolean;
  notAverage: boolean;
}[] = [
  {
    id: "quality_of_food",
    description: "Quality of Food",
    veryGood: false,
    good: false,
    average: false,
    notAverage: false,
  },
  {
    id: "cleanliness",
    description: "Cleanliness",
    veryGood: false,
    good: false,
    average: false,
    notAverage: false,
  },
  {
    id: "quality_of_service",
    description: "Quality of Service",
    veryGood: false,
    good: false,
    average: false,
    notAverage: false,
  },
  {
    id: "employee_behaviour",
    description: "Employee behaviour",
    veryGood: false,
    good: false,
    average: false,
    notAverage: false,
  },
  {
    id: "speed_of_service",
    description: "Speed of Service",
    veryGood: false,
    good: false,
    average: false,
    notAverage: false,
  },
  {
    id: "apperance_of_employee",
    description: "Appearance of Employee",
    veryGood: false,
    good: false,
    average: false,
    notAverage: false,
  },
  {
    id: "value_of_cash",
    description: "Value of Cash",
    veryGood: false,
    good: false,
    average: false,
    notAverage: false,
  },
];

const formSchema = z
  .object({
    id: z.string().min(1, { message: "Customer is required" }),
    feedback: z
      .record(z.enum(scale))
      .refine((val) => Object.keys(val).length === feedback_form.length, {
        message: "All fields are required",
      }),
    visitingTime: z.enum(["morning", "afternoon", "evening_snacks", "dinner"], {
      required_error: "Visiting time is required",
    }),
  })
  .refine(
    (data) => Object.keys(data.feedback).length === feedback_form.length,
    {
      message: "All fields are required",
      path: ["feedback"],
    },
  );

export default function FeedbackForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      feedback: {},
      visitingTime: undefined,
    },
  });

  const { mutate } = api.customer.sendFeedbackMsg.useMutation();

  function onSubmit(values: z.infer<typeof formSchema>) {
    const feedback = Object.entries(values.feedback).reduce(
      (acc, [key, value]) => {
        let score: number;

        switch (value) {
          case "veryGood":
            score = 4;
            break;
          case "good":
            score = 3;
            break;
          case "average":
            score = 2;
            break;
          default:
            score = 1;
        }

        acc[key as (typeof KPIs)[number]] = score;
        return acc;
      },
      {} as Record<(typeof KPIs)[number], number>,
    );

    mutate({
      id: values.id,
      feedback,
      visitingTime: values.visitingTime,
    });
  }

  return (
    <Form {...form}>
      <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
        <h3 className="text-lg font-semibold">Add Info</h3>
        <div>
          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                  <CustomerCombox
                    value={field.value}
                    setValue={field.onChange}
                    enableCreate
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="visitingTime"
              render={({ field }) => (
                <FormItem className="w-[250px]">
                  <Select
                    {...field}
                    value={field.value}
                    onValueChange={field.onChange}
                    onOpenChange={field.onBlur}
                  >
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Visting Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Breakfast</SelectItem>
                      <SelectItem value="afternoon">Lunch</SelectItem>
                      <SelectItem value="evening_snacks">
                        Evening Snacks
                      </SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DatePicker placeholder="DOB" className="w-fit" />
            <DatePicker placeholder="Anniversary" className="w-fit" />
          </div>
        </div>
        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <DataTable
                data={feedback_form}
                onRadioChange={(callback) => {
                  const newValues = callback(field.value);
                  field.onChange(newValues);
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-center">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}

export const Visitings = [
  "morning",
  "afternoon",
  "evening_snacks",
  "dinner",
] as const;
