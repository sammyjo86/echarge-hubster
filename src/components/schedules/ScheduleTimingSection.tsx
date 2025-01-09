import { UseFormReturn } from "react-hook-form";
import { ScheduleFormValues } from "./ScheduleFormComponent";
import { ScheduleDateTimeFields } from "./ScheduleDateTimeFields";
import { RecurringSectionsGroup } from "./RecurringSectionsGroup";

export function ScheduleTimingSection({
  form,
}: {
  form: UseFormReturn<ScheduleFormValues>;
}) {
  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="text-lg font-medium">Schedule Timing</h3>
      <ScheduleDateTimeFields form={form} />
      <RecurringSectionsGroup form={form} />
    </div>
  );
}