// 📄 frontend/components/LevelTree.jsx
import React, { useEffect, useState } from "react";
import "../styles/LevelTree.css";

const LevelTree = ({ userId }) => {
  const [levels, setLevels] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDownlines = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/users/downline-levels/${userId}`
        );
        const data = await res.json();
        setLevels(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load level tree", err);
      }
    };

    fetchDownlines();
  }, [userId]);

  if (loading) return <p>Loading level tree...</p>;

  return (
    <div className="level-tree">
      <h2>👥 Your Level-wise Downline</h2>
      {Object.keys(levels).length === 0 && <p>No downline yet.</p>}
      {Object.entries(levels).map(([level, users]) => (
        <div key={level} className="level-box">
          <h3>Level {level} ({users.length} member{users.length > 1 ? "s" : ""})</h3>
          <ul>
            {users.map((u) => (
              <li key={u.userId}>
                <span className="userid">{u.userId}</span> - {u.fullName}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default LevelTree;
