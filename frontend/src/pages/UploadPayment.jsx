// src/pages/UploadPayment.jsx

import React, { useState, useEffect } from "react";
import "../styles/UploadPayment.css";

function UploadPayment() {
  const [form, setForm] = useState({
    userId: localStorage.getItem("userId") || "",
    sponsorId: "",
    senderName: "",
    senderPhone: "",
    screenshot: null,
  });

  // Get sponsor ID from user profile
  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) {
      fetch(`http://localhost:5000/api/users/profile/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setForm((prev) => ({
            ...prev,
            sponsorId: data.sponsorId,
          }));
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, screenshot: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }

    const res = await fetch("http://localhost:5000/api/payments/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("✅ Payment uploaded. Wait for sponsor approval.");
      window.location.href = "/dashboard";
    } else {
      const err = await res.json();
      alert("❌ Upload failed: " + err.message);
    }
  };

  return (
    <div className="upload-payment-container">
      <h2>Upload Sponsor Payment</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="senderName"
          placeholder="Your Full Name"
          value={form.senderName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="senderPhone"
          placeholder="Phone Number"
          value={form.senderPhone}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="screenshot"
          accept="image/*"
          onChange={handleFileChange}
          required
        />
        <button type="submit">Submit Payment</button>
      </form>
    </div>
  );
}

export default UploadPayment;
