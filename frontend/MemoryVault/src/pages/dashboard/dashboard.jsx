import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import NoteCard from "../../components/NoteCard";
import "./Dashboard.css";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import Snackbar from "@mui/material/Snackbar";
import { useEffect, useState } from "react";
function Dashboard() {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  const [notes, setNotes] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  if (!token) {
    navigate("/login");
  }

  const fetchNotes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notes", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setNotes(data);
      } else {
        setMessage(data.error ?? data.message ?? "Unable to fetch notes.");
        setOpen(true);
      }
    } catch (error) {
      console.error("Note Fetch Error: ", error);
      setMessage("Unable to fetch notes error. Please reload the page");
      setOpen(true);
    }
  };
  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="main_dashboard_div">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={3000}
        message={message}
      />
      <Header sec_div={false} third_div={false} />
      <div className="first_subdiv">
        <div className="dashboard_heading_div">
          <h3>My Notes ({notes.length})</h3>
          <span>Manage and organize your thoughts and ideas.</span>
        </div>
        <div className="dashboard_button_div">
          <button type="submit">
            <AddSharpIcon />
            Create New Note
          </button>
        </div>
      </div>
      <div className="notes-container">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
