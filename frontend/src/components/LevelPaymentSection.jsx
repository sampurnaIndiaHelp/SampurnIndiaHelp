// 📁 frontend/components/LevelPaymentSection.jsx
import React, { useEffect, useState } from "react";
import "../styles/LevelPaymentSection.css";

const LevelPaymentSection = () => {
  const [userId] = useState(localStorage.getItem("userId"));
  const [levelPayments, setLevelPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [paymentsError, setPaymentsError] = useState("");
  const [form, setForm] = useState({
    senderName: "",
    senderPhone: "",
    screenshot: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [directs, setDirects] = useState([]);
  const [directsError, setDirectsError] = useState("");

  // 🔁 Load previous level payments
  const loadLevelPayments = async () => {
    setLoadingPayments(true);
    setPaymentsError("");
    try {
      const res = await fetch(`http://localhost:5000/api/payments/levels/${userId}`);
      if (!res.ok) throw new Error(`Server ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid data format");
      setLevelPayments(data);
      const nextLevel = data.length + 1;
      setCurrentLevel(nextLevel);
      return nextLevel;
    } catch (err) {
      console.error("Failed to load level payments", err);
      setPaymentsError("Failed to load your past level payments.");
      setLevelPayments([]);
      setCurrentLevel(1);
      return 1;
    } finally {
      setLoadingPayments(false);
    }
  };

  // 🔁 Load direct downline safely
  const loadDirects = async (nextLevel) => {
    setDirectsError("");
    try {
      const res = await fetch(`http://localhost:5000/api/users/downline/direct/${userId}`);
      if (!res.ok) throw new Error(`Server ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid data format");
      setDirects(data);
      if (data.length >= 1 && nextLevel > 2) {
        alert("🎉 A new member joined your team! Upgrade to unlock higher level payments.");
      }
    } catch (err) {
      console.warn("No directs found or failed to fetch:", err);
      setDirectsError("Could not load your direct referrals.");
      setDirects([]);
    }
  };

  // Initial load
  useEffect(() => {
    (async () => {
      const next = await loadLevelPayments();
      await loadDirects(next);
    })();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, screenshot: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentLevel > 2) {
      alert(`🚫 Access Denied: Please upgrade to pay for Level ${currentLevel}.`);
      return;
    }

    if (!form.senderName || !form.senderPhone || !form.screenshot) {
      alert("Please fill out your name, phone, and attach a screenshot.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("level", currentLevel);
      formData.append("senderName", form.senderName);
      formData.append("senderPhone", form.senderPhone);
      formData.append("screenshot", form.screenshot);

      const res = await fetch("http://localhost:5000/api/payments/upload-level", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed");
      alert(data.message);
      // refresh
      const next = await loadLevelPayments();
      await loadDirects(next);
      // clear form
      setForm({ senderName: "", senderPhone: "", screenshot: null });
    } catch (err) {
      console.error("Level payment error:", err);
      alert(err.message || "Error submitting level payment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="upload-payment">
      <h2>Level Payments</h2>

      {/* 🧾 Show previous level payments */}
      {loadingPayments ? (
        <p>Loading your payments…</p>
      ) : paymentsError ? (
        <p className="error">{paymentsError}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Level</th>
              <th>Receiver</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {levelPayments.length === 0 ? (
              <tr>
                <td colSpan="3">You have no level payments yet.</td>
              </tr>
            ) : (
              levelPayments.map((pmt) => (
                <tr key={pmt._id}>
                  <td>{pmt.level}</td>
                  <td>{pmt.toUserId}</td>
                  <td>{pmt.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* 📤 Upload form for next level */}
      {currentLevel && currentLevel <= 20 && (
        <>
          <h3>Pay Level {currentLevel} - ₹100</h3>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input
              type="text"
              name="senderName"
              placeholder="Your Name"
              value={form.senderName}
              onChange={handleChange}
              disabled={submitting}
              required
            />
            <input
              type="text"
              name="senderPhone"
              placeholder="Your Phone"
              value={form.senderPhone}
              onChange={handleChange}
              disabled={submitting}
              required
            />
            <input
              type="file"
              name="screenshot"
              onChange={handleFileChange}
              accept="image/*"
              disabled={submitting}
              required
            />
            <button type="submit" disabled={submitting}>
              {submitting ? "Submitting…" : `Submit Level ${currentLevel} Payment`}
            </button>
          </form>
        </>
      )}

      {/* show direct load errors */}
      {directsError && <p className="error">{directsError}</p>}
    </div>
  );
};

export default LevelPaymentSection;
