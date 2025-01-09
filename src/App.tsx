import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Index from "./pages/Index";
import ChargerConfig from "./pages/ChargerConfig";
import OcppMonitor from "./pages/OcppMonitor";
import Schedules from "./pages/Schedules";
import ScheduleForm from "./pages/ScheduleForm";

function App() {
  return (
    <Router>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <main className="flex-1 bg-background">
            <div className="p-4">
              <SidebarTrigger className="mb-4 bg-background hover:bg-accent" />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/charger-config" element={<ChargerConfig />} />
                <Route path="/ocpp-monitor" element={<OcppMonitor />} />
                <Route path="/schedules" element={<Schedules />} />
                <Route path="/schedules/new" element={<ScheduleForm />} />
              </Routes>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </Router>
  );
}

export default App;