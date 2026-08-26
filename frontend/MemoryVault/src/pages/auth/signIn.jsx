import "./Auth.css";
import Header from "../../components/Header";
import { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (ev) => {
    const { value, name } = ev.target;
    if (name === "email") {
      setEmail(value);
    }
    if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

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

    const userData = {
      email,
      password,
    };
    try {
      const response = await fetch("http://localhost:5000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (data.message) {
        setMessage(data.message);
        setOpen(true);
      } else {
        setMessage(data.error);
        setOpen(true);
      }
      if (data.message === "Login successful!") {
        localStorage.setItem("user", JSON.stringify(data.user.id));
        localStorage.setItem("username", JSON.stringify(data.user.username));
        localStorage.setItem("token", JSON.stringify(data.token));
        navigate("/");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("Unable to connect to the server. Please try again.");
      setOpen(true);
    }
  };
  return (
    <div className="signin_main_div">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={3000}
        message={message}
      />
      <Header sec_div={true} third_div={true} />
      <div className="signin_heading_div">
        <h1>MemoVault Secure Log In</h1>
      </div>
      <div className="signin_sub_div">
        <div className="signin_form_div">
          <form onSubmit={handleSubmit}>
            <p>Log-in form</p>
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
            <button type="submit">Access your Vault</button>
            <span>
              New here? <a href="/signup">Sign-Up</a>
            </span>
          </form>
        </div>
        <div className="signin_span_div">
          <span>Welcome back to your secure thought hub.</span>
          <img src="login_img.jpg" alt="img" />
        </div>
      </div>
    </div>
  );
}

export default SignIn;
