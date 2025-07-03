import React, { useEffect, useState } from "react";
import "../styles/GlobalTreeView.css";

const GlobalTreeView = ({ userId }) => {
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/global/tree/${userId}`)
      .then(res => res.json())
      .then(data => setTreeData(data))
      .catch(err => console.error("Error loading global tree:", err));
  }, [userId]);

  const renderLevel = (level) => {
    const levelNodes = treeData.filter(node => node.level === level);
    return (
      <div className="tree-level">
        <h4>Level {level} ({levelNodes.length} users)</h4>
        <div className="tree-row">
          {levelNodes.map((node, idx) => (
            <div key={idx} className="tree-node">
              <div className="tree-id">{node.userId}</div>
              <div className="tree-name">{node.userName}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const levels = [...new Set(treeData.map(n => n.level))];

  return (
    <div className="global-tree">
      <h3>🌐 Global Team Structure (2x2)</h3>
      {levels.length === 0 ? (
        <p>No data yet. Please complete your global join.</p>
      ) : (
        levels.map(lvl => renderLevel(lvl))
      )}
    </div>
  );
};

export default GlobalTreeView;
