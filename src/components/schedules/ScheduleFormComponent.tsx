import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { BasicScheduleInfo } from "./BasicScheduleInfo";
import { ScheduleTimingSection } from "./ScheduleTimingSection";
import { ScheduleConfigurationSection } from "./ScheduleConfigurationSection";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

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

export function ScheduleFormComponent() {
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
      // Insert schedule
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
        const { error: recurringError } = await supabase
          .from("recurrence_patterns")
          .insert({
            schedule_id: schedule.id,
            days: values.recurringDays,
            months: values.recurringMonths,
            start_time: values.recurringStartTime,
            end_time: values.recurringEndTime,
          });

        if (recurringError) throw recurringError;
      }

      if (values.schedule_type === "static_power") {
        const { error: configError } = await supabase
          .from("static_power_overrides")
          .insert({
            schedule_id: schedule.id,
            value: values.staticPowerValue,
            chargers: values.selectedChargers,
          });

        if (configError) throw configError;
      }

      if (values.schedule_type === "capacity_limit") {
        const { error: configError } = await supabase
          .from("capacity_limit_overrides")
          .insert({
            schedule_id: schedule.id,
            capacity_limit: values.capacityLimit,
            grid_connection_transformer: values.gridConnectionTransformer,
          });

        if (configError) throw configError;
      }

      if (values.schedule_type === "energy_price") {
        const { error: configError } = await supabase
          .from("energy_price_overrides")
          .insert({
            schedule_id: schedule.id,
            price: values.energyPrice,
            grid_connection_transformer: values.gridConnectionTransformer,
          });

        if (configError) throw configError;
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