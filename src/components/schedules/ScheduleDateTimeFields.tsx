import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ScheduleFormValues } from "./types";

export function ScheduleDateTimeFields({
  form,
}: {
  form: UseFormReturn<ScheduleFormValues>;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="start"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Start Date & Time</FormLabel>
            <FormControl>
              <Input 
                type="datetime-local" 
                {...field}
                value={field.value ? field.value.toISOString().slice(0, 16) : ''}
                onChange={(e) => field.onChange(new Date(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="end"
        render={({ field }) => (
          <FormItem>
            <FormLabel>End Date & Time</FormLabel>
            <FormControl>
              <Input 
                type="datetime-local" 
                {...field}
                value={field.value ? field.value.toISOString().slice(0, 16) : ''}
                onChange={(e) => field.onChange(new Date(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
