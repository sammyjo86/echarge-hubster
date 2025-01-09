import { FormField, FormItem } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { ScheduleFormValues } from "./ScheduleFormComponent";

interface RecurringSectionProps {
  form: UseFormReturn<ScheduleFormValues>;
  title: string;
  description: string;
  fieldName: "useDays" | "useMonths" | "useHours";
  children: React.ReactNode;
}

export function RecurringSection({
  form,
  title,
  description,
  fieldName,
  children,
}: RecurringSectionProps) {
  const isEnabled = form.watch(fieldName);

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <FormField
        control={form.control}
        name={fieldName}
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-base font-medium">{title}</div>
              <div className="text-sm text-muted-foreground">
                {description}
              </div>
            </div>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormItem>
        )}
      />
      {isEnabled && children}
    </div>
  );
}