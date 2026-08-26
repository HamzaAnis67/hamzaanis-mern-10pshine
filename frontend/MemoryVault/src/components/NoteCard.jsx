import "./notecard.css";
import Snackbar from "@mui/material/Snackbar";
import { useState } from "react";

function NoteCard({ note }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const token = JSON.parse(localStorage.getItem("token"));

  const deleteSingleNote = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notes/${note.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      console.log(data);
      setMessage(data.message);
      setOpen(true);
      if (data.message === "Note deleted successfully") {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error("Note Delete Error :", error);
      setMessage("Unable to delete note. Please try again.");
      setOpen(true);
    }
  };
  return (
    <div className="note-card">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={3000}
        message={message}
      />
      <h3>{note.title}</h3>

      <div
        className="note-content"
        dangerouslySetInnerHTML={{ __html: note.content }}
      />
      <div className="note-dateandbtn-div">
        <div className="note-date">
          Updated: {new Date(note.updated_at).toLocaleDateString()}
        </div>
        <div className="note-btn-div">
          <button className="btn-edit" type="submit">
            Edit
          </button>
          <button
            className="btn-delete"
            type="button"
            onClick={() => {
              deleteSingleNote();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
export default NoteCard;
