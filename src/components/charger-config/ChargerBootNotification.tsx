import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

interface ChargerBootNotificationProps {
  chargerId: string;
  lastBootPayload: string | null;
}

export const ChargerBootNotification = ({
  chargerId,
  lastBootPayload,
}: ChargerBootNotificationProps) => {
  const { toast } = useToast();

  const handleBootNotification = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("ocpp", {
        body: JSON.stringify([
          2, // MessageTypeId for request
          chargerId,
          "BootNotification",
          {
            chargePointVendor: "Test Vendor",
            chargePointModel: "Test Model",
            firmwareVersion: "1.0.0",
          },
        ]),
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Boot Notification Sent",
        description: "The boot notification was sent successfully",
      });
    } catch (error) {
      console.error("Boot notification error:", error);
      toast({
        title: "Error",
        description: "Failed to send boot notification",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Boot Notification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Last Boot Payload</h4>
          <pre className="bg-muted p-2 rounded-md text-xs overflow-auto">
            {lastBootPayload ? JSON.stringify(JSON.parse(lastBootPayload), null, 2) : "No boot notification received"}
          </pre>
        </div>
        <Button onClick={handleBootNotification}>
          Send Boot Notification
        </Button>
      </CardContent>
    </Card>
  );
};