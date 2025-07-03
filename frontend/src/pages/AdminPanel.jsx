import React, { useState, useEffect } from "react";
import "../styles/AdminPanel.css";

const AdminPanel = () => {
  const [adminKey, setAdminKey] = useState("sampurnaadmin123");
  const [count, setCount] = useState(1);
  const [epins, setEpins] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEpins = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/epins", {
        headers: { "x-admin-key": adminKey },
      });
      const data = await res.json();
      setEpins(data);
    } catch (err) {
      alert("Failed to load E-PINs");
    }
  };

  const generateEpins = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/generate-epins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ count }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`${count} E-PINs generated`);
        fetchEpins();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error generating E-PINs");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEpins();
  }, []);

  return (
    <div className="admin-panel">
      <h2>🔐 Admin E-PIN Panel</h2>

      <div className="generate-box">
        <input
          type="number"
          value={count}
          min="1"
          onChange={(e) => setCount(Number(e.target.value))}
        />
        <button onClick={generateEpins} disabled={loading}>

          {loading ? "Generating..." : "Generate E-PINs"}
        </button>
      </div>

      <h3>📄 All E-PINs</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>E-PIN</th>
            <th>Used</th>
            <th>Used By</th>
          </tr>
        </thead>
        <tbody>
          {epins.map((epin, i) => (
            <tr key={epin._id}>
              <td>{i + 1}</td>
              <td>{epin.code}</td>
              <td>{epin.used ? "✅" : "❌"}</td>
              <td>{epin.usedBy || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
