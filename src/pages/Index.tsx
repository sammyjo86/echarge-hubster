import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FleetOverview } from "@/components/dashboard/FleetOverview";
import { DepotMap } from "@/components/dashboard/DepotMap";
import { PowerMeter } from "@/components/dashboard/PowerMeter";
import { ChargingDeviations } from "@/components/dashboard/ChargingDeviations";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-3">
        <DepotMap />
        <PowerMeter />
      </div>
      <div className="grid gap-4 grid-cols-1">
        <ChargingDeviations />
        <FleetOverview />
      </div>
    </DashboardLayout>
  );
};

export default Index;