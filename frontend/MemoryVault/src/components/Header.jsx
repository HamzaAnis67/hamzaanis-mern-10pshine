import "./header.css";
import BookIcon from "@mui/icons-material/Book";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

function Header({ sec_div, third_div }) {
  return (
    <div className="header_maindiv">
      <div className="first_div">
        <BookIcon className="book_icon" />
        <p>MemoVault</p>
      </div>
      <div className="second_div" hidden={sec_div}>
        <SearchOutlinedIcon className="search_icon" />
        <input type="text" placeholder="Search" />
      </div>
      <div className={third_div ? "hide" : "third_div"}>
        <p>Hamza Anis</p>
        <button type="submit">Logout</button>
      </div>
    </div>
  );
}

export default Header;
