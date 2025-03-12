import { useState } from "react";

const Form = ({ onNoteAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#ffffff"); // Default white background

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    const response = await fetch("http://localhost:5000/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, color }),
    });

    if (response.ok) {
      setTitle("");
      setDescription("");
      setColor("#ffffff");
      onNoteAdded(); // Refresh notes
    } else {
      console.error("Failed to add note");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Choose Note Background Color</label>
        <input type="color" className="form-control form-control-color" value={color} onChange={(e) => setColor(e.target.value)} />
      </div>
      <button type="submit" className="btn btn-primary">Add Note</button>
    </form>
  );
};

export default Form;
