import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/auth/signUp";
import SignIn from "./pages/auth/signIn";
import Dashboard from "./pages/dashboard/dashboard";
import NoteEditor from "./pages/note-editor/note_editor";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/notes/new" element={<NoteEditor />} />
        <Route path="/notes/edit/:id" element={<NoteEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
