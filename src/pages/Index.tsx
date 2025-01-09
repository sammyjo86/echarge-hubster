import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DepotMap } from "@/components/dashboard/DepotMap";
import { PowerMeter } from "@/components/dashboard/PowerMeter";
import { ChargingDeviations } from "@/components/dashboard/ChargingDeviations";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

const Index = () => {
  return (
    <DashboardLayout>
      <ResizablePanelGroup
        direction="vertical"
        className="min-h-[800px] rounded-lg border"
      >
        <ResizablePanel defaultSize={60}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={50}>
              <div className="p-4">
                <DepotMap />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
              <div className="p-4">
                <PowerMeter />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40}>
          <div className="p-4">
            <ChargingDeviations />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </DashboardLayout>
  );
};

export default Index;