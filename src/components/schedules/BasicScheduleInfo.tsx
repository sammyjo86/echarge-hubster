import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ScheduleFormValues } from "./ScheduleFormComponent";
import { ScheduleTypeSelect } from "./ScheduleTypeSelect";

export function BasicScheduleInfo({
  form,
}: {
  form: UseFormReturn<ScheduleFormValues>;
}) {
  return (
    <div className="space-y-6">
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
              <Textarea placeholder="Enter schedule description" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <ScheduleTypeSelect form={form} />
    </div>
  );
}