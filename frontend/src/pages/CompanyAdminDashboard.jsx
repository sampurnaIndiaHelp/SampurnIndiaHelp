import React, { useEffect, useState } from "react";
import AdminPanel from "./AdminPanel";
import "../styles/CompanyAdminDashboard.css";

function CompanyAdminDashboard() {
  const [companyUser, setCompanyUser] = useState(null);
  const [allPayments, setAllPayments] = useState([]);
  const [epins, setEpins] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchCompanyData();
    fetchAllPayments();
    fetchAllEpins();
    fetchAllUsers();
  }, []);

  const fetchCompanyData = async () => {
    const res = await fetch(`http://localhost:5000/api/users/profile/SAMPUR01`);
    const data = await res.json();
    setCompanyUser(data);
  };

  const fetchAllPayments = async () => {
    const res = await fetch(`http://localhost:5000/api/payments/all`);
    const data = await res.json();
    setAllPayments(data);
  };

  const fetchAllEpins = async () => {
    const res = await fetch(`http://localhost:5000/api/epins`);
    const data = await res.json();
    setEpins(data);
  };

  const fetchAllUsers = async () => {
    const res = await fetch(`http://localhost:5000/api/users`);
    const data = await res.json();
    setUsers(data);
  };

  return (
    <div className="admin-dashboard">
      <h2>🌟 Company Admin Dashboard</h2>

      {companyUser && (
        <div className="company-info">
          <h3>Company ID: {companyUser.userId}</h3>
          <p><strong>Name:</strong> {companyUser.fullName}</p>
          <p><strong>Email:</strong> {companyUser.email}</p>
          <p><strong>Phone:</strong> {companyUser.phone}</p>
        </div>
      )}

      <section>
        <h3>📌 All E-PINs</h3>
        <AdminPanel/>
        {/* <table>
          <thead>
            <tr>
              <th>PIN Code</th>
              <th>Used</th>
              <th>Used By</th>
            </tr>
          </thead>
          <tbody>
            {epins.map((pin, idx) => (
              <tr key={idx}>
                <td>{pin.code}</td>
                <td>{pin.used ? "Yes" : "No"}</td>
                <td>{pin.usedBy || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table> */}
      </section>

      <section>
        <h3>💳 All Payments (Sponsor + Levels)</h3>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {allPayments.map((p, i) => (
              <tr key={i}>
                <td>{p.type || "sponsor"}</td>
                <td>{p.userId}</td>
                <td>{p.sponsorId}</td>
                <td>{p.status}</td>
                <td>{new Date(p.updatedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h3>📋 User Level Income Summary</h3>
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Sponsor</th>
              <th>Level Income</th>
              <th>Total Income</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i}>
                <td>{u.userId}</td>
                <td>{u.fullName}</td>
                <td>{u.sponsorName}</td>
                <td>₹{u.uplineIncome || 0}</td>
                <td>₹{u.totalIncome || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default CompanyAdminDashboard;
