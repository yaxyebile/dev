import { useEffect, useState } from "react";
import Modal from "./Modal";

const Main = ({ refreshNotes }) => {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [editText, setEditText] = useState({ title: "", description: "", color: "#ffffff" });
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await fetch("http://localhost:5000/notes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received");
        }

        setNotes(data);
      } catch (err) {
        console.error("Error fetching notes:", err);
        setNotes([]);
      }
    };

    fetchNotes();
  }, [refreshNotes]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(`http://localhost:5000/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note._id);
    setEditText({ title: note.title, description: note.description, color: note.color });
  };

  const handleUpdate = async () => {
    if (!editingNote) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(`http://localhost:5000/notes/${editingNote}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editText), // Ensure `color` is included
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const updatedNote = await response.json();

      // Immediately update the note in the state with the updated note including `updatedAt`
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === editingNote ? { ...note, ...updatedNote } : note
        )
      );

      setEditingNote(null);
      setEditText({ title: "", description: "", color: "#ffffff" });
    } catch (err) {
      console.error("Error updating note:", err);
    }
  };

  return (
    <div>
      {notes.length === 0 ? (
        <p className="text-muted text-center">No notes yet.</p>
      ) : (
        <ul className="list-group">
          {notes.map((note) => (
            <li
              key={note._id}
              className="list-group-item d-flex justify-content-between align-items-center"
              style={{
                backgroundColor: note.color || "#ffffff", // Apply selected color
                cursor: "pointer",
                padding: "15px",
                borderRadius: "5px",
              }}
            >
              <div
                onClick={() => setSelectedNote(note)}
                style={{
                  backgroundColor: note.color,
                  padding: "10px",
                  borderRadius: "5px",
                  width: "100%",
                }}
              >
                <strong className="d-block">{note.title}</strong>
                <span className="text-muted d-block">{note.description.substring(0, 50)}...</span>
                <small className="text-muted d-block">
                  Created: {new Date(note.createdAt).toLocaleString()}
                  {/* Show `updatedAt` only after update */}
                  {note.updatedAt && note._id === editingNote && (
                    <span className="text-info d-block">
                      (Updated: {new Date(note.updatedAt).toLocaleString()})
                    </span>
                  )}
                </small>
              </div>

              {/* Edit and Delete Buttons */}
              <div className="d-flex">
                <button onClick={() => handleEdit(note)} className="btn btn-sm btn-primary me-2">
                  Edit
                </button>
                <button onClick={() => handleDelete(note._id)} className="btn btn-sm btn-danger">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Edit Form */}
      {editingNote && (
        <div className="modal d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Note</h5>
                <button className="btn-close" onClick={() => setEditingNote(null)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Title"
                  value={editText.title}
                  onChange={(e) => setEditText({ ...editText, title: e.target.value })}
                />
                <textarea
                  className="form-control mb-2"
                  placeholder="Description"
                  value={editText.description}
                  onChange={(e) => setEditText({ ...editText, description: e.target.value })}
                />
                <input
                  type="color"
                  className="form-control"
                  value={editText.color}
                  onChange={(e) => setEditText({ ...editText, color: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditingNote(null)}>
                  Cancel
                </button>
                <button className="btn btn-success" onClick={handleUpdate}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal-ka Note-ka oo dhan */}
      {selectedNote && <Modal note={selectedNote} onClose={() => setSelectedNote(null)} />}
    </div>
  );
};

export default Main;
