"use client";
import {
  FormSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
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
import { CustomersTable } from "./select-customers-table";
import { Separator } from "~/components/ui/separator";
import { template_data } from "~/templates-data";
import { type RowSelectionState } from "@tanstack/react-table";
import { useMemo } from "react";
import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";

const formSchema = z
  .object({
    celebration: z.string(),
    template: z.string(),
    celebration_name: z.string().optional(),
    rowSelection: z
      .record(z.boolean())
      .refine((data) => Object.keys(data).length > 0, {
        message: "Select atleast one customer",
      }),
  })
  .refine(
    (data) =>
      template_data.find(
        ({ message, type }) => message === data.template && type === "custom",
      ) && data.celebration_name,
    {
      message: "Celebration name is required",
      path: ["celebration_name"],
    },
  );

export default function Celebrate() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      celebration: "",
      template: "",
      celebration_name: "",
      rowSelection: {},
    },
  });

  const { data } = api.customer.all.useQuery();
  const { mutate: sendMessages } = api.customer.send_messages.useMutation();

  const rowSelection = form.watch("rowSelection");

  const customersSelected = useMemo(() => {
    const ids = Object.keys(rowSelection);

    return data?.filter(({ id }) => ids.includes(id)) ?? [];
  }, [data, rowSelection]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    sendMessages({
      messageId: values.template,
      customers: customersSelected.map(({ name, phone_no }) => ({
        name,
        phone_no,
      })),
      celebration_name: values.celebration_name,
    });
  }

  return (
    <div className="grid w-full grid-cols-2 gap-4">
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="template"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select a Template</FormLabel>
                  <FormControl>
                    <FormSelect {...field}>
                      <SelectTrigger>
                        <SelectValue placeholder="Message Template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel className="flex items-center text-muted-foreground">
                            Anniversary{" "}
                            <span className="ml-1 text-xs text-muted-foreground">
                              (with name)
                            </span>
                          </SelectLabel>
                          {template_data
                            .filter((temp) =>
                              "type" in temp
                                ? temp.type === "anniversary"
                                : false,
                            )
                            .map((template) => (
                              <SelectItem
                                value={template.message}
                                key={template.id}
                              >
                                {template.id}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel className="flex items-center text-muted-foreground">
                            Birthday
                            <span className="ml-1 text-xs text-muted-foreground">
                              (with name)
                            </span>
                          </SelectLabel>
                          {template_data
                            .filter((temp) =>
                              "type" in temp ? temp.type === "birthday" : false,
                            )
                            .map((template) => (
                              <SelectItem
                                value={template.message}
                                key={template.id}
                              >
                                {template.id}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel className="flex items-center text-muted-foreground">
                            Custom Celebration
                            <span className="ml-1 text-xs text-muted-foreground">
                              (with name and celebration)
                            </span>
                          </SelectLabel>
                          {template_data
                            .filter((temp) =>
                              "type" in temp ? temp.type === "custom" : false,
                            )
                            .map((template) => (
                              <SelectItem
                                value={template.message}
                                key={template.id}
                              >
                                {template.id}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel className="flex items-center text-muted-foreground">
                            Other
                            <span className="ml-1 text-xs text-muted-foreground">
                              (with name)
                            </span>
                          </SelectLabel>
                          {template_data
                            .filter((temp) => !("type" in temp))
                            .map((template) => (
                              <SelectItem
                                value={template.message}
                                key={template.id}
                              >
                                {template.id}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </FormSelect>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("template") &&
              template_data.find(
                ({ message }) => message === form.watch("template"),
              )?.type === "custom" && (
                <FormField
                  control={form.control}
                  name="celebration_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Celebration Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            <div className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm">
              {form.watch("template") ? (
                template_data.find(
                  ({ message }) => message === form.watch("template"),
                )?.value
              ) : (
                <span className="text-muted-foreground">
                  Select a template to preview
                </span>
              )}
            </div>
            <div className="w-full">
              <FormField
                control={form.control}
                name="rowSelection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Customers</FormLabel>
                    <CustomersTable
                      onRowSelectionChange={(rowSelection) => {
                        const newState = (
                          rowSelection as unknown as (
                            old: RowSelectionState,
                          ) => RowSelectionState
                        )(field.value);
                        field.onChange(newState);
                      }}
                      rowSelection={rowSelection}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center justify-center">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </div>
      <CustomizeTheWishes
        messageId={form.watch("template")}
        name={customersSelected[0]?.name ?? ""}
        celebration={form.watch("celebration_name")}
      />
    </div>
  );
}

function CustomizeTheWishes({
  messageId,
  name,
  celebration,
}: {
  messageId?: string;
  name?: string;
  celebration?: string;
}) {
  const template_message = useMemo(() => {
    if (!messageId) return "";
    const msg_with_name = template_data
      .find(({ message }) => message === messageId)
      ?.value.replace("{#var#}", name ?? "{#var#}")
      .replace("{#var#}", celebration ?? "{#var#}");

    return msg_with_name;
  }, [messageId, name, celebration]);

  return (
    <div>
      <h3 className="text mb-2 text-lg font-semibold">Customize the Wishes</h3>
      <div className="flex flex-1 flex-col rounded-md border border-border">
        <div className="flex items-start p-4">
          <div className="flex items-center gap-4 text-sm">
            <span className="font-semibold">{name ? name : `Ramesh`}</span>
          </div>
        </div>
        <Separator />
        <div className="min-h-[200px] flex-1 whitespace-pre-wrap p-4 text-sm">
          {template_message
            ? template_message
            : `Hi, let have a meeting tomorrow to discuss the project.`}
        </div>
      </div>
      <div className="flex justify-center py-4">
        <Button onClick={(e) => e.preventDefault()} size="sm">
          Send
        </Button>
      </div>
    </div>
  );
}
