import React, { useEffect, useState } from "react";
import "../styles/AdminTable.css";

export default function AdminCompanyJoins() {
  const [joins, setJoins] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/company-directs")
      .then((res) => res.json())
      .then((data) => setJoins(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="admin-table-container">
      <h2>Direct Joiners Under Company</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Joining Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {joins.map((user, idx) => (
            <tr key={user._id}>
              <td>{idx + 1}</td>
              <td>{user.userId}</td>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                <span className={user.isActive ? "status working" : "status non-working"}>
                  {user.isActive ? "Working" : "Pending"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
