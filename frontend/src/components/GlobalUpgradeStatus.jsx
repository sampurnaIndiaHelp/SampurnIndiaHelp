import React, { useEffect, useState } from "react";
import "../styles/GlobalUpgradeStatus.css"
const GlobalUpgradeStatus = () => {
  const [userId, setUserId] = useState(null);
  const [myUpgrades, setMyUpgrades] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    setUserId(id);
    if (id) {
      fetchUpgrades(id);
      fetchApprovals(id);
    }
  }, []);

  const fetchUpgrades = async (id) => {
    const res = await fetch(`http://localhost:5000/api/users/upgrade-history/${id}`);
    const data = await res.json();
    setMyUpgrades(data);
  };

  const fetchApprovals = async (id) => {
    const res = await fetch(`http://localhost:5000/api/upgrade/pending/${id}`);
    const data = await res.json();
    setPendingApprovals(data);
  };

  const handleApprove = async (paymentId) => {
    await fetch(`http://localhost:5000/api/upgrade/approve/${paymentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
    alert("✅ Upgrade approved!");
    fetchApprovals(userId);
    fetchUpgrades(userId);
  };

  const handleReject = async (paymentId) => {
    await fetch(`http://localhost:5000/api/upgrade/reject/${paymentId}`, {
      method: "PUT",
    });
    alert("❌ Upgrade rejected.");
    fetchApprovals(userId);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📈 My Level Upgrades</h2>
      <table>
        <thead>
          <tr>
            <th>Level</th>
            <th>Paid To</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {myUpgrades.map((u, i) => (
            <tr key={i}>
              <td>{u.level}</td>
              <td>{u.paidTo}</td>
              <td>₹{u.amount}</td>
              <td>{u.isApproved ? "✅ Approved" : "⏳ Pending"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: "40px" }}>📝 Pending Approvals</h2>
      {pendingApprovals.length === 0 ? (
        <p>No approvals pending.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Level</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingApprovals.map((u, i) => (
              <tr key={i}>
                <td>{u.userId}</td>
                <td>{u.level}</td>
                <td>₹{u.amount}</td>
                <td>
                  <button onClick={() => handleApprove(u._id)}>✅ Approve</button>
                  <button onClick={() => handleReject(u._id)}>❌ Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GlobalUpgradeStatus;
