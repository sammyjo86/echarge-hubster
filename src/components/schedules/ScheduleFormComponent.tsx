import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RecurringDaysSelect } from "./RecurringDaysSelect";
import { RecurringMonthsSelect } from "./RecurringMonthsSelect";
import { RecurringTimeSelect } from "./RecurringTimeSelect";
import { RecurringSection } from "./RecurringSection";

const scheduleFormSchema = z.object({
  name: z.string().min(1, "Schedule name is required"),
  description: z.string().optional(),
  start: z.string().min(1, "Start date and time is required"),
  end: z.string().min(1, "End date and time is required"),
  recurring: z.boolean().default(false),
  time_zone_id: z.string().default("stockholm"),
  useDays: z.boolean().default(false),
  useMonths: z.boolean().default(false),
  useHours: z.boolean().default(false),
  recurringDays: z.array(z.string()).optional(),
  recurringMonths: z.array(z.string()).optional(),
  recurringStartTime: z.string().optional(),
  recurringEndTime: z.string().optional(),
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
      recurring: false,
      time_zone_id: "stockholm",
      useDays: false,
      useMonths: false,
      useHours: false,
      recurringDays: [],
      recurringMonths: [],
      recurringStartTime: "",
      recurringEndTime: "",
    },
  });

  const isRecurring = form.watch("recurring");

  async function onSubmit(values: ScheduleFormValues) {
    try {
      // First, create the schedule
      const { data: scheduleData, error: scheduleError } = await supabase
        .from("schedules")
        .insert({
          name: values.name,
          description: values.description,
          start: new Date(values.start).toISOString(),
          end: new Date(values.end).toISOString(),
          recurring: values.recurring,
          time_zone_id: values.time_zone_id,
        })
        .select()
        .single();

      if (scheduleError) throw scheduleError;

      // If it's a recurring schedule, create the recurrence pattern
      if (values.recurring && scheduleData) {
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Schedule Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter schedule name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter schedule description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date & Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date & Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="recurring"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Recurring Schedule</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Enable if this is a recurring schedule
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {isRecurring && (
          <div className="space-y-4">
            <RecurringSection
              form={form}
              title="Days"
              description="Configure which days this schedule should repeat on"
              fieldName="useDays"
            >
              <RecurringDaysSelect form={form} />
            </RecurringSection>

            <RecurringSection
              form={form}
              title="Months"
              description="Configure which months this schedule should be active in"
              fieldName="useMonths"
            >
              <RecurringMonthsSelect form={form} />
            </RecurringSection>

            <RecurringSection
              form={form}
              title="Hours"
              description="Configure the daily time window for this schedule"
              fieldName="useHours"
            >
              <RecurringTimeSelect form={form} />
            </RecurringSection>
          </div>
        )}

        <Button type="submit">Create Schedule</Button>
      </form>
    </Form>
  );
}