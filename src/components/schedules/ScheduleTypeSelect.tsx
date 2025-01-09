import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ScheduleFormValues } from "./types";

const scheduleTypes = [
  { value: "static_power", label: "Static Power" },
  { value: "capacity_limit", label: "Capacity Limit" },
  { value: "parking_prohibited", label: "Parking Prohibited" },
  { value: "energy_price", label: "Energy Price" },
] as const;

export function ScheduleTypeSelect({
  form,
}: {
  form: UseFormReturn<ScheduleFormValues>;
}) {
  return (
    <FormField
      control={form.control}
      name="schedule_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Schedule Type</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a schedule type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {scheduleTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
