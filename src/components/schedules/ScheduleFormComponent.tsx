import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BasicScheduleInfo } from "./BasicScheduleInfo";
import { ScheduleDateTimeFields } from "./ScheduleDateTimeFields";
import { ScheduleConfigurationSection } from "./ScheduleConfigurationSection";
import { RecurringSectionsGroup } from "./RecurringSectionsGroup";

const scheduleFormSchema = z.object({
  name: z.string().min(1, "Schedule name is required"),
  description: z.string().optional(),
  start: z.string().min(1, "Start date and time is required"),
  end: z.string().min(1, "End date and time is required"),
  time_zone_id: z.string().default("stockholm"),
  schedule_type: z.enum([
    "static_power",
    "capacity_limit",
    "parking_prohibited",
    "energy_price",
  ]).default("static_power"),
  useDays: z.boolean().default(false),
  useMonths: z.boolean().default(false),
  useHours: z.boolean().default(false),
  recurringDays: z.array(z.string()).optional(),
  recurringMonths: z.array(z.string()).optional(),
  recurringStartTime: z.string().optional(),
  recurringEndTime: z.string().optional(),
  staticPowerValue: z.number().optional(),
  capacityLimit: z.number().optional(),
  energyPrice: z.number().optional(),
  gridConnectionTransformer: z.string().optional(),
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
      start: "",
      end: "",
      time_zone_id: "stockholm",
      schedule_type: "static_power",
      useDays: false,
      useMonths: false,
      useHours: false,
      recurringDays: [],
      recurringMonths: [],
      recurringStartTime: "",
      recurringEndTime: "",
      staticPowerValue: undefined,
      capacityLimit: undefined,
      energyPrice: undefined,
      gridConnectionTransformer: "",
    },
  });

  const hasRecurringSettings =
    form.watch("useDays") ||
    form.watch("useMonths") ||
    form.watch("useHours");

  async function onSubmit(values: ScheduleFormValues) {
    try {
      const { data: scheduleData, error: scheduleError } = await supabase
        .from("schedules")
        .insert({
          name: values.name,
          description: values.description,
          start: new Date(values.start).toISOString(),
          end: new Date(values.end).toISOString(),
          recurring: hasRecurringSettings,
          time_zone_id: values.time_zone_id,
          schedule_type: values.schedule_type,
        })
        .select()
        .single();

      if (scheduleError) throw scheduleError;

      if (hasRecurringSettings && scheduleData) {
        const { error: recurrenceError } = await supabase
          .from("recurrence_patterns")
          .insert({
            schedule_id: scheduleData.id,
            start_time: values.recurringStartTime,
            end_time: values.recurringEndTime,
            recurring_days: values.recurringDays,
          });

        if (recurrenceError) throw recurrenceError;
      }

      if (scheduleData) {
        switch (values.schedule_type) {
          case "static_power":
            if (values.staticPowerValue) {
              const { error } = await supabase
                .from("static_power_overrides")
                .insert({
                  schedule_id: scheduleData.id,
                  value: values.staticPowerValue,
                });
              if (error) throw error;
            }
            break;
          case "capacity_limit":
            if (values.capacityLimit && values.gridConnectionTransformer) {
              const { error } = await supabase
                .from("capacity_limit_overrides")
                .insert({
                  schedule_id: scheduleData.id,
                  capacity_limit: values.capacityLimit,
                  grid_connection_transformer: values.gridConnectionTransformer,
                });
              if (error) throw error;
            }
            break;
          case "energy_price":
            if (values.energyPrice && values.gridConnectionTransformer) {
              const { error } = await supabase
                .from("energy_price_overrides")
                .insert({
                  schedule_id: scheduleData.id,
                  price: values.energyPrice,
                  grid_connection_transformer: values.gridConnectionTransformer,
                });
              if (error) throw error;
            }
            break;
        }
      }

      toast({
        title: "Schedule created",
        description: "Your schedule has been created successfully.",
      });

      navigate("/schedules");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating the schedule.",
        variant: "destructive",
      });
      console.error("Error creating schedule:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicScheduleInfo form={form} />
        <ScheduleConfigurationSection form={form} />
        <ScheduleDateTimeFields form={form} />
        <RecurringSectionsGroup form={form} />
        <Button type="submit">Create Schedule</Button>
      </form>
    </Form>
  );
}