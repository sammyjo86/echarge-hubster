import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Link } from "react-router-dom";

export function SchedulesDataTable() {
  const { data: schedules, isLoading } = useQuery({
    queryKey: ["schedules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schedules")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading schedules...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>End</TableHead>
            <TableHead>Recurring</TableHead>
            <TableHead>Time Zone</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules?.map((schedule) => (
            <TableRow key={schedule.id}>
              <TableCell>{schedule.name}</TableCell>
              <TableCell>{schedule.description}</TableCell>
              <TableCell>
                {format(new Date(schedule.start), "PPp")}
              </TableCell>
              <TableCell>
                {schedule.end ? format(new Date(schedule.end), "PPp") : "-"}
              </TableCell>
              <TableCell>{schedule.recurring ? "Yes" : "No"}</TableCell>
              <TableCell>{schedule.time_zone_id}</TableCell>
              <TableCell className="text-right">
                <Link to={`/schedules/new?id=${schedule.id}`}>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}