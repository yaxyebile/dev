const Modal = ({ note, onClose }) => {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            width: "50%",
            maxWidth: "500px",
          }}
        >
          <h3>{note.title}</h3>
          <p>{note.description}</p>
          <small className="text-muted d-block">Created: {new Date(note.createdAt).toLocaleString()}</small>
          <button onClick={onClose} className="btn btn-danger mt-3">Close</button>
        </div>
      </div>
    );
  };
  
  export default Modal;
  