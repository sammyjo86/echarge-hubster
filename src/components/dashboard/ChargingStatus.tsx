import { Battery, BatteryCharging, BatteryFull, BatteryLow } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";

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
  const getBatteryIcon = () => {
    if (status === "charging") return BatteryCharging;
    if (batteryLevel <= 20) return BatteryLow;
    if (batteryLevel >= 90) return BatteryFull;
    return Battery;
  };

  const BatteryIcon = getBatteryIcon();

  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Bus {busId}</CardTitle>
        <StatusBadge status={status} />
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <BatteryIcon className="h-8 w-8 text-primary" />
          <div>
            <div className="text-2xl font-bold">{batteryLevel}%</div>
            {timeRemaining && status === "charging" && (
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