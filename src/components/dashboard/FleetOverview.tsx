import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChargingStatus } from "./ChargingStatus";

const mockFleetData = [
  {
    busId: "BUS-001",
    batteryLevel: 85,
    status: "charging" as const,
    timeRemaining: "45 min",
  },
  {
    busId: "BUS-002",
    batteryLevel: 100,
    status: "available" as const,
  },
  {
    busId: "BUS-003",
    batteryLevel: 15,
    status: "error" as const,
  },
  {
    busId: "BUS-004",
    batteryLevel: 60,
    status: "offline" as const,
  },
];

export const FleetOverview = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fleet Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mockFleetData.map((bus) => (
          <ChargingStatus key={bus.busId} {...bus} />
        ))}
      </CardContent>
    </Card>
  );
};