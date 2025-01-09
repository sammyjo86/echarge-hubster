import { useQuery } from "@tanstack/react-query";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

export function ParkingProhibitedConfig({
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
        name="parkingProhibitedChargers"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Chargers</FormLabel>
            <Select
              onValueChange={(value) => {
                const currentValues = Array.isArray(field.value) ? field.value : [];
                if (currentValues.includes(value)) {
                  field.onChange(currentValues.filter(v => v !== value));
                } else {
                  field.onChange([...currentValues, value]);
                }
              }}
              value={field.value?.[0] || ""}
              multiple
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select chargers to apply parking prohibition" />
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