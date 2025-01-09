import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const scheduleFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  start: z.date(),
  end: z.date(),
  time_zone_id: z.string().default("stockholm"),
  schedule_type: z.enum(["static_power", "capacity_limit", "energy_price", "parking_prohibited"]),
  useDays: z.boolean().default(false),
  useMonths: z.boolean().default(false),
  useHours: z.boolean().default(false),
  recurringDays: z.array(z.string()).optional(),
  recurringMonths: z.array(z.string()).optional(),
  recurringStartTime: z.string().optional(),
  recurringEndTime: z.string().optional(),
  staticPowerValue: z.number().optional(),
  selectedChargers: z.array(z.string()).optional(),
  capacityLimit: z.number().optional(),
  energyPrice: z.number().optional(),
  gridConnectionTransformer: z.string().optional(),
  parkingProhibitedChargers: z.array(z.string()).optional(),
});

export type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

async function handleRecurringPattern(scheduleId: string, values: ScheduleFormValues) {
  const { error } = await supabase
    .from("recurrence_patterns")
    .insert({
      schedule_id: scheduleId,
      recurring_days: values.recurringDays,
      start_time: values.recurringStartTime,
      end_time: values.recurringEndTime,
    });

  if (error) throw error;
}

async function handleStaticPowerOverride(scheduleId: string, values: ScheduleFormValues) {
  const { error } = await supabase
    .from("static_power_overrides")
    .insert({
      schedule_id: scheduleId,
      value: values.staticPowerValue,
      chargers: values.selectedChargers,
    });

  if (error) throw error;
}

async function handleCapacityLimitOverride(scheduleId: string, values: ScheduleFormValues) {
  const { error } = await supabase
    .from("capacity_limit_overrides")
    .insert({
      schedule_id: scheduleId,
      capacity_limit: values.capacityLimit,
      grid_connection_transformer: values.gridConnectionTransformer,
    });

  if (error) throw error;
}

async function handleEnergyPriceOverride(scheduleId: string, values: ScheduleFormValues) {
  const { error } = await supabase
    .from("energy_price_overrides")
    .insert({
      schedule_id: scheduleId,
      price: values.energyPrice,
      grid_connection_transformer: values.gridConnectionTransformer,
    });

  if (error) throw error;
}

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
        await handleRecurringPattern(schedule.id, values);
      }

      switch (values.schedule_type) {
        case "static_power":
          await handleStaticPowerOverride(schedule.id, values);
          break;
        case "capacity_limit":
          await handleCapacityLimitOverride(schedule.id, values);
          break;
        case "energy_price":
          await handleEnergyPriceOverride(schedule.id, values);
          break;
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