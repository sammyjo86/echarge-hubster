import { UseFormReturn } from "react-hook-form";
import { ScheduleFormValues } from "./ScheduleFormComponent";
import { RecurringSection } from "./RecurringSection";
import { RecurringDaysSelect } from "./RecurringDaysSelect";
import { RecurringMonthsSelect } from "./RecurringMonthsSelect";
import { RecurringTimeSelect } from "./RecurringTimeSelect";

export function RecurringSectionsGroup({
  form,
}: {
  form: UseFormReturn<ScheduleFormValues>;
}) {
  return (
    <div className="space-y-4">
      <RecurringSection
        form={form}
        title="Recurring Days"
        description="Configure which days this schedule should repeat on"
        fieldName="useDays"
      >
        <RecurringDaysSelect form={form} />
      </RecurringSection>

      <RecurringSection
        form={form}
        title="Recurring Months"
        description="Configure which months this schedule should be active in"
        fieldName="useMonths"
      >
        <RecurringMonthsSelect form={form} />
      </RecurringSection>

      <RecurringSection
        form={form}
        title="Recurring Hours"
        description="Configure the daily time window for this schedule"
        fieldName="useHours"
      >
        <RecurringTimeSelect form={form} />
      </RecurringSection>
    </div>
  );
}