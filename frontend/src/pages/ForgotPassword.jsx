import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ForgotPassword.css";


export default function ForgotPassword() {
  const [form, setForm] = useState({ userId: "", phone: "", newPassword: "", confirmPassword: "" });
  const [stage, setStage] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleVerify = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/users/verify-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: form.userId, phone: form.phone }),
    });
    if (res.ok) {
      setStage(2);
    } else {
      alert("Invalid User ID or Phone");
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) return alert("Passwords do not match");

    const res = await fetch("http://localhost:5000/api/users/reset-password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: form.userId, newPassword: form.newPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Password changed successfully!");
      navigate("/login");
    } else {
      alert(data.message || "Failed to reset password");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={stage === 1 ? handleVerify : handleReset}>
        <h2>Forgot Password</h2>

        <input name="userId" value={form.userId} onChange={handleChange} placeholder="User ID" required />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" required />

        {stage === 2 && (
          <>
            <input name="newPassword" type="password" value={form.newPassword} onChange={handleChange} placeholder="New Password" required />
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />
          </>
        )}

        <button type="submit">{stage === 1 ? "Verify" : "Change Password"}</button>
      </form>
    </div>
  );
}
