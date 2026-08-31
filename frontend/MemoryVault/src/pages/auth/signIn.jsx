import "./Auth.css";
import Header from "../../components/Header";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import API_URL from "../../config/api";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      toast.warning("Email is required");
      return;
    }

    if (!password.trim()) {
      toast.warning("Password is required");
      return;
    }

    const userData = {
      email,
      password,
    };
    try {
      const response = await fetch(`${API_URL}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (data.message) {
        toast.success(data.message);
      } else {
        toast.error(data.error);
      }
      if (data.message === "Login successful!") {
        localStorage.setItem("username", JSON.stringify(data.user.username));
        navigate("/");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Unable to connect to the server. Please try again.");
    }
  };
  return (
    <div className="signin_main_div">
      <ToastContainer />
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
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
              name="email"
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
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
          <img src="login_img.jpg" alt="" />
        </div>
      </div>
    </div>
  );
}

export default SignIn;
