import { useQuery } from "@tanstack/react-query";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ScheduleFormValues } from "../ScheduleFormComponent";
import { supabase } from "@/integrations/supabase/client";

interface Charger {
  id: string;
  name: string;
  charge_point_id: string;
}

export function StaticPowerConfig({
  form,
}: {
  form: UseFormReturn<ScheduleFormValues>;
}) {
  const { data: chargers } = useQuery({
    queryKey: ["chargers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chargers")
        .select("id, name, charge_point_id");
      
      if (error) throw error;
      return data as Charger[];
    },
  });

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="staticPowerValue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Power Value (kW)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter power value"
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
        name="selectedChargers"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Chargers</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select chargers to apply power limit" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {chargers?.map((charger) => (
                  <SelectItem key={charger.id} value={charger.id}>
                    {charger.name} ({charger.charge_point_id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}