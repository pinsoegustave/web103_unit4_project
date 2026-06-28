import React from "react";

export default function JerseyList({
  jerseys,
  leftLogos,
  rightLogos,
  jerseyColors,
  updateJersey,
  deleteJersey,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState("");

  const startEdit = (jersey) => {
    setEditingId(jersey.id);
    setEditForm({
      back_name: jersey.back_name,
      left_logo_id: jersey.left_logo_id || "",
      right_logo_id: jersey.right_logo_id || "",
      jersey_color_id: jersey.jersey_color_id || "",
    });
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setError("");
  };

  const saveEdit = async (id) => {
    try {
      await updateJersey(id, {
        ...editForm,
        left_logo_id: editForm.left_logo_id || null,
        right_logo_id: editForm.right_logo_id || null,
        jersey_color_id: editForm.jersey_color_id || null,
      });
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
  <div className="jersey-list">
      <h2>Your Jerseys</h2>
      {jerseys.length === 0 && <p>No jerseys created yet.</p>}

      {jerseys.map(jersey => (
        <div key={jersey.id} className="jersey-card">
          {editingId === jersey.id ? (
            <>
              <input
                type="text"
                value={editForm.back_name}
                onChange={(e) => setEditForm({ ...editForm, back_name: e.target.value })}
              />

              <select
                value={editForm.left_logo_id}
                onChange={(e) => setEditForm({ ...editForm, left_logo_id: e.target.value })}
              >
                <option value="">None</option>
                {leftLogos.map(logo => (
                  <option key={logo.id} value={logo.id}>{logo.name}</option>
                ))}
              </select>

              <select
                value={editForm.right_logo_id}
                onChange={(e) => setEditForm({ ...editForm, right_logo_id: e.target.value })}
              >
                <option value="">None</option>
                {rightLogos.map(logo => (
                  <option key={logo.id} value={logo.id}>{logo.name}</option>
                ))}
              </select>

              <select
                value={editForm.jersey_color_id}
                onChange={(e) => setEditForm({ ...editForm, jersey_color_id: e.target.value })}
              >
                {jerseyColors.map(color => (
                  <option key={color.id} value={color.id}>{color.name}</option>
                ))}
              </select>

              {error && <p className="error">{error}</p>}

              <button onClick={() => saveEdit(jersey.id)}>Save</button>
              <button onClick={cancelEdit}>Cancel</button>
            </>
          ) : (
            <>
              <h3>{jersey.back_name}</h3>
              <p>Left Logo: {jersey.left_logo_name || 'None'}</p>
              <p>Right Logo: {jersey.right_logo_name || 'None'}</p>
              <p>Color: {jersey.jersey_color_name}</p>
              <p>Price: ${Number(jersey.total_price).toFixed(2)}</p>
              <button onClick={() => startEdit(jersey)}>Edit</button>
              <button onClick={() => deleteJersey(jersey.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
    );
}
