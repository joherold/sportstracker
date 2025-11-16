import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function StatisticsPage() {

  // Session list & filter
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState("");

  // Fetch all user from Supabase
  const fetchUser = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("name", { ascending: false });

    if (error) {
      console.error("Error fetching sessions:", error);
    } else {
      setSessions(data);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Statistics</h1>

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
        {sessions.length === 0 && <li>No sessions found</li>}
        {sessions.map((s) => (
          <li key={s.id}>
            {s.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
