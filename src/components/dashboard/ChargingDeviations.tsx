import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ChargingDeviation {
  busId: string;
  soc: number;
  departureTime: string;
  parkingSpot: string;
  deviationTime: string;
}

export const ChargingDeviations = () => {
  const [deviations, setDeviations] = useState<ChargingDeviation[]>([]);

  useEffect(() => {
    // Initial fetch of deviations
    fetchDeviations();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('charging-deviations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'charging_transactions'
        },
        () => {
          fetchDeviations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDeviations = async () => {
    // For now, let's use mock data instead of the actual fetch
    const mockDeviations: ChargingDeviation[] = [
      {
        busId: "Bus 123",
        soc: 45,
        departureTime: "08:30",
        parkingSpot: "L0001-A404",
        deviationTime: "2h 15min",
      },
      {
        busId: "Bus 456",
        soc: 23,
        departureTime: "09:15",
        parkingSpot: "L0002-A405",
        deviationTime: "1h 45min",
      },
      {
        busId: "Bus 789",
        soc: 67,
        departureTime: "10:00",
        parkingSpot: "L0003-A406",
        deviationTime: "30min",
      },
      {
        busId: "Bus 234",
        soc: 15,
        departureTime: "11:30",
        parkingSpot: "L0004-A407",
        deviationTime: "3h 20min",
      },
      {
        busId: "Bus 567",
        soc: 89,
        departureTime: "12:45",
        parkingSpot: "L0005-A408",
        deviationTime: "45min",
      }
    ];

    setDeviations(mockDeviations);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-destructive" />
          Charging Deviations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bus ID</TableHead>
              <TableHead>SOC</TableHead>
              <TableHead>Departure</TableHead>
              <TableHead>Parking Spot</TableHead>
              <TableHead>Deviation Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deviations.map((deviation, index) => (
              <TableRow key={`${deviation.busId}-${index}`}>
                <TableCell className="font-medium">{deviation.busId}</TableCell>
                <TableCell className="text-destructive font-medium">
                  {deviation.soc}%
                </TableCell>
                <TableCell>{deviation.departureTime}</TableCell>
                <TableCell>{deviation.parkingSpot}</TableCell>
                <TableCell>{deviation.deviationTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};