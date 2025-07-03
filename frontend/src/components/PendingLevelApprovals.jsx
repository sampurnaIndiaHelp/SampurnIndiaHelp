// 📁 frontend/components/PendingLevelApprovals.jsx
import React, { useEffect, useState } from "react";
import "../styles/PendingApproval.css";

const PendingLevelApprovals = () => {
  const userId = localStorage.getItem("userId");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPending = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `http://localhost:5000/api/payments/pending-levels/${userId}`
        );
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format");
        }
        setPayments(data);
      } catch (err) {
        console.error("Fetch pending level payments error:", err);
        setError("Could not load pending level approvals.");
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) loadPending();
  }, [userId]);

  const approve = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/payments/approve-level/${id}`,
        { method: "PUT" }
      );
      const data = await res.json();
      alert(data.message);
      setPayments((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Failed to approve.");
    }
  };

  const reject = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/payments/reject-level/${id}`,
        { method: "PUT" }
      );
      const data = await res.json();
      alert(data.message);
      setPayments((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Failed to reject.");
    }
  };

  return (
    <div className="pending-level-approvals">
      <h2>🕒 Pending Level Approvals</h2>

      {loading ? (
        <p>Loading pending approvals…</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : payments.length === 0 ? (
        <p>No pending level approvals.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>From</th>
              <th>Level</th>
              <th>Screenshot</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((pmt) => (
              <tr key={pmt._id}>
                <td>{pmt.userId}</td>
                <td>{pmt.level}</td>
                <td>
                  {pmt.screenshot ? (
                    <a
                      href={`http://localhost:5000/uploads/${pmt.screenshot}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-link"
                    >
                      View
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                
                <td>
                  <button onClick={() => approve(pmt._id)}>✅ Approve</button>
                  <button onClick={() => reject(pmt._id)}>❌ Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingLevelApprovals;
