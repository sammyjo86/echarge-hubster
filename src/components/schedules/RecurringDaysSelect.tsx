import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ScheduleFormValues } from "./ScheduleFormComponent";

const daysOfWeek = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
] as const;

interface RecurringDaysSelectProps {
  form: UseFormReturn<ScheduleFormValues>;
}

export function RecurringDaysSelect({ form }: RecurringDaysSelectProps) {
  return (
    <FormField
      control={form.control}
      name="recurringDays"
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel>Select Days</FormLabel>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {daysOfWeek.map((day) => (
              <FormField
                key={day.id}
                control={form.control}
                name="recurringDays"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={day.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(day.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value || [], day.id])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== day.id
                                  )
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {day.label}
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