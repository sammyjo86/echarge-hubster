import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ScheduleFormValues } from "../ScheduleFormComponent";

export function StaticPowerConfig({
  form,
}: {
  form: UseFormReturn<ScheduleFormValues>;
}) {
  return (
    <FormField
      control={form.control}
      name="staticPowerValue"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Power Value (kW)</FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder="Enter power value"
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}