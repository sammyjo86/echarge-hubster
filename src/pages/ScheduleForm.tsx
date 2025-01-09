import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ScheduleFormComponent } from "@/components/schedules/ScheduleFormComponent";

export default function ScheduleForm() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Create Schedule</h2>
        <p className="text-muted-foreground">
          Configure a new charging schedule for your fleet
        </p>
      </div>
      <ScheduleFormComponent />
    </DashboardLayout>
  );
}