import "./notecard.css";
import { ToastContainer, toast } from "react-toastify";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";

function NoteCard({ note }) {
  const navigate = useNavigate();
  const deleteSingleNote = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notes/${note.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );
      const data = await response.json();
      if (data.message) {
        toast.success(data.message);
      } else {
        toast.error(data.error ?? "Unable to delete note. Please try again.");
      }
      if (response.ok) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error("Note Delete Error :", error);
      toast.error("Unable to delete note. Please try again.");
    }
  };
  return (
    <div className="note-card">
      <ToastContainer />
      <h3>{note.title}</h3>

      <div
        className="note-content"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(note.content),
        }}
      />
      <div className="note-dateandbtn-div">
        <div className="note-date">
          Updated: {new Date(note.updated_at).toLocaleDateString()}
        </div>
        <div className="note-btn-div">
          <button
            className="btn-edit"
            type="button"
            onClick={() => {
              navigate(`/notes/edit/${note.id}`);
            }}
          >
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
