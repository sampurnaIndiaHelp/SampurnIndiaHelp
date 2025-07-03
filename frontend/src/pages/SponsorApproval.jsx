// 📁 /pages/SponsorApproval.jsx
import React, { useEffect, useState } from "react";
import "../styles/SponsorApproval.css";

const SponsorApproval = () => {
  const [payments, setPayments] = useState([]);

  const sponsorId = localStorage.getItem("userId");

  useEffect(() => {
    fetch(`http://localhost:5000/api/payments/pending/${sponsorId}`)
      .then((res) => res.json())
      .then((data) => setPayments(data))
      .catch((err) => console.error("Error loading pending payments", err));
  }, [sponsorId]);

  const handleAction = async (paymentId, status) => {
    const res = await fetch(`http://localhost:5000/api/payments/${status}/${paymentId}`, {
      method: "PUT",
    });
    const data = await res.json();
    alert(data.message);
    setPayments((prev) => prev.filter((p) => p._id !== paymentId));
  };

  return (
    <div className="approval-panel">
      <h2>Pending Sponsor Payments</h2>
      {payments.length === 0 ? (
        <p>No pending payments.</p>
      ) : (
        <div className="payment-list">
          {payments.map((p) => (
            <div className="payment-card" key={p._id}>
              <p><strong>Name:</strong> {p.senderName}</p>
              <p><strong>Phone:</strong> {p.senderPhone}</p>
              <p><strong>User ID:</strong> {p.userId}</p>
              <img
                src={`http://localhost:5000/uploads/${p.screenshot}`}
                alt="Payment Screenshot"
              />
              <div className="btn-group">
                <button className="approve" onClick={() => handleAction(p._id, "approve")}>Approve</button>
                <button className="reject" onClick={() => handleAction(p._id, "reject")}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SponsorApproval;
