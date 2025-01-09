import { SchedulesDataTable } from "@/components/schedules/SchedulesDataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function Schedules() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Charging Schedules</h2>
          <p className="text-muted-foreground">
            Manage and optimize your fleet charging schedules
          </p>
        </div>
        <Link to="/schedules/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Schedule
          </Button>
        </Link>
      </div>
      <SchedulesDataTable />
    </div>
  );
}