import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function LoggingPage() {

  // Define inputs.
  const [users, setUsers] = useState([]);
  const [sessionIDs, setSessionIDs] = useState([]);
  const [exercises, setExercises] = useState([]);

  const [userID, setUserID] = useState("");
  const [exerciseID, setExerciseID] = useState("");
  const [sessionID, setSessionID] = useState("");

  const [sets, setSets] = useState([]);
  const [laps, setLaps] = useState([]);

  const [comment, setComment] = useState("");

  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");

  const [distance, setDistance] = useState("");
  const [pace, setPace] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [duration, setDuration] = useState("");

  const [editingSet, setEditingSet] = useState(null);
  const [editingLap, setEditingLap] = useState(null);


  // Load exercises on page load.
  useEffect(() => {
    loadUsers();
    loadExercises();
  }, []);

  // Reload sessions after user has changed.
  useEffect(() => {
    if (userID) {
      loadSessionIDs();
    }
  }, [userID]);

  // Reload sets and laps after session has changed.
  useEffect(() => {
    if (sessionID) {
      loadLaps(sessionID);
      loadSets(sessionID);
    }
  }, [sessionID]);

  async function loadExercises() {
    const { data, error } = await supabase
      .from("exercises")
      .select("*")
      .order("name");

    if (!error) setExercises(data);
  }

  async function loadUsers() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("name");

    if (!error) setUsers(data);
  }

  async function startSession() {
    const { data, error } = await supabase
      .from("sessions")
      .insert([
        {
          user: userID,
          type: "strength",
          time: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (error) alert(error.message);
    else {
      setSessionID(data.id);
      loadSets(data.id);
      loadLaps(data.id);
    }
  }

  async function loadSessionIDs(uid = userID) {
    if (!uid) return;

    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("user", uid)
      .order("created_at");

    if (!error) setSessionIDs(data);
  } 

  async function loadSets(sid = sessionID) {
    if (!sid) return;

    const { data, error } = await supabase
      .from("sets")
      .select("*, exercises(name)")
      .eq("session", sid)
      .order("created_at");

    if (!error) setSets(data);
  }

  async function loadLaps(sid = sessionID) {
    if (!sid) return;

    const { data, error } = await supabase
      .from("laps")
      .select("*, exercises(name)")
      .eq("session", sid)
      .order("created_at");

    if (!error) setLaps(data);
  }

  async function addSet(e) {
    e.preventDefault();
    if (!sessionID) return;

    const { error } = await supabase
      .from("sets")
      .insert([
        {
          session: sessionID,
          exercise: exerciseID,
          weight: Number(weight),
          repetitions: Number(reps),
          comment,
        }
      ]);

    if (error) alert(error.message);
    else {
      setWeight("");
      setReps("");
      setComment("");
      loadSets();
    }
  }

  async function addLap(e) {
    e.preventDefault();
    if (!sessionID) return;

    const { error } = await supabase
      .from("laps")
      .insert([
        {
          session: sessionID,
          exercise: exerciseID,
          heart_rate: Number(heartRate),  
          pace: Number(pace),
          distance: Number(distance),
          duration: Number(duration),
          comment,
        }
      ]);

    if (error) alert(error.message);
    else {
      setHeartRate("");
      setPace("");
      setDistance("");
      setDuration("");
      setComment("");
      loadLaps();
    }
  }

  async function saveSetChanges() {
    const { error } = await supabase
      .from('sets')
      .update({
        weight: editingSet.weight,
        repetitions: editingSet.repetitions,
        comment: editingSet.comment
      })
      .eq('id', editingSet.id);

    if (!error) {
      // refresh lists
      loadSets();
      setEditingSet(null);
    }
  }

  async function saveLapChanges() {
    const { error } = await supabase
      .from('laps')
      .update({
        distance: editingLap.distance,
        duration: editingLap.duration,
        comment: editingLap.comment
      })
      .eq('id', editingLap.id);

    if (!error) {
      loadLaps();
      setEditingLap(null);
    }
  }


  return (
      <div style={{ padding: "2rem" }}>
        <h1>Logging</h1>


        <select value={userID} onChange={e => setUserID(e.target.value)} required>
          <option value="">Select user</option>
            {users.map(usr => (
              <option key={usr.id} value={usr.id}>{usr.name}</option>
            ))}
        </select>

        <select value={sessionID} onChange={e => setSessionID(e.target.value)} required>
          <option value="">Select session</option>
            {sessionIDs.map(s => (
              <option key={s.id} value={s.id}>{s.time}</option>
            ))}
        </select>

        {/* Start a new session */} 
        {!sessionID && (
          <button onClick={startSession}>
            Start new session
          </button>
        )}

        {/* Show session ID */}
        {sessionID && (
          <>
            <p><strong>Session ID:</strong> {sessionID}</p>

            {/* Add a set or lap */}
            <h2>Add set or lap</h2>

              <select value={exerciseID} onChange={e => setExerciseID(e.target.value)} required>
                <option value="">Select exercise</option>
                {exercises.map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.name}</option>
                ))}
              </select><br />

              <input
                type="text"
                placeholder="Comment"
                value={comment}
                onChange={e => setComment(e.target.value)}
              /><br /><br />                     

              <input
                type="number"
                placeholder="Weight"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                required
              /><br />

              <input
                type="number"
                placeholder="Reps"
                value={reps}
                onChange={e => setReps(e.target.value)}
                required
              /><br />

            <form onSubmit={addSet}>
              <button type="submit">Add set</button>
            </form>

              <br />
              <input
                type="number"
                placeholder="Distance"
                value={distance}
                onChange={e => setDistance(e.target.value)}
                required
              /><br />

              <input
                type="number"
                placeholder="Duration"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                required
              /><br />

              <input
                type="number"
                placeholder="Heart Rate"
                value={heartRate}
                onChange={e => setHeartRate(e.target.value)}
                required
              /><br />

              <input
                type="number"
                placeholder="Pace"
                value={pace}
                onChange={e => setPace(e.target.value)}
                required
              /><br />

            <form onSubmit={addLap}>
              <button type="submit">Add lap</button>
            </form>

            {/* 3️⃣ Show logged sets */}
            <h2>Logged sets and laps</h2>
            {sets.length == 0 && laps.length == 0 && <p>No sets or laps logged yet.</p>}

            <ul>
              {sets.map(s => (
                <li key={s.id}>
                  <strong>{s.exercises?.name}</strong> — {s.weight} kg × {s.repetitions}
                  {s.comment ? ` (${s.comment})` : ""}

                  <button onClick={() => setEditingSet(s)}>Edit</button>
                </li>
              ))}
            </ul>


            <ul>
              {laps.map(l => (
                <li key={l.id}>
                  <strong>{l.exercises?.name}</strong> — {l.distance} km in {l.duration} min
                  {l.comment ? ` (${l.comment})` : ""}

                  <button onClick={() => setEditingLap(l)}>Edit</button>
                </li>
              ))}
            </ul>

            {editingSet && (
              <div className="edit-form">
                <h3>Edit Set</h3>

                <label>Weight</label>
                <input
                  type="number"
                  value={editingSet.weight}
                  onChange={(e) =>
                    setEditingSet({ ...editingSet, weight: e.target.value })
                  }
                />

                <label>Repetitions</label>
                <input
                  type="number"
                  value={editingSet.repetitions}
                  onChange={(e) =>
                    setEditingSet({ ...editingSet, repetitions: e.target.value })
                  }
                />

                <label>Comment</label>
                <input
                  type="text"
                  value={editingSet.comment || ""}
                  onChange={(e) =>
                    setEditingSet({ ...editingSet, comment: e.target.value })
                  }
                />

                <button onClick={saveSetChanges}>Save</button>
                <button onClick={() => setEditingSet(null)}>Cancel</button>
              </div>
            )}

            {editingLap && (
              <div className="edit-form">
                <h3>Edit Lap</h3>

                <label>Distance (km)</label>
                <input
                  type="number"
                  value={editingLap.distance}
                  onChange={(e) =>
                    setEditingLap({ ...editingLap, distance: e.target.value })
                  }
                />

                <label>Duration (min)</label>
                <input
                  type="number"
                  value={editingLap.duration}
                  onChange={(e) =>
                    setEditingLap({ ...editingLap, duration: e.target.value })
                  }
                />

                <label>Comment</label>
                <input
                  type="text"
                  value={editingLap.comment || ""}
                  onChange={(e) =>
                    setEditingLap({ ...editingLap, comment: e.target.value })
                  }
                />

                <button onClick={saveLapChanges}>Save</button>
                <button onClick={() => setEditingLap(null)}>Cancel</button>
              </div>
            )}


          </>
        )}
      </div>
    );

}
