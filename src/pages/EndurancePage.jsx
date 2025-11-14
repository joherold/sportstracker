import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function EndurancePage() {
  // Form state
  const [sportType, setSportType] = useState("");
  const [duration, setDuration] = useState("");
  const [distance, setDistance] = useState("");

  // Session list & filter
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState("");

  // Fetch all sessions from Supabase
  const fetchSessions = async () => {
    const { data, error } = await supabase
      .from("endurance_sessions")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching sessions:", error);
    } else {
      setSessions(data);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Save new session
  const saveSession = async () => {
    if (!sportType || !duration) {
      alert("Please enter sport type and duration");
      return;
    }

    const { data, error } = await supabase
      .from("endurance_sessions")
      .insert({
        sport_type: sportType,
        duration_min: Number(duration),
        distance_km: distance ? Number(distance) : 0,
        date: new Date().toISOString().slice(0, 10),
      });

    if (error) {
      console.error("Error inserting session:", error);
      alert("Error saving session");
    } else {
      alert("Session saved!");
      setSportType("");
      setDuration("");
      setDistance("");
      fetchSessions(); // refresh the list
    }
  };

  // Filtered sessions
  const filteredSessions = sessions.filter(
    (s) => filter === "" || s.sport_type.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Endurance Tracker</h1>

      {/* Input form */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          value={sportType}
          onChange={(e) => setSportType(e.target.value)}
          placeholder="Run, Bike, Swim…"
        />
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration (min)"
        />
        <input
          type="number"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          placeholder="Distance (km, optional)"
        />
        <button onClick={saveSession} style={{ marginLeft: "0.5rem" }}>
          Save
        </button>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by sport type"
        />
      </div>

      {/* Session list */}
      <ul>
        {filteredSessions.length === 0 && <li>No sessions found</li>}
        {filteredSessions.map((s) => (
          <li key={s.id}>
            <strong>{s.date}</strong>: {s.sport_type} — {s.distance_km ?? 0} km in{" "}
            {s.duration_min} min
          </li>
        ))}
      </ul>
    </div>
  );
}
