import { SchedulesDataTable } from "@/components/schedules/SchedulesDataTable";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

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
        <div className="flex gap-2">
          <Menubar className="border-none">
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Schedule
                </Button>
              </MenubarTrigger>
              <MenubarContent>
                <Link to="/schedules/new">
                  <MenubarItem className="cursor-pointer">
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    New Schedule
                  </MenubarItem>
                </Link>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
      <SchedulesDataTable />
    </div>
  );
}