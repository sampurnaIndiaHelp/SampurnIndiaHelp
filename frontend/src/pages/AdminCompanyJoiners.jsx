// 📁 src/pages/AdminCompanyJoiners.jsx
import React, { useEffect, useState } from "react";
import "../styles/AdminCompanyJoiners.css";

function AdminCompanyJoiners() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/direct-company-joiners")
      .then((res) => res.json())
      .then(setUsers)
      .catch(() => alert("Failed to load joiners"));
  }, []);

  return (
    <div className="admin-joiners-container">
      <h2>👥 Direct Joiners Under SAMPUR01</h2>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>City</th>
            <th>State</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.userId}>
              <td>{u.userId}</td>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td>{u.phone}</td>
              <td>{u.city}</td>
              <td>{u.state}</td>
              <td>{new Date(u.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminCompanyJoiners;
