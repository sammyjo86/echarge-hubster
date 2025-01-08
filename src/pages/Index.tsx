import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FleetOverview } from "@/components/dashboard/FleetOverview";
import { DepotMap } from "@/components/dashboard/DepotMap";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-3">
        <DepotMap />
      </div>
      <FleetOverview />
    </DashboardLayout>
  );
};

export default Index;