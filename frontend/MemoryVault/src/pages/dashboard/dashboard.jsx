import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import NoteCard from "../../components/NoteCard";
import "./Dashboard.css";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import { ToastContainer, toast } from "react-toastify";
import Skeleton from "@mui/material/Skeleton";
import API_URL from "../../config/api";
import { useEffect, useState } from "react";
function Dashboard() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/notes`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setNotes(data);
        setLoading(false);
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("username");
        navigate("/login");
      } else {
        toast.error(data.message ?? data.error ?? "Unable to fetch notes.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Note Fetch Error: ", error);
      toast.error("Unable to fetch notes error. Please reload the page");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
    <div className="main_dashboard_div">
      <ToastContainer />
      <Header sec_div={false} third_div={false} onSearch={setSearchTerm} />
      {loading ? (
        <div className="skeleton_div">
          <Skeleton variant="rounded" width={310} height={150} />
          <Skeleton variant="rounded" width={310} height={150} />
          <Skeleton variant="rounded" width={310} height={150} />
        </div>
      ) : (
        <>
          <div className="first_subdiv">
            <div className="dashboard_heading_div">
              <h3>My Notes ({filteredNotes.length})</h3>
              <span>Manage and organize your thoughts and ideas.</span>
            </div>
            <div className="dashboard_button_div">
              <button
                type="button"
                onClick={() => {
                  navigate("/notes/new");
                }}
              >
                <AddSharpIcon />
                Create New Note
              </button>
            </div>
          </div>
          <div className="notes-container">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))
            ) : (
              <p className="no_note_text">No notes found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
