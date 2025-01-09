import { ScheduleFormComponent } from "@/components/schedules/ScheduleFormComponent";
import { useSearchParams } from "react-router-dom";

export default function ScheduleForm() {
  const [searchParams] = useSearchParams();
  const isEditing = !!searchParams.get('id');

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">
          {isEditing ? "Edit Schedule" : "Create Schedule"}
        </h2>
        <p className="text-muted-foreground">
          {isEditing 
            ? "Modify your existing charging schedule" 
            : "Configure a new charging schedule for your fleet"}
        </p>
      </div>
      <ScheduleFormComponent />
    </div>
  );
}