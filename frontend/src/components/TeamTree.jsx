import React, { useEffect, useState } from "react";
import "../styles/TeamTree.css";

function TeamTree({ userId }) {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/users/downline/full/${userId}`)
      .then((res) => res.json())
      .then(setTeam)
      .catch(() => alert("Error loading team tree"));
  }, [userId]);

  return (
    <div className="team-tree-container">
      <h3>🌳 My Team Structure</h3>
      <table>
        <thead>
          <tr>
            <th>Level</th>
            <th>User ID</th>
            <th>Name</th>
            <th>Sponsor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {team.map((u, i) => (
            <tr key={i}>
              <td>Level {u.level}</td>
              <td>{u.userId}</td>
              <td>{u.fullName}</td>
              <td>{u.sponsorName}</td>
              <td style={{ color: u.isActive ? "green" : "gray" }}>
                {u.isActive ? "Active" : "Inactive"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TeamTree;
