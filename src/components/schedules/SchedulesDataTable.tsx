import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export function SchedulesDataTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: schedules, isLoading } = useQuery({
    queryKey: ["schedules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schedules")
        .select(`
          *,
          static_power_overrides(value, chargers),
          capacity_limit_overrides(capacity_limit, grid_connection_transformer),
          energy_price_overrides(price, grid_connection_transformer),
          recurrence_patterns(recurring_days, start_time, end_time)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("schedules")
        .delete()
        .eq("id", id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      
      toast({
        title: "Schedule deleted",
        description: "The schedule has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting schedule:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the schedule. Please try again.",
      });
    }
  };

  if (isLoading) {
    return <div>Loading schedules...</div>;
  }

  const getScheduleTypeLabel = (type: string) => {
    switch (type) {
      case "static_power":
        return "Static Power";
      case "capacity_limit":
        return "Capacity Limit";
      case "energy_price":
        return "Energy Price";
      case "parking_prohibited":
        return "Parking Prohibited";
      default:
        return type;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>End</TableHead>
            <TableHead>Recurring</TableHead>
            <TableHead>Configuration</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules?.map((schedule) => (
            <TableRow key={schedule.id}>
              <TableCell className="font-medium">{schedule.name}</TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {getScheduleTypeLabel(schedule.schedule_type)}
                </Badge>
              </TableCell>
              <TableCell>{schedule.description}</TableCell>
              <TableCell>
                {format(new Date(schedule.start), "PPp")}
              </TableCell>
              <TableCell>
                {schedule.end ? format(new Date(schedule.end), "PPp") : "-"}
              </TableCell>
              <TableCell>
                {schedule.recurring ? (
                  <Badge variant="secondary">
                    {schedule.recurrence_patterns?.[0]?.recurring_days?.length} days
                  </Badge>
                ) : (
                  "No"
                )}
              </TableCell>
              <TableCell>
                {schedule.schedule_type === "static_power" && (
                  <span>{schedule.static_power_overrides?.[0]?.value} kW</span>
                )}
                {schedule.schedule_type === "capacity_limit" && (
                  <span>{schedule.capacity_limit_overrides?.[0]?.capacity_limit} kW</span>
                )}
                {schedule.schedule_type === "energy_price" && (
                  <span>{schedule.energy_price_overrides?.[0]?.price} kr/kWh</span>
                )}
                {schedule.schedule_type === "parking_prohibited" && (
                  <span>{schedule.parking_prohibited_chargers?.length} chargers</span>
                )}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Link to={`/schedules/new?id=${schedule.id}`}>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this schedule? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(schedule.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}