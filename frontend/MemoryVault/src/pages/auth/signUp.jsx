import { useState } from "react";
import "./Auth.css";
import { ToastContainer, toast } from "react-toastify";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      toast.warning("User Name is required");
      return;
    }
    if (username.length > 10) {
      toast.warning("name should be less than 10 character's");
      return;
    }

    if (!email.trim()) {
      toast.warning("Email is required");
      return;
    }

    if (!password.trim()) {
      toast.warning("Password is required");
      return;
    }
    if (password.length < 6) {
      toast.warning("Password must be at least 6 characters long");
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
        toast.error(data.error);
      } else {
        toast.success(data.message);
      }

      if (data.message === "User registered successfully!") {
        navigate("/login");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Unable to connect to the server. Please try again.");
    }
  };

  return (
    <div className="signup_main_div">
      <ToastContainer />
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
