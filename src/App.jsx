import React from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import LoggingPage from "./pages/LoggingPage";
import StatisticsPage from "./pages/StatisticsPage";

export default function App() {
  return (
    <Router>
      <nav style={{ padding: "1rem", background: "#eee" }}>
        <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
        <Link to="/logging" style={{ marginRight: "1rem" }}>Logging</Link>
        <Link to="/statistics" style={{ marginRight: "1rem" }}>Statistics</Link>
      </nav>

      <Routes>
        <Route path="/" element={<WelcomePage/>} />
        <Route path="/logging" element={<LoggingPage/>} />
        <Route path="/statistics" element={<StatisticsPage/>} />
      </Routes>
    </Router>
  );
}
