import "./header.css";
import BookIcon from "@mui/icons-material/Book";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

function Header({ sec_div, third_div, onSearch }) {
  const navigate = useNavigate();
  const username = JSON.parse(localStorage.getItem("username"));
  const logout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (data.message === "Logged out successfully") {
        localStorage.removeItem("username");
        toast.success(data.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("logout error :", error);
      toast.error("Unable to logout.");
    }
  };

  return (
    <div className="header_main">
      <ToastContainer />
      <div className="desktop_header">
        <div className="desktop_logo">
          <BookIcon className="desktop_book_icon" />
          <p>MemoVault</p>
        </div>

        {!sec_div && (
          <div className="desktop_search">
            <SearchOutlinedIcon className="desktop_search_icon" />

            <input
              type="text"
              placeholder="Search"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        )}

        {!third_div && (
          <div className="desktop_user">
            <p>{username}</p>

            <button type="button" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>

      <div className="mobile_header">
        <div className="mobile_top">
          <div className="mobile_logo">
            <BookIcon className="mobile_book_icon" />
            <p>MemoVault</p>
          </div>

          {!third_div && (
            <div className="mobile_username">
              <p>{username}</p>
            </div>
          )}
        </div>

        <div className="mobile_bottom">
          {!sec_div && (
            <div className="mobile_search">
              <SearchOutlinedIcon className="mobile_search_icon" />

              <input
                type="text"
                placeholder="Search"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
          )}

          {!third_div && (
            <div className="mobile_logout">
              <button type="button" onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
