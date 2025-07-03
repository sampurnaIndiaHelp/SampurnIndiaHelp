// 📁 frontend/components/UnlockPaymentSection.jsx

import React, { useEffect, useState } from "react";
import "../styles/UnlockPaymentSection.css";

const UNLOCK_RULES = [
  { level: 2, required: 5, amount: 500 },
  { level: 3, required: 10, amount: 1000 },
  { level: 4, required: 20, amount: 2000 },
  { level: 5, required: 40, amount: 4000 },
  { level: 6, required: 80, amount: 8000 },
  { level: 7, required: 160, amount: 16000 },
  { level: 8, required: 320, amount: 32000 },
  { level: 9, required: 640, amount: 64000 },
  { level: 10, required: 1280, amount: 128000 },
];

const UnlockPaymentSection = () => {
  const userId = localStorage.getItem("userId");
  const sponsorId = localStorage.getItem("sponsorId");

  const [downlines, setDownlines] = useState([]);
  const [unlockedLevels, setUnlockedLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [form, setForm] = useState({
    senderName: "",
    senderPhone: "",
    screenshot: null,
  });

  useEffect(() => {
    fetch(`http://localhost:5000/api/users/downline-levels/${userId}`)
      .then((res) => res.json())
      .then(setDownlines);

    fetch(`http://localhost:5000/api/unlocks/approved/${userId}`)
      .then((res) => res.json())
      .then((data) => setUnlockedLevels(data.unlockedLevels));
  }, []);

  const getCountAtLevel = (lvl) => downlines[lvl]?.length || 0;

  const showUnlockAlert = (rule) =>
    getCountAtLevel(rule.level) >= rule.required &&
    !unlockedLevels.includes(rule.level);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, screenshot: e.target.files[0] });
  };

  const handleSubmit = async (level, amount) => {
    if (!form.screenshot || !form.senderName || !form.senderPhone) {
      alert("Please fill all fields and upload screenshot.");
      return;
    }

    setFormSubmitting(true);
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("sponsorId", sponsorId);
    formData.append("level", level);
    formData.append("amount", amount);
    formData.append("senderName", form.senderName);
    formData.append("senderPhone", form.senderPhone);
    formData.append("screenshot", form.screenshot);

    const res = await fetch("http://localhost:5000/api/unlocks/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    alert(data.message || "Payment uploaded");
    setFormSubmitting(false);
    setSelectedLevel(null);
    setForm({ senderName: "", senderPhone: "", screenshot: null });
  };

  return (
    <div className="unlock-section">
      <h2>🔓 Level Unlock Requirements</h2>
      {UNLOCK_RULES.map((rule) => (
        <div key={rule.level} className="unlock-box">
          <b>Level {rule.level}</b> → Requires <b>{rule.required}</b> members<br />
          You have: {getCountAtLevel(rule.level)} &nbsp;
          {unlockedLevels.includes(rule.level) ? (
            <span className="status approved">✅ Unlocked</span>
          ) : showUnlockAlert(rule) ? (
            <button onClick={() => setSelectedLevel(rule)} className="pay-btn">
              Pay ₹{rule.amount} to Sponsor to Unlock
            </button>
          ) : (
            <span className="status pending">🔒 Locked</span>
          )}
        </div>
      ))}

      {/* 💳 Modal Form */}
      {selectedLevel !== null && typeof selectedLevel === "object" && (
        <div className="unlock-modal">
          <h3>Pay ₹{selectedLevel.amount} to unlock Level {selectedLevel.level}</h3>
          <p><b>Your ID:</b> {userId}</p>
          <p><b>Sponsor ID:</b> {sponsorId}</p>

          <input
            type="text"
            name="senderName"
            placeholder="Your Name"
            value={form.senderName}
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            name="senderPhone"
            placeholder="Your Phone Number"
            value={form.senderPhone}
            onChange={handleFormChange}
            required
          />
          <input
            type="file"
            name="screenshot"
            accept="image/*"
            onChange={handleFileChange}
            required
          />

          <button
            disabled={formSubmitting}
            onClick={() => handleSubmit(selectedLevel.level, selectedLevel.amount)}
          >
            {formSubmitting ? "Submitting..." : "Submit ₹" + selectedLevel.amount}
          </button>
          <button className="cancel" onClick={() => setSelectedLevel(null)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default UnlockPaymentSection;
