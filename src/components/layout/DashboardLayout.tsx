import { Battery, Bolt, Bus, Power } from "lucide-react";
import { MetricsCard } from "../dashboard/MetricsCard";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Monitor and manage your electric bus fleet charging operations
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Total Energy Consumed"
          value="2,345 kWh"
          icon={<Bolt className="h-4 w-4" />}
          description="Last 24 hours"
        />
        <MetricsCard
          title="Active Chargers"
          value="8/12"
          icon={<Power className="h-4 w-4" />}
          description="Currently in use"
        />
        <MetricsCard
          title="Fleet Status"
          value="12/15"
          icon={<Bus className="h-4 w-4" />}
          description="Buses operational"
        />
        <MetricsCard
          title="Average Charge"
          value="76%"
          icon={<Battery className="h-4 w-4" />}
          description="Fleet-wide"
        />
      </div>

      {children}
    </div>
  );
};