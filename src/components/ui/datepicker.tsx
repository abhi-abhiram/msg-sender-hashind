"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

type DatePickerProps = {
  className?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  onBlur?: () => void;
  format?: string;
  disabled?: boolean;
};

export function DatePicker({
  className,
  value,
  onChange,
  placeholder,
  onBlur,
  format: dateFormat = "dd/MM/yyyy",
  disabled,
}: DatePickerProps) {
  return (
    <input
      type="date"
      value={value ? format(value, "yyyy-MM-dd") : ""}
      onChange={(e) => {
        const date = e.target.value ? new Date(e.target.value) : undefined;
        onChange?.(date);
      }}
      placeholder={placeholder}
      onBlur={onBlur}
      className={cn(className, "h-10 rounded-md border")}
      disabled={disabled}
    />
  );
}
