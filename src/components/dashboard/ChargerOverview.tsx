import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge } from "./StatusBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BatteryCharging } from "lucide-react";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface Charger {
  id: string;
  name: string;
  status: "charging" | "available" | "offline" | "error";
  connectors: {
    id: number;
    status: "charging" | "available" | "offline" | "error";
  }[];
}

interface ChargingStationPayload {
  id: string;
  status: string;
}

export const ChargerOverview = () => {
  const [chargers, setChargers] = useState<Charger[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel('charger-status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'charging_stations',
        },
        (payload: RealtimePostgresChangesPayload<ChargingStationPayload>) => {
          console.log('Charger status update:', payload);
          // Update the charger status in the UI
          if (payload.new) {
            setChargers(current => 
              current.map(charger => 
                charger.id === payload.new.id 
                  ? { ...charger, status: payload.new.status.toLowerCase() }
                  : charger
              )
            );
          }
        }
      )
      .subscribe();

    // Initialize chargers data
    const initializeChargers = () => {
      const initialChargers: Charger[] = Array.from({ length: 50 }, (_, i) => ({
        id: `charger-${i + 1}`,
        name: `Charger ${i + 1}`,
        status: Math.random() > 0.7 ? "charging" : "available",
        connectors: Array.from({ length: 2 }, (_, j) => ({
          id: j + 1,
          status: Math.random() > 0.7 ? "charging" : "available",
        })),
      }));
      setChargers(initialChargers);
    };

    initializeChargers();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BatteryCharging className="h-6 w-6" />
          Charger Status Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chargers.map((charger) => (
              <Card key={charger.id} className="card-hover">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{charger.name}</h4>
                    <StatusBadge status={charger.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {charger.connectors.map((connector) => (
                      <div
                        key={`${charger.id}-${connector.id}`}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-muted-foreground">
                          Connector {connector.id}
                        </span>
                        <StatusBadge status={connector.status} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};