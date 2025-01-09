import { UseFormReturn } from "react-hook-form";
import { ScheduleFormValues } from "./ScheduleFormComponent";
import { StaticPowerConfig } from "./schedule-configs/StaticPowerConfig";
import { CapacityLimitConfig } from "./schedule-configs/CapacityLimitConfig";
import { EnergyPriceConfig } from "./schedule-configs/EnergyPriceConfig";
import { ParkingProhibitedConfig } from "./schedule-configs/ParkingProhibitedConfig";
import { ScheduleTypeSelect } from "./ScheduleTypeSelect";

export function ScheduleConfigurationSection({
  form,
}: {
  form: UseFormReturn<ScheduleFormValues>;
}) {
  const scheduleType = form.watch("schedule_type");

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="text-lg font-medium">Schedule Configuration</h3>
      <ScheduleTypeSelect form={form} />
      {scheduleType === "static_power" && <StaticPowerConfig form={form} />}
      {scheduleType === "capacity_limit" && <CapacityLimitConfig form={form} />}
      {scheduleType === "energy_price" && <EnergyPriceConfig form={form} />}
      {scheduleType === "parking_prohibited" && <ParkingProhibitedConfig form={form} />}
    </div>
  );
}