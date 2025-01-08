import { Battery, Bolt, Bus, Power, Menu } from "lucide-react";
import { MetricsCard } from "../dashboard/MetricsCard";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Monitor and manage your electric bus fleet charging operations
            </p>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-background">
                <DropdownMenuItem asChild>
                  <Link to="/" className="w-full">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/charger-config" className="w-full">
                    Charger Configuration
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/ocpp-monitor" className="w-full">
                    OCPP Monitor
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="hidden md:flex items-center gap-4">
              <Link to="/charger-config">
                <Button variant="outline">Charger Configuration</Button>
              </Link>
              <Link to="/ocpp-monitor">
                <Button variant="outline">OCPP Monitor</Button>
              </Link>
            </div>
            <img src="/nobina-logo.svg" alt="Nobina Logo" className="h-12" />
          </div>
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
    </div>
  );
};