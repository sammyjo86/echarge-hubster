import { Battery, BatteryCharging, BatteryFull, BatteryLow } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ChargingStatusProps {
  busId: string;
  batteryLevel: number;
  status: "charging" | "available" | "offline" | "error";
  timeRemaining?: string;
}

export const ChargingStatus = ({
  busId,
  batteryLevel,
  status,
  timeRemaining,
}: ChargingStatusProps) => {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [currentBatteryLevel, setBatteryLevel] = useState(batteryLevel);

  useEffect(() => {
    const channel = supabase
      .channel('charging-status')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'charging_stations',
          filter: `charge_point_id=eq.${busId}`,
        },
        (payload) => {
          console.log('Charging station update:', payload);
          if (payload.new.status) {
            setCurrentStatus(payload.new.status.toLowerCase());
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [busId]);

  const getBatteryIcon = () => {
    if (currentStatus === "charging") return BatteryCharging;
    if (currentBatteryLevel <= 20) return BatteryLow;
    if (currentBatteryLevel >= 90) return BatteryFull;
    return Battery;
  };

  const BatteryIcon = getBatteryIcon();

  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Bus {busId}</CardTitle>
        <StatusBadge status={currentStatus} />
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <BatteryIcon className="h-8 w-8 text-primary" />
          <div>
            <div className="text-2xl font-bold">{currentBatteryLevel}%</div>
            {timeRemaining && currentStatus === "charging" && (
              <p className="text-xs text-muted-foreground">
                {timeRemaining} until full
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};