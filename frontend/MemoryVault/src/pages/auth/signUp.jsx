import { useState } from "react";
import "./Auth.css";
import Snackbar from "@mui/material/Snackbar";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (ev) => {
    const { value, name } = ev.target;
    if (name === "username") {
      setUsername(value);
    }
    if (name === "email") {
      setEmail(value);
    }
    if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    if (!username.trim()) {
      setMessage("User Name is required");
      setOpen(true);
      return;
    }
    if (username.length > 10) {
      setMessage("name should be less than 10 character's");
      setOpen(true);
      return;
    }

    if (!email.trim()) {
      setMessage("Email is required");
      setOpen(true);
      return;
    }

    if (!password.trim()) {
      setMessage("Password is required");
      setOpen(true);
      return;
    }
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      setOpen(true);
      return;
    }

    const userData = {
      username,
      email,
      password,
    };
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.error) {
        setMessage(data.error);
      } else {
        setMessage(data.message);
      }

      setOpen(true);

      if (data.message === "User registered successfully!") {
        navigate("/login");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("Unable to connect to the server. Please try again.");
      setOpen(true);
    }
  };

  return (
    <div className="signup_main_div">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={3000}
        message={message}
      />
      <Header sec_div={true} third_div={true} />
      <div className="signup_heading_div">
        <h1>Join MemoVault</h1>
      </div>
      <div className="signup_sub_div">
        <div className="signup_span_div">
          <span>
            Start securing your thoughts today. Isolated, authenticated notes
          </span>
        </div>
        <div className="signup_form_div">
          <form onSubmit={handleSubmit}>
            <p>Sign-up form</p>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={handleChange}
              name="username"
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
              name="email"
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
              name="password"
            />
            <button type="submit">Create your Account</button>
            <span>
              Already a member? <a href="/login">Log In</a>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
