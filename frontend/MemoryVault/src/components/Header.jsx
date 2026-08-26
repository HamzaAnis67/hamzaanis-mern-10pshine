import "./header.css";
import BookIcon from "@mui/icons-material/Book";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useNavigate } from "react-router-dom";

function Header({ sec_div, third_div }) {
  const navigate = useNavigate();
  const username = JSON.parse(localStorage.getItem("username"));
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <div className="header_maindiv">
      <div className="first_div mobile-view-hidden">
        <BookIcon className="book_icon" />
        <p>MemoVault</p>
      </div>
      <div className="second_div mobile-view-hidden" hidden={sec_div}>
        <SearchOutlinedIcon className="search_icon" />
        <input type="text" placeholder="Search" />
      </div>
      <div className={third_div ? "hide" : "third_div mobile-view-hidden"}>
        <p>{username}</p>
        <button
          type="button"
          onClick={() => {
            logout();
          }}
        >
          Logout
        </button>
      </div>

      <div className="header_mobile_maindiv">
        <div className="mobile_layout_first_div">
          <div className="first_div">
            <BookIcon className="book_icon" />
            <p>MemoVault</p>
          </div>
          <div className={third_div ? "hide" : "third_div"}>
            <p>Hamza Anis</p>
          </div>
        </div>
        <div className="mobile_layout_second_div">
          <div className="second_div" hidden={sec_div}>
            <SearchOutlinedIcon className="search_icon" />
            <input type="text" placeholder="Search" />
          </div>
          <div className={third_div ? "hide" : "third_div"}>
            <button
              type="button"
              onClick={() => {
                console.log("hello world");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
