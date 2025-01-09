import { z } from "zod";

export const scheduleFormSchema = z.object({
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