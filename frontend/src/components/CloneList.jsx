import React, { useEffect, useState } from "react";

const CloneList = ({ userId }) => {
  const [clones, setClones] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/users/regenerated/${userId}`)
      .then((res) => res.json())
      .then(setClones)
      .catch(() => alert("Failed to fetch regenerated clones."));
  }, [userId]);

  if (!clones.length) return null;

  return (
    <div className="clone-list">
      <h3>🔁 Regenerated Global IDs</h3>
      <table>
        <thead>
          <tr>
            <th>Clone ID</th>
            <th>Name</th>
            <th>Parent</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {clones.map((c, i) => (
            <tr key={i}>
              <td>{c.userId}</td>
              <td>{c.userName}</td>
              <td>{c.parentId}</td>
              <td>{c.isApproved ? "✅ Active" : "⏳ Pending"}</td>
              <td>{new Date(c.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CloneList;
