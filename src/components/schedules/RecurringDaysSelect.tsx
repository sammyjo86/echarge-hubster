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
          <div className="flex flex-col space-y-2">
            {daysOfWeek.map((day) => (
              <FormField
                key={day.id}
                control={form.control}
                name="recurringDays"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={day.id}
                      className="flex flex-row items-center space-x-3"
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