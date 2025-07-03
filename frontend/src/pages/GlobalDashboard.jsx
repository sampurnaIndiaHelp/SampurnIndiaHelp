import React, { useEffect, useState } from "react";
import GlobalJoinStatus from "../components/GlobalJoinStatus";
import "../styles/GlobalDashboard.css";

const GlobalDashboard = () => {
  const userId = localStorage.getItem("userId");
  const [earnings, setEarnings] = useState([]);
  const [regenIds, setRegenIds] = useState([]);
  const [levelCounts, setLevelCounts] = useState({});

  useEffect(() => {
    fetch(`http://localhost:5000/api/global/earnings/${userId}`)
      .then(res => res.json())
      .then(data => {
        setEarnings(data);
        const regens = data.filter(e => e.type === "regen").map(e => e.sourceUserId);
        setRegenIds(regens);

        // Count downlines by level
        const counts = {};
        data.filter(e => e.type === "join").forEach(e => {
          counts[e.level] = (counts[e.level] || 0) + 1;
        });
        setLevelCounts(counts);
      });
  }, []);

  const sumByType = (type) =>
    earnings.filter(e => e.type === type).reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="global-dashboard">
      <h2>🌐 Global Earnings Dashboard</h2>

      <div className="income-cards">
        <div className="card">Join Income: ₹{sumByType("join")}</div>
        <div className="card">Sponsor Income: ₹{sumByType("sponsor")}</div>
        <div className="card">Upgrade Income: ₹{sumByType("upgrade")}</div>
      </div>

      <h3>📊 Team Levels</h3>
      <ul>
        {Object.entries(levelCounts).map(([lvl, count]) => (
          <li key={lvl}>Level {lvl}: {count} members</li>
        ))}
      </ul>

      <h3>♻️ Regenerated IDs</h3>
      {regenIds.length > 0 ? (
        <ul>{regenIds.map((id, i) => <li key={i}>{id}</li>)}</ul>
      ) : (
        <p>No regenerations yet</p>
      )}

      <h3>⬆️ Upgrade Log</h3>
      <ul>
        {earnings
          .filter(e => e.type === "upgrade")
          .map((e, i) => (
            <li key={i}>
              Level {e.level} - ₹{e.amount} from {e.sourceUserId} {e.isCompanyIncome ? "(Company)" : ""}
            </li>
          ))}
      </ul>
      <div><GlobalJoinStatus /></div>
      
    </div>
  );
};

export default GlobalDashboard;
