import React, { useEffect, useState } from "react";

const SponsorGlobalApprovals = () => {
  const sponsorId = localStorage.getItem("userId");
  const [pendingList, setPendingList] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/global/pending/${sponsorId}`)
      .then((res) => res.json())
      .then(setPendingList);
  }, []);

  const handleDecision = async (userId, decision) => {
    const res = await fetch(
      `http://localhost:5000/api/global/${decision}/${userId}`,
      { method: "PUT" }
    );
    const data = await res.json();
    alert(data.message || "Action completed");
    setPendingList(pendingList.filter((u) => u.userId !== userId));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🧾 Global Join Approvals</h2>
      {pendingList.length === 0 && <p>No pending global payments</p>}
      {pendingList.map((entry) => (
        <div key={entry.userId} style={{ border: "1px solid #ccc", padding: "10px", margin: "15px 0" }}>
          <p><b>User ID:</b> {entry.userId}</p>
          <p><b>Name:</b> {entry.userName}</p>
          <p><b>Parent:</b> {entry.parentId}</p>
          <img
            src={`http://localhost:5000/uploads/${entry.paymentScreenshot}`}
            alt="screenshot"
            style={{ width: "200px", marginBottom: "10px" }}
          />
          <br />
          <button onClick={() => handleDecision(entry.userId, "approve")} style={{ marginRight: "10px" }}>
            ✅ Approve
          </button>
          <button onClick={() => handleDecision(entry.userId, "reject")} style={{ background: "red", color: "white" }}>
            ❌ Reject
          </button>
        </div>
      ))}
    </div>
  );
};

export default SponsorGlobalApprovals;
