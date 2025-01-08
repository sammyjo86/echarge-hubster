import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChargingStatus } from "./ChargingStatus";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface FleetData {
  busId: string;
  batteryLevel: number;
  status: "charging" | "available" | "offline" | "error";
  timeRemaining?: string;
}

export const FleetOverview = () => {
  const [fleetData, setFleetData] = useState<FleetData[]>([]);

  useEffect(() => {
    // Initial fetch
    fetchFleetData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('fleet-overview')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'charging_stations'
        },
        () => {
          fetchFleetData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchFleetData = async () => {
    const { data: stations, error } = await supabase
      .from('charging_stations')
      .select(`
        *,
        charging_transactions(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching fleet data:', error);
      return;
    }

    // Transform the data
    const transformedData: FleetData[] = stations.map(station => {
      const transaction = station.charging_transactions?.[0];
      const batteryLevel = transaction 
        ? calculateBatteryLevel(transaction.meter_start, transaction.meter_stop)
        : 100;

      return {
        busId: station.charge_point_id,
        batteryLevel,
        status: transformStatus(station.status),
        timeRemaining: calculateTimeRemaining(transaction)
      };
    });

    setFleetData(transformedData);
  };

  const calculateBatteryLevel = (meterStart?: number, meterStop?: number): number => {
    if (!meterStart || !meterStop) return 100;
    // Simple calculation - can be made more sophisticated based on actual battery capacity
    return Math.min(Math.round(((meterStop - meterStart) / 1000) * 100), 100);
  };

  const calculateTimeRemaining = (transaction: any): string | undefined => {
    if (!transaction || transaction.status !== 'In Progress') return undefined;
    
    const startTime = new Date(transaction.start_time);
    const now = new Date();
    const elapsedMinutes = Math.round((now.getTime() - startTime.getTime()) / (1000 * 60));
    
    // Estimate remaining time based on battery level and charging rate
    // This is a simplified calculation - can be made more sophisticated
    const currentLevel = calculateBatteryLevel(transaction.meter_start, transaction.meter_stop);
    const remainingPercent = 100 - currentLevel;
    
    // Assume average charging rate of 2% per minute (adjust based on actual data)
    const estimatedMinutes = Math.round(remainingPercent / 2);
    
    if (estimatedMinutes < 60) {
      return `${estimatedMinutes}min`;
    }
    return `${Math.floor(estimatedMinutes / 60)}h ${estimatedMinutes % 60}min`;
  };

  const transformStatus = (status?: string): "charging" | "available" | "offline" | "error" => {
    switch (status?.toLowerCase()) {
      case 'charging':
        return 'charging';
      case 'available':
        return 'available';
      case 'error':
        return 'error';
      default:
        return 'offline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fleet Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {fleetData.map((bus) => (
          <ChargingStatus key={bus.busId} {...bus} />
        ))}
      </CardContent>
    </Card>
  );
};