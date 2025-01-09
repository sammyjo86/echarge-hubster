import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { BasicScheduleInfo } from "./BasicScheduleInfo";
import { ScheduleTimingSection } from "./ScheduleTimingSection";
import { ScheduleConfigurationSection } from "./ScheduleConfigurationSection";
import { useScheduleForm } from "@/hooks/useScheduleForm";

export function ScheduleFormComponent() {
  const { form, onSubmit } = useScheduleForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <BasicScheduleInfo form={form} />
        <ScheduleTimingSection form={form} />
        <ScheduleConfigurationSection form={form} />
        <Button type="submit">Create Schedule</Button>
      </form>
    </Form>
  );
}