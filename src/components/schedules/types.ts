import { z } from "zod";

export const scheduleTypes = ["static_power", "capacity_limit", "energy_price", "parking_prohibited"] as const;

export type ScheduleType = typeof scheduleTypes[number];

export interface Schedule {
  id: string;
  name: string;
  description?: string;
  start: string;
  end?: string;
  recurring?: boolean;
  dates_to_exclude?: string[];
  time_zone_id?: string;
  schedule_type?: ScheduleType;
  parking_prohibited_chargers?: string[];
  created_at?: string;
  updated_at?: string;
}