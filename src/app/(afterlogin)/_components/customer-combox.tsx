"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { api } from "~/trpc/react";
import { Separator } from "~/components/ui/separator";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { DatePicker } from "~/components/ui/datepicker";

const formSchema = z.object({
  first_name: z.string().min(3, {
    message: "First name must be atleast 3 characters long",
  }),
  last_name: z.string().min(3, {
    message: "Last name must be atleast 3 characters long",
  }),
  email: z.string().optional(),
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

type ComboboxProps = {
  placeholder?: string;
  value?: string;
  setValue?: (value: string) => void;
  className?: string;
  enableCreate?: boolean;
};

const searchFields = ["first_name", "phone_no", "last_name"];

export function CustomerCombox({
  value,
  setValue,
  enableCreate,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [width, setWidth] = React.useState(0);
  const captureWidth = React.useCallback(() => {
    if (buttonRef.current) {
      setWidth(buttonRef.current.getBoundingClientRect().width);
    }
  }, []);
  const [search, setSearch] = React.useState("");

  const { data } = api.customer.all.useQuery();

  React.useEffect(() => {
    window.addEventListener("resize", captureWidth);

    if (buttonRef.current) {
      setWidth(buttonRef.current.getBoundingClientRect().width);
    }

    return () => {
      window.removeEventListener("resize", captureWidth);
    };
  }, [captureWidth]);

  const filteredData = React.useMemo(() => {
    if (!search) {
      return data;
    }

    return data?.filter((customer) =>
      Object.entries(customer).some((value) => {
        if (searchFields.includes(value[0])) {
          return (value[1] as string)
            .toLowerCase()
            .includes(search.toLowerCase());
        }
      }),
    );
  }, [data, search]);

  const details = React.useMemo(() => {
    if (!value) {
      return null;
    }

    return data?.find((customer) => customer.id.toString() === value);
  }, [data, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          ref={buttonRef}
        >
          {details ? details.first_name : "Select Customer"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ width }}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search framework..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandEmpty className="w-full">
            <div>
              <div>
                <p className="py text-center text-sm text-muted-foreground">
                  No results found
                </p>
              </div>
              <Separator />
              {enableCreate && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full">
                      Add new customer
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>New Customer</DialogTitle>
                      <DialogDescription>
                        Add a new customer to the database
                      </DialogDescription>
                    </DialogHeader>
                    <CreateCustomerForm
                      onSuccess={(id) => setValue?.(id.toString())}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CommandEmpty>
          <CommandGroup className="max-h-72 overflow-auto">
            {filteredData?.map((customer) => (
              <CommandItem
                key={customer.id}
                value={customer.id.toString()}
                onSelect={(currentValue) => {
                  setValue?.(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === customer.id.toString()
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
                <span className="capitalize">{customer.first_name}</span> (
                {customer.phone_no})
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function CreateCustomerForm({
  onSuccess,
}: {
  onSuccess?: (id: number) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: undefined,
      dob: undefined,
      anniversary: undefined,
      phone_no: "",
    },
  });
  const queryUtils = api.useUtils();

  const closeRef = React.useRef<HTMLButtonElement>(null);

  const { isLoading, mutate } = api.customer.create.useMutation({
    onSuccess: (id) => {
      void queryUtils.customer.all.invalidate();
      onSuccess?.(id);
      closeRef.current?.click();
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-2 py-4">
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
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <div className="grid grid-cols-4 items-center">
                <div className="col-span-4">
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              </div>
            )}
          />

          <FormField
            control={form.control}
            name="phone_no"
            render={({ field }) => (
              <div className="grid grid-cols-4 items-center">
                <div className="col-span-4">
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="1234567890" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              </div>
            )}
          />

          <div className="grid grid-cols-4 items-center">
            <div className="col-span-4 flex justify-center gap-2">
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <DatePicker
                    placeholder="Date of birth"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="anniversary"
                render={({ field }) => (
                  <DatePicker
                    placeholder="Anniversary"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </form>
      <DialogClose className="hidden" ref={closeRef}></DialogClose>
    </Form>
  );
}
