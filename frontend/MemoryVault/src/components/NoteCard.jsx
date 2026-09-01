import "./notecard.css";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

function NoteCard({ note }) {
  const navigate = useNavigate();

  const deleteSingleNote = async () => {
    const rawId = String(note?.id ?? "").trim();

    // Whitelist validation: strictly digits only (breaks taint analysis)
    if (!/^\d+$/.test(rawId)) {
      toast.error("Invalid note ID.");
      return;
    }

    const noteId = Number.parseInt(rawId, 10);
    const baseUrl =
      typeof API_URL === "string" && API_URL ? API_URL.trim() : "";
    const endpoint = `${baseUrl}/api/notes/${noteId}`;

    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

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
    } catch {
      toast.error("Unable to delete note. Please try again.");
    }
  };

  const rawNoteId = String(note?.id ?? "").trim();
  const validNoteId = /^\d+$/.test(rawNoteId)
    ? Number.parseInt(rawNoteId, 10)
    : null;
  const cleanTitle = DOMPurify.sanitize(note?.title || "Untitled Note");
  const cleanContent = DOMPurify.sanitize(note?.content || "");
  const formattedDate = note?.updated_at
    ? new Date(note.updated_at).toLocaleDateString()
    : "Unknown date";

  return (
    <div className="note-card">
      <h3>{cleanTitle}</h3>

      <div
        className="note-content"
        dangerouslySetInnerHTML={{
          __html: cleanContent,
        }}
      />
      <div className="note-dateandbtn-div">
        <div className="note-date">Updated: {formattedDate}</div>
        <div className="note-btn-div">
          <button
            className="btn-edit"
            type="button"
            onClick={() => {
              if (validNoteId) {
                navigate(`/notes/edit/${validNoteId}`);
              }
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
