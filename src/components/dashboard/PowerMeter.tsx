import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const mockPowerData = [
  { time: "00:00", planned: 120, actual: 110 },
  { time: "04:00", planned: 180, actual: 190 },
  { time: "08:00", planned: 350, actual: 320 },
  { time: "12:00", planned: 280, actual: 290 },
  { time: "16:00", planned: 420, actual: 380 },
  { time: "20:00", planned: 250, actual: 270 },
  { time: "23:59", planned: 150, actual: 140 },
];

export const PowerMeter = () => {
  const [powerData, setPowerData] = useState(mockPowerData);

  useEffect(() => {
    const fetchRealConsumption = async () => {
      const { data: transactions, error } = await supabase
        .from('charging_transactions')
        .select('start_time, energy_delivered')
        .not('energy_delivered', 'is', null)
        .gte('start_time', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching consumption data:', error);
        return;
      }

      // Group transactions by hour and sum energy delivered
      const hourlyConsumption = transactions?.reduce((acc: Record<string, number>, curr) => {
        const hour = new Date(curr.start_time).getHours();
        const timeKey = `${hour.toString().padStart(2, '0')}:00`;
        acc[timeKey] = (acc[timeKey] || 0) + Number(curr.energy_delivered || 0);
        return acc;
      }, {});

      // Update powerData with real consumption
      if (hourlyConsumption) {
        setPowerData(prevData => 
          prevData.map(data => ({
            ...data,
            actual: hourlyConsumption[data.time] || data.actual
          }))
        );
      }
    };

    fetchRealConsumption();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('power-consumption')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'charging_transactions',
        },
        () => {
          fetchRealConsumption();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Power Consumption</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={powerData}>
              <defs>
                <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}kW`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">Time:</div>
                          <div>{payload[0].payload.time}</div>
                          <div className="font-medium">Planned:</div>
                          <div>{payload[0].payload.planned}kW</div>
                          <div className="font-medium">Actual:</div>
                          <div>{payload[0].payload.actual}kW</div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="planned"
                stroke="hsl(var(--primary))"
                fill="url(#powerGradient)"
                strokeWidth={2}
                name="Planned"
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                name="Actual"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};