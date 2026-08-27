import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Header from "../../components/Header";
import Placeholder from "@tiptap/extension-placeholder";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import { ToastContainer, toast } from "react-toastify";
import "./NoteEditor.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState();
  const isEditMode = Boolean(id);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing your note...",
      }),
    ],
    content: "",
  });
  const {
    isBulletListActive,
    isOrderedListActive,
    isBoldActive,
    isItalicActive,
    isStrikeActive,
    isUnderlineActive,
  } = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isBulletListActive: editor?.isActive("bulletList") ?? false,
      isOrderedListActive: editor?.isActive("orderedList") ?? false,
      isBoldActive: editor?.isActive("bold") ?? false,
      isItalicActive: editor?.isActive("italic") ?? false,
      isStrikeActive: editor?.isActive("strike") ?? false,
      isUnderlineActive: editor?.isActive("underline") ?? false,
    }),
  });

  useEffect(() => {
    if (!id || !editor) return;

    const getNote = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          toast.error("Failed to fetch note");
        }

        const data = await response.json();
        setTitle(data[0].title);
        editor.commands.setContent(data[0].content);
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    };

    getNote();
  }, [id, editor]);

  const handleSave = async () => {
    const trimmedTitle = title?.trim();
    const content = editor.getHTML();
    const trimmedContent = editor.getText().trim();

    if (!trimmedTitle) {
      toast.error("Please enter a title");
      return;
    }

    if (!trimmedContent) {
      toast.error("Please enter some content");
      return;
    }
    try {
      if (isEditMode) {
        const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title,
            content,
          }),
        });

        if (!response.ok) {
          toast.error("Failed to update note");
          return;
        }
        toast.success("Note Updated");
      } else {
        const response = await fetch("http://localhost:5000/api/notes/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title,
            content,
          }),
        });
        if (!response.ok) {
          toast.error("Failed to create note");
          return;
        }
        toast.success("Note Created");
      }
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  if (!editor) {
    return null;
  }
  const handleCancel = () => {
    navigate("/");
  };
  return (
    <div className="noteeditor_main_div">
      <ToastContainer />
      <Header sec_div={true} third_div={false} />
      <div className="noteeditor_sub_div">
        <div className="noteeditor_title_div">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            placeholder="Title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="noteeditor_editor_div">
          <span>Note Editor</span>
          <div className="note-editor">
            <div className="toolbar">
              <button
                className={isBoldActive ? "btn_active" : ""}
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
              >
                <FormatBoldIcon />
              </button>

              <button
                type="button"
                className={isItalicActive ? "btn_active" : ""}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              >
                <FormatItalicIcon />
              </button>

              <button
                type="button"
                className={isUnderlineActive ? "btn_active" : ""}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
              >
                <FormatUnderlinedIcon />
              </button>
              <button
                type="button"
                className={isStrikeActive ? "btn_active" : ""}
                onClick={() => editor.chain().focus().toggleStrike().run()}
              >
                <StrikethroughSIcon />
              </button>

              <button
                type="button"
                className={isBulletListActive ? "btn_active" : ""}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              >
                <FormatListBulletedIcon />
              </button>

              <button
                type="button"
                className={isOrderedListActive ? "btn_active" : ""}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
              >
                <FormatListNumberedIcon />
              </button>
            </div>

            <EditorContent editor={editor} className="editor" />
            <div className="sav_can_btn_div">
              <button
                type="button"
                onClick={handleCancel}
                style={{ backgroundColor: "transparent" }}
              >
                Cancel
              </button>
              <button type="button" onClick={handleSave} className="save_btn">
                Save Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteEditor;
