// 📁 src/pages/SponsorDashboard.jsx
import React, { useEffect, useState } from "react";
import "../styles/SponsorDashboard.css";

function SponsorDashboard() {
  const [payments, setPayments] = useState([]);
  const sponsorId = localStorage.getItem("userId");

  const fetchPending = async () => {
    const res = await fetch(`http://localhost:5000/api/payments/pending/${sponsorId}`);
    const data = await res.json();
    if (res.ok) setPayments(data);
    else alert("Failed to load pending payments");
  };

  const handleApprove = async (paymentId) => {
    const res = await fetch(`http://localhost:5000/api/payments/approve/${paymentId}`, {
      method: "POST",
    });
    const data = await res.json();
    if (res.ok) {
      alert("✅ Approved");
      fetchPending();
    } else {
      alert(data.message || "Approval failed");
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="sponsor-dashboard">
      <h2>🔔 Pending Sponsor Payments</h2>
      {payments.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <div className="payment-list">
          {payments.map((p) => (
            <div className="payment-card" key={p._id}>
              <p><strong>Sender Name:</strong> {p.senderName}</p>
              <p><strong>Phone:</strong> {p.senderPhone}</p>
              <p><strong>User ID:</strong> {p.userId}</p>
              <img src={`http://localhost:5000/uploads/${p.screenshot}`} alt="Payment Screenshot" />
              <button onClick={() => handleApprove(p._id)}>Approve Payment</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SponsorDashboard;
