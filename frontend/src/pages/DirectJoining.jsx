// 📁 frontend/components/DirectJoining.jsx
import React, { useEffect, useState } from "react";

function DirectJoining() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    fetch(`http://localhost:5000/api/users/downline/direct/${userId}`)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("❌ Error fetching directs:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>👥 Your Direct Joinees</h2>
      <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>User ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Join Date</th>
            <th style={thStyle}>Sponsor Paid</th>
            <th style={thStyle}>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={i}>
              <td style={tdStyle}>{u.userId}</td>
              <td style={tdStyle}>{u.fullName}</td>
              <td style={tdStyle}>
                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
              </td>
              <td style={tdStyle}>
                {u.paymentStatus === "approved" ? (
                  <span style={{ color: "green" }}>✅ Approved</span>
                ) : u.paymentStatus === "rejected" ? (
                  <span style={{ color: "red" }}>❌ Rejected</span>
                ) : (
                  <span style={{ color: "orange" }}>⏳ Pending</span>
                )}
              </td>
              <td style={tdStyle}>
                ₹{u.paymentAmount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Style objects
const thStyle = {
  borderBottom: "2px solid #ccc",
  padding: "8px",
  background: "#f0f0f0",
  textAlign: "left"
};
const tdStyle = {
  padding: "8px",
  borderBottom: "1px solid #eee"
};

export default DirectJoining;
