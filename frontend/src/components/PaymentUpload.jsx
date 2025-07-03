import React, { useState } from "react";
import "../styles/UploadPayment.css";

const UploadPayment = () => {
  const [form, setForm] = useState({
    senderName: "",
    senderPhone: "",
    screenshot: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, screenshot: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    const sponsorId = localStorage.getItem("sponsorId");

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("sponsorId", sponsorId);
    formData.append("senderName", form.senderName);
    formData.append("senderPhone", form.senderPhone);
    formData.append("screenshot", form.screenshot);

    const res = await fetch("http://localhost:5000/api/payments/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    alert(data.message || "Payment submitted");
    window.location.href = "/dashboard";
  };

  return (
    <div className="upload-payment">
      <h2>Upload Sponsor Payment</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Your Name</label>
        <input type="text" name="senderName" onChange={handleChange} required />

        <label>Your Phone</label>
        <input type="text" name="senderPhone" onChange={handleChange} required />

        <label>Upload Screenshot</label>
        <input type="file" name="screenshot" accept="image/*" onChange={handleFileChange} required />

        <button type="submit">Submit Payment</button>
      </form>
    </div>
  );
};

export default UploadPayment;
