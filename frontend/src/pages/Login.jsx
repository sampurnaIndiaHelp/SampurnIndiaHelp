// // 📁 src/pages/Login.jsx
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "../styles/Login.css";

// export default function Login() {
  
//   const [form, setForm] = useState({ userId: "", password: "" });
//   const navigate = useNavigate();

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const res = await fetch("http://localhost:5000/api/users/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });
//     const data = await res.json();
//     if (res.ok) {
//       localStorage.setItem("userId", data.userId);
//       localStorage.setItem("userName", data.fullName);
//       navigate("/dashboard");
//     } else alert(data.message || "Login failed");
//   };

//  return (
//   <div className="login-container">
//     <form className="login-form" onSubmit={handleSubmit}>
//       <h2>Login to Sampurna Help</h2>
//       <input name="userId" value={form.userId} onChange={handleChange} placeholder="User ID" required />
//       <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required />
//       <button type="submit">Login</button>
//       <p><Link to="/forgot-password">Forgot Password?</Link></p>
//       <p>Not registered? <Link to="/register">Register here</Link></p>
//     </form>
//   </div>
// );
// }




import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const [form, setForm] = useState({ userId: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userName", data.fullName);
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed ❌");
      }
    } catch (err) {
      alert("Server error. Please try again later.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login to Sampurna Help</h2>
        <input
          name="userId"
          value={form.userId}
          onChange={handleChange}
          placeholder="User ID"
          required
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
        <p><Link to="/forgot-password">Forgot Password?</Link></p>
        <p>Not registered? <Link to="/register">Register here</Link></p>
      </form>
    </div>
  );
}
