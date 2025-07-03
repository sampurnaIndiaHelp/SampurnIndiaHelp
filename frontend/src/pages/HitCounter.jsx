import React, { useEffect, useState } from "react";
import "../styles/HitCounter.css";

const statsData = [
  { label: "Happy Donors", target: 5000, icon: "❤️" },
  { label: "Funds Raised", target: 1200000, icon: "💰", prefix: "₹" },
  { label: "Ongoing Campaigns", target: 100, icon: "🎯" },
  { label: "People Helped", target: 24000, icon: "🤝" },
];

const HitCounter = () => {
  const [counts, setCounts] = useState(statsData.map(() => 0));

  useEffect(() => {
    const durations = 2000; // in ms
    const frameRate = 30; // update every 30ms
    const totalFrames = durations / frameRate;

    const intervals = statsData.map((stat, index) => {
      let frame = 0;
      return setInterval(() => {
        frame++;
        setCounts((prev) => {
          const updated = [...prev];
          updated[index] = Math.min(
            Math.floor((stat.target / totalFrames) * frame),
            stat.target
          );
          return updated;
        });
        if (frame >= totalFrames) clearInterval(intervals[index]);
      }, frameRate);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <section className="hit-counter-section">
      <div className="container">
        <h2 className="hit-title">Together We Make a Difference</h2>
        <p className="hit-subtitle">Your support changes lives.</p>
        <div className="hit-cards">
          {statsData.map((stat, index) => (
            <div className="hit-card" key={index}>
              <div className="hit-icon">{stat.icon}</div>
              <div className="hit-count">
                {stat.prefix || ""}
                {counts[index].toLocaleString()}
              </div>
              <div className="hit-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HitCounter;
