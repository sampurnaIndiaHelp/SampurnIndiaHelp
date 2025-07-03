import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/Register.css";

function Register() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    referralId: "",
    sponsorName: "",
    fullName: "",
    email: "",
    phone: "",
    epin: "",
    password: "",
    address: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    const refId = searchParams.get("ref");
    const sponsorName = searchParams.get("name");

    if (refId && sponsorName) {
      setForm((prev) => ({
        ...prev,
        referralId: refId,
        sponsorName: decodeURIComponent(sponsorName),
      }));
    } else if (refId) {
      fetch(`http://localhost:5000/api/users/${refId}`)
        .then((res) => res.json())
        .then((data) => {
          setForm((prev) => ({
            ...prev,
            referralId: refId,
            sponsorName: data.name || "Unknown",
          }));
        })
        .catch(() => alert("Invalid referral ID"));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Welcome, ${data.fullName}! Your ID is ${data.userId}`);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userName", data.fullName);
        window.location.href = "/dashboard";
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch {
      alert("Server error. Try again.");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Welcome to Sampurna Help</h2>

        <label>Referral ID</label>
        <input type="text" name="referralId" value={form.referralId} readOnly />

        <label>Sponsor Name</label>
        <input type="text" name="sponsorName" value={form.sponsorName} readOnly />

        <label>Full Name</label>
        <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>Phone Number</label>
        <input type="text" name="phone" value={form.phone} onChange={handleChange} required />

        <label>E-PIN</label>
        <input type="text" name="epin" value={form.epin} onChange={handleChange} required />

        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required />

        <label>Address</label>
        <input type="text" name="address" value={form.address} onChange={handleChange} required />

        <label>City</label>
        <input type="text" name="city" value={form.city} onChange={handleChange} required />

        <label>State</label>
        <input type="text" name="state" value={form.state} onChange={handleChange} required />

        <button type="submit">Join Now</button>
      </form>
    </div>
  );
}

export default Register;
