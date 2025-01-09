import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BatteryCharging } from "lucide-react";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface Charger {
  id: string;
  name: string;
  status: "charging" | "available" | "offline" | "error";
  connectors: {
    id: number;
    name: string;
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
          if (payload.new) {
            setChargers(current => 
              current.map(charger => 
                charger.id === (payload.new as ChargingStationPayload).id 
                  ? { ...charger, status: (payload.new as ChargingStationPayload).status.toLowerCase() as Charger['status'] }
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
        name: `L${(i + 1).toString().padStart(4, '0')}`,
        status: Math.random() > 0.7 ? "charging" : "available",
        connectors: Array.from({ length: 2 }, (_, j) => ({
          id: j + 1,
          name: `A${(i * 2 + j + 404).toString().padStart(3, '0')}`,
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
      <CardHeader className="py-2">
        <CardTitle className="flex items-center gap-1 text-base">
          <BatteryCharging className="h-4 w-4" />
          Charger Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1">
            {chargers.map((charger) => (
              <Card 
                key={charger.id} 
                className={`border ${
                  charger.status === "charging" ? "bg-blue-500/10 border-blue-500/30" : ""
                }`}
              >
                <CardContent className="p-1 space-y-0.5">
                  <div className="text-xs font-medium text-center">
                    {charger.name}
                  </div>
                  {charger.connectors.map((connector) => (
                    <div
                      key={`${charger.id}-${connector.id}`}
                      className={`text-[10px] px-1 py-0.5 rounded ${
                        connector.status === "charging" 
                          ? "bg-blue-500/20 text-blue-700" 
                          : "bg-gray-100"
                      }`}
                    >
                      {connector.name}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};