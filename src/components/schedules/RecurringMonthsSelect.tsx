import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ScheduleFormValues } from "./types";

const months = [
  { id: "january", label: "January" },
  { id: "february", label: "February" },
  { id: "march", label: "March" },
  { id: "april", label: "April" },
  { id: "may", label: "May" },
  { id: "june", label: "June" },
  { id: "july", label: "July" },
  { id: "august", label: "August" },
  { id: "september", label: "September" },
  { id: "october", label: "October" },
  { id: "november", label: "November" },
  { id: "december", label: "December" },
] as const;

interface RecurringMonthsSelectProps {
  form: UseFormReturn<ScheduleFormValues>;
}

export function RecurringMonthsSelect({ form }: RecurringMonthsSelectProps) {
  return (
    <FormField
      control={form.control}
      name="recurringMonths"
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel>Select Months</FormLabel>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {months.map((month) => (
              <FormField
                key={month.id}
                control={form.control}
                name="recurringMonths"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={month.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(month.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value || [], month.id])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== month.id
                                  )
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {month.label}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
        </FormItem>
      )}
    />
  );
}
