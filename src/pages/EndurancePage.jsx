import React, { useState } from "react";

export default function EndurancePage() {
  const [sessions, setSessions] = useState([]);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  const addSession = () => {
    if (!distance || !duration) return;
    setSessions([...sessions, { distance, duration }]);
    setDistance("");
    setDuration("");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Endurance Tracker</h1>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="number"
          placeholder="Distance (km)"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
        <input
          type="number"
          placeholder="Duration (min)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
        <button onClick={addSession}>Add Session</button>
      </div>

      <ul>
        {sessions.map((s, index) => (
          <li key={index}>
            {s.distance} km in {s.duration} min
          </li>
        ))}
      </ul>
    </div>
  );
}
