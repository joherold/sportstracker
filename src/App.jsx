import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import EndurancePage from "./pages/EndurancePage";

export default function App() {
  return (
    <Router>
      <nav style={{ padding: "1rem", background: "#eee" }}>
        <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
        <Link to="/endurance">Endurance Tracker</Link>
      </nav>

      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/endurance" element={<EndurancePage />} />
      </Routes>
    </Router>
  );
}
