import React, { useEffect, useState } from "react";
import "../styles/GlobalLevelUpgrade.css";

const GlobalLevelUpgrade = () => {
  const userId = localStorage.getItem("userId");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [message, setMessage] = useState("");

  const handleUpgrade = async () => {
    const res = await fetch(`http://localhost:5000/api/global/level-upgrade/${userId}/${currentLevel}`, {
      method: "PUT"
    });
    const data = await res.json();
    setMessage(data.message);

    // Trigger clone creation after upgrade (from level 4)
    if (currentLevel >= 4) {
      await fetch(`http://localhost:5000/api/global/generate-clones/${userId}/${currentLevel}`, {
        method: "POST"
      });
    }

    setCurrentLevel((prev) => prev + 1);
  };

  return (
    <div className="level-upgrade-card">
      <h3>🌐 Upgrade to Level {currentLevel}</h3>
      <button onClick={handleUpgrade}>Upgrade Now</button>
      {message && <p className="status-msg">{message}</p>}
    </div>
  );
};

export default GlobalLevelUpgrade;
