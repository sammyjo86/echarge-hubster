import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ChargerConfig from "./pages/ChargerConfig";
import OcppMonitor from "./pages/OcppMonitor";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/charger-config" element={<ChargerConfig />} />
        <Route path="/ocpp-monitor" element={<OcppMonitor />} />
      </Routes>
    </Router>
  );
}

export default App;