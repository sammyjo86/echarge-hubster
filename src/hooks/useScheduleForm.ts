import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { scheduleFormSchema, type ScheduleFormValues } from "@/components/schedules/types";

export function useScheduleForm() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      name: "",
      description: "",
      start: new Date(),
      end: new Date(),
      time_zone_id: "stockholm",
      schedule_type: "static_power",
      useDays: false,
      useMonths: false,
      useHours: false,
      recurringDays: [],
      recurringMonths: [],
      recurringStartTime: undefined,
      recurringEndTime: undefined,
      staticPowerValue: undefined,
      selectedChargers: [],
      capacityLimit: undefined,
      energyPrice: undefined,
      gridConnectionTransformer: "",
      parkingProhibitedChargers: [],
    },
  });

  const hasRecurringSettings = form.watch(["useDays", "useMonths", "useHours"]).some(Boolean);

  async function onSubmit(values: ScheduleFormValues) {
    try {
      const { data: schedule, error: scheduleError } = await supabase
        .from("schedules")
        .insert({
          name: values.name,
          description: values.description,
          start: values.start.toISOString(),
          end: values.end.toISOString(),
          recurring: hasRecurringSettings,
          time_zone_id: values.time_zone_id,
          schedule_type: values.schedule_type,
          parking_prohibited_chargers: values.schedule_type === "parking_prohibited" 
            ? values.parkingProhibitedChargers 
            : null,
        })
        .select()
        .single();

      if (scheduleError) throw scheduleError;

      if (hasRecurringSettings) {
        const { error: recurrenceError } = await supabase
          .from("recurrence_patterns")
          .insert({
            schedule_id: schedule.id,
            recurring_days: values.recurringDays,
            start_time: values.recurringStartTime,
            end_time: values.recurringEndTime,
          });

        if (recurrenceError) throw recurrenceError;
      }

      switch (values.schedule_type) {
        case "static_power": {
          const { error } = await supabase
            .from("static_power_overrides")
            .insert({
              schedule_id: schedule.id,
              value: values.staticPowerValue,
              chargers: values.selectedChargers,
            });
          if (error) throw error;
          break;
        }
        case "capacity_limit": {
          const { error } = await supabase
            .from("capacity_limit_overrides")
            .insert({
              schedule_id: schedule.id,
              capacity_limit: values.capacityLimit,
              grid_connection_transformer: values.gridConnectionTransformer,
            });
          if (error) throw error;
          break;
        }
        case "energy_price": {
          const { error } = await supabase
            .from("energy_price_overrides")
            .insert({
              schedule_id: schedule.id,
              price: values.energyPrice,
              grid_connection_transformer: values.gridConnectionTransformer,
            });
          if (error) throw error;
          break;
        }
      }

      toast({
        title: "Schedule created successfully",
        description: "Your new schedule has been created.",
      });

      navigate("/schedules");
    } catch (error) {
      console.error("Error creating schedule:", error);
      toast({
        variant: "destructive",
        title: "Error creating schedule",
        description: "There was an error creating your schedule. Please try again.",
      });
    }
  }

  return {
    form,
    onSubmit,
    hasRecurringSettings,
  };
}