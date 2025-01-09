import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ScheduleFormValues } from "../ScheduleFormComponent";

export function EnergyPriceConfig({
  form,
}: {
  form: UseFormReturn<ScheduleFormValues>;
}) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="energyPrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Energy Price (per kWh)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter energy price"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="gridConnectionTransformer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Grid Connection Transformer</FormLabel>
            <FormControl>
              <Input placeholder="Enter transformer ID" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}