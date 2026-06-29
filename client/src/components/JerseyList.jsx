import { useState } from 'react';

function JerseyList({ jerseys, leftLogos, rightLogos, jerseyColors, updateJersey, deleteJersey }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState('');

  const startEdit = (jersey) => {
    setEditingId(jersey.id);
    setEditForm({
      back_name: jersey.back_name,
      left_logo_id: jersey.left_logo_id || '',
      right_logo_id: jersey.right_logo_id || '',
      jersey_color_id: jersey.jersey_color_id || ''
    });
    setError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setError('');
  };

  const saveEdit = async (id) => {
    try {
      await updateJersey(id, {
        ...editForm,
        left_logo_id: editForm.left_logo_id || null,
        right_logo_id: editForm.right_logo_id || null,
        jersey_color_id: editForm.jersey_color_id || null
      });
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (jerseys.length === 0) {
    return <p className="empty-state">No favorites yet — build a kit above to save your first one.</p>;
  }

  return (
    <div className="favorites-grid">
      {jerseys.map(jersey => (
        <div key={jersey.id} className="favorite-card">
          {editingId === jersey.id ? (
            <div className="edit-form">
              <input
                type="text"
                value={editForm.back_name}
                onChange={(e) => setEditForm({ ...editForm, back_name: e.target.value })}
              />

              <select
                value={editForm.left_logo_id}
                onChange={(e) => setEditForm({ ...editForm, left_logo_id: e.target.value })}
              >
                <option value="">No left logo</option>
                {leftLogos.map(logo => (
                  <option key={logo.id} value={logo.id}>{logo.name}</option>
                ))}
              </select>

              <select
                value={editForm.right_logo_id}
                onChange={(e) => setEditForm({ ...editForm, right_logo_id: e.target.value })}
              >
                <option value="">No right logo</option>
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

              <div className="card-actions">
                <button onClick={() => saveEdit(jersey.id)} className="btn-primary btn-small">Save</button>
                <button onClick={cancelEdit} className="btn-ghost btn-small">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div
                className="favorite-thumb"
                style={{ backgroundColor: jersey.jersey_hex_color || '#cccccc' }}
              >
                <div className="jersey-collar" />
                {jersey.left_logo_image && (
                  <img src={jersey.left_logo_image} alt={jersey.left_logo_name} className="logo left-chest" />
                )}
                {jersey.right_logo_image && (
                  <img src={jersey.right_logo_image} alt={jersey.right_logo_name} className="logo right-chest" />
                )}
                <div className="back-name-preview small">{jersey.back_name}</div>
              </div>

              <div className="favorite-info">
                <h3>{jersey.back_name}</h3>
                <p className="favorite-meta">{jersey.jersey_color_name}{jersey.left_logo_name ? ` · ${jersey.left_logo_name}` : ''}{jersey.right_logo_name ? ` · ${jersey.right_logo_name}` : ''}</p>
                <p className="favorite-price">${Number(jersey.total_price).toFixed(2)}</p>
                <div className="card-actions">
                  <button onClick={() => startEdit(jersey)} className="btn-ghost btn-small">Edit</button>
                  <button onClick={() => deleteJersey(jersey.id)} className="btn-danger btn-small">Remove</button>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default JerseyList;