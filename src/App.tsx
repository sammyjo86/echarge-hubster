import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ChargerConfig from "./pages/ChargerConfig";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/charger-config" element={<ChargerConfig />} />
      </Routes>
    </Router>
  );
}

export default App;