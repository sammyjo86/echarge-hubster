import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Index from "./pages/Index";
import ChargerConfig from "./pages/ChargerConfig";
import OcppMonitor from "./pages/OcppMonitor";

function App() {
  return (
    <Router>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1">
            <div className="p-4">
              <SidebarTrigger className="mb-4" />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/charger-config" element={<ChargerConfig />} />
                <Route path="/ocpp-monitor" element={<OcppMonitor />} />
              </Routes>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </Router>
  );
}

export default App;