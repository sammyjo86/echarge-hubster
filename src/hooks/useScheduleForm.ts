import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { scheduleFormSchema, type ScheduleFormValues } from "@/components/schedules/types";
import { useQuery } from "@tanstack/react-query";

export function useScheduleForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scheduleId = searchParams.get('id');

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
      recurringStartTime: "00:00",
      recurringEndTime: "23:59",
      staticPowerValue: undefined,
      selectedChargers: [],
      capacityLimit: undefined,
      energyPrice: undefined,
      gridConnectionTransformer: "",
      parkingProhibitedChargers: [],
    },
  });

  // Fetch schedule data if editing
  useQuery({
    queryKey: ["schedule", scheduleId],
    queryFn: async () => {
      if (!scheduleId) return null;

      const { data: schedule, error } = await supabase
        .from("schedules")
        .select(`
          *,
          static_power_overrides(*),
          capacity_limit_overrides(*),
          energy_price_overrides(*),
          recurrence_patterns(*)
        `)
        .eq('id', scheduleId)
        .single();

      if (error) throw error;

      if (schedule) {
        const schedule_type = schedule.schedule_type as ScheduleFormValues['schedule_type'];
        
        form.reset({
          name: schedule.name,
          description: schedule.description || "",
          start: new Date(schedule.start),
          end: schedule.end ? new Date(schedule.end) : new Date(),
          time_zone_id: schedule.time_zone_id,
          schedule_type,
          useDays: schedule.recurrence_patterns?.[0]?.recurring_days?.length > 0 || false,
          useMonths: false,
          useHours: schedule.recurrence_patterns?.[0]?.start_time !== null || false,
          recurringDays: schedule.recurrence_patterns?.[0]?.recurring_days || [],
          recurringMonths: [],
          recurringStartTime: schedule.recurrence_patterns?.[0]?.start_time || "00:00",
          recurringEndTime: schedule.recurrence_patterns?.[0]?.end_time || "23:59",
          staticPowerValue: schedule.static_power_overrides?.[0]?.value,
          selectedChargers: schedule.static_power_overrides?.[0]?.chargers || [],
          capacityLimit: schedule.capacity_limit_overrides?.[0]?.capacity_limit,
          energyPrice: schedule.energy_price_overrides?.[0]?.price,
          gridConnectionTransformer: schedule.capacity_limit_overrides?.[0]?.grid_connection_transformer || 
                                   schedule.energy_price_overrides?.[0]?.grid_connection_transformer || "",
          parkingProhibitedChargers: schedule.parking_prohibited_chargers || [],
        });
      }

      return schedule;
    },
    enabled: !!scheduleId,
  });

  async function onSubmit(values: ScheduleFormValues) {
    try {
      let scheduleData = {
        name: values.name,
        description: values.description,
        start: values.start.toISOString(),
        end: values.end.toISOString(),
        recurring: values.useDays || values.useMonths || values.useHours,
        time_zone_id: values.time_zone_id,
        schedule_type: values.schedule_type,
        parking_prohibited_chargers: values.schedule_type === "parking_prohibited" 
          ? values.parkingProhibitedChargers 
          : null,
      };

      // Update or create schedule
      const { data: schedule, error: scheduleError } = scheduleId
        ? await supabase
            .from("schedules")
            .update(scheduleData)
            .eq('id', scheduleId)
            .select()
            .single()
        : await supabase
            .from("schedules")
            .insert(scheduleData)
            .select()
            .single();

      if (scheduleError) throw scheduleError;

      if (values.useDays || values.useHours) {
        const recurrenceData = {
          schedule_id: schedule.id,
          recurring_days: values.useDays ? values.recurringDays : null,
          start_time: values.useHours ? values.recurringStartTime : "00:00",
          end_time: values.useHours ? values.recurringEndTime : "23:59",
        };

        if (scheduleId) {
          // Update existing recurrence pattern
          await supabase
            .from("recurrence_patterns")
            .update(recurrenceData)
            .eq('schedule_id', scheduleId);
        } else {
          // Create new recurrence pattern
          await supabase
            .from("recurrence_patterns")
            .insert(recurrenceData);
        }
      }

      // Handle schedule type specific data
      switch (values.schedule_type) {
        case "static_power": {
          const staticPowerData = {
            schedule_id: schedule.id,
            value: values.staticPowerValue,
            chargers: values.selectedChargers,
          };

          if (scheduleId) {
            await supabase
              .from("static_power_overrides")
              .update(staticPowerData)
              .eq('schedule_id', scheduleId);
          } else {
            await supabase
              .from("static_power_overrides")
              .insert(staticPowerData);
          }
          break;
        }
        case "capacity_limit": {
          const capacityLimitData = {
            schedule_id: schedule.id,
            capacity_limit: values.capacityLimit,
            grid_connection_transformer: values.gridConnectionTransformer,
          };

          if (scheduleId) {
            await supabase
              .from("capacity_limit_overrides")
              .update(capacityLimitData)
              .eq('schedule_id', scheduleId);
          } else {
            await supabase
              .from("capacity_limit_overrides")
              .insert(capacityLimitData);
          }
          break;
        }
        case "energy_price": {
          const energyPriceData = {
            schedule_id: schedule.id,
            price: values.energyPrice,
            grid_connection_transformer: values.gridConnectionTransformer,
          };

          if (scheduleId) {
            await supabase
              .from("energy_price_overrides")
              .update(energyPriceData)
              .eq('schedule_id', scheduleId);
          } else {
            await supabase
              .from("energy_price_overrides")
              .insert(energyPriceData);
          }
          break;
        }
      }

      toast({
        title: scheduleId ? "Schedule updated successfully" : "Schedule created successfully",
        description: scheduleId ? "Your schedule has been updated." : "Your new schedule has been created.",
      });

      navigate("/schedules");
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast({
        variant: "destructive",
        title: scheduleId ? "Error updating schedule" : "Error creating schedule",
        description: "There was an error saving your schedule. Please try again.",
      });
    }
  }

  return {
    form,
    onSubmit,
    isEditing: !!scheduleId,
  };
}