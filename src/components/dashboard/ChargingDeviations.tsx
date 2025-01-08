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
          table: 'charging_transactions',
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
    const { data, error } = await supabase
      .from('charging_transactions')
      .select(`
        *,
        charging_stations (
          charge_point_id,
          location
        )
      `)
      .eq('status', 'In Progress')
      .order('start_time', { ascending: false });

    if (error) {
      console.error('Error fetching deviations:', error);
      return;
    }

    // Transform the data into the expected format
    const transformedData: ChargingDeviation[] = data.map((transaction) => ({
      busId: transaction.charging_stations?.charge_point_id || 'Unknown',
      soc: calculateSOC(transaction.meter_start, transaction.meter_stop),
      departureTime: formatTime(transaction.start_time),
      parkingSpot: transaction.charging_stations?.location || 'Unknown',
      deviationTime: calculateDeviationTime(transaction.start_time),
    }));

    setDeviations(transformedData);
  };

  const calculateSOC = (meterStart?: number, meterStop?: number): number => {
    if (!meterStart || !meterStop) return 0;
    // Simple calculation - can be made more sophisticated based on actual battery capacity
    return Math.min(Math.round(((meterStop - meterStart) / 1000) * 100), 100);
  };

  const formatTime = (timestamp: string): string => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const calculateDeviationTime = (startTime: string): string => {
    const start = new Date(startTime);
    const now = new Date();
    const diffMinutes = Math.round((now.getTime() - start.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}min`;
    }
    return `${Math.floor(diffMinutes / 60)}h ${diffMinutes % 60}min`;
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
            {deviations.map((deviation) => (
              <TableRow key={deviation.busId}>
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