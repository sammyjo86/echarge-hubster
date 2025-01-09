import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ScheduleFormValues } from "./ScheduleFormComponent";

interface RecurringTimeSelectProps {
  form: UseFormReturn<ScheduleFormValues>;
}

export function RecurringTimeSelect({ form }: RecurringTimeSelectProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="recurringStartTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Daily Start Time</FormLabel>
            <FormControl>
              <Input 
                type="time" 
                {...field} 
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="recurringEndTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Daily End Time</FormLabel>
            <FormControl>
              <Input 
                type="time" 
                {...field} 
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}